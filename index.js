const wordInput = document.getElementById("word-input");
const givenLetters = document.getElementById("given-letters");

const timerElement = document.getElementById("timer");
var timeRemaining = 5;

const scoreText = document.getElementById("score-text");
var score = 0;

const startButton = document.getElementById("start-button");
startButton.addEventListener('click', startGame);
const startPanel = document.getElementById("start-panel");
startPanel.style.display = "flex";

const endPanel = document.getElementById("end-panel");
endPanel.style.display = "none";
const finalPointsText = document.getElementById("final-points-text");
const againButton = document.getElementById("again-button");
againButton.addEventListener('click', startGame);

const usedWordsText = document.getElementById("used-words-text");

const title = document.getElementById("title");

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
    title.classList = "";

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

        title.className = "correct";
    } else {
        title.className = "wrong";
        console.warn(word + " is not a word :(");

        playWrong();
    }
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

function startGame() {
    startPanel.style.display = "none";
    endPanel.style.display = "none";

    timerElement.innerText = "60";
    timeRemaining = 60;

    scoreText.innerText = "0";
    score = 0;

    usedWords = [];

    usedWordsText.innerText = "--- Used words will show up here ---";

    let con = 'bbccddffgghhjkklllmmnnppqrrrrrssssssttttvwxyz';
    let vow = 'aeiou';
    letters = [];

    for (let i = 0; i < 3; i++) {
        letters.push(vow.charAt(Math.floor(Math.random() * vow.length)));
    }
    for (let i = 0; i < 7; i++) {
        letters.push(con.charAt(Math.floor(Math.random() * con.length)));
    }

    letters.sort(function (a, b) {
        return a === b ? 0 : a < b ? -1 : 1;
    });

    showLetters();

    var x = setInterval(function () {

        timeRemaining--;
        timerElement.innerText = timeRemaining;
        timerElement.style.boxShadow = `inset 0vh 0vh 0vh ${(timeRemaining / 60) * 3.75}vh black`;

        if(timeRemaining == 10) {
            playPipe();
        }

        if (timeRemaining <= 0) {
            playBuzzer();
            clearInterval(x);
            endPanel.style.display = "flex";
            timerElement.style.boxShadow = `inset 0vh 0vh 0vh 3.75vh black`;
            finalPointsText.innerText = `You scored ${score} points.`;

            if(score < 1000) {
                playWomp();
            }
        }
    }, 1000);
}

function checkIfWordExists(word) {
    return !usedWords.includes(word) && allWords.includes(word);
}

function updateScore(length) {
    score += lengthScored[length];
    scoreText.innerText = score;
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