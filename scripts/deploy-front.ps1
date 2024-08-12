param (
    [string]$cosSecretId,
    [string]$cosSecretKey,
    [string]$cosBucket,
    [string]$region,
    [string]$cdnUrl
)

# 设置环境变量
[System.Environment]::SetEnvironmentVariable('COS_SECRET_ID', $cosSecretId, [System.EnvironmentVariableTarget]::Process)
[System.Environment]::SetEnvironmentVariable('COS_SECRET_KEY', $cosSecretKey, [System.EnvironmentVariableTarget]::Process)
[System.Environment]::SetEnvironmentVariable('COS_BUCKET', $cosBucket, [System.EnvironmentVariableTarget]::Process)
[System.Environment]::SetEnvironmentVariable('REGION', $region, [System.EnvironmentVariableTarget]::Process)
[System.Environment]::SetEnvironmentVariable('CDN_URL', $cdnUrl, [System.EnvironmentVariableTarget]::Process)

# 获取当前脚本所在目录
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent

# 设置当前工作目录为脚本所在目录
Set-Location -Path $scriptDir

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

# 5. start node server
Write-Output "Starting node server..."
pnpm run start
if ($LASTEXITCODE -ne 0) {
    Write-Output "start node server failed. Exiting..."
    exit 1
}

Write-Output "All steps completed successfully."
