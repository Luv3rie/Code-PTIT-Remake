/*
/// Module: code_ptit
module code_ptit::code_ptit;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

#[allow(lint(self_transfer))]

module code_ptit::scoring {
    use sui::tx_context::{sender};
    use std::string::{Self, String};
    use sui::event;
    use sui::table::{Table, Self};
    use sui::clock::{Self, Clock};

    // Object Admin
    public struct AdminCap has key {id: UID}

    // Object hồ sơ sinh viên
    public struct StudentProfile has key, store {
        id: UID,
        student_id: String,
        nickname: String,
        avatar_url: String,
        major_language: String,
        language_stats: Table<String, u64>,
        last_submission: u64,
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
    } 

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {id: object::new(ctx)};
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        let class = ClassRoom {
            id: object::new(ctx),
            members: table::new(ctx),
        };
        transfer::share_object(class);
    }

    // Hàm khởi tạo hồ sơ cho sinh viên mới
    public entry fun create_profile(student_id: String, ctx: &mut TxContext) {
        let profile = StudentProfile {
            id: object::new(ctx),
            student_id,
            nickname: student_id,
            avatar_url: string::utf8(b""),
            major_language: string::utf8(b"None"),
            language_stats: table::new(ctx),
            last_submission: 0,
        };
        // Chuyển quyền sở hữu về ví sinh viên
        transfer::public_transfer(profile, sender(ctx));
    }

    // Hàm thêm sinh viên vào lớp
    public entry fun add_to_class(_: &AdminCap, class: &mut ClassRoom, student_id: String, wallet: address) {
        table::add(&mut class.members, student_id, wallet);
    }

    // Hàm cập nhật hồ sơ
    public entry fun update_profile(profile: &mut StudentProfile, new_nickname: String, new_avatar: String, new_lang: String) {
        profile.nickname = new_nickname;
        profile.avatar_url = new_avatar;
        profile.major_language = new_lang;
    }

    // Hàm cập nhật điểm
    public entry fun add_score(_: &AdminCap, profile: &mut StudentProfile, language: String, clock: &Clock) {
        let now = clock::timestamp_ms(clock);
        assert!(now - profile.last_submission >= 60000, 0);

        if (table::contains(&profile.language_stats, language)) {
            let current_count = table::borrow_mut(&mut profile.language_stats, language);
            *current_count = *current_count + 1;
        } else {
            table::add(&mut profile.language_stats, language, 1);
        };

        profile.last_submission = now;

        event::emit(ScoreUpdated {
            student_id: profile.student_id,
            language,
            total_solved_in_lang: *table::borrow(&profile.language_stats, language),
        });
    }

    // Hàm trao huy hiệu
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
        
        transfer::public_transfer(badge, tx_context::sender(ctx));
    }
}