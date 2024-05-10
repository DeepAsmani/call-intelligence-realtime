require('dotenv').config()
const express = require('express')
const axios = require('axios');
const app = express()
const multer = require('multer');
// const azure = require('azure-storage');
// const speech = require('@azure/cognitiveservices-speech');

const  router = express.Router();
const { BlobServiceClient } = require('@azure/storage-blob');

app.use(express.urlencoded({ extended: true }));

// get router
const openaiRouter = require('./routes/openai-gpt')
const azurelanguageRouter = require('./routes/azureai-language')   

var connectionString ='';

// get config
const config = require('./config.json')
const port = config[0].web_port
const speechKey = config[0].speech_subscription_key;
const speechRegion = config[0].speech_region;
const endpoint_id = config[0].speech_custom_endpoint_id_optional;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/openai', openaiRouter);
app.use('/azure/language', azurelanguageRouter);

app.get('/api/sayhello', (req, res) => {
    const currentDateTime = new Date();    
    res.send('Hello World from the backend root! ' + currentDateTime)
});

app.get('/api/get-speech-token', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

    if (speechKey === 'paste-your-speech-key-here' || speechRegion === 'paste-your-speech-region-here') {
        res.status(400).send('You forgot to add your speech key or region to the .env file.');
    } else {
        const headers = { 
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
            console.log(`Speechkey loaded for speech region ${speechRegion}. Getting token`)
            const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
            res.send({ token: tokenResponse.data, region: speechRegion, endpoint_id: endpoint_id });
        } catch (err) {
            res.status(401).send('There was an error authorizing your speech key.');
        }
    }
});

