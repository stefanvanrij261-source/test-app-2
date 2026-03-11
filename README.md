test-app-2

## Contactformulier e-mail (server-side)
Het contactformulier op `pagina4.html` verstuurt berichten via `POST /api/contact` vanuit de server.

## Belangrijk (PowerShell)
Je moet SMTP-variabelen zetten **in dezelfde PowerShell-sessie en vóór `npm start`**.
Anders ziet de server ze niet en krijg je: `Mail server not configured`.

## Windows PowerShell (copy/paste)
```powershell
cd C:\Users\lnvan\Downloads\QR-code\server

$env:SMTP_HOST="smtp.voorbeeldprovider.nl"
$env:SMTP_PORT="587"
$env:SMTP_USER="echte_smtp_user"
$env:SMTP_PASS="echt_app_wachtwoord"
$env:MAIL_FROM="noreply@jouwdomein.nl"
$env:MAIL_TO="pcpocontact@gmail.com"
$env:SMTP_SECURE="false"
$env:SMTP_ALLOW_INVALID_CERT="false"

npm start