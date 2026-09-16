$ErrorActionPreference = 'SilentlyContinue'

$ports = @(3000, 3010)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $uniquePids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $uniquePids) {
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
    }
}

$env:PORT = '3010'
Set-Location 'c:\Users\Akshatha Chinnur\Downloads\KrishiRakshak-main\KrishiRakshak-main\frontend2'
npx.cmd tsx server.ts --host 0.0.0.0
