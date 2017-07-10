'use strict';
var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startModeHandlers, sideModeHandlers, playModeHandlers, endModeHandlers);
    alexa.execute();
};

var states = {
    STARTMODE: '_STARTMODE', // Prompt the user to start or restart the game.
    SIDEMODE: '_SIDEMODE', // Prompt the user to choose a side.
    PLAYMODE: '_PLAYMODE', // User is playing.
    ENDMODE: '_ENDMODE'
};

var lang = {
    HELP: 'We will first choose sides. The sides are ping and pong. Then we will say our side\'s name, ping or pong, back and forth until one of us stops.',
    WELCOME: 'Welcome to ping-pong dev.',
    PROMPT_START: 'Would you like to start a game?',
    PROMPT_START_CHOICES: 'Say yes to start a game, or no to quit.',
    STARTED_GAME: 'Great!',
    CHOOSE_A_SIDE: 'Choose a side. Ping or pong.',
    CHOOSE_A_SIDE_CHOICES: 'Say ping to choose ping, or pong to choose pong.',
    SIDE_CHOSEN: 'Good choice! Get ready.',
    PING: 'Ping!',
    PONG: 'Pong!',
    ALEXA_WINS: 'Nice try!',
    PLAY_AGAIN: 'Do you want to play again?',
    PLAY_AGAIN_CHOICES: 'Say yes to play again, or no to quit.',
    BYE: 'Alright, I\'m down for a challenge anytime.'
};

var newSessionHandlers = {
    'NewSession': function() {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', lang.WELCOME + " " + lang.PROMPT_START, lang.PROMPT_START_CHOICES);
    },
    'SessionEndedRequest': function () {
        console.log('Session ended!');
        this.emit(':tell', lang.BYE);
    },
    "AMAZON.StopIntent": function() {
        this.emit(':tell', lang.BYE);
    }
};

var startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'NewSession': function() {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', lang.HELP + " " + lang.PROMPT_START, lang.PROMPT_START_CHOICES);
    },
    'AMAZON.YesIntent': function() {
        this.handler.state = states.SIDEMODE;
        this.emit(':ask', lang.STARTED_GAME + " " + lang.CHOOSE_A_SIDE, lang.CHOOSE_A_SIDE_CHOICES);
    },
    'AMAZON.NoIntent': function() {
        this.emit('AMAZON.StopIntent');
    },
    "AMAZON.StopIntent": function() {
        this.emit(':tell', lang.BYE);
    },
    'SessionEndedRequest': function () {
        console.log('Session ended!');
        this.emit(':tell', lang.BYE);
    },
    'Unhandled': function() {
        this.emit(':ask', lang.PROMPT_START_CHOICES, lang.PROMPT_START_CHOICES);
    }
});

var sideModeHandlers = Alexa.CreateStateHandler(states.SIDEMODE, {
    'NewSession': function() {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'ChoosePing': function() {
    	this.attributes["side"] = 'ping';
    	this.handler.state = states.PLAYMODE;
        this.emit(':ask', lang.SIDE_CHOSEN + " " + lang.PONG);
    },
    'ChoosePong': function() {
    	this.attributes["side"] = 'pong';
    	this.handler.state = states.PLAYMODE;
        this.emit(':ask', lang.SIDE_CHOSEN + " " + lang.PING);
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', lang.HELP + " " + lang.CHOOSE_A_SIDE, lang.CHOOSE_A_SIDE_CHOICES);
    },
    "AMAZON.StopIntent": function() {
        this.emit(':tell', lang.BYE);
    },
    'SessionEndedRequest': function () {
        console.log('Session ended!');
        this.emit(':tell', lang.BYE);
    },
    'Unhandled': function() {
        this.emit(':ask', lang.CHOOSE_A_SIDE_CHOICES, lang.CHOOSE_A_SIDE_CHOICES);
    }
});

var playModeHandlers = Alexa.CreateStateHandler(states.PLAYMODE, {
    'NewSession': function() {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'ChoosePing': function() {
    	var side = this.attributes["side"];
    	if (side != 'ping') {
			this.handler.state = states.ENDMODE;
            this.emit(':ask', lang.ALEXA_WINS + " " + lang.PLAY_AGAIN, lang.PLAY_AGAIN_CHOICES);
    	} else {
			this.emit(':ask', lang.PONG);
    	}
    },
    'ChoosePong': function() {
    	var side = this.attributes["side"];
    	if (side != 'pong') {
			this.handler.state = states.ENDMODE;
            this.emit(':ask', lang.ALEXA_WINS + " " + lang.PLAY_AGAIN, lang.PLAY_AGAIN_CHOICES);
    	} else {
			this.emit(':ask', lang.PING);
    	}
    },
    "AMAZON.StopIntent": function() {
        this.emit(':tell', lang.BYE);
    },
    'SessionEndedRequest': function () {
        console.log('Session ended!');
        this.emit(':tell', lang.BYE);
    },
    'Unhandled': function() {
        this.handler.state = states.ENDMODE;
        this.emit(':ask', lang.ALEXA_WINS + " " + lang.PLAY_AGAIN, lang.PLAY_AGAIN_CHOICES);
    }
});

var endModeHandlers = Alexa.CreateStateHandler(states.ENDMODE, {
    'NewSession': function() {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'AMAZON.YesIntent': function() {
        this.handler.state = states.SIDEMODE;
        this.emit(':ask', lang.STARTED_GAME + " " + lang.CHOOSE_A_SIDE, lang.CHOOSE_A_SIDE_CHOICES);
    },
    'AMAZON.NoIntent': function() {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', lang.HELP + " " + lang.PLAY_AGAIN, lang.PLAY_AGAIN_CHOICES);
    },
    "AMAZON.StopIntent": function() {
        this.emit(':tell', lang.BYE);
    },
    'SessionEndedRequest': function () {
        console.log('Session ended!');
        this.emit(':tell', lang.BYE);
    },
    'Unhandled': function() {
        this.emit(':ask', lang.PLAY_AGAIN_CHOICES, lang.PLAY_AGAIN_CHOICES);
    }
});