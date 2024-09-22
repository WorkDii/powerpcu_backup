@echo off
:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )
:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params = %*:"=""
    echo UAC.ShellExecute "cmd.exe", "/c %~s0 %params%", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B
:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------
sc stop power_pcu_backup
sc delete power_pcu_backup
sc stop jhcis_backup_s3
sc delete jhcis_backup_s3
REM Install the service
"%~dp0lib\nssm-2.24\win64\nssm.exe" install power_pcu_backup "%~dp0power_pcu_backup.exe"
REM Configure stdout log
"%~dp0lib\nssm-2.24\win64\nssm.exe" set power_pcu_backup AppStdout "%~dp0power_pcu_backup_stdout.log"
"%~dp0lib\nssm-2.24\win64\nssm.exe" set power_pcu_backup AppStdoutCreationDisposition 4
REM Configure stderr log
"%~dp0lib\nssm-2.24\win64\nssm.exe" set power_pcu_backup AppStderr "%~dp0power_pcu_backup_stderr.log"
"%~dp0lib\nssm-2.24\win64\nssm.exe" set power_pcu_backup AppStderrCreationDisposition 4
REM Set rotation settings (optional)
"%~dp0lib\nssm-2.24\win64\nssm.exe" set power_pcu_backup AppRotateFiles 1
"%~dp0lib\nssm-2.24\win64\nssm.exe" set power_pcu_backup AppRotateOnline 1
"%~dp0lib\nssm-2.24\win64\nssm.exe" set power_pcu_backup AppRotateBytes 1048576
REM Set restart delay to 1 day
"%~dp0lib\nssm-2.24\win64\nssm.exe" set power_pcu_backup AppRestartDelay 21600000 
echo Service installed and configured with logging and 6 hours restart delay.
REM Open the service in the Services control panel
start https://powerpcu.com/backup