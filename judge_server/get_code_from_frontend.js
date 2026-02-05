const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');

const app = express();

const submissionLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 10, 
    message: { error: "Quá nhiều submission, vui lòng thử lại sau" }
});

app.use(express.json({ 
    limit: '50kb', 
    strict: true 
}));

const TEMP_BASE = path.join(__dirname, 'temp_submissions');
const MAX_CODE_LENGTH = 10000; 

// CẬP NHẬT: Chỉ còn 2 ngôn ngữ
const ALLOWED_LANGUAGES = {
    'cpp': { ext: 'solution.cpp', maxSize: 10000 },
    'javascript': { ext: 'solution.js', maxSize: 10000 }
};

fs.ensureDirSync(TEMP_BASE);

function validateInput(student_id, challenge_id, source_code, language) {
    const errors = [];
    if (!student_id || !/^[a-zA-Z0-9_-]{1,50}$/.test(student_id)) {
        errors.push("student_id không hợp lệ");
    }
    if (!challenge_id || !/^[a-zA-Z0-9_-]{1,50}$/.test(challenge_id)) {
        errors.push("challenge_id không hợp lệ");
    }
    if (!ALLOWED_LANGUAGES[language]) {
        errors.push("Ngôn ngữ không được hỗ trợ");
    }
    if (!source_code || typeof source_code !== 'string') {
        errors.push("source_code không hợp lệ");
    } else if (source_code.length > MAX_CODE_LENGTH) {
        errors.push(`Code quá dài (max ${MAX_CODE_LENGTH} ký tự)`);
    } else if (source_code.trim().length === 0) {
        errors.push("Code không được để trống");
    }
    if (source_code && source_code.includes('\0')) {
        errors.push("Code chứa ký tự không hợp lệ");
    }
    return errors;
}

function sanitizeCode(code) {
    const dangerousPatterns = [
        /require\s*\(\s*['"]child_process['"]\s*\)/gi,
        /eval\s*\(/gi,
        /Function\s*\(/gi,
        /exec\s*\(/gi,
    ];
    for (const pattern of dangerousPatterns) {
        if (pattern.test(code)) {
            return false; // Trả về false thay vì throw error
        }
    }
    return true;
}

app.post('/submit', submissionLimiter, async (req, res) => {
    let submissionPath = null;
    try {
        const { student_id, challenge_id, source_code, language } = req.body;

        const errors = validateInput(student_id, challenge_id, source_code, language);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        // CẬP NHẬT: Xử lý sanitize lỗi 400 thay vì 500
        if (language === 'javascript') {
            if (!sanitizeCode(source_code)) {
                return res.status(400).json({ success: false, error: "Code chứa lệnh bị cấm" });
            }
        }

        const internalId = uuidv4();
        submissionPath = path.join(TEMP_BASE, internalId);
        if (!submissionPath.startsWith(TEMP_BASE)) {
            throw new Error("Path traversal detected");
        }

        await fs.ensureDir(submissionPath);

        const fileName = ALLOWED_LANGUAGES[language].ext;
        const filePath = path.join(submissionPath, fileName);
        
        // CẬP NHẬT: mode 0o444 để Docker có thể đọc file
        await fs.writeFile(filePath, source_code, { 
            mode: 0o444, 
            encoding: 'utf8' 
        });

        console.log(`[Judge] Submission ID: ${internalId} | Student: ${student_id} | Lang: ${language}`);

        // TODO: Chỗ này bạn sẽ gọi lệnh Docker hoặc đẩy vào Queue
        res.json({
            success: true,
            submissionId: internalId,
            message: "Bài làm đã được ghi nhận"
        });

    } catch (error) {
        console.error("[Judge Error]", error.message);
        if (submissionPath) await fs.remove(submissionPath);
        res.status(500).json({ success: false, error: "Lỗi server" });
    }
});

setInterval(async () => {
    try {
        const files = await fs.readdir(TEMP_BASE);
        const now = Date.now();
        for (const file of files) {
            const filePath = path.join(TEMP_BASE, file);
            const stat = await fs.stat(filePath);
            if (now - stat.mtimeMs > 24 * 60 * 60 * 1000) {
                await fs.remove(filePath);
            }
        }
    } catch (err) { console.error("Cleanup error:", err); }
}, 60 * 60 * 1000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server Judge running on port ${PORT}`));