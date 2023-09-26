// factories
const playerFactory = (playerName, playerMarker, _playerPoints, playerType) => {
    const playerWon = () => {
        return _playerPoints += 1;
    }

    return { playerName, playerMarker, playerType, playerWon };
};

const movementFactory = (movement, x, y, score) =>
{
    return { movement, x, y, score }
};

// Modules
const gameBoardController = (function() {
    let _currentBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];

    const getCurrentBoard = () => _currentBoard;

    const appendMarker = (posX, posY, marker) =>
    {
        if(!hasMarker(posX, posY))
        {
            _currentBoard[posY][posX] = marker;
        }
    };

    const restartBoard = () => {
        for(let y = 0; y < 3; y++)
        {
            for(let x = 0; x < 3; x++)
            {
                _currentBoard[y][x] = '';
            }
        }
    }

    const checkTie = (board) => getAvailableSpots(board).length === 0;

    const getAdjacent = (posX, posY, marker, board) => {
        let adjacentList = [];
        // make sure x and y are numbers
        let checkPosX = +posX;
        let checkPosY = +posY;

        // try all adjacent boxes
        for(position of getMarkedSpots(board, marker))
        {
            let splitter = position.split(',');
            let sPosX = +splitter[0];
            let sPosY = +splitter[1];

            if((sPosX - 1) === checkPosX || (sPosY-1) === checkPosY || 
            (sPosX + 1) === checkPosX || (sPosY+1) === checkPosY)
            {
                adjacentList.push(position);
            }
        }

        return adjacentList;
    }

    const getAvailableSpots = (board) => getMarkedSpots(board, '');

    const getMarkedSpots = (board, marker) => {
        let availableSpots = [];
        for(let y = 0; y < board.length; y++)
        {
            for(let x = 0; x < board[y].length; x++)
            {
                if(board[y][x] === marker)
                {
                    availableSpots.push(`${x},${y}`);
                }
            }
        }

        return availableSpots;
    }

    const makeALine = (posX, posY, posX2, posY2, posX3, posY3) => {
        // check for straight lines
        if(posY == posY2 && posY2 == posY3)
        {
            return true;
        }

        if(posX == posX2 && posX2 == posX3)
        {
            return true;
        }

        // check diagonal /
        //   3      3    2    1   2   1
        //  2     1     1    2   3   3
        // 1     2     3    3   1   2
        if((posY-1) == posY2 && (posX+1) == posX2 && (posY2-1) == posY3 && (posX2+1) == posX3)
        {
            return true;
        }

        if((posY+1) == posY2 && (posX-1) == posX2 && (posY2-2) == posY3 && (posX2+2) == posX3)
        {
            return true;
        }

        if((posY-1) == posY2 && (posX+1) == posX2 && (posY2+2) == posY3 && (posX2-2) == posX3)
        {
            return true;
        }

        if((posY+1) == posY2 && (posX-1) == posX2 && (posY2+1) == posY3 && (posX2-1) == posX3)
        {
            return true;
        }

        if((posY-2) == posY2 && (posX+2) == posX2 && (posY2+1) == posY3 && (posX2-1) == posX3)
        {
            return true;
        }

        if((posY+2) == posY2 && (posX-2) == posX2 && (posY2-1) == posY3 && (posX2+1) == posX3)
        {
            return true;
        }

        // check diagonal \
        // 3     3    2    1   2   1
        //  2     1     1    2   3   3
        //    1     2     3    3   1   2
        if((posY-1) == posY2 && (posX-1) == posX2 && (posY2-1) == posY3 && (posX2-1) == posX3)
        {
            return true;
        }

        if((posY+1) == posY2 && (posX+1) == posX2 && (posY2-2) == posY3 && (posX2-2) == posX3)
        {
            return true;
        }

        if((posY-1) == posY2 && (posX-1) == posX2 && (posY2+2) == posY3 && (posX2+2) == posX3)
        {
            return true;
        }

        if((posY+1) == posY2 && (posX+1) == posX2 && (posY2+1) == posY3 && (posX2+1) == posX3)
        {
            return true;
        }

        if((posY-2) == posY2 && (posX-2) == posX2 && (posY2+1) == posY3 && (posX2+1) == posX3)
        {
            return true;
        }

        if((posY+2) == posY2 && (posX+2) == posX2 && (posY2-1) == posY3 && (posX2-1) == posX3)
        {
            return true;
        }

        return false;
    }

    const hasMarker = (posX, posY) => (_currentBoard[+posY][+posX] !== '');
    
    return { getCurrentBoard, appendMarker, hasMarker, getAdjacent, makeALine, restartBoard, checkTie, getAvailableSpots, getMarkedSpots }
})();

