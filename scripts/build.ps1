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
sudo docker stop $(sudo docker ps -aq)
sudo docker rm $(sudo docker ps -a -q)
sudo docker system prune -a -f
# 有时候这句会静默失败，所以这里等待 5 秒
sleep 5
sudo docker volume rm briar-mono_briar-static -f
sleep 5
sudo docker compose pull
sudo docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Output "Docker run failed. Exiting..."
    exit 1
}

Write-Output "All steps completed successfully."
