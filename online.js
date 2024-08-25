var score = 0;

// Import the functions you need from the SDKs you need
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCM2QcOaIauTbSKQg2YvdYi6PM-1VXTx5Y",
    authDomain: "anagrams-55e69.firebaseapp.com",
    databaseURL: "https://anagrams-55e69-default-rtdb.firebaseio.com",
    projectId: "anagrams-55e69",
    storageBucket: "anagrams-55e69.appspot.com",
    messagingSenderId: "692002426160",
    appId: "1:692002426160:web:41270d332c301b98140cf5"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);

var playerId;
var playerRef;
var players = {};
var playerElements = {};

var playersInMainLobby = [];
var previousScores = [];
var previousPlayers = [];

var playerName = localStorage.getItem("name");
while (playerName == null) {
    //prompt("What would you like to be know as?")
    //playerName = "Anagrammar";
    playerName = Math.round(Math.random() * 100);
}

firebase.auth().onAuthStateChanged((user) => {
    console.log(user);
    if (user) {
        console.warn("User logged in");

        playerId = user.uid;
        playerRef = firebase.database().ref(`players/${playerId}`);

        playerRef.set({
            id: playerId,
            name: playerName,
            lobby: 1,
            score: score,
            words: []
        });

        playerRef.onDisconnect().remove();

        //if(confirm("Start game?")) {
        initGame();
        //}
    } else {
        console.warn("User logged out");
    }
});


firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.error(errorCode, errorMessage);
});


function initGame() {
    const allPlayersRef = firebase.database().ref(`players`);

    allPlayersRef.on("value", (snapshot) => {
        playersInMainLobby = [];
        players = snapshot.val() || {};
        Object.keys(players).forEach((key) => {
            const characterState = players[key];
            console.log(characterState);
            if (characterState.name != playerName) {
                playersInMainLobby.push(characterState);
            }
        });

        // If two or more players are in main lobby, start a game
        if (playersInMainLobby.length >= 20000) {
            players[playerId].lobby = Object.keys(players).length;
            console.warn("Created lobby " + players[playerId].lobby);
            playerRef.set(players[playerId]);
        }

        updatePlayerText();
    });
    allPlayersRef.on("child_added", (snapshot) => {
        const addedPlayer = snapshot.val();
        console.log(addedPlayer);
    });
}

function updatePlayerText() {
    let newScores = [];
    let newPlayers = [];
    let playerTexts = document.getElementsByClassName('player-text');
    for (let i = 0; i < playerTexts.length; i++) {
        playerTexts[i].parentNode.style.display = 'none';
    }
    for (let i = 0; i < playersInMainLobby.length; i++) {
        playerTexts[i].innerHTML = playersInMainLobby[i].name;
        playerTexts[i].parentElement.children[1].innerHTML = playersInMainLobby[i].score;
        playerTexts[i].parentNode.style.display = 'flex';

        if(previousPlayers.includes(playersInMainLobby[i].name)) {
            if(previousScores[previousPlayers.indexOf(playersInMainLobby[i].name)] != playersInMainLobby[i].score) {
                //playerTexts[i].className = 'player-text';
                playerTexts[i].classList.add('green-strobe');
                playerTexts[i].style.animation = 'none';
                playerTexts[i].offsetHeight; /* trigger reflow */
                playerTexts[i].style.animation = null; 
            }
        }

        newScores.push(playersInMainLobby[i].score);
        newPlayers.push(playersInMainLobby[i].name);
    }

    previousPlayers = newPlayers;
    previousScores = newScores;
}