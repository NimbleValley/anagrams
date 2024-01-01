readTextFile("words.txt");
var allWords;

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                allWords = rawFile.responseText.split("\n");
                allWords = allWords.map(function (el) {
                    return el.trim();
                });
            }
        }
    }
    rawFile.send(null);
}