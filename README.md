# Chinglish Chrome Extension

## TO RUN
Visit chrome://extensions and make sure you are in developer mode. Click the "Load unpacked" button and select the `/chrome_extension` folder where our chrome extension lives. Now try out the addon!

## TO DO
- Figure out how to get a hanzi-to-pinyin api working w/o running into stupid Typescript typing issues
- Add text-to-speech for translated words
- Playback the translations word for word
- better async play of audio (currently using a shitty setTimeout)

## USEFUL LINKS
- [Neural Pinyin Predictor](https://github.com/Kyubyong/neural_chinese_transliterator)
- [Chinese Text Decomposer](https://github.com/nieldlr/hanzi)
- [Strip Character Accents](https://gist.github.com/sindresorhus/4705780)
- [Pinyin REST](https://www.npmjs.com/package/pinyin-rest)
- [Google AutoML Language](https://cloud.google.com/translate/docs/intro-to-v3)
- [Google Transliteration](https://www.google.com/inputtools/services/features/transliteration.html)
- [Text to Speech](https://cloud.google.com/text-to-speech/docs/reference/rest/v1beta1/text/synthesize)

## RELATED RESOURCES
- [Previous Repo](https://github.com/kangzeroo/Chinglish-Chrome-Keyboard)
- [Main Tutorial](https://blog.usejournal.com/making-an-interactive-chrome-extension-with-react-524483d7aa5d)
- [Comprehensive Tutorial](https://itnext.io/create-chrome-extension-with-reactjs-using-inject-page-strategy-137650de1f39)
- [With create-react-app](https://medium.com/@gilfink/building-a-chrome-extension-using-react-c5bfe45aaf36)