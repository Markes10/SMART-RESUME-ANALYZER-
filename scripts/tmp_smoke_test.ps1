$base='http://127.0.0.1:8000'

Write-Output "--- Register employee ---"
$emp = @{username='smoke_emp'; email='smoke_emp@example.com'; password='Password123!'; role='employee'}
try { $r = Invoke-RestMethod -Uri "$base/auth/register" -Method Post -ContentType 'application/json' -Body ($emp|ConvertTo-Json -Depth 5) ; $r | ConvertTo-Json -Depth 5 } catch { Write-Output "EMP_REGISTER_ERROR: $_" }

Write-Output "--- Login employee ---"
try { $login = Invoke-RestMethod -Uri "$base/auth/token" -Method Post -ContentType 'application/x-www-form-urlencoded' -Body @{username=$emp.username; password=$emp.password}; $login | ConvertTo-Json -Depth 5 } catch { Write-Output "EMP_LOGIN_ERROR: $_" }

$emp_token = $null
if ($login -and $login.access_token) { $emp_token = $login.access_token; Write-Output "Employee token acquired" } else { Write-Output "No token returned for employee" }

Write-Output "--- Get current user (employee) ---"
if ($emp_token) {
    try { $me = Invoke-RestMethod -Uri "$base/auth/users/me" -Headers @{Authorization = "Bearer $emp_token"}; $me | ConvertTo-Json -Depth 5 } catch { Write-Output "EMP_ME_ERROR: $_" }
}

Write-Output "--- Update current user (employee) ---"
if ($emp_token) {
    $update = @{username='smoke_emp2'; email='smoke_emp2@example.com'}
    try { $up = Invoke-RestMethod -Uri "$base/auth/users/me" -Method Put -Headers @{Authorization = "Bearer $emp_token"} -ContentType 'application/json' -Body ($update|ConvertTo-Json); $up | ConvertTo-Json -Depth 5 } catch { Write-Output "EMP_UPDATE_ERROR: $_" }
}

Write-Output "--- Register admin ---"
$adm = @{username='smoke_admin'; email='smoke_admin@example.com'; password='AdminPass123!'; role='admin'}
try { $ra = Invoke-RestMethod -Uri "$base/auth/register" -Method Post -ContentType 'application/json' -Body ($adm|ConvertTo-Json -Depth 5); $ra | ConvertTo-Json -Depth 5 } catch { Write-Output "ADMIN_REGISTER_ERROR: $_" }

Write-Output "--- Login admin ---"
try { $alog = Invoke-RestMethod -Uri "$base/auth/token" -Method Post -ContentType 'application/x-www-form-urlencoded' -Body @{username=$adm.username; password=$adm.password}; $alog | ConvertTo-Json -Depth 5 } catch { Write-Output "ADMIN_LOGIN_ERROR: $_" }

$admin_token = $null
if ($alog -and $alog.access_token) { $admin_token = $alog.access_token; Write-Output "Admin token acquired" } else { Write-Output "No token returned for admin" }

Write-Output "--- Admin list users ---"
if ($admin_token) {
    try { $list = Invoke-RestMethod -Uri "$base/auth/users" -Headers @{Authorization = "Bearer $admin_token"}; $list | ConvertTo-Json -Depth 5 } catch { Write-Output "ADMIN_LIST_ERROR: $_" }
} else { Write-Output "Skipping admin list (no token)" }

Write-Output "--- Done smoke tests ---"
