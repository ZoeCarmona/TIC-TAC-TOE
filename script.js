const cells = document.querySelectorAll('.cell');
const option = document.querySelector('#option');
const xPlayer = document.querySelector('#player1Symbol');
const oPlayer = document.querySelector('#player2Symbol');
const level_1 = document.querySelector('#level-1');
const level_2 = document.querySelector('#level-2');
const level_3 = document.querySelector('#level-3');
const restartGame = document.querySelector('#restartGame');
let def = document.getElementById('level-definition');

// Initializing variables for game
let player = 'X';
let level = '1';
let isPauseGame = false;
let isGameStart = false;

// Choose level and desription for each level
function chooseLevel(selectedLevel){
    if(!isGameStart){
        level = selectedLevel;
        if(level == '1'){
            level_1.classList.add('level-active');
            level_2.classList.remove('level-active');
            level_3.classList.remove('level-active');
            def.innerText = 'On this level, the machine follows the Tic-Tac-Toe rules and makes a random move on the board, so you’re always gonna win!!!';
        } else if (level == '2'){
            level_1.classList.remove('level-active');
            level_2.classList.add('level-active');
            level_3.classList.remove('level-active');
            def.innerText = 'On this level, the machine tries to prevent the opponent from winning and/or seeks to win, so be careful!!';
        } else {
            level_1.classList.remove('level-active');
            level_2.classList.remove('level-active');
            level_3.classList.add('level-active');
            def.innerText = 'On this level, the machine attempts to make moves in positions that allow it to get closer to winning, think wisely!!';
        }
    }
}

// Array for winning options (all the locations)
const board = [
    '', '', '', '', 
    '', '', '', '', 
    '', '', '', '', 
    '', '', '', '', 
];

const winCondition = [
    // Rows
    [0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15],
    // Columns
    [0,4,8,12], [1,5,9,13], [2,6,10,14], [3,7,11,15],  
    //Diagonal 1 (top left to bottom right)
    [0,5,10,15], [3,6,9,12]
];

// Click 
cells.forEach( (cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index))
});

function tapCell(cell, index){
    // console.log(cell);
    // console.log('Index: '+index);
    if ((cell.textContent == '') & (!isPauseGame)){
        isGameStart = true;
        updateCell(cell, index);
        // Levels
        if(!checkWinner()){
            changePlayer()

            if(level == '1'){
                levelOneGame();
            } else if (level == '2'){
                levelTwoGame();
            } else {
                levelThreeGame();
            }
        }
    }
};

function updateCell(cell, index){
    cell.textContent = player; 
    board[index] = player;
    // console.log(index);
    cell.style.color = (player == 'X') ? '#7fc7af' : '#cf69e6'
}

function changePlayer(){
    player = (player == 'X') ? 'O' : 'X'
    option.textContent = `Player `+player+' turn';
    //console.log(player) #option
}

function checkWinner(){
    for(const [a,b,c,d] of winCondition){
        // Check each condition
        if ((board[a] == player) && (board[b] == player) && (board[c] == player) && (board[d] == player)){
            winner([a,b,c,d]);
            return true;
        } 
    }

    // For draw
    if(board.every(cell => cell != '')){
        declareDraw();
        return true;
    }
}

function declareDraw(){
    option.textContent = `Draw`;
    isPauseGame = true;
    restartGame.style.visibility = 'visible';
}

function winner(winIndex){

    option.textContent = ` Player ${player} wins`  
    isPauseGame = true

    //Highlight winner
    winIndex.forEach((index) => cells[index].style.background = `#2a2343`);

    restartGame.style.visibility = 'visible';
}

function choosePlayer(selectedPlayer){
    if (!isGameStart){
        player = selectedPlayer;
        if(player == 'X'){
            xPlayer.classList.add('player-active');
            oPlayer.classList.remove('player-active');
        } else{
            xPlayer.classList.remove('player-active');
            oPlayer.classList.add('player-active');
        }
    }
}

// Hide again the restart button
restartGame.addEventListener('click', () => {
    restartGame.style.visibility = 'hidden';
    //Cleaning the board
    board.fill('')
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.background = '';
    })

    isPauseGame = false;
    isGameStart = false;
    // option.textContent = `Please choose your symbol`
    document.getElementById("option").innerText = "Please choose your symbol"
})

