param (
    [string]$apiKey
)

Write-Output "Starting node server..."
pnpm run start
if ($LASTEXITCODE -ne 0) {
    Write-Output "start node server failed. Exiting..."
    exit 1
}