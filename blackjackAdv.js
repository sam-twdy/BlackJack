let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck;

let yourBankroll = 100;
let bet = 0;
let restoreBet = 0;

let canHit = true; //while yourSum <= 21
let canRaise = true;
let canDrop = true;

var mouseIsDown = false;

window.onload = function() {
    buildDeck();
    shuffleDeck();
    placeBet();
    let playButton = document.querySelector('.play-container');
    playButton.style.visibility = 'hidden';
    
    document.getElementById("place-bet").style.color = "black";
    document.getElementById("place-bet").style.backgroundColor = "white";
    document.getElementById("place-bet").style.cursor = "pointer";
    document.getElementById("hit").style.color = "dimgray";
    document.getElementById("hit").style.backgroundColor = "lightgray";
    document.getElementById("hit").style.cursor = "default";
    document.getElementById("stay").style.color = "dimgray";
    document.getElementById("stay").style.backgroundColor = "lightgray";
    document.getElementById("stay").style.cursor = "default";

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
}

//Deck Builder
function buildDeck() {
    const suit = ['C', 'S', 'D', 'H'];
    const val = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];

    for (let i = 0; i < suit.length; i++) {
        for (let j = 0; j < val.length; j++) {
            deck.push(val[j] + '-' + suit[i]);
        }
    }
    //console.log(deck);
}

//Shuffler
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck [i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

//Betting
function raise() {
    if (bet === yourBankroll) {
        return;
    }
    else if (!canRaise) {
        return;
    }
    else {
    bet += 10;
    document.getElementById("your-bankroll").innerText = '$' + yourBankroll;
    document.getElementById("bet").innerText = '$' + bet;
    }
}

function drop() {
    if (bet === 0) {
        return;
    }
    else if (!canDrop) {
        return;
    }
    else {
    bet -= 10;
    document.getElementById("your-bankroll").innerText = '$' + yourBankroll;
    document.getElementById("bet").innerText = '$' + bet;
    }
}

//Game
function startGame() {
    restoreBet = bet;
    yourBankroll -= bet;

    document.getElementById("place-bet").style.color = "dimgray";
    document.getElementById("place-bet").style.backgroundColor = "lightgray";
    document.getElementById("place-bet").style.cursor = "default";
    document.getElementById("stay").style.color = "black";
    document.getElementById("stay").style.backgroundColor = "white";
    document.getElementById("stay").style.cursor = "pointer";
    document.getElementById("hit").style.color = "black";
    document.getElementById("hit").style.backgroundColor = "white";
    document.getElementById("hit").style.cursor = "pointer";

    document.getElementById("your-bankroll").innerText = '$' + yourBankroll - bet;
    document.getElementById("bet").innerText = '$' + bet;
    //let playButton = document.querySelector('.play-container');
    //playButton.style.visibility = 'hidden';

    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    console.log('hidden: ' + hidden);

    //Dealer Draws
    for (let i = 0; i < 1; i++) {
        let cardImg = document.createElement("img"); //creates img tag
        let card = deck.pop(); //retrieves card from deck
        cardImg.src = "cards/" + card + ".png"; //sets image for tag
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById('dealer-cards').append(cardImg);
    }
    console.log('dealer sum: ' + dealerSum);
    document.getElementById("dealer-sum").innerText = dealerSum - getValue(hidden);

    //Player Draws
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img"); 
        let card = deck.pop();
        cardImg.src = "cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById('your-cards').append(cardImg);
        //Win Condition
        if (reduceAce(yourSum, yourAceCount) === 21) {
            stay();
        }
    }
    //yourSum = reduceAce(yourSum, yourAceCount);
    //console.log(yourSum);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    //document.getElementById("raise").addEventListener("click", raise);
    //document.getElementById("drop").addEventListener("click", drop);
    document.getElementById("play").addEventListener("click", play);
    document.getElementById("new-game").addEventListener("click", newGame);
    //document.getElementById("place-bet").addEventListener("click", placeBet);
}

//Dealer Draws Again
function dealerDraws () {
    while (dealerSum < 17) {
        let cardImg = document.createElement("img"); //creates img tag
        let card = deck.pop(); //retrieves card from deck
        cardImg.src = "cards/" + card + ".png"; //sets image for tag
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById('dealer-cards').append(cardImg);
    }
}

//Win Conditions
function winCon () {
    let message = '';
    let playButton = document.querySelector('.play-container');
    playButton.style.visibility = 'visible';
    let nextRound = document.getElementById('play');
    nextRound.style.visibility = 'hidden';
    let newBank = document.getElementById('new-game');
    newBank.style.visibility = 'hidden';
    if (yourSum > 21) {
        yourBankroll;
        message = 'You Lose.';
        dynamicButtons ();
    }
    else if (dealerSum > 21) {
        yourBankroll += 2 * bet;
        message = 'You Win!';
        dynamicButtons ();
    }
    else if (yourSum === dealerSum) {
        yourBankroll += bet;
        message = 'Tie.';
        dynamicButtons ();
    }
    else if (yourSum > dealerSum) {
        yourBankroll += 2 * bet;
        message = 'You Win!';
        dynamicButtons ();
    }
    else if (yourSum < dealerSum) {
        yourBankroll;
        message = 'You Lose.';
        dynamicButtons ();
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    document.getElementById("your-bankroll").innerText = '$' + yourBankroll;
}


//Hit button
function hit() {
    if (!canHit) {
        return;
    }
    let cardImg = document.createElement("img"); 
    let card = deck.pop();
    cardImg.src = "cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById('your-cards').append(cardImg);
    //Win Conditions
    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        dealerDraws();
        winCon();
    }
    if (reduceAce(yourSum, yourAceCount) === 21) {
        canHit = false;
        dealerDraws();
        winCon();
    }
}

