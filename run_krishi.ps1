$ErrorActionPreference = 'SilentlyContinue'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = Get-Location }

# 1. Clean up old processes on ports 3000, 3010, 8000, 8001
$ports = @(3000, 3010, 8000, 8001)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $uniquePids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $uniquePids) {
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
    }
}

# 2. Launch Backend: Crop Advisory API (Port 8000)
$pythonExe = Join-Path $ScriptDir "venv\Scripts\python.exe"
if (-not (Test-Path $pythonExe)) {
    $pythonExe = "python"
}

$cropDir = Join-Path $ScriptDir "backend\crop_model"
Start-Process -FilePath $pythonExe -ArgumentList "api.py" -WorkingDirectory $cropDir -WindowStyle Hidden

# 3. Launch Backend: Fertilizer Advisory API (Port 8001)
$fertDir = Join-Path $ScriptDir "backend\fertilizer_model"
Start-Process -FilePath $pythonExe -ArgumentList "fertilizer.py" -WorkingDirectory $fertDir -WindowStyle Hidden

# 4. Launch Frontend2 (Port 3010)
$frontendDir = Join-Path $ScriptDir "frontend2"
Set-Location $frontendDir
$env:PORT = '3010'
npx.cmd tsx server.ts --host 0.0.0.0

