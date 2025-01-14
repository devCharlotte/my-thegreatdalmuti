<!-- index.html -->
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>달무티 게임</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="game-container">
        <h1>달무티 게임</h1>
        <p>게임에 참여할 플레이어 수를 선택하세요:</p>
        <button onclick="startGame(3)">사용자 + 2명</button>
        <button onclick="startGame(4)">사용자 + 3명</button>
        <button onclick="showRules()">게임 규칙 보기</button>
        <div id="gameArea" style="display: none;">
            <p id="message">게임을 시작합니다!</p>
            <div class="player-hand" id="playerHand"></div>
            <ul id="gameLog"></ul>
        </div>
        <div id="rules" style="display: none;">
            <h2>달무티 게임 규칙</h2>
            <p>1. 각 플레이어는 섞인 카드 덱에서 카드를 나누어 가집니다.</p>
            <p>2. 게임은 계급이 낮은 카드(1이 가장 낮음)를 먼저 내는 순서로 진행됩니다.</p>
            <p>3. 한 턴에서 동일한 계급의 카드만 낼 수 있습니다.</p>
            <p>4. 가장 먼저 모든 카드를 소진한 플레이어가 승리합니다.</p>
            <button onclick="hideRules()">닫기</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>

/* styles.css */
@font-face {
    font-family: 'HakgyoansimNadeuriTTF-B';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2408-5@1.0/HakgyoansimNadeuriTTF-B.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
}

body {
    font-family: 'HakgyoansimNadeuriTTF-B', Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(120deg, #ff9a9e, #fad0c4);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.game-container {
    background: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    text-align: center;
    max-width: 400px;
    width: 90%;
}

h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 20px;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 10px;
}

p {
    font-size: 1.2rem;
    margin: 10px 0;
    color: #555;
}

button {
    font-family: inherit;
    font-size: 1.2rem;
    padding: 10px 20px;
    background-color: #ff79c6;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background-color: #ff47b2;
    box-shadow: 0 4px 10px rgba(255, 121, 198, 0.5);
}

.player-hand {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
}

.card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    margin: 5px;
    font-size: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.card:hover {
    background: #ff9a9e;
    color: white;
}

#message {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ff5555;
    margin-top: 15px;
}

ul {
    list-style: none;
    padding: 0;
    margin-top: 20px;
}

li {
    background-color: #ffe6f2;
    margin: 5px 0;
    padding: 10px;
    border-radius: 8px;
    font-size: 1.1rem;
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* script.js */
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

    for (let i = 1; i < players.length; i++) {
        if (players[i].length > 0) {
            const computerCard = players[i].shift();
            logMessage(`플레이어 ${i}가 ${computerCard} 카드를 냈습니다.`);
        }
    }

    currentTurn++;
    if (playerHand.length === 0) {
        logMessage('사용자가 승리했습니다!');
    } else if (players.slice(1).every(p => p.length === 0)) {
        logMessage('컴퓨터가 승리했습니다!');
    } else {
        logMessage('다음 턴입니다.');
    }
}

function showRules() {
    document.getElementById('rules').style.display = 'block';
}

function hideRules() {
    document.getElementById('rules').style.display = 'none';
}
