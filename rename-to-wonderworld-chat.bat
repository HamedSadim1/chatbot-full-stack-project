@echo off
:: Wrapper for rename-to-wonderworld-chat.ps1
:: Run this from a fresh Command Prompt or double-click it.
:: This is a one-time helper script. You can delete it after the folder is renamed.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0rename-to-wonderworld-chat.ps1" %*

:: Only pause when the script was likely double-clicked (no existing terminal context).
if "%1"=="" pause
