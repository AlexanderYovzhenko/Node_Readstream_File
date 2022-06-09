const fs = require('mz/fs');

const readLastLines = async (inputFilePath, maxLineCount) => {

  const NEW_LINE_CHARACTERS = ['\n'];
  const encoding = 'utf8';
  let stat = null;
  let file = null;
  let chars = 0;
  let lineCount = 0;
  let lines = '';

  const existsFile = () => {
    return fs.exists(inputFilePath);
  };

  const readPreviousChar = async ( stat, file, currentCharacterCount) => {
    const bytesReadAndBuffer = await fs.read(file, Buffer.alloc(1), 0, 1, stat.size - 1 - currentCharacterCount);

    return String.fromCharCode(bytesReadAndBuffer[1][0]);
  };

  const countLines = async () => {
    if (lines.length >= stat.size || lineCount >= maxLineCount) {

      if (NEW_LINE_CHARACTERS.includes(lines.substring(0, 1))) {
        lines = lines.substring(1);
      }
      fs.close(file);
      return Buffer.from(lines, 'binary').toString(encoding);
    }

    const nextCharacter = await readPreviousChar(stat, file, chars);

    lines = nextCharacter + lines;

    if (NEW_LINE_CHARACTERS.includes(nextCharacter) && lines.length > 1) {
      lineCount++;
    }

    chars++;

    return countLines();
  };

  return new Promise(async (resolve, reject) => {
    try {
      if (!await existsFile()) {
        return reject('file does not exist');
      }

      stat =  await fs.stat(inputFilePath);
      file =  await fs.open(inputFilePath, 'r');

      return resolve(countLines());
      
    } catch (error) {
      if (file !== null) {
        await fs.close(file);
      }

      return reject(error);
    }
  });
}

const fileNamesArr = ['textEn.txt', 'textRu.txt', 'textSmall.txt'];
const numberLines = 5;

readLastLines(__dirname + '/../files/' + fileNamesArr[0], numberLines)
  .then((lines) => console.log(lines))
  .catch((err) => console.log(err));
