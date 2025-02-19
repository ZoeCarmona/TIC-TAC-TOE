const cells = document.querySelectorAll('.cell');
const option = document.querySelector('#option');
const xPlayer = document.querySelector('#player1Symbol');
const oPlayer = document.querySelector('#player2Symbol');
const restartGame = document.querySelector('#restartGame');

// Initializing variables for game
let player = 'X';
let isPauseGame = false;
let isGameStart = false;

// Array for winning options (all teh locations)
const board = [
    '', '', '', '', 
    '', '', '', '', 
    '', '', '', '', 
    '', '', '', '', 
];

const winCondition = [
    // Rows
    [0,1,2], [1,2,3], [4,5,6], [5,6,7], [8,9,10], [9,10,11], [12,13,14], [13,14,15],
    // Columns
    [0,4,8], [4,8,12], [1,5,9], [5,9,13], [2,6,10], [6,10,14], [3,7,11], [7,11,15], 
    //Diagonal 1 (top left to bottom right)
    [4,9,14], [0,5,10,15], [5,10,15], [1,6,11], 
    // Diagonal 2 (top right to bottom left)
    [2,5,8], [3,6,9], [6,9,12], [7,10,13]
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
        // Random pick
        if(!checkWinner()){
            changePlayer()
        }
    }
};

function updateCell(cell, index){
    cell.textContent = player; 
    board[index] = player;
    // console.log(board);
    cell.style.color = (player == 'X') ? '#7fc7af' : '#cf69e6'
}

function changePlayer(){
    player = (player == 'X') ? 'O' : 'X'
    //console.log(player) #option
    //min 17:45
}

function checkWinner(){
    for(const [a,b,c] of winCondition){
        // Check each condition
        if ((board[a] == player) && (board[b] == player) && (board[c] == player)){
            winner([a,b,c]);
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
    option.textContent = `Please choose your symbol`
})