$migrations = @(
    "001", "010", "20240101", "20251129", "20251220", "20251221", "20260104", "20260105"
)

# Get all SQL files in migrations folder
$files = Get-ChildItem "H:\ANTIGRAVITY\QuranPulse-v6.0\supabase\migrations" -Filter "*.sql"

foreach ($file in $files) {
    # Skip the new migration I just created
    if ($file.Name -like "20260107010000*") {
        Write-Host "Skipping new migration: $($file.Name)"
        continue
    }
    
    # Extract version (everything before first underscore)
    $version = $file.Name.Split('_')[0]
    
    Write-Host "Repairing migration: $version ($($file.Name))"
    
    # Run the repair command
    & npx supabase migration repair --status applied $version --linked
}
