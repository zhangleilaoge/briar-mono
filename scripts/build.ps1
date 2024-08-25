# 获取当前脚本所在目录
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent

# 设置当前工作目录为脚本所在目录
Set-Location -Path $scriptDir

# 1. Git pull
Write-Output "Pulling latest changes from git..."
git stash
git pull
if ($LASTEXITCODE -ne 0) {
    Write-Output "Git pull failed. Exiting..."
    exit 1
}

# 2. Docker run
Write-Output "try to run docker..."
docker system prune -a -f
# rm  ~/.docker/config.json 
docker compose pull
docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Output "Docker run failed. Exiting..."
    exit 1
}

Write-Output "All steps completed successfully."
