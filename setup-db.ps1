$password = Read-Host "Digite a senha do usuario 'postgres'" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)

[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

$envContent = "DATABASE_URL=`"postgresql://postgres:$plainPassword@localhost:5432/mangareader_db`""
Set-Content -Path "D:\MangaProject\.env" -Value $envContent
Write-Host "Arquivo .env criado com sucesso." -ForegroundColor Green

node D:\MangaProject\scripts\create-db.js
