const gameTime = document.getElementById('time-to-game');

const gameControlCOntainer = document.getElementById('game-controls-container');

var inGame = false;
var startedGame = false;

let totalTime = 25;

function update() {
    let seconds = totalTime - new Date().getTime() / 1000 % totalTime;
    document.getElementById('seconds').innerText = Math.round(seconds);

    if(!inGame) {
        gameControlCOntainer.style.display = 'none';

        gameTime.innerText = `Game begins in ${(Math.round(seconds * 10) / 10 - 1).toFixed(1)}`;
        if(seconds <= 1) {
            inGame = true;
            startedGame = false;
            startGame();
        }
    } else {
        gameControlCOntainer.style.display = 'flex';

        gameTime.innerText = `${(Math.round(seconds * 10) / 10 - 16).toFixed(1)}`;
        if((Math.round(seconds * 10) / 10 - 15).toFixed(1) < 0) {
            gameTime.innerText = "START";
            startedGame = false;
        } else {
            startedGame = true;
        }
        if((Math.round(seconds * 10) / 10 - 16) < 0 && startedGame) {
            inGame = false;
            startedGame = false;
            console.warn("OK.");
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
var score = 0;
const usedWordsText = document.getElementById("used-words-text");
var letters = [];
var usedWords = [];
var lengthScored = [100, 200, 400, 800, 1200, 2000, 3000, 4000];

wordInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        checkWord(event);
    }
    if (event.key === "Control" || event.key === "Alt") {
        wordInput.value = "";
    }
});

function checkWord(e) {
    e.preventDefault();

    let word = wordInput.value;

    if (word.length <= 2) {
        return;
    }
    gameTime.classList = "";

    if(checkIfWordExists(word)) {
        wordInput.value = "";
        usedWords.push(word);
        updateScore(word.length-3);
        showUsedWords();

        if(word.length <= 3) {
            playRizz();
        } else if(word.length <= 5) {
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
    usedWords = [];
    score = 0;
    scoreText.innerText = `Score: 0`;

    usedWordsText.innerText = "--- Used words will show up here ---";

    let con = 'bbccddffgghhjkklllmmnnppqrrrrrssssssttttvwxyz';
    let vow = 'aaaaaeeeeeeeeiiiiooouu';
    letters = [];

    for (let i = 0; i < Math.floor(Math.random() * 4) + 3; i++) {
        letters.push(vow.charAt(Math.floor(Math.random() * vow.length)));
    }
    for (let i = 0; i < 7; i++) {
        letters.push(con.charAt(Math.floor(Math.random() * con.length)));
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