# iDel
A Discord selfbot designed to delete messages from both DMs and servers, inspired by the Undiscord script.

### Requirements

- [Node.js](https://nodejs.org/en/) (Make sure you have the latest stable version)
- A valid Discord user account token

### Setup and Installation

#### 1. Install Node.js
If you haven’t already, download and install [Node.js](https://nodejs.org/en/)  (Ensure that you have the latest stable version installed.)

#### 2. Download the Script
Navigate to the directory where you want to store the script and download or clone the repository containing the script.

#### 3. Install Dependencies
Once you have the script, open a terminal in the project directory and run the following command to install the necessary dependencies:

```bash
npm install discord.js-selfbot-v13 readline-sync gradient-string
```

### 4. Configure config.json

In the same directory as the script, create a config.json file and add your Discord user token:

```json
{
    "token": "your-discord-user-token-here"
}
```

Replace "your-discord-user-token-here" with your actual Discord account token.

### 5. Run the Script

Once the dependencies are installed and the configuration is set, you can run the script with the following command:
```bash
node iDel.mjs
```
This will start the bot, and you will be able to interact with it through your terminal.

![preview](https://github.com/user-attachments/assets/16588fe6-dcea-4335-88fb-35f4f9db8935)

