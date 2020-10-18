// function to read from the input text boxes
function readInputText(botName, clearInput){
    let inputTextObj = document.getElementById(`input-text-${botName}`);
    let text = inputTextObj.value;
    if (clearInput == true){
        inputTextObj.value = '';
    }
    return text;
}

// declaring the variables for the two button elements
const btnTextPico = document.getElementById('text-pico');
const btnTextBit = document.getElementById('text-bit');

// adding the event listeners for the buttons
btnTextPico.addEventListener(
    'click',
    function(){
        let text = readInputText('pico', true);
        showTextBalloon('pico', text);
        speak('pico', text);
    }
);

btnTextBit.addEventListener(
    'click',
    function(){
        let text = readInputText('bit', true);
        showTextBalloon('bit', text);
        speak('bit', text);
    }
);
