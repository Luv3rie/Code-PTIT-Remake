FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# ==========================================
# Install Runtimes & Utils
# ==========================================
RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    gcc \
    curl \
    ca-certificates \
    jq \
    coreutils \
    sed \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    # Dọn dẹp để giảm dung lượng image
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ==========================================
# Setup Workspace & Permissions
# ==========================================
WORKDIR /workspace

# Quan trọng: Cấp quyền ghi cho mọi user tại /workspace 
# Vì Node.js truyền UID động qua lệnh "docker run --user"
RUN chmod 777 /workspace

# ==========================================
# Copy Judge Script
# ==========================================
# Chép vào /usr/local/bin để gọi từ bất cứ đâu
COPY run_judge.sh /usr/local/bin/run_judge.sh
RUN chmod +x /usr/local/bin/run_judge.sh

# ==========================================
# Security & Env
# ==========================================
# Không nhất thiết phải switch USER ở đây nếu bạn đã dùng --user ở Node.js
# Nhưng tạo sẵn để làm mặc định nếu chạy thủ công
RUN useradd -m judgeuser
ENV PATH="/usr/local/bin:${PATH}"

# Shell mặc định
SHELL ["/bin/bash", "-c"]

# Entrypoint nhận tham số từ Node.js: fileName test_cases.json language
ENTRYPOINT ["/usr/local/bin/run_judge.sh"]