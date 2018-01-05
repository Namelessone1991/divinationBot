const Discord = require('discord.js');
var http = require('http');
var Promise = require("bluebird");
var randomOrg = require("random-org");
var Jimp = require("jimp");
const request = require('request');
const client = new Discord.Client();
const express = require('express');

const fs = require('fs');

const tarotFolder = "./tarot/";
const conchFolder = "./magicConch/";
const thotFolder = "./thot/";

const runeFolder = "./runes/";

const alchFolder = "./alch/";

const tarotDecksFolder = "./tarotDecks/";


var astroArray = [];
var tumblrArray = [];

astroArray[0] = "aquarius";
astroArray[1] = "pisces";
astroArray[2] = "aries";
astroArray[3] = "taurus";
astroArray[4] = "gemini";
astroArray[5] = "cancer";
astroArray[6] = "leo";
astroArray[7] = "virgo";
astroArray[8] = "libra";
astroArray[9] = "scorpio";
astroArray[10] = "sagittarius";
astroArray[11] = "capricorn";


const app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the `public` directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', (request, response) => {
    // ejs render automatically looks in the views folder
    response.render('index');
});

app.listen(port, () => {
    // will echo 'Our app is running on http://localhost:5000 when run locally'
    console.log('Our app is running on http://localhost:' + port);
});

// pings server every 15 minutes to prevent dynos from sleeping
setInterval(() => {
  http.get('http://aqueous-dusk-98460.herokuapp.com/');
  console.log("Pinging");
}, 900000);




function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

function getFiles(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isFile();
  });
}

var tarotDecksArray = getDirectories('./tarotDecks');


var commandArray = ['!coin',
"!thot",
"!conch",
"!rune",
"!tarot",
"!i-ching",
"!divhelp",
"!listatorts",
"!coin"
];


function mysql_real_escape_string (str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
          case "\0":
              return "\\0";
          case "\x08":
              return "\\b";
          case "\x09":
              return "\\t";
          case "\x1a":
              return "\\z";
          case "\n":
              return "\\n";
          case "\r":
              return "\\r";
          case "\"":
          case "'":
          case "\\":
          case "%":
              return "\\"+char; // prepends a backslash to backslash, percent,
                                // and double/single quotes
      }
  });
}



for(var t = 0; t < tarotDecksArray.length; t++)
{

  commandArray.push("!"+tarotDecksArray[t]);

}

for(var j=0; j < astroArray; j++)
{

  commandArray.push("!astro " + astroArray[i]);

}


global.date = new Date();
global.globalTimer = global.date.getTime();






client.on('ready', () => {
  console.log('Bot is running!');
});

