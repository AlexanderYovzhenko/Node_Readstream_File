const fs = require('mz/fs');

const readLastLines = async (inputFilePath, maxLineCount) => {

  const existsFile = await fs.exists(inputFilePath);
      
  if (!existsFile) {
    return 'file does not exist';
  };

  const NEW_LINE_CHARACTERS = ['\n'];
  const encoding = 'utf8';
  const stat = await fs.stat(inputFilePath);
  const file = await fs.open(inputFilePath, 'r');
  let chars = 0;
  let lineCount = 0;
  let lines = '';

  const readPreviousChar = async ( stat, file, currentCharacterCount) => {
    const bytesReadAndBuffer = await fs.read(file, Buffer.alloc(1), 0, 1, stat.size - 1 - currentCharacterCount);

    return String.fromCharCode(bytesReadAndBuffer[1][0]);
  };

  const countLines = async () => {
    for (let index = 0; index <= stat.size; index++) {
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
    }
  };

  return countLines();
}

const fileNamesArr = ['textEn.txt', 'textRu.txt', 'textSmall.txt'];
const numberLines = 5;

readLastLines(__dirname + '/../files/' + fileNamesArr[0], numberLines)
  .then((lines) => console.log(lines))
  .catch((err) => console.error(err));
