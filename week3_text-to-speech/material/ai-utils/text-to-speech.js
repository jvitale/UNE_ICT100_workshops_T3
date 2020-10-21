async function waitForVoicesLoaded() {
    let setPromise = new Promise(
        function (resolve, reject) {
            let id;

            id = setInterval(() => {
                if (speechSynthesis.getVoices().length !== 0) {
                    resolve(speechSynthesis.getVoices());
                    clearInterval(id);
                }
            }, 10);
        }
    );
    voiceList = await setPromise;
    return voiceList;
}

var __botVoices;
waitForVoicesLoaded().then(
    (result) => {
        let voiceList = result;
        __botVoices = [
            ['pico', voiceList[0]],
            ['bit', voiceList[1]]
        ];
    }
);

function speak(botName, sentence) {
    let utterance = new SpeechSynthesisUtterance(sentence);
    let voice = __botVoices.find((item) => {return item[0] == botName});
    if (voice !== undefined){
        utterance.voice = voice[1];
    } else {
        // default
        utterance.voice = __botVoices[0][1];
    }

    // adding onstart and onend events to manage balloon GUI
    utterance.onstart = function(event){
        manager.publish(
            'speech_event', 
            {
                eventType: 'start',
                bot: botName,
                speech: sentence
            }
        );
    }

    utterance.onend = function(event){
        manager.publish(
            'speech_event',
            {
                eventType: 'end',
                bot: botName,
                speech: sentence
            }
        );
    }

    speechSynthesis.speak(utterance);
}