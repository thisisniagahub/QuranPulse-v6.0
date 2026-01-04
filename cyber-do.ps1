function Invoke-CyberDo {
    param(
        [Parameter(Mandatory=$true)]
        [string]$TaskDescription
    )

    Write-Host "🤖 Cyber-Manager is thinking..." -ForegroundColor Cyan
    
    # Run the gemini command and capture output
    # We use --non-interactive if possible, or usually gemini just outputs the text
    $command = gemini /cyber:do "$TaskDescription"
    
    # Filter lines to find the one starting with 'gemini'
    $cleanCommand = $command | Where-Object { $_ -match "^gemini /cyber:" } | Select-Object -First 1

    if ($cleanCommand) {
        Write-Host "✔ Manager delegated to: $cleanCommand" -ForegroundColor Green
        Write-Host "⚡ Executing..." -ForegroundColor Yellow
        Invoke-Expression $cleanCommand
    } else {
        Write-Error "Could not determine delegation command from output."
        Write-Host "Raw Output:" -ForegroundColor DarkGray
        $command | ForEach-Object { Write-Host $_ }
    }
}

Set-Alias cyber-do Invoke-CyberDo
Export-ModuleMember -Function Invoke-CyberDo -Alias cyber-do
