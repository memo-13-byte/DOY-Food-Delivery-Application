const fs = require('fs');
const path = require('path');

// package.json dosyasını okuyalım
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Webpack için gerekli script'leri ekleyelim
packageJson.scripts = {
  ...packageJson.scripts,
  "webpack-start": "webpack serve",
  "webpack-build": "webpack --mode production",
  "webpack-dev": "webpack serve --mode development"
};

// Değişiklikleri kaydedelim
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('package.json dosyası webpack scriptleri ile güncellendi.');