//Stay Button
function stay() {
    if (!canHit) {
        return;
    }

    dealerDraws();

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);
    document.getElementById("your-sum").innerText = yourSum;

    canHit = false;
    
    document.getElementById("hidden").src = "cards/" + hidden + ".png"; //replaces facedown card

    //Win Conditions
    winCon()
    
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("your-bankroll").innerText = '$' + yourBankroll;
}

function dynamicButtons () {
    //console.log('bankroll: ' + yourBankroll);
    //console.log('bet: ' + bet);
    if (yourBankroll !== 0) {
    let nextRound = document.getElementById('play');
    nextRound.style.visibility = 'inherit';
    }
    else {
    let newBank = document.getElementById('new-game');
    newBank.style.visibility = 'inherit';
    }
}

//Card Value Conversion
function getValue(card) {
    let data = card.split('-');
    let value = data[0];

    if (isNaN(value)) {
        if (value =="A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

//Ace Count
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

//Reduce Ace
function reduceAce(yourSum, yourAceCount) {
    while (yourSum > 21 && yourAceCount > 0) {
        yourSum -= 10;
        yourAceCount -= 1;
        document.getElementById("your-sum").innerText = yourSum;
    }
    document.getElementById("your-sum").innerText = yourSum;
    return yourSum;
}

//Play Button
function play() {
    if (canHit) {
        return;
    }
    reset();
    dealerSum = 0;
    yourSum = 0;

    dealerAceCount = 0;
    yourAceCount = 0;

    hidden = [];
    deck = [];

    bet = 0;

    canHit = true;
    canRaise = true;
    canDrop = true;
    document.getElementById("results").innerText = '';

    let playButton = document.querySelector('.play-container');
    playButton.style.visibility = 'hidden';

    document.getElementById("place-bet").style.color = "black";
    document.getElementById("place-bet").style.backgroundColor = "white";
    document.getElementById("place-bet").style.cursor = "pointer";
    document.getElementById("hit").style.color = "dimgray";
    document.getElementById("hit").style.backgroundColor = "lightgray";
    document.getElementById("hit").style.cursor = "default";
    document.getElementById("stay").style.color = "dimgray";
    document.getElementById("stay").style.backgroundColor = "lightgray";
    document.getElementById("stay").style.cursor = "default";

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;

    buildDeck();
    shuffleDeck();
    placeBet();
}

function reset() {
    document.getElementById("your-cards").innerHTML = "";
    document.getElementById("dealer-cards").innerHTML = "";
    let hiddenCard = document.createElement("img");
    hiddenCard.src = "cards/BACK.png";
    document.getElementById('dealer-cards').append(hiddenCard);
    hiddenCard.setAttribute("id", "hidden");
}

function newGame() {
    reset();
    dealerSum = 0;
    yourSum = 0;

    dealerAceCount = 0;
    yourAceCount = 0;

    hidden = [];
    deck = [];

    yourBankroll = 100;
    bet = 0;

    canHit = true;
    canRaise = true;
    canDrop = true;
    document.getElementById("results").innerText = '';

    let playButton = document.querySelector('.play-container');
    playButton.style.visibility = 'hidden';

    document.getElementById("place-bet").style.color = "black";
    document.getElementById("place-bet").style.backgroundColor = "white";
    document.getElementById("place-bet").style.cursor = "pointer";
    document.getElementById("hit").style.color = "dimgray";
    document.getElementById("hit").style.backgroundColor = "lightgray";
    document.getElementById("hit").style.cursor = "default";
    document.getElementById("stay").style.color = "dimgray";
    document.getElementById("stay").style.backgroundColor = "lightgray";
    document.getElementById("stay").style.cursor = "default";

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;

    buildDeck();
    shuffleDeck();
    placeBet();
}

//Place Bet
function placeBet () {
    if (!canRaise) {
        return;
    }
    else if (bet === 0) {
        canHit = false;
    }
   else if (bet > 0) {
        canRaise = false;
        canDrop = false;
        canHit = true;
        startGame();
    }
    restore();
    document.getElementById("raise").addEventListener("click", raise);
    document.getElementById("drop").addEventListener("click", drop);
    document.getElementById("your-bankroll").innerText = '$' + yourBankroll;
    document.getElementById("bet").innerText = '$' + bet;
    document.getElementById("place-bet").addEventListener("click", placeBet);
}

function restore() {
    console.log('restore: ' + restoreBet);
    console.log('bankroll: ' + yourBankroll);
    console.log('bet: ' + bet);
    if (restoreBet <= yourBankroll) {
        bet = restoreBet;
    }
}