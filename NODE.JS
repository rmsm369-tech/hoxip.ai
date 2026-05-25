const fs = require('fs');
const html = `<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'/>
<meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'/>
<meta name='mobile-web-app-capable' content='yes'/>
<meta name='apple-mobile-web-app-capable' content='yes'/>
<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
<meta name='theme-color' content='#050508'/>
<title>Pulse — Music</title>
<link rel='manifest' href='manifest.json'/>
<link href='https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap' rel='stylesheet'/>
</head>
<body>
<p>test</p>
</body>
</html>`;
fs.writeFileSync('/tmp/test.html', html);
console.log('File size:', fs.statSync('/tmp/test.html').size, 'bytes');
console.log('Done');