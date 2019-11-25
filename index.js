const TelegramBot = require('./telegram');
var request = require('request');
var config = require('./config.json');

// replace the value below with the Telegram token you receive from @BotFather
// ServerfyBOT token
const botToken = '711197504:AAE9lt1B1K0o8x3Iu9PMISPAoAxCD-nmeTg';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(botToken, {polling: true});

var userToken = "";
var userId = "";

// Matches "/echo [whatever]", used to get regex expressions
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/config/, (msg, match) => {
  const chatId = msg.chat.id;

  var user = msg.from;
  var telegramID = user.id;
  var fname = user.first_name;
  var lname = user.last_name;
  var uname = user.username;

  asw = "Name: " + fname + " " + lname + "\n";
  asw += "UserName: @" + uname + "\n";
  asw += "Telegram ID: " + telegramID;

  bot.sendMessage(chatId, asw);
});

bot.onText(/\/login/, (msg, match) => {
  if(msg.text.indexOf(" ") == -1)
  {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Por favor, se identifique utilizando: \n<login> <senha>");
  }
});

bot.onText(/\/login (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  if(match[1].indexOf(" ") == -1)
  {
    bot.sendMessage(chatId, "Por favor, se identifique utilizando: \n<login> <senha>");
    return;
  }
  else
  {
    var username = match[1].split(" ")[0];
    var password = match[1].split(" ")[1];
    var form = {username: username,password: password};

    request.post({
        url: config.apiUrl + '/users/authenticate',
        form: form,
        json: true
    }, function (error, response, body) {
        if (error) {
            bot.sendMessage(chatId, "Me desculpe, parece que aconteceu algum erro.");
            return;
        }
        if(!body.token){
          bot.sendMessage(chatId, "Desculpe, não consigo lembrar de você.");
          return;
        }

        // save JWT token and the userId in the session to make it available to the angular app
        userToken = body.token;
        userId = body.userId;
        bot.sendMessage(chatId, "Olá! \nSou assistente pessoal para servidores. \nComo posso ajudá-lo?");
    });
  }
});

bot.onText(/\/getAllServers/, (msg, match) => {
  const chatId = msg.chat.id;

  if(userToken != "" && userId != "")
  {
    var asw = "";

    //$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    var form = {"Authorization" : "Bearer " + userToken};
    request.get({
        url: config.apiUrl + '/server/',
        headers: form,
        json: true
    }, function (error, response, body) {
        if (error) {
            bot.sendMessage(chatId, "Me desculpe, parece que aconteceu algum erro.");
            return;
        }
        if(body.toString().includes("Unauthorized")) {
          bot.sendMessage(chatId, "Requisição não autorizada, sinto muito");
          return;
        }

        for(var s in body)
        {
          var x = getStatus(body[s].ip);
          var a = Math.floor((Math.random() * 100) + 1);
          if(a < 80)
            x = "UP";
          else
            x = "DOWN";
          asw += body[s].ip + " - " + body[s].host + " - " + x + "\n";
        }
        if(asw != "")
          bot.sendMessage(chatId, asw);
    });
  }
  else {
    bot.sendMessage(chatId, "Por favor, efetue o login!");
  }
});

function getStatus(ip)
{
  var form = {"Authorization" : "Bearer " + userToken};
  request.get({
      url: config.apiUrl + "/command/status/:"+ip,
      headers: form,
      json: true
  }, function (error1, response1, body1) {
      if (error1) {
          bot.sendMessage(chatId, "Me desculpe, parece que aconteceu algum erro.");
          return;
      }
      if(body1.toString().includes("Unauthorized")) {
        bot.sendMessage(chatId, "Requisição não autorizada, sinto muito");
        return;
      }
      return body1;
  });
}


// Listen for any kind of message. There are different kinds of messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//
//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });

// Listen to text messages only
bot.on('text', (msg) => {
  if(msg.text[0] != "/")
  {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, msg.text);
  }
});

// Listen to audio messages only
bot.on('audio', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your audio message');
});

// Listen to document messages only
bot.on('document', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your document message');
});

// Listen to photo messages only
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your photo message');
});

// Listen to sticker messages only
bot.on('sticker', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your sticker message');
});

// Listen to video messages only
bot.on('video', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your video message');
});

// Listen to voice messages only
bot.on('voice', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your voice message');
});