client.on('message', message => {


  var timeRestriction = new Date();


  // definition of the function just to check its efficiency...
  function generateSingleItem(filePath, replyMessage="") {


    fs.readdir(filePath, function (err, files) {




      files = files.filter(item => item !== "spread");



      request("https://www.random.org/integers/?num=1&min=0&max=" + (files.length - 1) + "&col=1&base=10&format=plain&rnd=new", (err, res, body) => {
        if (err) { return console.log(err); }





        var copy = body.toString().replace(/(\r\n|\n|\r)/gm, " ").split(" ");

        copy.pop();


        var randomInts = [];


        for (var i = 0; i < copy.length; i++) {

          randomInts.push(parseInt(copy[i]), 10);

        }

        var chosenItem = files[randomInts[0]];

        console.log("Value of the random number "+randomInts[0]);
        console.log("value of the set file  " + files[randomInts[0]]);


       if (replyMessage == "chosenItem" )
       {
             
             replyMessage = chosenItem.substr(0,chosenItem.indexOf('.'));
       } 


      if(replyMessage == "<@378462544421060608> BE GONE THOT!")
      {

        message.channel.send(replyMessage,{

         file: filePath + chosenItem 

        } );

        return; 
      }


        message.reply(replyMessage, {
          file: filePath + chosenItem
        });


      });




    });




  }




  function cardSpread(filePath = tarotDecksFolder + "/waite/") {


    message.reply('Please wait while the spread is being generated...');

    fs.readdir(filePath, function (err, files) {

      files = files.filter(item => item !== "spread");


      request("https://www.random.org/integer-sets/?sets=1&num=3&min=0&max=" + (files.length - 1) + "&order=index&format=plain&rnd=new", (err, res, body) => {
        if (err) { return console.log(err); }



        var copy = body.toString().split(" ");
        console.log('Pop value ' + copy);

        var randomInts = [];


        for (var i = 0; i < copy.length; i++) {

          randomInts.push(parseInt(copy[i], 10));

        }



        var promises = [];

        var spreadArray = [];

        var chosenCards = randomInts;
        spreadArray.unshift(filePath + '/spread/table.jpg');



        for (var u = 0; u < chosenCards.length; u++) {

          spreadArray.push(filePath + files[chosenCards[u]].toString());

          console.log('value of the cards' + files[chosenCards[u]].toString());

        }

        for (var i = 0; i < spreadArray.length; i++) {
          promises.push(Jimp.read(spreadArray[i])); //still undefined until this point because of 
          //poorly created language
        }


        Promise.all(promises).then(function (data) {

          return Promise.all(promises);

        }).then(function (data) {

          data[0].resize(200 + (data[1].bitmap.width * 3), data[1].bitmap.height + 50);
          data[0].composite(data[1], 50, 25);
          data[0].composite(data[2], data[1].bitmap.width + 100, 25);
          data[0].composite(data[3], (data[1].bitmap.width * 2) + 150, 25);

          try {

            var finalImage = new Jimp(200 + (data[1].bitmap.width * 3), data[1].bitmap.height + 50,
              function (err, image) {
                data[0]
                  .quality(90)
                  .write(filePath + '/spread/overlayJimp.jpg');


                message.reply("Here is your spread", {
                  file: filePath + "/spread/overlayJimp.jpg"
                });




              });
          }
          catch (e) {
            console.log("unable to write in the overlay");
            return;
          }

        }).catch(function (except) {

          console.log('unable to handle the promises ' + except);

        });


      });


    });





  }


  function cardSpread7(filePath = tarotDecksFolder + "/waite/") {


    message.reply('Please wait while the spread is being generated...');


    fs.readdir(filePath, function (err, files) {

      files = files.filter(item => item !== "spread");


      request("https://www.random.org/integer-sets/?sets=1&num=7&min=0&max=" + (files.length - 1) + "&order=index&format=plain&rnd=new", (err, res, body) => {
        if (err) { return console.log(err); }



        var copy = body.toString().split(" ");
        

        var randomInts = [];


        for (var i = 0; i < copy.length; i++) {

          randomInts.push(parseInt(copy[i], 10));

        }



        var promises = [];

        var spreadArray = [];

        var chosenCards = randomInts;
        spreadArray.unshift(filePath + '/spread/table.jpg');



        for (var u = 0; u < chosenCards.length; u++) {

          spreadArray.push(filePath + files[chosenCards[u]].toString());

          

        }


        for (var i = 0; i < spreadArray.length; i++) {
          promises.push(Jimp.read(spreadArray[i])); //still undefined until this point because of 
          //poorly created language
        }


        Promise.all(promises).then(function (data) {

          return Promise.all(promises);

        }).then(function (data) {

          data[0].resize(200 + (data[1].bitmap.width * 3), (data[1].bitmap.height * 3) + 100);
          data[0].composite(data[1], 50, 25);
          data[0].composite(data[2], (data[1].bitmap.width * 2) + 150, 25);
          data[0].composite(data[3], 50, (data[1].bitmap.height) + 50);
          data[0].composite(data[4], (data[1].bitmap.width * 2) + 150, (data[1].bitmap.height) + 50);
          data[0].composite(data[5], 50, (data[1].bitmap.height * 2) + 75);
          data[0].composite(data[6], (data[1].bitmap.width * 2) + 150, (data[1].bitmap.height * 2) + 75);
          data[0].composite(data[7], (data[1].bitmap.width) + 100, (data[1].bitmap.height) + 50);

          try {

            var finalImage = new Jimp(200 + (data[1].bitmap.width * 3), data[1].bitmap.height + 50,
              function (err, image) {
                data[0]
                  .quality(90)
                  .write(filePath+'/spread/overlayJimp7.jpg');



                message.reply("Here is your spread", {
                  file: filePath+'/spread/overlayJimp7.jpg'
                });


              });
          }
          catch (e) {
            console.log("unable to write in the overlay");
            return;
          }

        }).catch(function (except) {

          console.log('unable to handle the promises ' + except);

        });



      });
    });





  }



  //continue with the code as normal

for (var z = 0; z < commandArray.length; z++)
{  
  if (message.content.includes(commandArray[z]) && ((timeRestriction.getTime() - global.globalTimer) < 4000)) {

    message.reply("Please wait "+ Math.abs((((timeRestriction.getTime() - global.globalTimer) -4000 )/1000)) +" seconds before requesting something again");

    break;    
    return;  
  } 

  if ((message.content.includes('!spread') || message.content.includes('!love') ) && (z === (commandArray.length -1)) &&  ((timeRestriction.getTime() - global.globalTimer) < 10000)) {

    message.reply("Please wait "+ Math.abs((((timeRestriction.getTime() - global.globalTimer) -4000 )/1000)) +" seconds before requesting a spread  again");
    break;
    return;  
  } 
  

}







  if (message.content.includes('!coin') && ((timeRestriction.getTime() - global.globalTimer) > 4000) ) {
    
   generateSingleItem('./coin/');
   global.globalTimer = Date.now();

  }


  var thotUsers = [];

  thotUsers[0] = "<@217140895999459328>"; // HM aka dev/null's ID
  thotUsers[1] = "<@378462544421060608>"; /* Candy kitten meow
     aka that CIS WHITE FEMALE who hurts my feelies all the time ;__; 
     */

  thotUsers[2] = "<@140528497197056000>"; //XT
  thotUsers[3] = "<@158016121721585665>"; // Habit
  thotUsers[4] = "<@369983964187983876>"; //Fortune


  for (var i = 0; i < thotUsers.length; i++) {
    if (message.content.includes('!thot') && (message.author.toString() === thotUsers[i].toString())&& ((timeRestriction.getTime() - global.globalTimer) > 4000)) 
    {

      generateSingleItem(thotFolder, "<@378462544421060608> BE GONE THOT!" );
      global.globalTimer = Date.now();

    }
  }


  if (message.content.includes('!conch')&& ((timeRestriction.getTime() - global.globalTimer) > 4000)) {


     generateSingleItem(conchFolder);
     global.globalTimer = Date.now();     

  }


  






  if (message.content.includes('!rune')&&((timeRestriction.getTime() - global.globalTimer) > 4000)) {

    generateSingleItem(runeFolder);
    global.globalTimer = Date.now();

  }

  


  for (var i = 0; i < tarotDecksArray.length; i++) {
    if (message.content.includes('!' + tarotDecksArray[i])&&((timeRestriction.getTime() - global.globalTimer) > 4000)) {

      generateSingleItem(tarotDecksFolder + tarotDecksArray[i] + "/");
      global.globalTimer = Date.now();

    }
  }

  if(message.content.includes('!tarot')&&((timeRestriction.getTime() - global.globalTimer) > 4000)){

     generateSingleItem(tarotDecksFolder+"/waite/");
     global.globalTimer = Date.now();

  }
  

  for (var i = 0; i < tarotDecksArray.length; i++) {


    if (message.content.includes('!spread ' + tarotDecksArray[i]) && ((timeRestriction.getTime() - global.globalTimer) > 4000)) {

      cardSpread(tarotDecksFolder + tarotDecksArray[i] + "/");

      global.globalTimer = Date.now();

      break;

    }

    if (message.content.includes('!spread') && (i === (tarotDecksArray.length - 1)) && ((timeRestriction.getTime() - global.globalTimer) > 4000)) {


      cardSpread();
      global.globalTimer = Date.now();
      break;


    }

  }


  for (var i = 0; i < tarotDecksArray.length; i++) {
    
    
        if (message.content.includes('!love ' + tarotDecksArray[i]) && ((timeRestriction.getTime() - global.globalTimer) > 10000)) {
    
          cardSpread7(tarotDecksFolder + tarotDecksArray[i] + "/");
    
          global.globalTimer = Date.now();
    
          break;
    
        }
    
        if (message.content.includes('!love') && (i === (tarotDecksArray.length - 1)) && ((timeRestriction.getTime() - global.globalTimer) > 10000)) {
    
    
          cardSpread7();
          global.globalTimer = Date.now();
          break;
    
    
        }
    
      }


  if(message.content.includes('!i-ching') && ((timeRestriction.getTime() - global.globalTimer) > 4000) ){

    generateSingleItem('./iching/',"chosenItem");
    global.globalTimer = Date.now();

  } 
  
  for (var i = 0; i < thotUsers.length; i++) {
  if(message.content.includes('!tumblradd') &&  ((timeRestriction.getTime() - global.globalTimer) > 4000) && (message.author.toString() === thotUsers[i].toString()) ){
  

    tumblrArray.push(message.content.replace("!tumblradd", ""));

    var _escapeString = function (val) {
      val = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
        switch (s) {
          case "\0":
            return "\\0";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          case "\b":
            return "\\b";
          case "\t":
            return "\\t";
          case "\x1a":
            return "\\Z";
          case "'":
            return "''";
          case '"':
            return '""';
          default:
            return "\\" + s;
        }
      });
    
      return val;
    };



    console.log(mysql_real_escape_string(message.content.replace("!tumblradd", "")));





  }
  }



  if(message.content.includes('!angel') && ((timeRestriction.getTime() - global.globalTimer) > 4000) ){

    generateSingleItem('./angel/',"chosenItem");
    global.globalTimer = Date.now();

  }    


  
  if(message.content.includes('!geo') && ((timeRestriction.getTime() - global.globalTimer) > 4000) ){

    generateSingleItem('./geo/');
    global.globalTimer = Date.now();

  }    
    
   if(message.content.includes('!divhelp') && ((timeRestriction.getTime() - global.globalTimer) > 4000))
   {

     message.channel.send('**PREPEND THE \'!\' CHARACTER TO EVERY COMMAND**\n\n\
**listtarots**: Lists the currently available decks\n\n**spread**: Posts and image with 3 cards using the Rider-Waite tarot\n\n**spread [tarot name]**: It gives you a spread with the requested tarot deck\n\n\
**tarot**: A single Rider-Waite tarot card\n\n\
**[tarot name]**:Get a single card of the tarot\n\n\
**lenormand**:Get a single Lenormand card\n\n\
**love**: It posts a 7 card spread for relationship advice, the left side represents the querent,the right side the other person and finally the card in the middle how the energies of both parties flow together\n\n\
**rune**: It posts the image of a random rune\n\n\
**love [tarot name]**: A relationship spread with the chosen tarot deck\n\n\
**astro [sun sign]**: It gives you the daily horoscope for your sun sign\n\n\
**conch**: It uploads the response from the Magic Conch\n\n\
**i-ching**: It posts an I-Ching hexagram\n\n\
**coin**: Flips a coin, and posts the result\n\n\
**angel**: Posts a random Angelic Oracle Deck card\n\n\
**geo**: Posts a geomancy figure');

global.globalTimer = Date.now();

   }


   if(message.content.includes('!listtarots')&& ((timeRestriction.getTime() - global.globalTimer) > 4000)){

    message.channel.send('**THESE ARE THE CURRENTLY AVAILABLE DECKS**\n\n'+tarotDecksArray+"");
    global.globalTimer = Date.now();

    


   }

 



  for (var i = 0; i < astroArray.length; i++)

    if (message.content.includes("!astro " + astroArray[i]) && ((timeRestriction.getTime() - global.globalTimer) > 4000)){
      request('http://sandipbgt.com/theastrologer/api/horoscope/' + astroArray[i] + '/today/', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }

        message.channel.send("**"+body.sunsign+"** :"+body.horoscope);
       


      });

      global.globalTimer = Date.now();
    }
});

client.login('Mzg4Mzk4MDgyMzY4NDcxMDUw.DQsjtQ.vJtc6yRHsvo3J3AL_KC8aU9vsSA');