const gameController = (function() {
    let _gamePlayers = [];
    let _currentTurn = 0;
    let _gameStatus = "";

    const cleanUpPlayers = () => {
        _gamePlayers = [];
    }

    const appendPlayer = (playerName, playerMarker, playerPoints, playerType) => {
        _gamePlayers.push(playerFactory(playerName, playerMarker, playerPoints, playerType));
    }

    const getGameStatus = () => _gameStatus;

    const startGame = () => {
        _currentTurn = 0;
        _gameStatus = "started";
    }

    const restartGame = () => {
        _currentTurn = 0;
        _gameStatus = "restarted";
        gameBoardController.restartBoard();
    }

    const gameTied = () => {
        _currentTurn = 0;
        _gameStatus = "tie";
    }

    const nextPlayer = () => _gamePlayers[_currentTurn];

    const playNextTurn = (posX, posY, playerMarker) => {
        if(_gameStatus !== "finished")
        {

            if(!gameBoardController.hasMarker(posX, posY))
            {
                // Valid turn
                _currentTurn += 1;

                if(_currentTurn === _gamePlayers.length)
                {
                    _currentTurn = 0;
                }

                gameBoardController.appendMarker(posX, posY, playerMarker);

                return true;
            }

            return false;
        } else {
            return false;
        }
    };

    const checkTie = () =>
    {
        return gameBoardController.checkTie(gameBoardController.getCurrentBoard());
    }

    const checkVictory = (playerMarker, board) =>
    {
        let markedSpots = gameBoardController.getMarkedSpots(board, playerMarker);
        if(markedSpots.length > 2)
        {
            for(position of markedSpots)
            {
                let splitter = position.split(',');
                let posX = +splitter[0];
                let posY = +splitter[1];

                let adjacentBoxes = gameBoardController.getAdjacent(posX, posY, playerMarker, board);
                if(adjacentBoxes.length > 0)
                {
                    for(box of adjacentBoxes)
                    {
                        let split = box.split(',');
                        let secondaryPosX = +split[0];
                        let secondaryPosY = +split[1];
                        let secondaryAdjacentBoxes = gameBoardController.getAdjacent(secondaryPosX, secondaryPosY, playerMarker, board);
                        if(secondaryAdjacentBoxes.length > 0)
                        {
                            // probable winner, check if it's in a line
                            for(adjBox of secondaryAdjacentBoxes)
                            {
                                let adjSplit = adjBox.split(',');
                                let tPosX = +adjSplit[0];
                                let tPosY = +adjSplit[1];

                                if(tPosX === posX && tPosY === posY)
                                {
                                    // ignore original pos
                                    continue;
                                }

                                if(gameBoardController.makeALine((+posX), (+posY), (+secondaryPosX), (+secondaryPosY), (+tPosX), (+tPosY)))
                                {
                                    // We won!
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            }
        } else {
            return false;
        }
    }

    const executeVictory = (winner) => {
        _gameStatus = "finished";
        winner.playerWon();
    }

    return { getGameStatus, cleanUpPlayers, appendPlayer, nextPlayer, playNextTurn, checkVictory, checkTie, executeVictory, startGame, restartGame, gameTied };
})();

const computerAIController = (function() {
    let _difficulty = "easy";

    const updateDifficulty = (diff) => {
        _difficulty = diff;
    }

    const makeNextMove = (marker) => {
        if(_difficulty === "easy")
        {
            let nextRand = _nextRandomPosition();
            while(nextRand == undefined || nextRand == null)
            {
                nextRand = _nextRandomPosition();
            }
            return nextRand;
        } else if(_difficulty === "medium") {
            let nextMove = null;
            // check for winning movement
            for(position of gameBoardController.getAvailableSpots(gameBoardController.getCurrentBoard()))
            {
                let split = position.split(',');
                let x = +split[0];
                let y = +split[1];
                let replicateBoard = _replicateCurrentBoard(gameBoardController.getCurrentBoard());
                replicateBoard[x][y] = marker;
                if(gameController.checkVictory(marker, replicateBoard))
                {
                    nextMove = [];
                    nextMove.push(x);
                    nextMove.push(y);
                }
            }

            if(nextMove !== null)
            {
                return nextMove;
            } else {
                nextMove = _nextRandomPosition();
                while(nextMove == undefined || nextMove == null)
                {
                    nextMove = _nextRandomPosition();
                }
                return nextMove;
            }
        } else if(_difficulty === "hard") {
            let nextMove = null;
            // check for winning movement
            for(position of gameBoardController.getAvailableSpots(gameBoardController.getCurrentBoard()))
            {
                let split = position.split(',');
                let x = +split[0];
                let y = +split[1];
                let replicateBoard = _replicateCurrentBoard(gameBoardController.getCurrentBoard());
                replicateBoard[x][y] = marker;
                if(gameController.checkVictory(marker, replicateBoard))
                {
                    nextMove = [];
                    nextMove.push(x);
                    nextMove.push(y);
                }
            }

            // check for enemy win
            let enemyMarker = (marker === "O") ? "X" : "O";
            for(position of gameBoardController.getAvailableSpots(gameBoardController.getCurrentBoard()))
            {
                let split = position.split(',');
                let x = +split[0];
                let y = +split[1];
                let replicateBoard = _replicateCurrentBoard(gameBoardController.getCurrentBoard());
                replicateBoard[x][y] = enemyMarker;
                if(gameController.checkVictory(enemyMarker, replicateBoard))
                {
                    nextMove = [];
                    nextMove.push(x);
                    nextMove.push(y);
                }
            }

            if(nextMove !== null)
            {
                return nextMove;
            } else {
                nextMove = _nextRandomPosition();
                while(nextMove == undefined || nextMove == null)
                {
                    nextMove = _nextRandomPosition();
                }
                return nextMove;
            }
        } else {
            // check for winning movement                
            return _minimaxCalc(marker);
        }
    }

    const _minimaxCalc = (marker) =>
    {
        let moveSet = [];
        let splitter = _minimaxCalcBestPath(marker, marker, gameBoardController.getCurrentBoard());
        moveSet.push(splitter.x);
        moveSet.push(splitter.y);
        return moveSet;
    }
6
    const _minimaxCalcBestPath = (marker, original_marker, board) =>
    {
        let availableSpots = gameBoardController.getAvailableSpots(board);
        if(gameController.checkVictory(original_marker, board))
        {
            return { score: 10 };
        } else if(gameController.checkVictory(((original_marker === "O") ? "X" : "O"), board))
        {
            return { score: -10};
        } else if(availableSpots.length === 0)
        {
            return { score: 0 };
        }

        let currentPath = [];
        for(position of availableSpots)
        {
            let split = position.split(',');
            let x = +split[0];
            let y = +split[1];

            let move = movementFactory(board[y][x], x, y, 0);
            board[y][x] = marker;

            move.score = _minimaxCalcBestPath(((marker === "O") ? "X" : "O"), original_marker, board).score;

            board[y][x] = move.movement;

            currentPath.push(move);
        }

        let bestMovement;

        if(marker === original_marker)
        {
            let bestScore = -10000;
            for(let i = 0; i < currentPath.length; i++)
            {
                if(currentPath[i].score > bestScore)
                {
                    bestMovement = i;
                    bestScore = currentPath[i].score;
                }
            }
        } else {
            let bestScore = 10000;
            for(let i = 0; i < currentPath.length; i++)
            {
                if(currentPath[i].score < bestScore)
                {
                    bestMovement = i;
                    bestScore = currentPath[i].score;
                }
            }
        }

        return currentPath[bestMovement];
    }

    const _replicateCurrentBoard = (board) =>
    {
        let newArray = [[]];
        for(let i = 0; i < board.length; i++)
        {
            newArray[i] = board[i].slice();
        }

        return newArray;
    }

    const _nextRandomPosition = () => {
        let randomX = Math.floor(Math.random() * 3);
        let randomY = Math.floor(Math.random() * 3);
        let result = [];

        if(gameBoardController.hasMarker(randomX, randomY))
        {
            _nextRandomPosition();
        } else {
            result.push(randomX);
            result.push(randomY);
            return result;
        }
    }

    return { updateDifficulty, makeNextMove };

})();

const mainController = (function(doc) {
    let _gameOpponent;
    let _gameMarker;
    let _gamePlayerName, _gamePlayerTwoName;
    const gameCaption = doc.querySelector('.content-box-caption');

    const registerOpponentSelection = () => {
        const selectComputer = doc.querySelector('#selectComputer');
        const selectPlayer = doc.querySelector('#selectPlayer');

        selectComputer.addEventListener("click", _clickHandler);
        selectPlayer.addEventListener("click", _clickHandler);
    };

    const _clickHandler = (event) => {
        if(event.target.id === "selectComputer")
        {
            _gameOpponent = "computer";
            _appendPlayerMarker();
        } else if(event.target.id === "selectPlayer")
        {
            _gameOpponent = "player";
            _appendPlayerMarker();
        } else if(event.target.id === "selectX")
        {
            _gameMarker = "X";
            _appendPlayerNames();
        } else if(event.target.id === "selectO")
        {
            _gameMarker = "O";
            _appendPlayerNames();
        } else if(event.target.id === "restartGame")
        {
            _restartGame();
        } else if(event.target.id === "diffEasy")
        {
            const diffCaption = document.querySelector('.content-box-difficulty-caption');
            diffCaption.textContent = "Computer difficulty: EASY";
            computerAIController.updateDifficulty("easy");
        } else if(event.target.id === "diffMedium")
        {
            const diffCaption = document.querySelector('.content-box-difficulty-caption');
            diffCaption.textContent = "Computer difficulty: MEDIUM";
            computerAIController.updateDifficulty("medium");
        } else if(event.target.id === "diffHard")
        {
            const diffCaption = document.querySelector('.content-box-difficulty-caption');
            diffCaption.textContent = "Computer difficulty: HARD";
            computerAIController.updateDifficulty("hard");
        } else if(event.target.id === "diffUnbeatable")
        {
            const diffCaption = document.querySelector('.content-box-difficulty-caption');
            diffCaption.textContent = "Computer difficulty: UNBEATABLE";
            computerAIController.updateDifficulty("unbeatable");
        } else if(event.target.id === "selectNames")
        {
            const playerOne = document.querySelector('#playerOneName');
            const playerOneError = document.querySelector('#playerOneNameError');

            if(playerOne.classList.contains("content-box-select-box-input-error"))
            {
                playerOne.classList.remove("content-box-select-box-input-error");
                playerOneError.textContent = "";
            }

            if(playerOne.value.length === 0)
            {
                playerOne.classList.add("content-box-select-box-input-error");
                playerOneError.textContent = "Please don't leave the player name empty.";
                return;
            }

            _gamePlayerName = playerOne.value;

            if(_gameOpponent !== "computer")
            {
                const playerTwo = document.querySelector('#playerTwoName');
                const playerTwoError = document.querySelector('#playerTwoNameError');

                if(playerTwo.classList.contains("content-box-select-box-input-error"))
                {
                    playerTwo.classList.remove("content-box-select-box-input-error");
                    playerTwoError.textContent = "";
                }

                if(playerTwo.value.length === 0)
                {
                    playerTwo.classList.add("content-box-select-box-input-error");
                    playerTwoError.textContent = "Please don't leave the player name empty.";
                    return;
                }

                _gamePlayerTwoName = playerTwo.value;
            }

            _startGame();

        } else if(event.target.classList.contains("box") && event.target.getAttribute("data-position").includes(","))
        {
            if(gameController.getGameStatus() !== "started" && gameController.getGameStatus() !== "restarted")
            {
                return;
            }

            let currentPlayer = gameController.nextPlayer();
            let position = event.target.getAttribute("data-position").split(',');
            
            _executeNextMovement((+position[0]), (+position[1]), currentPlayer, event.target);
        }
    }

    const _executeNextMovement = (posX, posY, currentPlayer, target) =>
    {
        if(gameController.playNextTurn(posX, posY, currentPlayer.playerMarker))
        {
            if(target.classList.contains("hov"))
            {
                target.classList.remove("hov");
            }

            target.textContent = currentPlayer.playerMarker;
            if(gameController.checkVictory(currentPlayer.playerMarker, gameBoardController.getCurrentBoard()))
            {
                gameController.executeVictory(currentPlayer);
                _notifyVictory(currentPlayer);
            } else if(gameController.checkTie(gameBoardController.getCurrentBoard()))
            {
                gameController.gameTied();
                gameCaption.textContent = `It's a tie!`;
            } else {
                gameCaption.textContent = `It's ${gameController.nextPlayer().playerName}'s turn`;

                // check if next turn is computer's turn
                if(gameController.nextPlayer().playerType === "computer")
                {
                    // Do next move
                    let computerPlayer = gameController.nextPlayer();
                    let computerMovement = computerAIController.makeNextMove(computerPlayer.playerMarker);
                    let computerTarget = doc.querySelector(`.box[data-position="${computerMovement[0]},${computerMovement[1]}"]`);

                    _executeNextMovement(computerMovement[0], computerMovement[1], computerPlayer, computerTarget);
                }
            }
        }
    };

    const _appendPlayerMarker = () => {
        const selectParent = doc.querySelector('.content-box-select');
        // clean up children
        let child = selectParent.lastElementChild; 
        while (child) {
            selectParent.removeChild(child);
            child = selectParent.lastElementChild;
        }

        // create new ones
        let crossMarker = document.createElement("div");
        crossMarker.classList.add("content-box-select-button");
        crossMarker.setAttribute("id", "selectX");
        crossMarker.addEventListener("click", _clickHandler);
        crossMarker.textContent = "X"; 
        selectParent.appendChild(crossMarker);

        let circleMarker = document.createElement("div");
        circleMarker.classList.add("content-box-select-button");
        circleMarker.setAttribute("id", "selectO");
        circleMarker.addEventListener("click", _clickHandler);
        circleMarker.textContent = "O"; 
        selectParent.appendChild(circleMarker);

        gameCaption.textContent = "Please select a marker:";

    }

    const _appendPlayerNames = () => {
        const selectParent = doc.querySelector('.content-box-select');
        // clean up children
        let child = selectParent.lastElementChild; 
        while (child) {
            selectParent.removeChild(child);
            child = selectParent.lastElementChild;
        }

        // create new ones
        let selectNameBox = document.createElement("div");
        selectNameBox.classList.add("content-box-select-box");
        let selectNameLabel = document.createElement("label");
        selectNameLabel.setAttribute("for", "playerOneName");
        selectNameLabel.textContent = "Player One: "
        selectNameBox.appendChild(selectNameLabel);
        let selectNameInput = document.createElement("input");
        selectNameInput.setAttribute("type", "text");
        selectNameInput.setAttribute("id", "playerOneName");
        selectNameInput.setAttribute("name", "player_one_name");
        selectNameBox.appendChild(selectNameInput);
        let selectNameError = document.createElement("div");
        selectNameError.classList.add("content-box-select-box-error");
        selectNameError.setAttribute("id", "playerOneNameError");
        selectNameBox.appendChild(selectNameError);
        selectParent.appendChild(selectNameBox);

        if(_gameOpponent !== "computer")
        {
            let selectSecondNameBox = document.createElement("div");
            selectSecondNameBox.classList.add("content-box-select-box");
            let selectSecondNameLabel = document.createElement("label");
            selectSecondNameLabel.setAttribute("for", "playerTwoName");
            selectSecondNameLabel.textContent = "Player Two: "
            selectSecondNameBox.appendChild(selectSecondNameLabel);
            let selectSecondNameInput = document.createElement("input");
            selectSecondNameInput.setAttribute("type", "text");
            selectSecondNameInput.setAttribute("id", "playerTwoName");
            selectSecondNameInput.setAttribute("name", "player_two_name");
            selectSecondNameBox.appendChild(selectSecondNameInput);
            let selectSecondNameError = document.createElement("div");
            selectSecondNameError.classList.add("content-box-select-box-error");
            selectSecondNameError.setAttribute("id", "playerTwoNameError");
            selectSecondNameBox.appendChild(selectSecondNameError);
            selectParent.appendChild(selectSecondNameBox);
        }

        const endParent = doc.querySelector('.content-box-end');

        let selectNamesButton = document.createElement("div");
        selectNamesButton.classList.add("content-box-select-button");
        selectNamesButton.setAttribute("id", "selectNames");
        selectNamesButton.addEventListener("click", _clickHandler);
        selectNamesButton.textContent = "Select names"; 
        endParent.appendChild(selectNamesButton);

        gameCaption.textContent = "Please input your name:";

    }

    const _restartGame = () => {
        // restart boxes
        const boxes = doc.querySelectorAll('.box');
        
        boxes.forEach((box) => {
            if(!box.classList.contains("hov"))
            {
                box.classList.add("hov");
            }
            box.textContent = "";
        })

        // restart game
        gameController.restartGame();

        gameCaption.textContent = `It's ${gameController.nextPlayer().playerName}'s turn`;
    }

    const _startGame = () => {
        const endParent = doc.querySelector('.content-box-end');
        // clean up children
        let child = endParent.lastElementChild; 
        while (child) {
            endParent.removeChild(child);
            child = endParent.lastElementChild;
        }

        let restartButton = document.createElement("div");
        restartButton.classList.add("content-box-select-button");
        restartButton.setAttribute("id", "restartGame");
        restartButton.addEventListener("click", _clickHandler);
        restartButton.textContent = "Restart"; 
        endParent.appendChild(restartButton);

        if(_gameOpponent === "computer")
        {
            let difficultyBoxCaption = document.createElement("div");
            difficultyBoxCaption.classList.add("content-box-difficulty-caption");
            difficultyBoxCaption.textContent = "Computer difficulty: EASY";
            endParent.appendChild(difficultyBoxCaption);

            let difficultyBox = document.createElement("div");
            difficultyBox.classList.add("content-box-difficulty");
            
            let easyButton = document.createElement("div");
            easyButton.classList.add("content-box-select-button");
            easyButton.setAttribute("id", "diffEasy");
            easyButton.addEventListener("click", _clickHandler);
            easyButton.textContent = "Easy"; 
            difficultyBox.appendChild(easyButton);

            let mediumButton = document.createElement("div");
            mediumButton.classList.add("content-box-select-button");
            mediumButton.setAttribute("id", "diffMedium");
            mediumButton.addEventListener("click", _clickHandler);
            mediumButton.textContent = "Medium"; 
            difficultyBox.appendChild(mediumButton);

            let hardButton = document.createElement("div");
            hardButton.classList.add("content-box-select-button");
            hardButton.setAttribute("id", "diffHard");
            hardButton.addEventListener("click", _clickHandler);
            hardButton.textContent = "Hard"; 
            difficultyBox.appendChild(hardButton);

            let unbeatableButton = document.createElement("div");
            unbeatableButton.classList.add("content-box-select-button");
            unbeatableButton.setAttribute("id", "diffUnbeatable");
            unbeatableButton.addEventListener("click", _clickHandler);
            unbeatableButton.textContent = "Unbeatable"; 
            difficultyBox.appendChild(unbeatableButton);

            endParent.appendChild(difficultyBox);
        }

        // cleanup (just in case) & append players
        gameController.cleanUpPlayers();
        gameController.appendPlayer(_gamePlayerName, (_gameMarker === "O") ? "O" : "X", 0, "player");
        gameController.appendPlayer((_gameOpponent === "computer") ? "Computer" : _gamePlayerTwoName, (_gameMarker !== "O") ? "O" : "X", 0, (_gameOpponent === "computer") ? "computer" : "player");

        const selectBox = doc.querySelector('.content-box-select');
        selectBox.style['display'] = 'none';

        const gameBox = doc.querySelector('.content-box-game');
        gameBox.style['display'] = 'grid';

        // set up board
        for(let y = 0; y < 3; y++)
        {
            for(let x = 0; x < 3; x++)
            {
                let gameSquare = document.createElement("div");
                gameSquare.classList.add("box");
                gameSquare.classList.add("hov");
                gameSquare.setAttribute("data-position", x + "," + y);
                gameSquare.addEventListener("click", _clickHandler);
                // border logic
                gameSquare.style["border"] = "2px solid #132544";
                if(y === 0)
                {
                    gameSquare.style["border-top"] = "0";
                }
                if(x === 0)
                {
                    gameSquare.style["border-left"] = "0";
                }
                if(y === 2)
                {
                    gameSquare.style["border-bottom"] = "0";
                }
                if(x === 2)
                {
                    gameSquare.style["border-right"] = "0";
                }
                gameBox.appendChild(gameSquare);
            }
        }

        gameController.startGame();

        gameCaption.textContent = `It's ${gameController.nextPlayer().playerName}'s turn`;

    }

    const _notifyVictory = (winner) => {
        gameCaption.textContent = `${winner.playerName} WON!`;
    };

    return { registerOpponentSelection };

})(document);

// General code
mainController.registerOpponentSelection();