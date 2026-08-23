const fs = require('fs');
function readdir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = dir + '/' + file;
    if (fs.statSync(filePath).isDirectory()) {
      readdir(filePath, fileList);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}
const files = readdir('src');
files.forEach(file => {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const match = line.match(/useState\((.*?)\)/);
    if (match) {
      const arg = match[1].trim();
      if (!arg) {
        console.log(file + ':' + (i+1) + ': ' + line.trim() + ' (Empty)');
      } else if (!arg.includes('||') && !arg.startsWith("'") && !arg.startsWith('"') && !arg.startsWith('`') && arg !== 'false' && arg !== 'true' && arg !== 'null' && arg !== '[]' && arg !== '{}' && !arg.includes('{') && !arg.includes('[')) {
        console.log(file + ':' + (i+1) + ': ' + line.trim());
      }
    }
  });
});
