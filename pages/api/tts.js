// import textToSpeech from '@google-cloud/text-to-speech';
// import fs from 'fs';
// import path from 'path';

// const client = new textToSpeech.TextToSpeechClient({
//   keyFilename: path.join(process.cwd(), 'google-key.json'),
// });

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).send('Only POST requests allowed');
//   }

//   const { text, gender } = req.body;

//   const voiceMap = {
//     male: 'en-US-Standard-B',
//     female: 'en-US-Standard-C',
//   };

//   const request = {
//     input: { text },
//     voice: {
//       languageCode: 'en-US',
//       name: voiceMap[gender.toLowerCase()] || 'en-US-Standard-C',
//       ssmlGender: gender.toUpperCase(),
//     },
//     audioConfig: {
//       audioEncoding: 'MP3',
//     },
//   };

//   try {
//     const [response] = await client.synthesizeSpeech(request);
//     const fileName = `tts-${Date.now()}.mp3`;
//     const filePath = path.join(process.cwd(), 'public', fileName);
//     fs.writeFileSync(filePath, response.audioContent, 'binary');

//     res.status(200).json({ url: `/${fileName}` });
//   } catch (error) {
//     console.error('TTS generation failed:', error);
//     res.status(500).json({ error: 'TTS generation failed' });
//   }
// }
