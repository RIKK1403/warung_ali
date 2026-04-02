@echo off
REM Install & Start Script untuk Warung Ali (Windows)
REM Double-click file ini untuk menjalankan

echo 🏪 Warung Ali - Setup ^& Start
echo ==============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js tidak terinstall
    echo Silahkan download di: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i

echo ✓ Node.js: %NODE_VER%
echo ✓ NPM: %NPM_VER%
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo ✓ Dependencies installed
    echo.
)

REM Ask for sample data
set /p SAMPLE="Tambahkan sample data untuk testing? (Y/n): "
if "%SAMPLE%"=="" set SAMPLE=Y

if /i "%SAMPLE%"=="Y" (
    echo 🌱 Adding sample data...
    node backend/seed.js
    echo.
)

REM Start server
echo 🚀 Starting server...
echo 📍 Open: http://localhost:3000
echo.
call npm start

pause
