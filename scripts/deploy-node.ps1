param (
    [string]$apiKey
)

# 设置环境变量
[System.Environment]::SetEnvironmentVariable('API_KEY', $apiKey, [System.EnvironmentVariableTarget]::Process)

Write-Output "Starting node server..."
pnpm run start
if ($LASTEXITCODE -ne 0) {
    Write-Output "start node server failed. Exiting..."
    exit 1
}