const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove JSDoc blocks starting with /** and ending with */
    // Note: this will remove ALL JSDoc blocks. 
    const cleaned = content.replace(/\/\*\*[\s\S]*?\*\/\s*/g, '');
    if (cleaned !== content) {
      fs.writeFileSync(filePath, cleaned, 'utf8');
      console.log('Cleaned', filePath);
    }
  }
});
