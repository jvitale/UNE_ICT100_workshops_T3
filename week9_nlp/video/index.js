// function to read from the input text boxes
function readInputText(botName, clearInput){
    let inputTextObj = document.getElementById(`input-text-${botName}`);
    let text = inputTextObj.value;
    if (clearInput == true){
        inputTextObj.value = '';
    }
    return text;
}

function handleChatMessage(sender, receiver, chatMessage){
    let message = {
        sender: sender,
        receiver: receiver,
        content: chatMessage
    }
    manager.publish('new_chat_message', message);
}

// declaring the variables for the two button elements
const btnTextPico = document.getElementById('text-pico');
const btnTextBit = document.getElementById('text-bit');

// adding the event listeners for the buttons
btnTextPico.addEventListener(
    'click',
    function(){
        let text = readInputText('pico', true);
        handleChatMessage('user_text', 'pico', text);
    }
);

btnTextBit.addEventListener(
    'click',
    function(){
        let text = readInputText('bit', true);
        handleChatMessage('user_text', 'bit', text);
    }
);

const btnTalkPico = document.getElementById('talk-to-pico');
const btnTalkBit = document.getElementById('talk-to-bit');

btnTalkPico.addEventListener(
    'click',
    function(){
        let text;
        listen(
            (result) => {
                text = result;
                handleChatMessage('user_speech', 'pico', text);
            }
        );
    }
);

btnTalkBit.addEventListener(
    'click',
    function(){
        let text;
        listen(
            (result) => {
                text = result;
                handleChatMessage('user_speech', 'bit', text);
            }
        );
    }
);

let subBalloon = manager.subscribe(
    'speech_event',
    (message) => {
        let eventType = message.eventType;
        let bot = message.bot;
        let text = message.speech;
        if(eventType === 'start'){
            showTextBalloon(bot, text);
        } else {
            hideTextBalloon(bot);
        }
    }
);

let subChatMessage = manager.subscribe(
    'new_chat_message',
    (message) => {
        let sender = message.sender;
        let bot = message.receiver;
        let text = message.content;
        if (sender === 'user_speech'){
            text = `You said: ${text}`;
        } else {
            text = `You wrote: ${text}`;
        }
        speak(bot, text);
    }
);

// Face detection and recognition

let subFaceRecSetup = manager.subscribe(
    'webcam_ready',
    async (msg) => {
        let promiseSetup = setupFaceDetectionAndRecognition();
        await promiseSetup;
        detectFace();
    }
);

let subHandleFaceDetectionResults = manager.subscribe(
    'face_detection_result',
    (msg) => {
        let detections = msg.detections;
        displayDetections(detections);
        if (detections.length > 0){
            manager.publish('user_engagement', {});
        }
        detectFace();
    }
);

var lastUserGreeted = '';

async function greetUser(salutation, name, botName){
    if (lastUserGreeted !== name){
        await speak(botName, `${salutation} ${name}!`);
        console.log(`${name} greeted`);
        lastUserGreeted = name;
    }
}

function retrieveName(sentence){
    let docx = nlp(sentence);
    let people = docx.match('#Person').json();

    if (people.length > 0){
        return people[0].text;
    } else {
        return '';
    }
}

function isAnswerYes(answer){
    let docx = nlp(answer);
    return docx.has('(yes|sure|affermative|correct|definitely|obviously|true)');
}

async function enrollFace(botName){
    await speak(botName, "I think I don't know you");
    await speak(botName, `I'm ${botName}, what's your name?`);
    let name = '';
    do {
        let answerName = await listenBlocking();
        name = retrieveName(answerName);
        let success = false;
        if (name !== ''){
            await speak(botName, `Did you say your name is ${name}?`);
            let answerConfirm = await listenBlocking();
            success = isAnswerYes(answerConfirm);
        }
        if (success){
            await speak(botName, `Nice to meet you ${name}`);
            await speak(botName, `Please, look at the camera. I will memorise your identity.`);
            let enrolled = await learnFace(name, botName);
            if (enrolled) {
                await speak(botName, `I memorised your identity`);
            } else {
                await speak(botName, `I was not able to memorise your identity`);
            }
        } else {
            name = '';
            await speak(botName, `Sorry, I did not get your name. What's your name?`);
        }
    } while (name === '');
}

var isEngaging = false;

let subHandleEngagement = manager.subscribe(
    'user_engagement',
    async (msg) => {
        if (!isEngaging){
            isEngaging = true;
            let botName = 'pico';

            let result = await recogniseFace(botName);

            if (result !== false){
                // face recognise!
                await greetUser("hello", result, botName);
            } else {
                // new face
                await enrollFace(botName);
            }
            isEngaging = false;
        }
    }
)

openWebcam(__webcam.webcamConstraints);
manager.verbose = false;
