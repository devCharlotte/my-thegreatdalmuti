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

function logMessage(message) {
    const log = document.getElementById('gameLog');
    const logItem = document.createElement('li');
    logItem.textContent = message;
    log.appendChild(logItem);
}

function startGame(playerCount) {
    const deck = createDeck();
    players = distributeCards(deck, playerCount);
    document.querySelector('.game-container > p').style.display = 'none';
    document.querySelectorAll('button').forEach(button => button.style.display = 'none');
    document.getElementById('gameArea').style.display = 'block';
    renderHand(players[0]);
    logMessage('게임 시작! 당신의 차례입니다.');
}

function playCard(index) {
    const playerHand = players[0];
    const card = playerHand.splice(index, 1)[0];
    renderHand(playerHand);
    logMessage(`사용자가 ${card} 카드를 냈습니다.`);

    // 간단한 컴퓨터 턴 처리
    for (let i = 1; i < players.length; i++) {
        if (players[i].length > 0) {
            const computerCard = players[i].shift();
            logMessage(`플레이어 ${i}가 ${computerCard} 카드를 냈습니다.`);
        }
    }

    // 턴 종료 후 상태 업데이트
    currentTurn++;
    if (playerHand.length === 0) {
        logMessage('사용자가 승리했습니다!');
    } else if (players.slice(1).every(p => p.length === 0)) {
        logMessage('컴퓨터가 승리했습니다!');
    } else {
        logMessage('다음 턴입니다.');
    }
}
