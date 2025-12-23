$file = "c:\Users\tusha\Desktop\ucm2\university-cms\src\pages\InstructorDashboard.jsx"
$content = Get-Content $file -Raw

# Find and remove the malformed section
$malformed = '            })}\"'
$start = $content.IndexOf($malformed)

if ($start -ne -1) {
    $endMarker = '          {courses.length === 0 && ('
    $end = $content.IndexOf($endMarker, $start)
    
    if ($end -ne -1) {
        $before = $content.Substring(0, $start)
        $after = $content.Substring($end)
        $fixed = $before + '            })}' + "`n" + '          </div>' + "`n`n" + $after
        Set-Content $file $fixed
        Write-Host "Fixed!"
    }
}
