import axios from 'axios';
import _ from 'lodash'

export const translateText = (text, token) => {
  const p = new Promise((res, rej) => {
    const headers = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    let translated = ""
    let pinyin = ""
    axios.post(`https://translation.googleapis.com/v3beta1/projects/chinglish-keyboard:translateText`, {
        "contents": [
          text
        ],
        "targetLanguageCode": "zh-Hans",
      }, headers)
      .then((data) => {
        translated = _.get(data, ["data", "translations", "0", "translatedText"], "")
        return Promise.resolve(['xxx xx xx'])
      })
      .then((data) => {
        pinyin = data
        return axios.post(`https://texttospeech.googleapis.com/v1beta1/text:synthesize`, {
          input: {
            "text": translated
          },
          voice: {
            "languageCode": "cmn-cn"
          },
          audioConfig: {
            "audioEncoding": "OGG_OPUS"
          }
        }, headers)
      })
      .then((audioContent) => {
        const output = {
          text: translated,
          audio: _.get(audioContent, ["data", "audioContent"]),
          pronounciation: pinyin.map(x => {
            if (typeof x === 'object' && x[0]) {
              return x[0]
            } else if (typeof x === 'string') {
              return x
            }
            return null
          }).filter(x => x)
        }
        res(output)
      })
      .catch((err) => {
        const error = _.get(err, ["response", "data"], "err.response.data")
        console.log("--------- ERROR ---------")
        rej(error)
      })
  })
  return p
}

// $ node --experimental-modules src/utils.mjs
// translateText("Hello world lets do nothing!")
