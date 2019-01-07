// Set Constants
const AWS = require('aws-sdk');
const BoxSDK = require('box-node-sdk');
const fs = require('fs');
const boxConfig = JSON.parse(fs.readFileSync('CLI_config.json'));
const moment = require('moment');

// Create SDKs
let sdk = new BoxSDK({
  clientID: boxConfig.boxAppSettings.clientID,
  clientSecret: boxConfig.boxAppSettings.clientSecret,
  appAuth: {
		keyID: boxConfig.boxAppSettings.appAuth.publicKeyID,
		privateKey: boxConfig.boxAppSettings.appAuth.privateKey,
		passphrase: boxConfig.boxAppSettings.appAuth.passphrase
	}
});
let serviceAccountClient = sdk.getAppAuthClient('enterprise', boxConfig.enterpriseID);

let Polly = new AWS.Polly({
  region: 'us-east-1'
});

let s3 = new AWS.S3();

// Define inputs
let fileId = '299477988105';
let folderId = '63056667798';

// Define function
let doThing = async (fileId) => {
  // Get the extracted text from the fileId
  // extractedText is a stream
  let extractedTextStream = await serviceAccountClient.files.getRepresentationContent(fileId, '[extracted_text]');

  // Wrap the stream in a promise, so we can await it later.
  let extractedTextPromise = new Promise((resolve, reject) => {
    extractedTextStream.on('data', (content) => {
      resolve(content);
    });
  });

  // When the stream is ready, save it in text
  let extractedTextObject = await extractedTextPromise;
  let extractedTextString = extractedTextObject.toString();

  // Set up polly
  let pollyParams = {
    OutputFormat: "mp3",
    SampleRate: "22050",
    Text: extractedTextString,
    TextType: "text",
    VoiceId: "Joanna"
   };

   // Wrap the polly synthesizeSpeech function in a promise
   let pollyPromise = new Promise((resolve, reject) => {
     Polly.synthesizeSpeech(pollyParams, (err, data) => {
        if (err) {
         reject(err);
        } else if (data) {
         resolve(data);
        }
     })
   });

   // Then send the data to Polly
  let pollyReturnData = await pollyPromise;
  let pollyReturnAudio = await pollyReturnData.AudioStream;

  // Append date to the end of the filename and send the file to box
  let date = moment().format('MMM DD h:mm:SS a');
  await serviceAccountClient.files.uploadFile(folderId, `My File_${date}.mp3`, pollyReturnAudio);
}

// Call function
doThing(fileId, folderId);
