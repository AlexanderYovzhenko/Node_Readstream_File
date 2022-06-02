const fs = require('fs');

// Примерное число байт в строке
const numberLetterLines = 1000;

async function readLinesFile(fileName, numberLines) {
  const start = Date.now();
  let sizeFile = 0;
  const bufferSize = numberLines * numberLetterLines;
  
  fs.stat(('files/' + fileName), (error, stats) => {
      if (error) {
        console.error(error);
      }
      else {
        sizeFile = stats.size;
      }
  });

  fs.open('files/' + fileName, 'r', function (err, fd) {
    if (err) {
      console.error(err);
    }
    
    const buf = new Buffer.allocUnsafe(sizeFile > bufferSize ? bufferSize : sizeFile); 

    fs.read(fd, buf, 0, buf.length, sizeFile > bufferSize ? sizeFile - bufferSize : 0, function (err, bytes) {  
      if (err) {
        console.error(err);
      }
      
      if (bytes > 0) {
        const resBufLines = buf.slice(0).toString().split('\r');
        const resLines = resBufLines.slice(-numberLines).join(' ');      
        console.log(resLines);
        console.log('\nКоличество линий ' + resBufLines.slice(-numberLines).length);
        const end = Date.now();
        console.log((end - start) / 1000, 's');
      }

      fs.close(fd, function (err) {
        if (err) {
          console.error(err);
        }
      });
    });
  });
}

const fileNameArr = ['textEn.txt', 'textRu.txt', 'textSmall.txt'];
const numberLines = 50;

readLinesFile(fileNameArr[0], numberLines);