const upload = multer({
    storage: multer.memoryStorage(),
    // limits: {
    //   fileSize: 4 * 1024 * 1024 // 4 MB
    // }
  }).single("audio");
  
  app.post("/upload", async (req, res) => {
    // Call the `upload` middleware to handle the file upload
     upload(req, res, async function (err) {
      const json = `{
        "source": "https://intechspeech.blob.core.windows.net/audio-input/20231018_140809-988_9081430400-9979767262.wav?sv=2021-10-04&st=2024-03-28T09%3A59%3A59Z&se=2024-03-29T10%3A09%3A59Z&sr=b&sp=r&sig=J%2F75E%2BvfzK7gwaB%2BTAGEl5%2B8p8x6vAD%2B0eDjQYCgEgI%3D",
        "timeStamp": "2024-03-28T10:10:16Z",
        "durationInTicks": 871700000,
        "duration": "PT1M27.17S",
        "combinedRecognizedPhrases": [
          {
            "channel": 0,
            "lexical": "",
            "itn": "",
            "maskedITN": "",
            "display": "हैलो। हाँ सर गुड आफ्टरनून मेरी बात ************ *** से। हो रही। है। और ******** से बात करे आपने लेमनेट का कैटलॉग देखना था उसके लिए एक एन्क्वारी की थी तो सर आई होप आपको उसकी पी डी ऐफ़ फॉर्मॅट मिल गई हुई ********* नंबर पर। **, मैं मैं पुराने लकड़ी का ******* हूँ इसके लिए डाला था। और मसले का ******* है आप? ऑल टिकेट और सब लोग सब जगह ************* में जाता है। अच्छा अच्छा तो सर आपका फर्निचर काम कोई चालू हो या कोई प्लानिंग हो? ये दीपावली के बाद है। अच्छा कहाँ पे आपके घर पे है सर नहीं। मेरा गोडाउन है बरोड़ा बरोड़ा से बोल रहा। हूँ। अच्छा अच्छा तो सर बरोड़ा में हमारा शोरूम अवेलेबल है। एड्रेस आपको सेंड कर रही। हूँ। ठीक है, और। जो हमारे एरिया ****** है उनका आपका कॅाटाक्ट नंबर सेंड करते है। वो आपको दीपावली के बाद कॅाटाक्ट करेंगे। जब आपका काम शुरू होता है वो आपको सेलेक्शन और परचेस में सहायता कर देंगे। सर। और ऑल आपको लगता है, ****? या सर नेक्*** *******? वो सब नहीं लगता है सर हमारा लकड़े का नहीं है हमारा सनम एक है और वुडेन स्टोरी नहीं है सर। अच्छा कोई बात नहीं नंबर सेव कर लेता हूँ। ठीक है, **, ओके ओके, ठीक है। थैंक यू सर, हॅव ए नाइस।"
          }
        ],
        "recognizedPhrases": [
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 1,
            "offset": "PT1.79S",
            "duration": "PT0.92S",
            "offsetInTicks": 17900000,
            "durationInTicks": 9200000,
            "nBest": [
              {
                "confidence": 0.74694973,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "हैलो।",
                "sentiment": {
                  "negative": 0.0,
                  "neutral": 0.99,
                  "positive": 0.01
                },
                "words": [
                  {
                    "word": "हैलो",
                    "offset": "PT1.79S",
                    "duration": "PT0.92S",
                    "offsetInTicks": 17900000.0,
                    "durationInTicks": 9200000.0,
                    "confidence": 0.6945034
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT3.43S",
            "duration": "PT3.2S",
            "offsetInTicks": 34300000,
            "durationInTicks": 32000000,
            "nBest": [
              {
                "confidence": 0.74694973,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "हाँ सर गुड आफ्टरनून मेरी बात ************ *** से।",
                "sentiment": {
                  "negative": 0.0,
                  "neutral": 0.03,
                  "positive": 0.97
                },
                "words": [
                  {
                    "word": "हाँ",
                    "offset": "PT3.43S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 34300000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.28943774
                  },
                  {
                    "word": "सर",
                    "offset": "PT3.63S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 36300000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.81904674
                  },
                  {
                    "word": "गुड",
                    "offset": "PT3.95S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 39500000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.9667045
                  },
                  {
                    "word": "आफ्टरनून",
                    "offset": "PT4.07S",
                    "duration": "PT0.48S",
                    "offsetInTicks": 40700000.0,
                    "durationInTicks": 4800000.0,
                    "confidence": 0.7266187
                  },
                  {
                    "word": "मेरी",
                    "offset": "PT4.55S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 45500000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.9163712
                  },
                  {
                    "word": "बात",
                    "offset": "PT4.75S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 47500000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.9604312
                  },
                  {
                    "word": "वाघेला",
                    "offset": "PT5.15S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 51500000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.5814014
                  },
                  {
                    "word": "मुकेश",
                    "offset": "PT5.39S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 53900000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.95531744
                  },
                  {
                    "word": "भाई",
                    "offset": "PT5.91S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 59100000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.415798
                  },
                  {
                    "word": "से",
                    "offset": "PT6.07S",
                    "duration": "PT0.56S",
                    "offsetInTicks": 60700000.0,
                    "durationInTicks": 5600000.0,
                    "confidence": 0.8748851
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 1,
            "offset": "PT7.43S",
            "duration": "PT0.56S",
            "offsetInTicks": 74300000,
            "durationInTicks": 5600000,
            "nBest": [
              {
                "confidence": 0.74694973,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "हो रही।",
                "sentiment": {
                  "negative": 0.01,
                  "neutral": 0.92,
                  "positive": 0.07
                },
                "words": [
                  {
                    "word": "हो",
                    "offset": "PT7.43S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 74300000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.96051335
                  },
                  {
                    "word": "रही",
                    "offset": "PT7.83S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 78300000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.876454
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT8.11S",
            "duration": "PT0.08S",
            "offsetInTicks": 81100000,
            "durationInTicks": 800000,
            "nBest": [
              {
                "confidence": 0.74694973,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "है।",
                "sentiment": {
                  "negative": 0.0,
                  "neutral": 0.99,
                  "positive": 0.0
                },
                "words": [
                  {
                    "word": "है",
                    "offset": "PT8.11S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 81100000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.41981342
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT8.64S",
            "duration": "PT10.16S",
            "offsetInTicks": 86400000,
            "durationInTicks": 101600000,
            "nBest": [
              {
                "confidence": 0.74822253,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "और ******** से बात करे आपने लेमनेट का कैटलॉग देखना था उसके लिए एक एन्क्वारी की थी तो सर आई होप आपको उसकी पी डी ऐफ़ फॉर्मॅट मिल गई हुई ********* नंबर पर।",
                "sentiment": {
                  "negative": 0.02,
                  "neutral": 0.95,
                  "positive": 0.03
                },
                "words": [
                  {
                    "word": "और",
                    "offset": "PT8.64S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 86400000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.5151234
                  },
                  {
                    "word": "रॉयल",
                    "offset": "PT8.72S",
                    "duration": "PT0.52S",
                    "offsetInTicks": 87200000.0,
                    "durationInTicks": 5200000.0,
                    "confidence": 0.94421595
                  },
                  {
                    "word": "टॅच",
                    "offset": "PT9.28S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 92800000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.27497038
                  },
                  {
                    "word": "से",
                    "offset": "PT9.6S",
                    "duration": "PT0.56S",
                    "offsetInTicks": 96000000.0,
                    "durationInTicks": 5600000.0,
                    "confidence": 0.92257196
                  },
                  {
                    "word": "बात",
                    "offset": "PT10.16S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 101600000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.96594197
                  },
                  {
                    "word": "करे",
                    "offset": "PT10.44S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 104400000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.36653063
                  },
                  {
                    "word": "आपने",
                    "offset": "PT10.8S",
                    "duration": "PT0.76S",
                    "offsetInTicks": 108000000.0,
                    "durationInTicks": 7600000.0,
                    "confidence": 0.803919
                  },
                  {
                    "word": "लेमनेट",
                    "offset": "PT11.56S",
                    "duration": "PT0.48S",
                    "offsetInTicks": 115600000.0,
                    "durationInTicks": 4800000.0,
                    "confidence": 0.20962854
                  },
                  {
                    "word": "का",
                    "offset": "PT12.04S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 120400000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.9581351
                  },
                  {
                    "word": "कैटलॉग",
                    "offset": "PT12.32S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 123200000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.662955
                  },
                  {
                    "word": "देखना",
                    "offset": "PT12.64S",
                    "duration": "PT0.44S",
                    "offsetInTicks": 126400000.0,
                    "durationInTicks": 4400000.0,
                    "confidence": 0.7058914
                  },
                  {
                    "word": "था",
                    "offset": "PT13.08S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 130800000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.945782
                  },
                  {
                    "word": "उसके",
                    "offset": "PT13.24S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 132400000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.9380078
                  },
                  {
                    "word": "लिए",
                    "offset": "PT13.52S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 135200000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.90913826
                  },
                  {
                    "word": "एक",
                    "offset": "PT13.64S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 136400000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.51611775
                  },
                  {
                    "word": "एन्क्वारी",
                    "offset": "PT13.72S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 137200000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.6795389
                  },
                  {
                    "word": "की",
                    "offset": "PT14.08S",
                    "duration": "PT0.6S",
                    "offsetInTicks": 140800000.0,
                    "durationInTicks": 6000000.0,
                    "confidence": 0.73955965
                  },
                  {
                    "word": "थी",
                    "offset": "PT14.68S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 146800000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.95350295
                  },
                  {
                    "word": "तो",
                    "offset": "PT15.12S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 151200000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.91732943
                  },
                  {
                    "word": "सर",
                    "offset": "PT15.44S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 154400000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.91323763
                  },
                  {
                    "word": "आई",
                    "offset": "PT15.6S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 156000000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.9356537
                  },
                  {
                    "word": "होप",
                    "offset": "PT15.8S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 158000000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.95036054
                  },
                  {
                    "word": "आपको",
                    "offset": "PT16S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 160000000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.9342246
                  },
                  {
                    "word": "उसकी",
                    "offset": "PT16.4S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 164000000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.7146022
                  },
                  {
                    "word": "पी",
                    "offset": "PT16.64S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 166400000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.9601363
                  },
                  {
                    "word": "डी",
                    "offset": "PT16.8S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 168000000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.6074331
                  },
                  {
                    "word": "ऐफ़",
                    "offset": "PT17S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 170000000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.62653315
                  },
                  {
                    "word": "फॉर्मॅट",
                    "offset": "PT17.08S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 170800000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.6945126
                  },
                  {
                    "word": "मिल",
                    "offset": "PT17.44S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 174400000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.93611383
                  },
                  {
                    "word": "गई",
                    "offset": "PT17.76S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 177600000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.5219327
                  },
                  {
                    "word": "हुई",
                    "offset": "PT17.88S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 178800000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.28017515
                  },
                  {
                    "word": "व्हाट्सएप",
                    "offset": "PT18S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 180000000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.8932923
                  },
                  {
                    "word": "नंबर",
                    "offset": "PT18.32S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 183200000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.96540594
                  },
                  {
                    "word": "पर",
                    "offset": "PT18.6S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 186000000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.57709193
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 1,
            "offset": "PT20.57S",
            "duration": "PT4.12S",
            "offsetInTicks": 205700000,
            "durationInTicks": 41200000,
            "nBest": [
              {
                "confidence": 0.6896716,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "**, मैं मैं पुराने लकड़ी का ******* हूँ इसके लिए डाला था।",
                "sentiment": {
                  "negative": 0.0,
                  "neutral": 0.99,
                  "positive": 0.0
                },
                "words": [
                  {
                    "word": "सर",
                    "offset": "PT20.57S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 205700000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.31962138
                  },
                  {
                    "word": "मैं",
                    "offset": "PT20.73S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 207300000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.7810854
                  },
                  {
                    "word": "मैं",
                    "offset": "PT20.93S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 209300000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.5660861
                  },
                  {
                    "word": "पुराने",
                    "offset": "PT21.05S",
                    "duration": "PT0.8S",
                    "offsetInTicks": 210500000.0,
                    "durationInTicks": 8000000.0,
                    "confidence": 0.2923973
                  },
                  {
                    "word": "लकड़ी",
                    "offset": "PT22.25S",
                    "duration": "PT0.44S",
                    "offsetInTicks": 222500000.0,
                    "durationInTicks": 4400000.0,
                    "confidence": 0.7250421
                  },
                  {
                    "word": "का",
                    "offset": "PT22.69S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 226900000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.9404347
                  },
                  {
                    "word": "सप्लायर",
                    "offset": "PT22.85S",
                    "duration": "PT0.8S",
                    "offsetInTicks": 228500000.0,
                    "durationInTicks": 8000000.0,
                    "confidence": 0.7971453
                  },
                  {
                    "word": "हूँ",
                    "offset": "PT23.65S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 236500000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.57078636
                  },
                  {
                    "word": "इसके",
                    "offset": "PT23.73S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 237300000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.6778292
                  },
                  {
                    "word": "लिए",
                    "offset": "PT23.93S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 239300000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.93320763
                  },
                  {
                    "word": "डाला",
                    "offset": "PT24.21S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 242100000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.76474774
                  },
                  {
                    "word": "था",
                    "offset": "PT24.61S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 246100000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.90767527
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT26.44S",
            "duration": "PT1.6S",
            "offsetInTicks": 264400000,
            "durationInTicks": 16000000,
            "nBest": [
              {
                "confidence": 0.60978866,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "और मसले का ******* है आप?",
                "sentiment": {
                  "negative": 0.83,
                  "neutral": 0.17,
                  "positive": 0.0
                },
                "words": [
                  {
                    "word": "और",
                    "offset": "PT26.44S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 264400000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.23762004
                  },
                  {
                    "word": "मसले",
                    "offset": "PT26.68S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 266800000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.1897352
                  },
                  {
                    "word": "का",
                    "offset": "PT26.92S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 269200000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.58420205
                  },
                  {
                    "word": "सप्लायर",
                    "offset": "PT27.04S",
                    "duration": "PT0.48S",
                    "offsetInTicks": 270400000.0,
                    "durationInTicks": 4800000.0,
                    "confidence": 0.7198693
                  },
                  {
                    "word": "है",
                    "offset": "PT27.52S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 275200000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.38197744
                  },
                  {
                    "word": "आप",
                    "offset": "PT27.6S",
                    "duration": "PT0.44S",
                    "offsetInTicks": 276000000.0,
                    "durationInTicks": 4400000.0,
                    "confidence": 0.4884291
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 1,
            "offset": "PT28.68S",
            "duration": "PT3.36S",
            "offsetInTicks": 286800000,
            "durationInTicks": 33600000,
            "nBest": [
              {
                "confidence": 0.60978866,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "ऑल टिकेट और सब लोग सब जगह ************* में जाता है।",
                "sentiment": {
                  "negative": 0.03,
                  "neutral": 0.87,
                  "positive": 0.1
                },
                "words": [
                  {
                    "word": "ऑल",
                    "offset": "PT28.68S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 286800000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.32938793
                  },
                  {
                    "word": "टिकेट",
                    "offset": "PT28.8S",
                    "duration": "PT0.44S",
                    "offsetInTicks": 288000000.0,
                    "durationInTicks": 4400000.0,
                    "confidence": 0.2354591
                  },
                  {
                    "word": "और",
                    "offset": "PT29.24S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 292400000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.26211095
                  },
                  {
                    "word": "सब",
                    "offset": "PT29.32S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 293200000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.84467715
                  },
                  {
                    "word": "लोग",
                    "offset": "PT29.56S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 295600000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.38954538
                  },
                  {
                    "word": "सब",
                    "offset": "PT29.84S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 298400000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.9462063
                  },
                  {
                    "word": "जगह",
                    "offset": "PT30.2S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 302000000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.9413857
                  },
                  {
                    "word": "सप्लायर",
                    "offset": "PT30.56S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 305600000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.8131515
                  },
                  {
                    "word": "कंपनी",
                    "offset": "PT30.88S",
                    "duration": "PT0.44S",
                    "offsetInTicks": 308800000.0,
                    "durationInTicks": 4400000.0,
                    "confidence": 0.95931774
                  },
                  {
                    "word": "में",
                    "offset": "PT31.32S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 313200000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.8997147
                  },
                  {
                    "word": "जाता",
                    "offset": "PT31.44S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 314400000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.9531468
                  },
                  {
                    "word": "है",
                    "offset": "PT31.8S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 318000000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.8002611
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT33.23S",
            "duration": "PT3.96S",
            "offsetInTicks": 332300000,
            "durationInTicks": 39600000,
            "nBest": [
              {
                "confidence": 0.76772296,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "अच्छा अच्छा तो सर आपका फर्निचर काम कोई चालू हो या कोई प्लानिंग हो?",
                "sentiment": {
                  "negative": 0.0,
                  "neutral": 0.0,
                  "positive": 1.0
                },
                "words": [
                  {
                    "word": "अच्छा",
                    "offset": "PT33.23S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 332300000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.70353985
                  },
                  {
                    "word": "अच्छा",
                    "offset": "PT33.51S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 335100000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.8662348
                  },
                  {
                    "word": "तो",
                    "offset": "PT33.87S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 338700000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.9352448
                  },
                  {
                    "word": "सर",
                    "offset": "PT33.99S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 339900000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.6629569
                  },
                  {
                    "word": "आपका",
                    "offset": "PT34.15S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 341500000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.8791745
                  },
                  {
                    "word": "फर्निचर",
                    "offset": "PT34.55S",
                    "duration": "PT0.52S",
                    "offsetInTicks": 345500000.0,
                    "durationInTicks": 5200000.0,
                    "confidence": 0.71021044
                  },
                  {
                    "word": "काम",
                    "offset": "PT35.07S",
                    "duration": "PT0.56S",
                    "offsetInTicks": 350700000.0,
                    "durationInTicks": 5600000.0,
                    "confidence": 0.75715375
                  },
                  {
                    "word": "कोई",
                    "offset": "PT35.63S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 356300000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.29720137
                  },
                  {
                    "word": "चालू",
                    "offset": "PT35.75S",
                    "duration": "PT0.44S",
                    "offsetInTicks": 357500000.0,
                    "durationInTicks": 4400000.0,
                    "confidence": 0.43624032
                  },
                  {
                    "word": "हो",
                    "offset": "PT36.19S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 361900000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.7843671
                  },
                  {
                    "word": "या",
                    "offset": "PT36.27S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 362700000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.9462532
                  },
                  {
                    "word": "कोई",
                    "offset": "PT36.43S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 364300000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.8441477
                  },
                  {
                    "word": "प्लानिंग",
                    "offset": "PT36.59S",
                    "duration": "PT0.44S",
                    "offsetInTicks": 365900000.0,
                    "durationInTicks": 4400000.0,
                    "confidence": 0.96312135
                  },
                  {
                    "word": "हो",
                    "offset": "PT37.03S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 370300000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.96227616
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 1,
            "offset": "PT39.8S",
            "duration": "PT1.44S",
            "offsetInTicks": 398000000,
            "durationInTicks": 14400000,
            "nBest": [
              {
                "confidence": 0.6684855,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "ये दीपावली के बाद है।",
                "sentiment": {
                  "negative": 0.01,
                  "neutral": 0.93,
                  "positive": 0.06
                },
                "words": [
                  {
                    "word": "ये",
                    "offset": "PT39.8S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 398000000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.24344036
                  },
                  {
                    "word": "दीपावली",
                    "offset": "PT39.96S",
                    "duration": "PT0.56S",
                    "offsetInTicks": 399600000.0,
                    "durationInTicks": 5600000.0,
                    "confidence": 0.6684571
                  },
                  {
                    "word": "के",
                    "offset": "PT40.52S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 405200000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.94718987
                  },
                  {
                    "word": "बाद",
                    "offset": "PT40.6S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 406000000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.6120155
                  },
                  {
                    "word": "है",
                    "offset": "PT40.92S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 409200000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.8713248
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT43.05S",
            "duration": "PT1.68S",
            "offsetInTicks": 430500000,
            "durationInTicks": 16800000,
            "nBest": [
              {
                "confidence": 0.7114828,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "अच्छा कहाँ पे आपके घर पे है सर नहीं।",
                "sentiment": {
                  "negative": 0.01,
                  "neutral": 0.04,
                  "positive": 0.95
                },
                "words": [
                  {
                    "word": "अच्छा",
                    "offset": "PT43.05S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 430500000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.31865263
                  },
                  {
                    "word": "कहाँ",
                    "offset": "PT43.25S",
                    "duration": "PT0.48S",
                    "offsetInTicks": 432500000.0,
                    "durationInTicks": 4800000.0,
                    "confidence": 0.46114054
                  },
                  {
                    "word": "पे",
                    "offset": "PT43.73S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 437300000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.7522385
                  },
                  {
                    "word": "आपके",
                    "offset": "PT43.85S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 438500000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.92623925
                  },
                  {
                    "word": "घर",
                    "offset": "PT44.01S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 440100000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.9633867
                  },
                  {
                    "word": "पे",
                    "offset": "PT44.17S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 441700000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.56441456
                  },
                  {
                    "word": "है",
                    "offset": "PT44.29S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 442900000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.43395084
                  },
                  {
                    "word": "सर",
                    "offset": "PT44.37S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 443700000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.9538006
                  },
                  {
                    "word": "नहीं",
                    "offset": "PT44.57S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 445700000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.95738417
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 1,
            "offset": "PT45.17S",
            "duration": "PT4.08S",
            "offsetInTicks": 451700000,
            "durationInTicks": 40800000,
            "nBest": [
              {
                "confidence": 0.7114828,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "मेरा गोडाउन है बरोड़ा बरोड़ा से बोल रहा।",
                "sentiment": {
                  "negative": 0.02,
                  "neutral": 0.98,
                  "positive": 0.01
                },
                "words": [
                  {
                    "word": "मेरा",
                    "offset": "PT45.17S",
                    "duration": "PT0.6S",
                    "offsetInTicks": 451700000.0,
                    "durationInTicks": 6000000.0,
                    "confidence": 0.60117275
                  },
                  {
                    "word": "गोडाउन",
                    "offset": "PT45.81S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 458100000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.6770163
                  },
                  {
                    "word": "है",
                    "offset": "PT46.21S",
                    "duration": "PT0.48S",
                    "offsetInTicks": 462100000.0,
                    "durationInTicks": 4800000.0,
                    "confidence": 0.86813337
                  },
                  {
                    "word": "बरोड़ा",
                    "offset": "PT47.09S",
                    "duration": "PT0.72S",
                    "offsetInTicks": 470900000.0,
                    "durationInTicks": 7200000.0,
                    "confidence": 0.2872195
                  },
                  {
                    "word": "बरोड़ा",
                    "offset": "PT47.93S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 479300000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.5946944
                  },
                  {
                    "word": "से",
                    "offset": "PT48.29S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 482900000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.9182503
                  },
                  {
                    "word": "बोल",
                    "offset": "PT48.53S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 485300000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.9518357
                  },
                  {
                    "word": "रहा",
                    "offset": "PT48.65S",
                    "duration": "PT0.6S",
                    "offsetInTicks": 486500000.0,
                    "durationInTicks": 6000000.0,
                    "confidence": 0.94344956
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT49.49S",
            "duration": "PT0.08S",
            "offsetInTicks": 494900000,
            "durationInTicks": 800000,
            "nBest": [
              {
                "confidence": 0.7114828,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "हूँ।",
                "sentiment": {
                  "negative": 0.01,
                  "neutral": 0.96,
                  "positive": 0.03
                },
                "words": [
                  {
                    "word": "हूँ",
                    "offset": "PT49.49S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 494900000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.6337112
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT51S",
            "duration": "PT4.28S",
            "offsetInTicks": 510000000,
            "durationInTicks": 42800000,
            "nBest": [
              {
                "confidence": 0.70362836,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "अच्छा अच्छा तो सर बरोड़ा में हमारा शोरूम अवेलेबल है। एड्रेस आपको सेंड कर रही।",
                "sentiment": {
                  "negative": 0.0,
                  "neutral": 0.0,
                  "positive": 1.0
                },
                "words": [
                  {
                    "word": "अच्छा",
                    "offset": "PT51S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 510000000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.7369309
                  },
                  {
                    "word": "अच्छा",
                    "offset": "PT51.2S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 512000000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.80805326
                  },
                  {
                    "word": "तो",
                    "offset": "PT51.44S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 514400000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.6107441
                  },
                  {
                    "word": "सर",
                    "offset": "PT51.6S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 516000000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.6663702
                  },
                  {
                    "word": "बरोड़ा",
                    "offset": "PT52.04S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 520400000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.52721715
                  },
                  {
                    "word": "में",
                    "offset": "PT52.4S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 524000000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.9380707
                  },
                  {
                    "word": "हमारा",
                    "offset": "PT52.48S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 524800000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.8960992
                  },
                  {
                    "word": "शोरूम",
                    "offset": "PT52.88S",
                    "duration": "PT0.44S",
                    "offsetInTicks": 528800000.0,
                    "durationInTicks": 4400000.0,
                    "confidence": 0.93261933
                  },
                  {
                    "word": "अवेलेबल",
                    "offset": "PT53.32S",
                    "duration": "PT0.64S",
                    "offsetInTicks": 533200000.0,
                    "durationInTicks": 6400000.0,
                    "confidence": 0.96389294
                  },
                  {
                    "word": "है",
                    "offset": "PT53.96S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 539600000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.91079193
                  },
                  {
                    "word": "अड्रेस",
                    "offset": "PT54.04S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 540400000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.84595984
                  },
                  {
                    "word": "आपको",
                    "offset": "PT54.28S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 542800000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.94547695
                  },
                  {
                    "word": "सेंड",
                    "offset": "PT54.6S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 546000000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.9450152
                  },
                  {
                    "word": "कर",
                    "offset": "PT54.84S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 548400000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.12900963
                  },
                  {
                    "word": "रही",
                    "offset": "PT54.96S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 549600000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.15213259
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 1,
            "offset": "PT55.88S",
            "duration": "PT0.24S",
            "offsetInTicks": 558800000,
            "durationInTicks": 2400000,
            "nBest": [
              {
                "confidence": 0.70362836,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "हूँ।",
                "sentiment": {
                  "negative": 0.01,
                  "neutral": 0.96,
                  "positive": 0.03
                },
                "words": [
                  {
                    "word": "हूँ",
                    "offset": "PT55.88S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 558800000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.17183241
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT56.88S",
            "duration": "PT0.36S",
            "offsetInTicks": 568800000,
            "durationInTicks": 3600000,
            "nBest": [
              {
                "confidence": 0.70362836,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "ठीक है, और।",
                "sentiment": {
                  "negative": 0.04,
                  "neutral": 0.59,
                  "positive": 0.38
                },
                "words": [
                  {
                    "word": "ठीक",
                    "offset": "PT56.88S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 568800000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.95399165
                  },
                  {
                    "word": "है",
                    "offset": "PT57.08S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 570800000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.7884114
                  },
                  {
                    "word": "और",
                    "offset": "PT57.16S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 571600000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.44631913
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT57.32S",
            "duration": "PT9.44S",
            "offsetInTicks": 573200000,
            "durationInTicks": 94400000,
            "nBest": [
              {
                "confidence": 0.80248326,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "जो हमारे एरिया ****** है उनका आपका कॅाटाक्ट नंबर सेंड करते है। वो आपको दीपावली के बाद कॅाटाक्ट करेंगे। जब आपका काम शुरू होता है वो आपको सेलेक्शन और परचेस में सहायता कर देंगे। सर।",
                "sentiment": {
                  "negative": 0.0,
                  "neutral": 0.01,
                  "positive": 0.99
                },
                "words": [
                  {
                    "word": "जो",
                    "offset": "PT57.32S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 573200000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.9430382
                  },
                  {
                    "word": "हमारे",
                    "offset": "PT57.52S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 575200000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.9312178
                  },
                  {
                    "word": "एरिया",
                    "offset": "PT57.84S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 578400000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.96394014
                  },
                  {
                    "word": "मैनेजर",
                    "offset": "PT58.2S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 582000000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.95861095
                  },
                  {
                    "word": "है",
                    "offset": "PT58.56S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 585600000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.91091174
                  },
                  {
                    "word": "उनका",
                    "offset": "PT58.68S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 586800000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.5263184
                  },
                  {
                    "word": "आपका",
                    "offset": "PT58.84S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 588400000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.27120417
                  },
                  {
                    "word": "कॅाटाक्ट",
                    "offset": "PT59.04S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 590400000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.9615399
                  },
                  {
                    "word": "नंबर",
                    "offset": "PT59.44S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 594400000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.9594417
                  },
                  {
                    "word": "सेंड",
                    "offset": "PT59.84S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 598400000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.54640055
                  },
                  {
                    "word": "करते",
                    "offset": "PT1M0.04S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 600400000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.8524643
                  },
                  {
                    "word": "है",
                    "offset": "PT1M0.36S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 603600000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.5979391
                  },
                  {
                    "word": "वो",
                    "offset": "PT1M0.44S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 604400000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.59801066
                  },
                  {
                    "word": "आपको",
                    "offset": "PT1M0.56S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 605600000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.9472522
                  },
                  {
                    "word": "दीपावली",
                    "offset": "PT1M0.84S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 608400000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.8513238
                  },
                  {
                    "word": "के",
                    "offset": "PT1M1.24S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 612400000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.9624435
                  },
                  {
                    "word": "बाद",
                    "offset": "PT1M1.32S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 613200000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.96474075
                  },
                  {
                    "word": "कॅाटाक्ट",
                    "offset": "PT1M1.52S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 615200000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.9651793
                  },
                  {
                    "word": "करेंगे",
                    "offset": "PT1M1.88S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 618800000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.8495813
                  },
                  {
                    "word": "जब",
                    "offset": "PT1M2.28S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 622800000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.9457655
                  },
                  {
                    "word": "आपका",
                    "offset": "PT1M2.4S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 624000000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.9497358
                  },
                  {
                    "word": "काम",
                    "offset": "PT1M2.68S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 626800000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.9513793
                  },
                  {
                    "word": "शुरू",
                    "offset": "PT1M2.92S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 629200000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.8810083
                  },
                  {
                    "word": "होता",
                    "offset": "PT1M3.2S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 632000000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.9533309
                  },
                  {
                    "word": "है",
                    "offset": "PT1M3.44S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 634400000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.847328
                  },
                  {
                    "word": "वो",
                    "offset": "PT1M4.24S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 642400000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.40822983
                  },
                  {
                    "word": "आपको",
                    "offset": "PT1M4.32S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 643200000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.91367954
                  },
                  {
                    "word": "सेलेक्शन",
                    "offset": "PT1M4.56S",
                    "duration": "PT0.56S",
                    "offsetInTicks": 645600000.0,
                    "durationInTicks": 5600000.0,
                    "confidence": 0.45861873
                  },
                  {
                    "word": "और",
                    "offset": "PT1M5.12S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 651200000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.38810283
                  },
                  {
                    "word": "परचेस",
                    "offset": "PT1M5.2S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 652000000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.8093438
                  },
                  {
                    "word": "में",
                    "offset": "PT1M5.56S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 655600000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.9193498
                  },
                  {
                    "word": "सहायता",
                    "offset": "PT1M5.72S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 657200000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.94168943
                  },
                  {
                    "word": "कर",
                    "offset": "PT1M6.08S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 660800000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.8179064
                  },
                  {
                    "word": "देंगे",
                    "offset": "PT1M6.24S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 662400000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.40580422
                  },
                  {
                    "word": "सर",
                    "offset": "PT1M6.52S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 665200000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.93408424
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 1,
            "offset": "PT1M8.83S",
            "duration": "PT2.44S",
            "offsetInTicks": 688300000,
            "durationInTicks": 24400000,
            "nBest": [
              {
                "confidence": 0.7451322,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "और ऑल आपको लगता है, ****?",
                "sentiment": {
                  "negative": 0.0,
                  "neutral": 0.99,
                  "positive": 0.0
                },
                "words": [
                  {
                    "word": "और",
                    "offset": "PT1M8.83S",
                    "duration": "PT0.8S",
                    "offsetInTicks": 688300000.0,
                    "durationInTicks": 8000000.0,
                    "confidence": 0.8541877
                  },
                  {
                    "word": "ऑल",
                    "offset": "PT1M9.63S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 696300000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.45176718
                  },
                  {
                    "word": "आपको",
                    "offset": "PT1M9.71S",
                    "duration": "PT0.8S",
                    "offsetInTicks": 697100000.0,
                    "durationInTicks": 8000000.0,
                    "confidence": 0.75174105
                  },
                  {
                    "word": "लगता",
                    "offset": "PT1M10.51S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 705100000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.96325654
                  },
                  {
                    "word": "है",
                    "offset": "PT1M10.83S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 708300000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.50469637
                  },
                  {
                    "word": "मैडम",
                    "offset": "PT1M10.99S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 709900000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.9451445
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT1M12.39S",
            "duration": "PT5.84S",
            "offsetInTicks": 723900000,
            "durationInTicks": 58400000,
            "nBest": [
              {
                "confidence": 0.68723524,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "या सर नेक्*** *******? वो सब नहीं लगता है सर हमारा लकड़े का नहीं है हमारा सनम एक है और वुडेन स्टोरी नहीं है सर।",
                "sentiment": {
                  "negative": 0.15,
                  "neutral": 0.85,
                  "positive": 0.0
                },
                "words": [
                  {
                    "word": "या",
                    "offset": "PT1M12.39S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 723900000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.29879698
                  },
                  {
                    "word": "सर",
                    "offset": "PT1M12.51S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 725100000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.95003396
                  },
                  {
                    "word": "नेक्स्ट",
                    "offset": "PT1M12.71S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 727100000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.895728
                  },
                  {
                    "word": "वीक",
                    "offset": "PT1M13.11S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 731100000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.2573511
                  },
                  {
                    "word": "वुड",
                    "offset": "PT1M13.35S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 733500000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.35189947
                  },
                  {
                    "word": "वो",
                    "offset": "PT1M13.75S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 737500000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.8144965
                  },
                  {
                    "word": "सब",
                    "offset": "PT1M13.83S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 738300000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.9545278
                  },
                  {
                    "word": "नहीं",
                    "offset": "PT1M14.11S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 741100000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.9470552
                  },
                  {
                    "word": "लगता",
                    "offset": "PT1M14.27S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 742700000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.94620436
                  },
                  {
                    "word": "है",
                    "offset": "PT1M14.51S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 745100000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.5115861
                  },
                  {
                    "word": "सर",
                    "offset": "PT1M14.59S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 745900000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.91674155
                  },
                  {
                    "word": "हमारा",
                    "offset": "PT1M14.79S",
                    "duration": "PT0.44S",
                    "offsetInTicks": 747900000.0,
                    "durationInTicks": 4400000.0,
                    "confidence": 0.9520496
                  },
                  {
                    "word": "लकड़े",
                    "offset": "PT1M15.23S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 752300000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.57515836
                  },
                  {
                    "word": "का",
                    "offset": "PT1M15.63S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 756300000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.9542087
                  },
                  {
                    "word": "नहीं",
                    "offset": "PT1M15.75S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 757500000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.95746493
                  },
                  {
                    "word": "है",
                    "offset": "PT1M15.99S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 759900000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.9045873
                  },
                  {
                    "word": "हमारा",
                    "offset": "PT1M16.07S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 760700000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.89565164
                  },
                  {
                    "word": "सनम",
                    "offset": "PT1M16.39S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 763900000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.6325933
                  },
                  {
                    "word": "एक",
                    "offset": "PT1M16.75S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 767500000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.32020536
                  },
                  {
                    "word": "है",
                    "offset": "PT1M16.95S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 769500000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.56629336
                  },
                  {
                    "word": "और",
                    "offset": "PT1M17.11S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 771100000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.9118719
                  },
                  {
                    "word": "वुडेन",
                    "offset": "PT1M17.23S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 772300000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.26243684
                  },
                  {
                    "word": "स्टोरी",
                    "offset": "PT1M17.47S",
                    "duration": "PT0.2S",
                    "offsetInTicks": 774700000.0,
                    "durationInTicks": 2000000.0,
                    "confidence": 0.21447101
                  },
                  {
                    "word": "नहीं",
                    "offset": "PT1M17.67S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 776700000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.3561143
                  },
                  {
                    "word": "है",
                    "offset": "PT1M17.83S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 778300000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.6084676
                  },
                  {
                    "word": "सर",
                    "offset": "PT1M17.91S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 779100000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.912122
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 1,
            "offset": "PT1M19.47S",
            "duration": "PT2.72S",
            "offsetInTicks": 794700000,
            "durationInTicks": 27200000,
            "nBest": [
              {
                "confidence": 0.53151006,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "अच्छा कोई बात नहीं नंबर सेव कर लेता हूँ।",
                "sentiment": {
                  "negative": 0.19,
                  "neutral": 0.43,
                  "positive": 0.38
                },
                "words": [
                  {
                    "word": "अच्छा",
                    "offset": "PT1M19.47S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 794700000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.23168023
                  },
                  {
                    "word": "कोई",
                    "offset": "PT1M19.75S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 797500000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.36852005
                  },
                  {
                    "word": "बात",
                    "offset": "PT1M19.99S",
                    "duration": "PT0.24S",
                    "offsetInTicks": 799900000.0,
                    "durationInTicks": 2400000.0,
                    "confidence": 0.1804038
                  },
                  {
                    "word": "नहीं",
                    "offset": "PT1M20.23S",
                    "duration": "PT0.36S",
                    "offsetInTicks": 802300000.0,
                    "durationInTicks": 3600000.0,
                    "confidence": 0.5168495
                  },
                  {
                    "word": "नंबर",
                    "offset": "PT1M20.75S",
                    "duration": "PT0.48S",
                    "offsetInTicks": 807500000.0,
                    "durationInTicks": 4800000.0,
                    "confidence": 0.37843946
                  },
                  {
                    "word": "सेव",
                    "offset": "PT1M21.23S",
                    "duration": "PT0.32S",
                    "offsetInTicks": 812300000.0,
                    "durationInTicks": 3200000.0,
                    "confidence": 0.9543872
                  },
                  {
                    "word": "कर",
                    "offset": "PT1M21.55S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 815500000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.9583328
                  },
                  {
                    "word": "लेता",
                    "offset": "PT1M21.71S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 817100000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.44251028
                  },
                  {
                    "word": "हूँ",
                    "offset": "PT1M22.11S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 821100000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.75246745
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT1M23.15S",
            "duration": "PT1.48S",
            "offsetInTicks": 831500000,
            "durationInTicks": 14800000,
            "nBest": [
              {
                "confidence": 0.81669044,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "ठीक है, **, ओके ओके, ठीक है।",
                "sentiment": {
                  "negative": 0.05,
                  "neutral": 0.41,
                  "positive": 0.54
                },
                "words": [
                  {
                    "word": "ठीक",
                    "offset": "PT1M23.15S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 831500000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.6778898
                  },
                  {
                    "word": "है",
                    "offset": "PT1M23.27S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 832700000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.76345485
                  },
                  {
                    "word": "सर",
                    "offset": "PT1M23.35S",
                    "duration": "PT0.28S",
                    "offsetInTicks": 833500000.0,
                    "durationInTicks": 2800000.0,
                    "confidence": 0.6009858
                  },
                  {
                    "word": "ओके",
                    "offset": "PT1M23.63S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 836300000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.95612603
                  },
                  {
                    "word": "ओके",
                    "offset": "PT1M24.03S",
                    "duration": "PT0.4S",
                    "offsetInTicks": 840300000.0,
                    "durationInTicks": 4000000.0,
                    "confidence": 0.95160323
                  },
                  {
                    "word": "ठीक",
                    "offset": "PT1M24.43S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 844300000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.9428459
                  },
                  {
                    "word": "है",
                    "offset": "PT1M24.55S",
                    "duration": "PT0.08S",
                    "offsetInTicks": 845500000.0,
                    "durationInTicks": 800000.0,
                    "confidence": 0.8239276
                  }
                ]
              }
            ]
          },
          {
            "recognitionStatus": "Success",
            "channel": 0,
            "speaker": 2,
            "offset": "PT1M26.28S",
            "duration": "PT0.84S",
            "offsetInTicks": 862800000,
            "durationInTicks": 8400000,
            "nBest": [
              {
                "confidence": 0.96114707,
                "lexical": "",
                "itn": "",
                "maskedITN": "",
                "display": "थैंक यू सर, हॅव ए नाइस।",
                "sentiment": {
                  "negative": 0.0,
                  "neutral": 0.02,
                  "positive": 0.98
                },
                "words": [
                  {
                    "word": "थैंक",
                    "offset": "PT1M26.28S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 862800000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.9635318
                  },
                  {
                    "word": "यू",
                    "offset": "PT1M26.4S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 864000000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.9540555
                  },
                  {
                    "word": "सर",
                    "offset": "PT1M26.56S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 865600000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.9619207
                  },
                  {
                    "word": "हॅव",
                    "offset": "PT1M26.68S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 866800000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.96689737
                  },
                  {
                    "word": "ए",
                    "offset": "PT1M26.84S",
                    "duration": "PT0.12S",
                    "offsetInTicks": 868400000.0,
                    "durationInTicks": 1200000.0,
                    "confidence": 0.96054626
                  },
                  {
                    "word": "नाइस",
                    "offset": "PT1M26.96S",
                    "duration": "PT0.16S",
                    "offsetInTicks": 869600000.0,
                    "durationInTicks": 1600000.0,
                    "confidence": 0.9599307
                  }
                ]
              }
            ]
          }
        ]
      }`
      res.json(JSON.parse(json));
    })
    });
  
    async function streamToString(readableStream) {
      if (!readableStream) {
        return "";
      }
      else{
      return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
          chunks.push(data.toString());
        });
        readableStream.on("end", () => {
          resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
      });
    }
  }

app.listen(port, () => {
  console.log(`Express backend app listening on port ${port}`)
})