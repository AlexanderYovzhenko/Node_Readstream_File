const fs = require('fs');
const readline = require('readline');

async function readLinesFile(fileName, numberLines) {
  const fileReadStream = fs.createReadStream(__dirname + '/../files/' + fileName);
  const linesFile = [];

  const readLine = readline.createInterface({
    input: fileReadStream,
    crlfDelay: Infinity
  });

  for await (const line of readLine) {
    linesFile.push(line);
  }

  if (numberLines > linesFile.length) {
    console.log(`All lines from the file:\n ${linesFile.join('\n')}`);
  } else if (numberLines <= 0 || !!numberLines === false) {
    console.log('Not correct number of lines');
  } else {
    console.log(`Last ${numberLines} line[s] from the file:\n ${linesFile.slice((linesFile.length - numberLines)).join('\n')}`);
  }
}

const fileNameArr = ['textEn.txt', 'textRu.txt'];
const numberLines = 5;

readLinesFile(fileNameArr[1], numberLines);
