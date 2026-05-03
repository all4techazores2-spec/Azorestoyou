
Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\PC\Desktop\Azores4you\public\tours\studio.jpg"
$destPath = "C:\Users\PC\Desktop\Azores4you\public\tours\studio_compressed.jpg"

if (Test-Path $imagePath) {
    $img = [System.Drawing.Image]::FromFile($imagePath)
    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
    # Set quality to 60%
    $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 60)
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    
    $img.Save($destPath, $codec, $encoderParameters)
    $img.Dispose()
    
    # Replace original if successful and smaller
    if ((Get-Item $destPath).Length -lt (Get-Item $imagePath).Length) {
        Remove-Item $imagePath
        Move-Item $destPath $imagePath
        Write-Host "Compressed studio.jpg successfully!"
    }
} else {
    Write-Host "File not found: $imagePath"
}