// ------------------- LEVELS ------------------------------------------------------------------
//--------------------Level one game (random)
function levelOneGame(){
    //Machine choosing
    isPauseGame = true;

    setTimeout(() => {
        //Machine choosing
        isPauseGame = true;

        let randomIndex
        do {
            //Picking a random index
            randomIndex = Math.floor(Math.random() * board.length);
            console.log("The AI ("+player+") is playing in: "+randomIndex)
        } while( board[randomIndex] != '' ) //It´s not empty
        //Playing that cell (machine)
        updateCell(cells[randomIndex], randomIndex, player);

        // Change to player
        if(!checkWinner()){
            changePlayer();
            isPauseGame = false;
            return;
        }

        //Reset of the player
        // player = (player == 'X') ? 'O' : 'X';
    }, 1000) //Delay machine move by 1s
}

//------------------------------LEVEL TWO-----------
function levelTwoGame() {
    //Machine choosing
    isPauseGame = true;
    console.log('Agent playing with '+player)

    setTimeout(() => {
        // For storing the players movement
        const xIndex = [];
        const oIndex = [];
        // Attempt to block or make a move based on win conditions
        let moveMade = false;
        // Loop through the board and record the positions of 'X' and 'O'
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 'X') {
                xIndex.push(i);  
            } else if (board[i] === 'O') {
                oIndex.push(i); 
            }
        }

        console.log("Index of O elements: "+ oIndex)
        console.log("Index of X elements: "+ xIndex)

        // Check for winCondition and place mark accordingly
        for (const combination of winCondition) {
            // Check if there are two X or O marks in the combination
            const xInCombination = combination.filter(index => xIndex.includes(index));
            const oInCombination = combination.filter(index => oIndex.includes(index));

            // If three X marks are found, block by placing an O in the available spot
            if (xInCombination.length === 3) {
                const emptySpot = combination.find(index => !xIndex.includes(index) && !oIndex.includes(index));
                console.log("Player "+player+" is going to block in "+emptySpot)
                if (emptySpot !== undefined && board[emptySpot] === '') {
                    // Place the mark in the empty spot
                    updateCell(cells[emptySpot], emptySpot, 'O');
                    moveMade = true;
                    break;  // Exit loop once the move is made
                }
            }

            // If three O marks are found, block by placing an X in the available spot
            if (oInCombination.length === 3) {
                const emptySpot = combination.find(index => !xIndex.includes(index) && !oIndex.includes(index));
                console.log("Player "+player+" is going to block in "+emptySpot)
                if (emptySpot !== undefined && board[emptySpot] === '') {
                    // Place the mark in the empty spot
                    updateCell(cells[emptySpot], emptySpot, 'X');
                    moveMade = true;
                    break;  // Exit loop once the move is made
                }
            }
        }

        // If no move was made (no block), make a random move
        if (!moveMade) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * board.length);
            } while (board[randomIndex] !== '');  // It’s not empty
            updateCell(cells[randomIndex], randomIndex, player);
        }

        // Change to player
        if (!checkWinner()) {
            changePlayer();
            isPauseGame = false;
            return;
        }

        //Reset of the player
        // player = (player == 'X') ? 'O' : 'X';
    }, 1000) //Delay machine move by 1s
}

//----------------------------- LEVEL THREE
function levelThreeGame() {
    // Machine choosing
    isPauseGame = true;

    setTimeout(() => {
        // Minimax algorithm to find the best move
        function minimax(board, depth, isMaximizing) {
            // Limit the depth to 3 to avoid deep recursion
            if (depth > 5) {
                return 0; // Return neutral score if depth exceeds the limit
            }

            // Check if the game is over
            const winner = checkWinner();
            if (winner !== null) {
                if (winner === 'O') {
                    return 10 - depth; // Computer wins
                } else if (winner === 'X') {
                    return depth - 10; // Player wins
                } else {
                    return 0; // Draw
                }
            }

            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < board.length; i++) {
                    if (board[i] === '') {
                        board[i] = 'O'; // Computer's move
                        let score = minimax(board, depth + 1, false);
                        board[i] = ''; // Undo move
                        bestScore = Math.max(score, bestScore);
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < board.length; i++) {
                    if (board[i] === '') {
                        board[i] = 'X'; // Player's move
                        let score = minimax(board, depth + 1, true);
                        board[i] = ''; // Undo move
                        bestScore = Math.min(score, bestScore);
                    }
                }
                return bestScore;
            }
        }

        // Function to find the best move for the computer
        function findBestMove() {
            let bestScore = -Infinity;
            let bestMove = null;

            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O'; // Try computer's move
                    let score = minimax(board, 0, false);
                    board[i] = ''; // Undo move
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }

            return bestMove;
        }

        // Find the best move for the computer
        const bestMove = findBestMove();

        if (bestMove !== null) {
            // Make the computer's move
            updateCell(cells[bestMove], bestMove);
            if (!checkWinner()) {
                changePlayer(); // Switch back to the player
            }
        }

        isPauseGame = false; // Unpause the game
    }, 1000); // Delay machine move by 1 second
}

