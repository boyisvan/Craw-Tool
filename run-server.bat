@echo off
title DucVanCoder Crawler Tool
echo ========================================
echo    DucVanCoder Crawler Tool
echo ========================================
echo.
echo Dang kiem tra Node.js...
node --version
if %errorlevel% neq 0 (
    echo Loi: Node.js chua duoc cai dat!
    echo Vui long cai dat Node.js tu: https://nodejs.org/
    pause
    exit
)

echo.
echo Dang cai dat dependencies...
call npm install

echo.
echo Dang kiem tra cac port dang su dung...
echo Dang dong cac process dang su dung port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo Dang dong cac process dang su dung port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo Da dong cac process cu.
timeout /t 2 /nobreak >nul

echo.
echo Dang khoi dong server...
echo Server se chay tai: http://localhost:3000
echo.

REM Mo trinh duyet sau 3 giay
start /b timeout /t 3 /nobreak >nul && start http://localhost:8080

REM Chay server
cd js
node server.js

pause