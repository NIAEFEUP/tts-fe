Write-Output ">> Formating ./django/entrypoint.sh file..."
$EntrypointPath =  '.\django\entrypoint.sh' 
$result = Get-Content -Raw -Path $EntrypointPath
$result | ForEach-Object {$_ -replace "[`r`n]+", "`n"} | Set-Content $EntrypointPath

Write-Output ">> Removing old containers..."
docker compose down
Write-Output ">> Initializing docker..."
docker compose up --build -d