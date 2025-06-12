# Disappear - Discord Message Cleaner Selfbot

A selfbot utility to bulk delete your Discord messages across servers, DMs, and group chats with rate-limiting to avoid detection.



## ⚠️ Important Notice
- This is a **selfbot**, which violates Discord's Terms of Service
- Use at your own risk - accounts using selfbots may be banned
- Only use this with your own account/token
- The bot includes rate-limiting to reduce detection risk

## Features
- Delete messages in batches with configurable delays
- Support for:
  - Direct Messages (DMs)
  - Group DMs
  - Specific channels
  - Entire servers (all channels)
- Colorful console output with gradients
- Automatic retry mechanism for failed deletions
- Interactive command interface

## Installation
1. Clone the repository and navigate to the iDelete directory:
   ```bash
   git clone https://github.com/7v6a/Disappear.git
   cd Disappear/iDelete
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a config.json file with your Discord token:
   ```json
   {
   "token": "UserAccountToken"
   }
   ```

## Usage

1. Start the selfbot:
    ```bash
    node disappear.mjs
    ```
2. Follow interactive prompts;
   ```text
   Enter: dm | server <ID> | channel ID | exit
    >
   ```

 ## Configuration
 Edit these constants in disappear.mjs to adjust behavior:
 
```javascript
    const constants = {
      DELETE_DELAY: 800,       // Delay between individual message deletions (ms)
      BATCH_SIZE: 7,           // Number of messages before a longer pause
      BATCH_PAUSE: 3000,       // Pause after each batch (ms)
      MAX_RETRIES: 3           // Max retry attempts for failed operations
        };
 ```


## FAQ

Q: How do I get channel/server IDs? <br>
A: Enable Developer Mode in Discord settings, then right-click to copy IDs.

Q: Why does it pause between deletions? <br>
A: To mimic human behavior and avoid rate limits or detection.

Q: Can I delete messages older than 14 days? <br>
A: Yes, this selfbot can bypass the normal 14-day limitation.

Q: Is there a way to preview before deleting? <br>
A: Not currently - always back up important messages first.

## Disclaimer

This project is for educational purposes only. The developer is not responsible for any account suspensions or violations of Discord's Terms of Service that may result from using this software.
