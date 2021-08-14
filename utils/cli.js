module.exports.input = (str = '') => new Promise((resolve) => {
  if (str) {
    this.write(`${str} `, false);
  }
  process.stdin.once('data', (line) => {
    resolve(line.toString().trim());
  });
});

module.exports.write = (str = '', addNewLine = true) => {
  if (Array.isArray(str)) {
    for (const line of str) {
      this.write(line, addNewLine);
    }
    return;
  }
  process.stdout.write(`${str}${addNewLine ? '\n' : ''}`);
}

module.exports.getArg = (keys, defaultValue = null) => {
  const args = process.argv.slice(2);
  for (const key of keys) {
    const index = args.indexOf(key);
    if (index !== -1 && typeof args[index + 1] !== 'undefined') {
      return args[index + 1];
    }
  }
  return defaultValue;
}

module.exports.hasArg = (keys) => process.argv.slice(2).findIndex((x) => keys.includes(x)) > -1;

module.exports.exit = (code = 0, text = '') => {
  if (text) {
    this.write(text);
  }
  process.exit(code);
}
