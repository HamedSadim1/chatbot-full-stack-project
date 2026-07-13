#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Renames the project folder from "chatbot-full-stack-project" to "wonderworld-chat".

.DESCRIPTION
    Run this script from any location EXCEPT inside the project folder itself
    (for example, from a fresh PowerShell window or by double-clicking the .bat file).
    It renames the local project folder so it matches the GitHub repository name.

    This is a one-time helper script. You can delete it after the folder is renamed.

.PARAMETER ParentDirectory
    The directory that contains the project folder. Defaults to the known project parent path.

.EXAMPLE
    .\rename-to-wonderworld-chat.ps1

.EXAMPLE
    .\rename-to-wonderworld-chat.ps1 -ParentDirectory "C:\Users\hamid\Downloads\AP_Hogeschool\Webframeworks\Extra_Oefeningen"
#>

param(
    [string]$ParentDirectory = "C:\Users\hamid\Downloads\AP_Hogeschool\Webframeworks\Extra_Oefeningen"
)

$ErrorActionPreference = "Stop"

$oldName = "chatbot-full-stack-project"
$newName = "wonderworld-chat"

$oldPath = Join-Path -Path $ParentDirectory -ChildPath $oldName
$newPath = Join-Path -Path $ParentDirectory -ChildPath $newName

# Safety check: do not run from inside the folder that is about to be renamed.
$currentDir = (Get-Item -Path ".").FullName.TrimEnd('\')
if ($currentDir -ieq $oldPath -or $currentDir.StartsWith($oldPath + "\", [System.StringComparison]::OrdinalIgnoreCase)) {
    Write-Error "You are currently inside the folder that will be renamed. Open a new terminal outside of '$oldName' and run the script again."
    exit 1
}

if (-Not (Test-Path -Path $oldPath -PathType Container)) {
    Write-Host "Folder already renamed or not found: $oldPath" -ForegroundColor Yellow
    exit 0
}

if (Test-Path -Path $newPath) {
    Write-Error "Cannot rename: a folder named '$newName' already exists in $ParentDirectory"
    exit 1
}

Write-Host "Renaming folder..." -ForegroundColor Cyan
Write-Host "  From: $oldPath" -ForegroundColor Gray
Write-Host "  To:   $newPath" -ForegroundColor Gray

Rename-Item -Path $oldPath -NewName $newName

Write-Host "Done! The project folder is now: $newPath" -ForegroundColor Green
Write-Host "Open the project from the new folder before continuing." -ForegroundColor Green
Write-Host "You can now delete rename-to-wonderworld-chat.ps1 and rename-to-wonderworld-chat.bat." -ForegroundColor DarkGray
