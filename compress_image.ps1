Add-Type -AssemblyName System.Drawing
$inputPath = "C:\Users\PC\Desktop\Azores4you\public\tours\studio.jpg"
$outputPath = "C:\Users\PC\Desktop\Azores4you\public\tours\studio_ready.jpg"

if (Test-Path $inputPath) {
    $img = [System.Drawing.Image]::FromFile($inputPath)
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 70) # 70% Quality
    
    $img.Save($outputPath, $codec, $encoderParams)
    $img.Dispose()
    Write-Host "Compressão concluída com sucesso!"
} else {
    Write-Host "Erro: Ficheiro original não encontrado."
}
