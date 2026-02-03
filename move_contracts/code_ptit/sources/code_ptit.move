/*
/// Module: code_ptit
module code_ptit::code_ptit;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

#[allow(lint(custom_state_change))]

module code_ptit::scoring {
    use sui::tx_context::{sender};
    use std::string::{String};

    // Admin
    public struct AdminCap has key {id: UID}

    // Cấu trúc dữ liệu hồ sơ sinh viên
    public struct StudentProfile has key, store {
        id: UID,
        student_id: String,
        total_score: u64,
        solved_count: u64,
    }

    // Khởi tạo hồ sơ cho sinh viên mới
    public fun create_profile(student_id: String, ctx: &mut TxContext) {
        let profile = StudentProfile {
            id: object::new(ctx),
            student_id,
            total_score: 0,
            solved_count: 0,
        };
        // Chuyển quyền sở hữu về ví sinh viên
        transfer::public_transfer(profile, sender(ctx));
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {id: object::new(ctx)};
        // Gửi key này về ví deployer
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    // Cập nhật điểm
    public fun add_score(_admin: &AdminCap, profile: &mut StudentProfile, points: u64) {
        profile.total_score = profile.total_score + points;
        profile.solved_count = profile.solved_count + 1;
    }
}