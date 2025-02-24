
// Establishing The Elements
const game = document.querySelector('.game-container');
const intro = document.querySelector('.intro')


const playerCards = document.getElementById('player-cards');
const dealerCards = document.getElementById('dealer-cards');

const playerTotal = document.getElementById('player-total');
const dealerTotal = document.getElementById('dealer-total');

const startBtn = document.getElementById('start-button');
const hitBtn = document.getElementById('hit-button');
const standBtn = document.getElementById('stand-button');
const playAgainBtn = document.getElementById('play-again-button');
const placeBetBtn = document.getElementById('place-bet-button');
const dealCardsButton = document.getElementById('deal-cards')
const betLabel = document.getElementById('bet-label')

const playerBankDisplay = document.getElementById('player-bank');
const betAmountSelect = document.getElementById('bet-amount');
const messageArea = document.getElementById('message');

// The Game
let deck = [];
let playerHandArray = [];
let dealerHandArray = [];
let playerBank = 100;
let currentBet = 0;


hitBtn.style.display = 'none'
standBtn.style.display = 'none'

createDeck();
shuffleDeck();

function createDeck(){
    const values = [2,3,4,5,6,7,8,9,10,10,10,10,11];

        for (let i = 0; i < 4; i++) {
            deck = deck.concat(values);
        }
};

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [deck[i], deck[j]] = [deck[j], deck[i]]; 
    }
};



function drawCards() {
    if (deck.length < 10){
        deck = [];
        createDeck()
        shuffleDeck()
    }
    return deck.pop();
}

function dealCards(){
    let playerFirstCard = drawCards();
    playerHandArray.push(playerFirstCard);
    playerCards.innerHTML = playerHandArray.join(', ')

    let dealerFirstCard = drawCards();
    let dealerSecondCard = drawCards();
    dealerHandArray.push(dealerFirstCard, dealerSecondCard);
    dealerCards.innerHTML = `${dealerFirstCard}, ?`

    const total = calculateTotal(playerHandArray);
    playerTotal.innerHTML = `Total: ${total}`;

    
    if (total === 21) {
        messageArea.textContent = `You've Got BLACKJACK! You win ${currentBet * 1.5}!`;
        playAgainBtn.style.display = 'inline-block';
        hitBtn.style.display = 'none';
        standBtn.style.display = 'none';
        playerBank += currentBet * 2.5;
        playerBankDisplay.innerHTML = playerBank;
    } else {
        
        hitBtn.style.display = 'inline-block';
        standBtn.style.display = 'inline-block';
    }
}



function calculateTotal(handArray) {
    return handArray.reduce((total, card) => total + card, 0);
}

placeBetBtn.addEventListener('click', () => {
    currentBet = parseInt(betAmountSelect.value);
    if (playerBank >= currentBet) {
        playerBank -= currentBet;
        playerBankDisplay.innerHTML = playerBank;
        placeBetBtn.style.display = 'none';
        betAmountSelect.style.display = 'none';
        betLabel.textContent = `Current Bet: ${currentBet}`;

        
        startBtn.style.display = 'inline-block';
    } else {
        messageArea.textContent = 'Not enough coins to place this bet.';
    }
});

dealCardsButton.addEventListener('click', () => {

    if(currentBet > 0){
     dealCards()
     dealCardsButton.style.display = 'none'

    } else {
        messageArea.innerHTML = 'Please place a bet before playing'
    }

    
})

startBtn.addEventListener('click', () => {
    startBtn.remove(); 
    game.style.display = 'block'
    intro.style.display = 'none'
});

hitBtn.addEventListener('click', () => {
    
    standBtn.disabled = false;
    let newCard = drawCards();
    playerHandArray.push(newCard);
    playerCards.innerHTML = playerHandArray.join(', ');

 
    const total = calculateTotal(playerHandArray);
    playerTotal.innerHTML = `Total: ${total}`;

    if (total > 21) {
        hitBtn.disabled = true;
        standBtn.disabled = true;
        messageArea.textContent = 'Too Many!';
        playAgainBtn.style.display = 'inline-block';
    } else if (total === 21){
        messageArea.textContent = `You've Got BLACKJACK! You win ${currentBet * 1.5}!`
        playAgainBtn.style.display = 'inline-block';
        hitBtn.disabled = true;
        standBtn.disabled = true;
        playerBank += currentBet * 2.5;
        playerBankDisplay.innerHTML = playerBank;
    }



});

standBtn.addEventListener('click', () => {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealerPlays();
});

function dealerPlays() {
    let currentDealerTotal = calculateTotal(dealerHandArray);
    
    dealerCards.innerHTML = dealerHandArray.join(', ');
    dealerTotal.innerHTML = `Total: ${currentDealerTotal}`;

    function drawDealerCard() {
        
        if (currentDealerTotal < 17) {
            
            setTimeout(() => {
                let newCard = drawCards();
                dealerHandArray.push(newCard);
                dealerCards.innerHTML = dealerHandArray.join(', ');

                currentDealerTotal = calculateTotal(dealerHandArray);
                dealerTotal.innerHTML = `Total: ${currentDealerTotal}`;

                
                drawDealerCard();
            }, 1500); 
        } else {
            determineWinner(currentDealerTotal);
        }
    }

    drawDealerCard(); 
}



function determineWinner(currentDealerTotal) {
    const playerTotalValue = calculateTotal(playerHandArray);
    if (currentDealerTotal > 21) {
        messageArea.textContent = `Dealer busts! You Win ${currentBet}!`;
        playerBank += currentBet * 2;
    } else if (playerTotalValue > currentDealerTotal) {
        messageArea.textContent = `You win ${currentBet}!`;
        playerBank += currentBet * 2;
    } else if (playerTotalValue < currentDealerTotal) {
        messageArea.textContent = `Dealer wins! You Lose ${currentBet}!`;
    }  else {
        messageArea.textContent = "It's a tie!";
        playerBank += currentBet; 
    }
    playerBankDisplay.innerHTML = playerBank;
    playAgainBtn.style.display = 'inline-block';
    hitBtn.style.display = 'none';
    standBtn.style.display = 'none';


    
}

playAgainBtn.addEventListener('click', () => {
    
    dealCardsButton.style.display = 'inline-block'
    hitBtn.style.display = 'none'
    standBtn.style.display = 'none'
    playAgainBtn.style.display = 'none';

    betLabel.textContent = `Choose Your Bet: `
    currentBet = 0;

    playerHandArray = [];
    dealerHandArray = [];

    playerCards.innerHTML = '';
    dealerCards.innerHTML = '';
    playerTotal.innerHTML = '';
    dealerTotal.innerHTML = '';
    messageArea.textContent = '';

    hitBtn.disabled = false;
    standBtn.disabled = true;

    placeBetBtn.style.display = 'inline-block';
    betAmountSelect.style.display = 'inline-block';

    if(playerBank === 0){
        alert('You Have No Coins Left! But hope you had fun!')

    }
});

