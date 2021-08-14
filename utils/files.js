const fs = require('fs');
const path = require('path');

module.exports.mkdir = (dirPath) => {
  try {
    fs.mkdirSync(path.resolve(dirPath), { recursive: true });
  } catch (e) {}
};


module.exports.jsonFile = (filePath, defaultValue) => {
  const resolvedFilePath = path.resolve(filePath);
  let content = defaultValue;
  const reload = () => {
    try {
      content = JSON.parse(fs.readFileSync(resolvedFilePath, 'utf-8'));
    } catch (e) {}
  }

  const save = () => {
    fs.writeFileSync(resolvedFilePath, JSON.stringify(content), 'utf-8')
  }

  reload();
  return {
    reload,
    save,
    path: resolvedFilePath,
    content,
  }
}
