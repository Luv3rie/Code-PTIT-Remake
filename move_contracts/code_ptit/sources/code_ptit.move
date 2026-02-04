module code_ptit::scoring {
    use sui::tx_context::{Self, sender};
    use std::string::{Self, String};
    use sui::event;
    use sui::table::{Table, Self};
    use sui::clock::{Self, Clock};

    // Object Admin
    public struct AdminCap has key {id: UID}

    // Object hồ sơ sinh viên
    public struct StudentProfile has key {
        id: UID,
        student_id: String,
        nickname: String,
        avatar_url: String,
        major_language: String,
        language_stats: Table<String, u64>,
        completed_challenges: Table<ID, bool>,
        last_submission: u64,
        total_score: u64,
        total_solved: u64,
        owner: address, // Lưu ví sinh viên để kiểm tra quyền
    }

    // Object lớp học
    public struct ClassRoom has key {
        id: UID,
        members: Table<String, address>,
    }

    // Object huy hiệu
    public struct LanguageBadge has key, store {
        id: UID,
        language: String,
        rank: String,
    }

    // Object sự kiện
    public struct ScoreUpdated has copy, drop {
        student_id: String,
        language: String,
        total_solved_in_lang: u64,
        new_total_score: u64,
    }

    // Object bài tập
    public struct Challenge has key, store {
        id: UID,
        name: String,
        difficulty: u8,
        point_value: u64,
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {id: object::new(ctx)};
        transfer::transfer(admin_cap, sender(ctx));

        let class = ClassRoom {
            id: object::new(ctx),
            members: table::new(ctx),
        };
        transfer::share_object(class);
    }

    public entry fun create_profile(_: &AdminCap, student_id: String, student_address: address, ctx: &mut TxContext) {
        let profile = StudentProfile {
            id: object::new(ctx),
            student_id,
            nickname: student_id,
            avatar_url: string::utf8(b""),
            major_language: string::utf8(b"None"),
            language_stats: table::new(ctx),
            completed_challenges: table::new(ctx),
            last_submission: 0,
            total_solved: 0,
            total_score: 0,
            owner: student_address, 
        };
        // SHARE để Admin có thể truy cập vào Object này sau này
        transfer::share_object(profile);
    }

    // Chỉ chủ sở hữu Profile (sinh viên) mới có quyền tự sửa thông tin
    public entry fun update_profile(profile: &mut StudentProfile, new_nickname: String, new_avatar: String, new_lang: String, ctx: &mut TxContext) {
        assert!(sender(ctx) == profile.owner, 403);
        profile.nickname = new_nickname;
        profile.avatar_url = new_avatar;
        profile.major_language = new_lang;
    }

    public entry fun add_score(_: &AdminCap, profile: &mut StudentProfile, challenge: &Challenge, language: String, clock: &Clock) {
        let now = clock::timestamp_ms(clock);
        let challenge_id = object::id(challenge);

        assert!(now - profile.last_submission >= 60000, 0);
        assert!(!table::contains(&profile.completed_challenges, challenge_id), 1);

        if (table::contains(&profile.language_stats, language)) {
            let current_count = table::borrow_mut(&mut profile.language_stats, language);
            *current_count = *current_count + 1;
        } else {
            table::add(&mut profile.language_stats, language, 1);
        };

        profile.total_score = profile.total_score + challenge.point_value;
        profile.total_solved = profile.total_solved + 1;

        table::add(&mut profile.completed_challenges, challenge_id, true);
        profile.last_submission = now;

        event::emit(ScoreUpdated {
            student_id: profile.student_id,
            language,
            total_solved_in_lang: *table::borrow(&profile.language_stats, language),
            new_total_score: profile.total_score,
        });
    }

    // Admin trao huy hiệu
    public entry fun mint_badge(_: &AdminCap, student: &mut StudentProfile, language: String, ctx: &mut TxContext) {
        assert!(table::contains(&student.language_stats, language), 404);
        let solved_count = *table::borrow(&student.language_stats, language);
        let lang_bytes = language.as_bytes();
        
        let rank_name = if (lang_bytes == b"C++") {
            if (solved_count >= 50) string::utf8(b"Memory God") 
            else if (solved_count >= 15) string::utf8(b"Pointer Survivor")
            else abort 0
        } else if (lang_bytes == b"JavaScript") {
            if (solved_count >= 50) string::utf8(b"JS Async Master") 
            else if (solved_count >= 15) string::utf8(b"Script Kiddie")
            else abort 0
        } else if (lang_bytes == b"Move") {
            if (solved_count >= 50) string::utf8(b"Move Architect") 
            else if (solved_count >= 15) string::utf8(b"Object Apprentice")
            else abort 0
        } else {
            if (solved_count >= 50) string::utf8(b"Coding God")
            else string::utf8(b"Newbie")
        };

        let badge = LanguageBadge {
            id: object::new(ctx),
            language,
            rank: rank_name,
        };
        
        transfer::public_transfer(badge, student.owner);
    }

    public entry fun create_challenge(_: &AdminCap, name: String, difficulty: u8, point_value: u64, ctx: &mut TxContext) {
        let challenge = Challenge {
            id: object::new(ctx),
            name, difficulty, point_value,  
        };
        transfer::share_object(challenge);
    }
}