var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

var speechRecognitionObj = new SpeechRecognition();

speechRecognitionObj.continuous = false; // making it stop at the end of an utterance
speechRecognitionObj.lang = 'en-US'; // setting the language to English
speechRecognitionObj.interimResults = false; // no interim results
speechRecognitionObj.maxAlternatives = 1; // only one alternative available as result

// function to listen using the speech recognition of the browser
function listen(callback) {
    // setting what to do once we get a result
    speechRecognitionObj.onresult = function(event){
        var result = event.results[0][0].transcript;
        manager.publish('speech_recognition_event', {event: 'stop'});
        manager.publish('speech_recognition_result', {result: result});
        callback(result);
    }

    // opening the mic and start listening
    manager.publish('speech_recognition_event', {event: 'start'});
    speechRecognitionObj.start();
}

async function listenBlocking(){
    let response;
    let promiseListen = new Promise(
        (resolve) => {
            listen((result) => resolve(result));
        }
    ).then((result) => response = result);
    await promiseListen;
    return response
}