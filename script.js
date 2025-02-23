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
        // Levels
        if(!checkWinner()){
            changePlayer()

            if(level == '1'){
                levelOneGame();
            } else if (level == '2'){
                console.log('cooking....');
            } else {
                levelThreeGame();
            }
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

// ------------------- LEVELS -----------------------
//Level one game (random)
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
        player = (player == 'X') ? 'O' : 'X';
    }, 1000) //Delay machine move by 1s
}

//Level Three ()
function levelThreeGame(){
    //Machine choosing
    isPauseGame = true;

    //Creating and array of the center of the board
    const centerBoard = [5, 6, 9, 10];
    //cReating and array of the borders of the board
    const aroundBoard = [1,2,3,4,5,8,9,12,13,14,15,16];
    let randomIndex;

    function next(){
        //Playing that cell (machine)
        updateCell(cells[randomIndex], randomIndex, player);
    
        // Change to player
        if(!checkWinner()){
            changePlayer();
            isPauseGame = false;
            return;
        }
    
        //Reset of the player
        player = (player == 'X') ? 'O' : 'X';
    }

    setTimeout(() =>{
        if(board[5] !== '' || board[6] !== '' || board[9] !== '' || board[10] !== ''){
            around();
            return;
        } else{
            center();
            return;
        }

        //First move on the center
        function center(){
            randomIndex = centerBoard[Math.floor(Math.random() * centerBoard.length)];
            if(board[randomIndex] == '') next();
            // Check if the selected cell is empty
            if(board[randomIndex] === '') {
                next(); // If the spot is empty, make the move

            } else {
                center(); // If not, try again by calling around() recursively
            }
        }

        // Move on the corners
        function around(){
            randomIndex = aroundBoard[Math.floor(Math.random() * aroundBoard.length)];
            // Check if the selected cell is empty
            if(board[randomIndex] === '') {
                next(); // If the spot is empty, make the move
            } else {
                around(); // If not, try again by calling around() recursively
            }
        }
    }, 1000) //Delay machine move by 1s)
    
}