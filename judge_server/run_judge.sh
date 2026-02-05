#!/bin/bash

# ==========================================
# Configuration & Safety Flags
# ==========================================
set -uo pipefail

# Nhận tham số từ Node.js
readonly SOURCE_FILE="${1:-}"
readonly TEST_CASES_FILE="${2:-}"
readonly LANGUAGE="${3:-}"

# Cấu hình giới hạn
MAX_RUN_TIME="${MAX_RUN_TIME:-5}"
MAX_MEMORY="${MAX_MEMORY:-256000}" 
MAX_OUTPUT_SIZE="${MAX_OUTPUT_SIZE:-1M}"
WORKSPACE="${WORKSPACE:-/workspace}"

# --- SỬA LỖI EXECUTABLE ---
if [[ "$LANGUAGE" == "cpp" ]]; then
    CMD=("${WORKSPACE}/solution")
elif [[ "$LANGUAGE" == "javascript" ]]; then
    CMD=("node" "${WORKSPACE}/${SOURCE_FILE}")
else
    CMD=("${WORKSPACE}/solution")
fi

# ==========================================
# Logging & Cleanup
# ==========================================
log_info() { echo "[INFO] $1" >&2; }
log_error() { echo "[ERROR] $1" >&2; }

cleanup() {
    rm -f .tmp_input .tmp_actual .compile_log
}
trap cleanup EXIT

# Kiểm tra file test cases
if [[ ! -f "$TEST_CASES_FILE" ]]; then
    echo "{\"verdict\":\"SYSTEM_ERROR\", \"message\":\"Test cases file not found\"}"
    exit 1
fi

# ==========================================
# THÊM: BIÊN DỊCH CHO C++
# ==========================================
if [[ "$LANGUAGE" == "cpp" ]]; then
    log_info "Compiling C++ source..."
    if ! g++ -O3 "$SOURCE_FILE" -o "${WORKSPACE}/solution" 2>.compile_log; then
        COMPILE_ERRORS=$(cat .compile_log | head -c 5000)
        jq -n \
            --arg verdict "COMPILE_ERROR" \
            --arg details "$COMPILE_ERRORS" \
            '{verdict: $verdict, message: "Lỗi biên dịch", compile_details: $details}'
        exit 0
    fi
    log_info "Compilation successful."
fi

# ==========================================
# Functions
# ==========================================
normalize() {
    # Xóa khoảng trắng cuối dòng, xóa dòng trống cuối, xóa \r
    printf "%s" "$1" | sed 's/[[:space:]]*$//' | tr -d '\r' | sed -e :a -e '/^\n*$/{$d;N;ba' -e '}'
}

# ==========================================
# Process Test Cases
# ==========================================
log_info "=== Starting Judge (Language: $LANGUAGE) ==="

TOTAL_TESTS=0
PASSED_TESTS=0
TOTAL_TIME=0
TEST_RESULTS="[]"
FIRST_FAILURE="null"
FINAL_VERDICT="ACCEPTED"

# Đọc dữ liệu an toàn bằng TSV + Base64
while IFS=$'\t' read -r TEST_NAME_RAW TEST_INPUT_B64 EXPECTED_B64; do
    [ -z "$TEST_NAME_RAW" ] && continue
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    TEST_NAME="$TEST_NAME_RAW"
    TEST_INPUT=$(echo "$TEST_INPUT_B64" | base64 -d)
    EXPECTED_OUTPUT=$(echo "$EXPECTED_B64" | base64 -d)

    log_info "Running: $TEST_NAME"

    printf "%s" "$TEST_INPUT" > .tmp_input
    
    EXEC_START=$(date +%s%N)
    EXIT_CODE=0
    
    # --- THỰC THI CHÍNH XÁC ---
    (
        ulimit -v "$MAX_MEMORY" 2>/dev/null || true
        timeout "$MAX_RUN_TIME" "${CMD[@]}" < .tmp_input 2>&1 | head -c "$MAX_OUTPUT_SIZE" > .tmp_actual
    )
    EXIT_CODE=$?

    EXEC_END=$(date +%s%N)
    EXEC_TIME=$(( (EXEC_END - EXEC_START) / 1000000 ))
    TOTAL_TIME=$((TOTAL_TIME + EXEC_TIME))

    ACTUAL_OUTPUT=$(cat .tmp_actual)
    ACTUAL_NORMALIZED=$(normalize "$ACTUAL_OUTPUT")
    EXPECTED_NORMALIZED=$(normalize "$EXPECTED_OUTPUT")

    CUR_VERDICT="ACCEPTED"
    PASSED="false"

    if [ "$EXIT_CODE" -eq 124 ]; then
        CUR_VERDICT="TIME_LIMIT_EXCEEDED"
    elif [ "$EXIT_CODE" -ne 0 ]; then
        CUR_VERDICT="RUNTIME_ERROR"
    elif [[ "$ACTUAL_NORMALIZED" == "$EXPECTED_NORMALIZED" ]]; then
        CUR_VERDICT="ACCEPTED"
        PASSED="true"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        CUR_VERDICT="WRONG_ANSWER"
    fi

    if [ "$CUR_VERDICT" != "ACCEPTED" ] && [ "$FINAL_VERDICT" == "ACCEPTED" ]; then
        FINAL_VERDICT="$CUR_VERDICT"
    fi

    TEST_RESULTS=$(jq -n \
        --argjson current "$TEST_RESULTS" \
        --arg name "$TEST_NAME" \
        --argjson passed "$PASSED" \
        --arg verdict "$CUR_VERDICT" \
        --arg input "$TEST_INPUT" \
        --arg expected "$EXPECTED_OUTPUT" \
        --arg actual "$ACTUAL_OUTPUT" \
        --argjson time "$EXEC_TIME" \
        '$current + [{name: $name, passed: $passed, verdict: $verdict, input: $input, expected: $expected, actual: $actual, executionTime: $time}]')

    if [ "$PASSED" == "false" ]; then
        FIRST_FAILURE=$(jq -n \
            --arg name "$TEST_NAME" \
            --arg input "$TEST_INPUT" \
            --arg expected "$EXPECTED_OUTPUT" \
            --arg actual "$ACTUAL_OUTPUT" \
            '{name: $name, input: $input, expected: $expected, actual: $actual}')
        break
    fi

done < <(jq -r '.[] | [.name // "", (.input // "" | @base64), (.expected // "" | @base64)] | @tsv' "$TEST_CASES_FILE")

# ==========================================
# Final JSON Output
# ==========================================
jq -n \
    --arg verdict "$FINAL_VERDICT" \
    --argjson passed "$PASSED_TESTS" \
    --argjson total "$TOTAL_TESTS" \
    --argjson time "$TOTAL_TIME" \
    --argjson results "$TEST_RESULTS" \
    --argjson failure "$FIRST_FAILURE" \
    '{verdict: $verdict, stats: {passed: $passed, total: $total, totalTimeMs: $time}, firstFailure: $failure, details: $results}'

log_info "=== Judge Finished: $FINAL_VERDICT ==="