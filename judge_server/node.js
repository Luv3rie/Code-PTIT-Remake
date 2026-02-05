const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const { exec } = require('child_process');

const app = express();
const TEMP_BASE = path.join(__dirname, 'temp_submissions');

// Đảm bảo thư mục tạm tồn tại
fs.ensureDirSync(TEMP_BASE);

// --- 1. HÀM CHẠY DOCKER JUDGE ---
async function runDockerJudge(submissionId, fileName, language) {
    const submissionPath = path.join(TEMP_BASE, submissionId);
    const containerName = `judge_${submissionId}`;
    const uid = process.getuid ? process.getuid() : 1000;

    const dockerCmd = `docker run --rm \
        --name "${containerName}" \
        --user ${uid} \
        --memory="512m" --cpus="0.5" \
        --network none \
        -v "${submissionPath}":/workspace \
        -w /workspace \
        judge_server "${fileName}" "test_cases.json" "${language}"`;

    return new Promise((resolve) => {
        exec(dockerCmd, { timeout: 25000 }, (error, stdout, stderr) => {
            // Cưỡng ép dừng nếu container bị treo
            exec(`docker kill ${containerName} 2>/dev/null`);

            try {
                // Tìm JSON trong stdout
                const jsonMatch = stdout.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    resolve(JSON.parse(jsonMatch[0]));
                } else {
                    resolve({
                        verdict: "SYSTEM_ERROR",
                        message: "Không tìm thấy kết quả từ môi trường chấm",
                        details: stderr || stdout
                    });
                }
            } catch (e) {
                resolve({ 
                    verdict: "SYSTEM_ERROR", 
                    message: "Lỗi xử lý JSON kết quả", 
                    details: stdout 
                });
            }
        });
    });
}

// --- 2. CẤU HÌNH & VALIDATION ---
const ALLOWED_LANGUAGES = {
    'cpp': { ext: 'solution.cpp' },
    'javascript': { ext: 'solution.js' }
};

function sanitizeCode(code) {
    const dangerousPatterns = [
        /require\s*\(\s*['"]child_process['"]\s*\)/gi, 
        /eval\s*\(/gi, 
        /exec\s*\(/gi
    ];
    return !dangerousPatterns.some(p => p.test(code));
}

app.use(express.json({ limit: '50kb' }));

// --- 3. ROUTE POST /SUBMIT ---
app.post('/submit', rateLimit({ windowMs: 10000, max: 5 }), async (req, res) => {
    const { student_id, challenge_id, source_code, language } = req.body;
    const submissionId = uuidv4();
    const submissionPath = path.join(TEMP_BASE, submissionId);

    try {
        // 1. Validation
        if (!ALLOWED_LANGUAGES[language]) {
            return res.status(400).json({ error: "Ngôn ngữ không hỗ trợ" });
        }
        if (language === 'javascript' && !sanitizeCode(source_code)) {
            return res.status(400).json({ error: "Mã nguồn chứa lệnh bị cấm" });
        }

        // 2. Tạo thư mục tạm
        await fs.ensureDir(submissionPath);

        // 3. Tạo dữ liệu Test Case mẫu để bạn test local
        const demoTestCases = [
    { 
        name: "Test Hello World", 
        input: "",             
        expected: "Hello World" 
    }
];

        // 4. Ghi file JSON test cases và file code nguồn
        await fs.writeJson(path.join(submissionPath, 'test_cases.json'), demoTestCases);
        const fileName = ALLOWED_LANGUAGES[language].ext;
        await fs.writeFile(path.join(submissionPath, fileName), source_code);

        // 5. Gọi thực thi Docker
        const result = await runDockerJudge(submissionId, fileName, language);

        // 6. Trả kết quả
        res.json({
            success: true,
            submissionId: submissionId,
            ...result
        });

        // 7. Dọn dẹp folder sau khi chấm xong
        await fs.remove(submissionPath);

    } catch (error) {
        console.error("[Internal Error]", error);
        res.status(500).json({ error: "Lỗi hệ thống trong quá trình xử lý bài nộp" });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server Judge đang chạy tại: http://localhost:${PORT}`);
});