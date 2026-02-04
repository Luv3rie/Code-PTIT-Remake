module code_ptit::code_ptit {
    use sui::tx_context::{Self, sender};
    use std::string::{Self, String};
    use sui::event;
    use sui::table::{Table, Self};
    use sui::clock::{Self, Clock};

    const ENotOwner: u64 = 0;
    const ESubmissionTooFast: u64 = 1;
    const EAlreadyCompleted: u64 = 2;
    const ENotEnoughSolved: u64 = 3;
    const EBadgeAlreadyMinted: u64 = 4;
    const ELanguageNotFound: u64 = 5;
    const ETableNotEmpty: u64 = 6;

    public struct Admin has key { id: UID }

    public struct StudentProfile has key {
        id: UID,
        student_id: String,
        nickname: String,
        avatar_url: String,
        major_language: String,
        language_stats: Table<String, u64>,
        completed_challenges: Table<ID, bool>,
        badges_issued: Table<String, bool>,
        last_submission: u64,
        total_score: u64,
        total_solved: u64,
        owner: address,
    }

    public struct Challenge has key, store {
        id: UID,
        name: String,
        difficulty: u8,
        point_value: u64,
    }

    public struct LanguageBadge has key, store {
        id: UID,
        language: String,
        rank: String,
    }

    public struct ScoreUpdated has copy, drop {
        student_id: String,
        language: String,
        total_solved_in_lang: u64,
        new_total_score: u64,
    }

    fun init(ctx: &mut TxContext) {
        transfer::transfer(Admin { id: object::new(ctx) }, sender(ctx));
    }

    public entry fun create_profile(_: &Admin, student_id: String, student_address: address, ctx: &mut TxContext) {
        let profile = StudentProfile {
            id: object::new(ctx),
            student_id,
            nickname: student_id,
            avatar_url: string::utf8(b""),
            major_language: string::utf8(b"None"),
            language_stats: table::new(ctx),
            completed_challenges: table::new(ctx),
            badges_issued: table::new(ctx),
            last_submission: 0,
            total_solved: 0,
            total_score: 0,
            owner: student_address, 
        };
        transfer::share_object(profile);
    }

    public entry fun update_profile(profile: &mut StudentProfile, new_nickname: String, new_avatar: String, new_lang: String, ctx: &mut TxContext) {
        assert!(sender(ctx) == profile.owner, ENotOwner);
        profile.nickname = new_nickname;
        profile.avatar_url = new_avatar;
        profile.major_language = new_lang;
    }

    public entry fun delete_profile(_: &Admin, profile: StudentProfile, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == profile.owner, ENotOwner);

        let StudentProfile {
            id,
            student_id: _,
            nickname: _,
            avatar_url: _,
            major_language: _,
            language_stats,
            completed_challenges,
            badges_issued,
            last_submission: _,
            total_score: _,
            total_solved: _,
            owner: _,
        } = profile;

        table::drop(language_stats);
        table::drop(completed_challenges);
        table::drop(badges_issued);

        object::delete(id);
    }

    public entry fun create_challenge(_: &Admin, name: String, difficulty: u8, point_value: u64, ctx: &mut TxContext) {
        let challenge = Challenge {
            id: object::new(ctx),
            name, difficulty, point_value,  
        };
        transfer::share_object(challenge);
    }

    public entry fun delete_challenge(_: &Admin, challenge: Challenge) {
        let Challenge {
            id,
            name: _,
            difficulty: _,
            point_value: _,
        } = challenge;

        object::delete(id);
    }

    public entry fun add_score(_: &Admin, profile: &mut StudentProfile, challenge: &Challenge, language: String, clock: &Clock) {
        let now = clock::timestamp_ms(clock);
        let challenge_id = object::id(challenge);

        assert!(now - profile.last_submission >= 60000, ESubmissionTooFast);
        assert!(!table::contains(&profile.completed_challenges, challenge_id), EAlreadyCompleted);

        if (table::contains(&profile.language_stats, language)) {
            let current_count = table::borrow_mut(&mut profile.language_stats, language);
            *current_count = *current_count + 1;
        } else {
            table::add(&mut profile.language_stats, language, 1);
        };

        profile.total_score = profile.total_score + challenge.point_value;
        profile.total_solved = profile.total_solved + 1;
        profile.last_submission = now;
        table::add(&mut profile.completed_challenges, challenge_id, true);

        event::emit(ScoreUpdated {
            student_id: profile.student_id,
            language,
            total_solved_in_lang: *table::borrow(&profile.language_stats, language),
            new_total_score: profile.total_score,
        });
    }

    public entry fun mint_badge(_: &Admin, student: &mut StudentProfile, language: String, ctx: &mut TxContext) {
        assert!(table::contains(&student.language_stats, language), ELanguageNotFound);
        
        let solved_count = *table::borrow(&student.language_stats, language);
        let lang_bytes = language.as_bytes();
        
        let rank_name = if (lang_bytes == b"C++") {
            if (solved_count >= 50) string::utf8(b"Memory God") 
            else if (solved_count >= 15) string::utf8(b"Pointer Survivor")
            else abort ENotEnoughSolved
        } else if (lang_bytes == b"Move") {
            if (solved_count >= 50) string::utf8(b"Move Architect") 
            else if (solved_count >= 15) string::utf8(b"Object Apprentice")
            else abort ENotEnoughSolved
        } else {
            if (solved_count >= 50) string::utf8(b"Coding God")
            else string::utf8(b"Newbie")
        };

        let mut badge_key = language;
        string::append(&mut badge_key, string::utf8(b"-"));
        string::append(&mut badge_key, rank_name);

        assert!(!table::contains(&student.badges_issued, badge_key), EBadgeAlreadyMinted);
        table::add(&mut student.badges_issued, badge_key, true);

        let badge = LanguageBadge {
            id: object::new(ctx),
            language,
            rank: rank_name,
        };
        transfer::public_transfer(badge, student.owner);
    }
}