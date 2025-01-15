let players = [];
let currentTurn = 0;
let lastPlayedCards = [];

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startGame3").addEventListener("click", () => startGame(3));
    document.getElementById("startGame4").addEventListener("click", () => startGame(4));
    document.getElementById("showRules").addEventListener("click", showRules);
    document.getElementById("hideRules").addEventListener("click", hideRules);
    document.getElementById("playCardsButton").addEventListener("click", playSelectedCards);
});

function createDeck() {
    const deck = [];
    const maxRank = 12;

    for (let rank = 1; rank <= maxRank; rank++) {
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

    players.forEach(hand => hand.sort((a, b) => a - b));
    return players;
}

function renderHand(hand) {
    const handDiv = document.getElementById("playerHand");
    handDiv.innerHTML = hand
        .map((card, index) => `<div class="card" data-index="${index}" data-value="${card}">${card}</div>`)
        .join("");

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", () => card.classList.toggle("selected"));
    });
}

function playSelectedCards() {
    const selectedCards = document.querySelectorAll(".card.selected");
    if (selectedCards.length === 0) {
        alert("카드를 선택하세요.");
        return;
    }

    const selectedValues = Array.from(selectedCards).map(card => parseInt(card.dataset.value));
    const isValid = validatePlay(selectedValues);
    if (!isValid) {
        alert("규칙에 맞지 않는 카드입니다.");
        return;
    }

    selectedValues.forEach(value => {
        const index = players[0].indexOf(value);
        if (index !== -1) players[0].splice(index, 1);
    });

    lastPlayedCards = selectedValues;
    processTurn(selectedValues);
    renderHand(players[0]);
    updateGameInfo();
}

function validatePlay(cards) {
    if (cards.length === 0) return false;

    const rank = cards[0];
    if (!cards.every(card => card === rank)) return false;

    if (lastPlayedCards.length > 0 && rank >= lastPlayedCards[0]) return false;

    return true;
}

function processTurn(playerCards) {
    const turnLog = [playerCards];

    for (let i = 1; i < players.length; i++) {
        const computerCards = computerPlay();
        turnLog.push(computerCards);
        lastPlayedCards = computerCards;
    }

    logTurn(turnLog);
    currentTurn++;
    checkGameEnd();
}

function computerPlay() {
    const hand = players[currentTurn % players.length];
    const playableCards = hand.filter(card => lastPlayedCards.length === 0 || card < lastPlayedCards[0]);

    if (playableCards.length === 0) return [];

    const selectedRank = Math.min(...playableCards);
    const selectedCards = hand.filter(card => card === selectedRank);
    players[currentTurn % players.length] = hand.filter(card => card !== selectedRank);

    return selectedCards;
}

function checkGameEnd() {
    if (players[0].length === 0) {
        alert("사용자가 승리했습니다!");
    } else if (players.slice(1).every(p => p.length === 0)) {
        alert("컴퓨터가 승리했습니다!");
    }
}

function updateGameInfo() {
    document.getElementById("remainingCards").textContent = players[0].length;
    document.getElementById("turnCount").textContent = currentTurn;
}

function logTurn(playerCards) {
    const logBody = document.getElementById("logBody");
    const row = document.createElement("tr");
    playerCards.forEach(cards => {
        const cell = document.createElement("td");
        cell.textContent = cards.join(", ") || "-";
        row.appendChild(cell);
    });
    logBody.appendChild(row);
}

function startGame(playerCount) {
    const deck = createDeck();
    players = distributeCards(deck, playerCount);
    currentTurn = 0;
    lastPlayedCards = [];

    document.querySelector(".game-container > p").style.display = "none";
    document.querySelectorAll("button").forEach(button => button.style.display = "none");
    document.getElementById("gameArea").style.display = "block";

    renderHand(players[0]);
    updateGameInfo();
    logTurn(Array(playerCount).fill([]));
}

function showRules() {
    document.getElementById("rules").style.display = "block";
}

function hideRules() {
    document.getElementById("rules").style.display = "none";
}
