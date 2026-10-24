@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Instaliraj Node.js 24 ili noviji.
 pause
 exit /b 1
)
node -e "if(Number(process.versions.node.split('.')[0])<24)process.exit(1)"
if errorlevel 1 (
 echo Potreban je Node.js 24 ili noviji.
 pause
 exit /b 1
)
if not exist "node_modules" (
 call npm.cmd ci
 if errorlevel 1 (
  echo Instalacija nije uspela. Proveri poruku iznad.
  pause
  exit /b 1
 )
)
echo Otvori http://localhost:4173 u Chrome-u.
call npm.cmd start
pause
