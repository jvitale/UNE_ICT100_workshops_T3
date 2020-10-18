// function to show the text balloon
function showTextBalloon(botName, message){
    let balloon = document.getElementById('text-balloon-' + botName);
    balloon.getElementsByClassName('bot-message')[0].textContent = message;
    balloon.style.display = 'block';
}

// function to hide the text balloon
function hideTextBalloon(botName){
    let balloon = document.getElementById('text-balloon-' + botName);
    balloon.getElementsByClassName('bot-message')[0].textContent = '';
    balloon.style.display = 'none';
}