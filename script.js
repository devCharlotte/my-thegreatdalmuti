let players = [];
let currentTurn = 0;

function createDeck() {
    const deck = [];
    for (let rank = 1; rank <= 12; rank++) {
        for (let count = 0; count < rank; count++) {
            deck.push(rank);
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

function distributeCards(deck, playerCount) {
    const players = Array(playerCount).fill().map(() => []);
    let currentIndex = 0;
    while (deck.length) {
        players[currentIndex % playerCount].push(deck.pop());
        currentIndex++;
    }
    return players;
}

function renderHand(hand) {
    const handDiv = document.getElementById('playerHand');
    handDiv.innerHTML = hand.map((card, index) => `<div class='card' onclick='playCard(${index})'>${card}</div>`).join('');
}

function updateGameInfo() {
    document.getElementById('remainingCards').textContent = players[0].length;
    document.getElementById('turnCount').textContent = currentTurn;
}

function logTurn(playerCards) {
    const logBody = document.getElementById('logBody');
    const row = document.createElement('tr');
    playerCards.forEach(cards => {
        const cell = document.createElement('td');
        cell.textContent = cards.join(', ') || '-';
        row.appendChild(cell);
    });
    logBody.appendChild(row);
}

function startGame(playerCount) {
    const deck = createDeck();
    players = distributeCards(deck, playerCount);
    document.querySelector('.game-container > p').style.display = 'none';
    document.querySelectorAll('button').forEach(button => button.style.display = 'none');
    document.getElementById('gameArea').style.display = 'block';
    renderHand(players[0]);
    updateGameInfo();
    logTurn(Array(playerCount).fill([]));
}

function playCard(index) {
    const player
