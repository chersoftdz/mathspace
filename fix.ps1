$lines = Get-Content "exams.js" -Encoding UTF8
$newLines = $lines[0..191] + $lines[409..$($lines.Length - 1)]
$newLines | Set-Content "exams.js" -Encoding UTF8
Write-Host "File fixed successfully"
