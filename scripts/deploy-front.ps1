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

# 4. upload to cdn
Write-Output "Uploading to cdn..."
node ./depoly-front-upload-cdn.js
if ($LASTEXITCODE -ne 0) {
    Write-Output "upload to cdn failed. Exiting..."
    exit 1
}

# 5. Reload nginx
Write-Output "Reloading nginx..."
nginx -s reload
if ($LASTEXITCODE -ne 0) {
    Write-Output "nginx reload failed. Exiting..."
    exit 1
}

Write-Output "All steps completed successfully."
