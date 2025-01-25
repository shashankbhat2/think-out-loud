# Think Out Loud! Chrome Extension

A Chrome extension that adds text-to-speech capabilities to Deepseek Chat's thinking steps using PlayHT's dialog TTS model via fal.ai.

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. Configure your fal.ai API key in `config.js`

## Configuration

1. Open `config.js`
2. Replace `YOUR_FAL_API_KEY` with your actual fal.ai API key:
```javascript
FAL_API_KEY: "your_actual_api_key_here"
```

## Usage

1. Visit [Deepseek Chat](https://chat.deepseek.com/)
2. Enable Deepthink in the chat input. 
3. Ask a question or start a conversation. 
4. Look for the speaker icon button above the thinking steps. 
5. Click the button, wait for the audio to play. 

###### Thank you!
