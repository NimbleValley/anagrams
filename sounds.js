const airhorn = new Audio("sounds/airhorn.mp3");
const buzzer = new Audio("sounds/buzzer.mp3");
const holyMoly = new Audio("sounds/holy-moly.mp3");
const rizz = new Audio("sounds/rizz.mp3");
const pipe = new Audio("sounds/pipe.mp3");
const wrong = new Audio("sounds/wrong.mp3");
const womp = new Audio("sounds/womp.mp3");

const lobbyMusic = new Audio("sounds/lobby-music.m4a");
const battleMusic = new Audio("sounds/battle-music.m4a");

function playAirHorn() {
    airhorn.currentTime = 0;
    airhorn.play();
}

function playBuzzer() {
    buzzer.currentTime = 0;
    buzzer.play();
}

function playHolyMoly() {
    holyMoly.currentTime = 0;
    holyMoly.play();
}

function playRizz() {
    rizz.currentTime = 0;
    rizz.play();
}

function playPipe() {
    pipe.play();
}

function playWrong() {
    wrong.play();
}

async function playWomp() {
    await(sleep(1000));
    womp.play();
}

function playBattleMusic() {
    battleMusic.play();
}

function stopBattleMusic() {
    battleMusic.pause();
    battleMusic.currentTime = 0;
}

function playLobbyMusic() {
    lobbyMusic.play();
}

function stopLobbyMusic() {
    lobbyMusic.pause();
    lobbyMusic.currentTime = 0;
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}