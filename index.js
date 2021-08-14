#!/usr/bin/env node

const { input, write, getArg, hasArg, exit } = require('./utils/cli.js');
const { mkdir, jsonFile } = require('./utils/files.js');
const translate = require('./utils/translate.js');
const { exec } = require('child_process');
const path = require('path');
const homeDir = require('os').homedir();
const pkgJson = require('./package.json');

(async () => {
  mkdir(`${homeDir}/.vocabul`);

  const action = getArg(['--action', '-a'], false);
  const help = hasArg(['--help', '-h']);
  const version = hasArg(['--version', '-v']);

  if (help) {
    write([
      'Usage: vocabul [...arguments]',
      'Available arguments are:',
      '  --action -a [action]: Required and Should be one of "translate", "random", or "start"',
      '  --dictionary -d [dictionary_name=default]: Local dictionary name',
      '  --from -f [lang_code=auto]: Source language for "translate" action',
      '  --to -t [lang_code]: Target language for "translate" action',
      '  --word -w [word]: Input word for "translate" action',
      '  --add -y [y/n=y]: Add translated word to dictionary',
      '  --period -p [minute=1]: "start" action interval period',
      '  --command -c [command="notify-send"]: "start" action run command',
      '  --version -v: Show installed version',
      '  --help -h: Show help',
    ]);
    exit(0);
  }

  if (version) {
    write(pkgJson.version);
    exit(0);
  }

  if (!action) {
    write('--action arg is missing! Use --help to see how to use!');
    exit(-1);
  }

  const dictionary = getArg(['--dictionary', '-d'], 'default');
  const dictionaryFile = jsonFile(path.resolve(homeDir, '.vocabul', `${dictionary}.json`), []);

  if (action === 'translate') {
    const word = getArg(['--word', '-w']) || (await input('Enter the word:')) || exit(-1, 'Missing "word" variable!');
    const from = getArg(['--from', '-f'], 'auto');
    const to = getArg(['--to', '-t']) || (await input('Enter the target language code:')) || exit(-1, 'Missing "to" variable!');

    const translation = await translate(word, from, to);

    write(`${word}: ${translation}`);

    let addToDict = null;
    if (hasArg(['--add', '-y'])) {
      addToDict = !['false', 'no', '0', 'n'].includes(getArg(['--add', '-y']));
    } else {
      const addToDictQ = await input(`Add "${word}" to "${dictionary}" dictionary? [y/n]`);
      addToDict = addToDictQ !== 'n';
    }
    if (addToDict) {
      dictionaryFile.content.push([word, translation]);
      dictionaryFile.save();
    }
    exit(0);
  }

  if (action === 'random') {
    if(dictionaryFile.content.length === 0) {
      write(`Dictionary "${dictionary}" is empty!`);
      exit(-1);
    }
    const randomWord = dictionaryFile.content[Math.floor(Math.random() * dictionaryFile.content.length)];
    write(`${randomWord[0]}: ${randomWord[1]}`);
    exit(0);
  }

  if (action === 'start') {
    period = getArg(['--period', '-p']) || (await input(`Interval period (minutes)? [1]`)) || '1';
    const pmil = Number(period) * 60000;
    const command = getArg(['--command', '-c'], 'notify-send');

    const run = () => {
      if(dictionaryFile.content.length > 0) {
        const randomWord = dictionaryFile.content[Math.floor(Math.random() * dictionaryFile.content.length)];
        write(`${randomWord[0]}: ${randomWord[1]}`);
        exec(`${command} "${randomWord[0]}: ${randomWord[1]}"`);
      }
    }
    run();
    setInterval(run, pmil);
  }

})();
