# PowerShell script to perform the following tasks:
# 1. Git pull
# 2. Install dependencies using pnpm
# 3. Build the project
# 4. Reload nginx

# 1. Git pull
Write-Output "Pulling latest changes from git..."
git pull
if ($LASTEXITCODE -ne 0) {
    Write-Output "Git pull failed. Exiting..."
    exit 1
}

# 2. Install dependencies using pnpm
Write-Output "Installing dependencies with pnpm..."
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Output "pnpm install failed. Exiting..."
    exit 1
}

# 3. Build the project
Write-Output "Building the project..."
pnpm run build
if ($LASTEXITCODE -ne 0) {
    Write-Output "pnpm run build failed. Exiting..."
    exit 1
}

# 4. Reload nginx
Write-Output "Reloading nginx..."
nginx -s reload
if ($LASTEXITCODE -ne 0) {
    Write-Output "nginx reload failed. Exiting..."
    exit 1
}

Write-Output "All steps completed successfully."
