//globals
var dictionary = ["javascript","hangman","banana","GitHub","jQuery","canvas","cookie","grades","WCTC","Quizzes","function","Objects"];
//picked word player has to guess
var word = "";
//picked word as displayed during game
var hiddenWord = [];
//number of wrong guesses left until game over
var numGuesses = 6;
//array for storing previous guesses
var guessed = [""];
//number of correct letters in word found
var numFound = 0;
//game state for checking against
var gameOver = false;
//counter that is inverse of number of guesses left, to change picture
var gallows = 0;

//pick a word, update display spans, bind calc() to form submit event
$(document).ready(function() {
    word = pickWord();
    $("#word").text(hiddenWord.join(" "));
    $("#numLeft").text(numGuesses);
    $("form").submit(calc);
});

//meat + potatoes
function calc(e) {
    e.preventDefault();
    //if somehow this gets triggered during the inbetween state of game over but not restarted, die honorably
    if(gameOver) return;
    //grab input, clear display <input>
    var g = $("#guess").val();
    $("#guess").val("");
    //if previously guessed, die honorably
    //otherwise add guess to guessed array
    if (guessed.includes(g)) {
        return;
    } else guessed.push(g);
    //setup check to see if guess is good or bad
    var goodGuess = false;

    //search word for guessed letter
    //if found, update displayed word with guessed letter, flip goodGuess check
    for(var i in word) {
        if(g.toUpperCase() == word[i].toUpperCase()) {
            numFound++;
            hiddenWord[i] = `${word[i]}`;
            $("#word").text(hiddenWord.join(" "));
            goodGuess = true;
        }
    }
    //i didn't want to just have words with < 6 letters in them so,
    //had to not count good guesses against player
    if(!goodGuess) {
        gallows++;
        numGuesses--;
    }
    //update image
    $("#gallows").attr('src',`gallows${gallows}.png`);

    //check for win/loss conditions
    //... i think this replaces the boolean i have, not sure
    if(numFound == word.length) endGame("win");
    else if (numGuesses == 0) endGame("lose");
    //update number of guesses left
    $("#numLeft").text(numGuesses);
}
//disable <input> , output win / loss,
//swap the submit function to restartGame() instead of calc();
function endGame(result) {
    console.log("end game:"+result);
    if(result=="win") var msg = "You Win!";
    else var msg = "You lose!";
    $("#guess").val("");
    $("#guess").prop('disabled',true);
    $("form").unbind('submit');
    $("form").submit(restartGame);
    $("#btn").text("Restart");
    $("#winlose").text(msg);
    $("#winlose").addClass(result);

    //might be vestigial
    gameOver = true;
}
//set everything back to new game, pick a new word, wipe globals
function restartGame(e) {
    e.preventDefault();
    console.log("restarting game");
    word = "";
    hiddenWord = [];
    numGuesses = 6;
    guessed = [""];
    numFound = 0;
    gameOver = false;
    gallows = 0;
    $("form").unbind('submit');
    $("form").submit(calc);
    $("#btn").text("Guess");
    $("#guess").prop('disabled',false);
    $("#numLeft").text(numGuesses);
    word = pickWord();
    $("#word").text(hiddenWord.join(" "));
    $("#winlose").text("");
    $("#winlose").removeClass();
    $("#gallows").attr('src',`gallows${gallows}.png`);
}
function pickWord() {
    //grab random number, use dictionary array to select a word
    //update hidden word output variable
    var i = Math.floor(Math.random()*12);
    word = dictionary[i];
    console.log(`pickWord->${word}`);
    for(var i in word) {
        hiddenWord[i] = "-";
    }
    return word;
}