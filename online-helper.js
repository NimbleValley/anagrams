const gameTime = document.getElementById('time-to-game');
const gameControlContainer = document.getElementById('game-controls-container');
const otherPlayerScores = document.getElementById('other-player-score');

var inGame = false;
var startedGame = false;

let totalTime = 50;

async function interacted() {
    document.getElementById('interact-button').style.display = 'none';
    //if (prompt(`Hello welcome to the 'Anagram Online Experience.' Please read the rulbook carefully so you do not cheat. Please note that this may cost money thank you. Donate today yes ;). Ok bye. (Please click ok because then we can play music, sound like a deal?).`) != 'ahrjlrgnlfn') {
    //playLobbyMusic();
    //}
}

function update() {
    let seconds = totalTime - new Date().getTime() / 1000 % totalTime;
    document.getElementById('seconds').innerText = Math.round(seconds);

    if (!inGame) {
        gameControlContainer.style.display = 'none';

        gameTime.innerHTML = `
        <span class='strobe'>Game begins in</span> 
        <div id='timer-container'>
        <span class='segment'>${Math.floor((seconds - 1) / 10)}</span>
        <span class='segment'>${(Math.floor(seconds - 1) * 1) % 10}</span>
        <span class='segment dot'>.</span>
        <span class='segment' style='padding-right: 2.5vw'>${((Math.floor((seconds - 1) * 10)) % 10)}</span>
        </div>`;
        if (seconds <= 1) {
            inGame = true;
            startedGame = false;
            startGame();
        }

        if (seconds <= 4) {
            playBattleMusic();
            stopLobbyMusic();
            outputPanel.style.display = 'none';
        }
    } else {
        gameControlContainer.style.display = 'flex';

        gameTime.innerText = `${(Math.floor(seconds * 10) / 10 - 16).toFixed(1)}`;
        gameTime.innerHTML = `<div id='timer-container'>
        <span class='segment'>${Math.floor((seconds - 16) / 10)}</span>
        <span class='segment'>${(Math.floor(seconds - 16) * 1) % 10}</span>
        <span class='segment dot'>.</span>
        <span class='segment' style='padding-right: 2.5vw'>${((Math.floor((seconds - 16) * 10)) % 10)}</span>
        </div>`;

        if ((Math.floor(seconds * 10) / 10 - 15).toFixed(1) < 0) {
            gameTime.innerHTML = "START";
            startedGame = false;
        } else {
            startedGame = true;
        }
        if ((Math.floor(seconds * 10) / 10 - 16) < 8) {
            playPipe();
        }
        if ((Math.floor(seconds * 10) / 10 - 16) < 5) {
            playWrong();
        }
        if ((Math.floor(seconds * 10) / 10 - 16) < 0 && startedGame) {
            inGame = false;
            startedGame = false;
            stopBattleMusic();
            playLobbyMusic();
            playBuzzer();
            metalPipe.style.display = 'none';

            endGame();
        }
    }

    window.requestAnimationFrame(update);
}

update();

const wordInput = document.getElementById("word-input");
const givenLetters = document.getElementById("given-letters");
const timerElement = document.getElementById("timer");
var timeRemaining = 5;
const scoreText = document.getElementById("user-score-text");
const usedWordsText = document.getElementById("used-words-text");
var letters = [];
var usedWords = [];
var lengthScored = [100, 200, 400, 800, 1200, 2000, 3000, 4000];

const outputPanel = document.getElementById('win-banner');
outputPanel.style.display = 'none';
const winText = document.getElementById('win-output-text');

document.body.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (inGame) {
            checkWord(event);
        }
    }
    if (event.key === "Control" || event.key === "Alt") {
        wordInput.value = "";
    }
    if (event.key === "?") {
        playerName = prompt('Name?');
        playerRef.set({
            id: playerId,
            name: playerName,
            lobby: 1,
            score: 0,
            words: []
        });
    }
});

function checkWord(e) {
    e.preventDefault();

    let word = wordInput.value;

    if (word.length <= 2) {
        return;
    }
    gameTime.classList = "";

    if (checkIfWordExists(word)) {
        wordInput.value = "";
        usedWords.push(word);
        updateScore(word.length - 3);
        showUsedWords();

        if (word.length <= 3) {
            playRizz();
        } else if (word.length <= 5) {
            playAirHorn();
        } else {
            playHolyMoly();
        }

        gameTime.className = "correct";
    } else {
        gameTime.className = "wrong";
        console.warn(word + " is not a word :(");

        playWrong();
    }
}

function startGame() {
    metalPipe.style.display = 'none';
    wordInput.value = '';

    playerRef.set({
        id: playerId,
        name: playerName,
        lobby: 1,
        score: 0,
        words: []
    });

    usedWords = [];
    score = 0;
    scoreText.innerText = `Score: 0`;

    usedWordsText.innerText = "--- Used words will show up here ---";

    let minutes = new Date().getMinutes() * 100;

    let con = 'bbccddffgghhjkklllmmnnppqrrrrrssssssttttvwxyz';
    let vow = 'aaaaaeeeeeeeiiiiooouu';
    letters = [];

    for (let i = 0; i < Math.floor(mulberry32(minutes) * 3) + 3; i++) {
        letters.push(vow.charAt(Math.floor(mulberry32(minutes + i * 3) * vow.length)));
    }
    for (let i = 0; i < 8; i++) {
        letters.push(con.charAt(Math.floor(mulberry32(minutes + i * 5 + 100) * con.length)));
    }

    letters.sort(function (a, b) {
        return a === b ? 0 : a < b ? -1 : 1;
    });

    showLetters();
}

function showLetters() {
    givenLetters.innerText = "";
    letters.forEach(element => {
        givenLetters.innerText = givenLetters.innerText + "  " + element;
    });
}

function wordUpdated(e) {
    if (e == "Backspace") {
        return true;
    }
    return letters.includes(e) && (wordInput.value.split(e).length - 1 < getOccurrence(e));
}

function getOccurrence(value) {
    let count = 0;
    letters.forEach((v) => (v === value && count++));
    return count;
}

function checkIfWordExists(word) {
    return !usedWords.includes(word) && allWords.includes(word);
}

function updateScore(length) {
    score += lengthScored[length];
    scoreText.innerText = `Score: ${score}`;

    playerRef.set({
        id: playerId,
        name: playerName,
        lobby: 1,
        score: score,
        words: []
    });
}

function showUsedWords() {
    usedWordsText.innerText = "";

    usedWords.sort(function (a, b) {
        return a === b ? 0 : a < b ? -1 : 1;
    });

    usedWords.forEach(element => {
        usedWordsText.innerText = usedWordsText.innerText + ", " + element
    });

    usedWordsText.innerText = usedWordsText.innerText.substring(1);
}

function mulberry32(a) {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

async function endGame() {
    await sleep(1500);
    outputPanel.style.display = 'flex';

    let highest = score;
    let highestName = playerName;

    for (let i = 0; i < playersInMainLobby.length; i++) {
        if(parseInt(playersInMainLobby[i].score) > parseInt(highest)) {
            highest = playersInMainLobby[i].score;
            highestName = playersInMainLobby[i].name;
        }
    }

    winText.innerText = `${highestName} Wins`;
}