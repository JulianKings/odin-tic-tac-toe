// factories
const playerFactory = (playerName, playerMarker, playerPoints, playerType) => {
    const playerWon = () => {
        return playerPoints += 1;
    }

    return { playerName, playerMarker, playerType, playerWon };
};

// Modules
const gameBoardController = (function() {
    let currentBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];

    const appendMarker = (posX, posY, marker) =>
    {
        if(!hasMarker(posX, posY))
        {
            currentBoard[posY][posX] = marker;
        }
    };

    const restartBoard = () => {
        for(let y = 0; y < 3; y++)
        {
            for(let x = 0; x < 3; x++)
            {
                currentBoard[y][x] = '';
            }
        }
    }

    const getAdjacent = (posX, posY, marker) => {
        let adjacentList = [];
        // make sure x and y are numbers
        let checkPosX = +posX;
        let checkPosY = +posY;

        // try all adjacent boxes
        // x-1 & y-1   y-1     x+1 & y-1
        // x-1          -          x+1
        // x-1 & y+1   y-1     x+1 & y+1
        if((checkPosX - 1) >= 0)
        {
            if((checkPosY -1) >= 0)
            {
                if(currentBoard[checkPosY-1][checkPosX-1] === marker)
                {
                    adjacentList.push((checkPosX-1) + "," + (checkPosY-1) + "," + marker);
                }
            }

            if(currentBoard[checkPosY][checkPosX-1] === marker)
            {
                adjacentList.push((checkPosX-1) + "," + (checkPosY) + "," + marker);
            }

            if((checkPosY +1) <= 2)
            {
                if(currentBoard[checkPosY+1][checkPosX-1] === marker)
                {
                    adjacentList.push((checkPosX-1) + "," + (checkPosY+1) + "," + marker);
                }
            }
        }

        if((checkPosY -1) >= 0)
        {
            if(currentBoard[checkPosY-1][checkPosX] === marker)
            {
                adjacentList.push((checkPosX) + "," + (checkPosY-1) + "," + marker);
            }
        }

        if((checkPosY +1) <= 2)
        {
            if(currentBoard[checkPosY+1][checkPosX] === marker)
            {
                adjacentList.push((checkPosX) + "," + (checkPosY+1) + "," + marker);
            }
        }

        if((checkPosX + 1) <= 2)
        {
            if((checkPosY -1) >= 0)
            {
                if(currentBoard[checkPosY-1][checkPosX+1] === marker)
                {
                    adjacentList.push((checkPosX+1) + "," + (checkPosY-1) + "," + marker);
                }
            }

            if(currentBoard[checkPosY][checkPosX+1] === marker)
            {
                adjacentList.push((checkPosX+1) + "," + (checkPosY) + "," + marker);
            }

            if((checkPosY +1) <= 2)
            {
                if(currentBoard[checkPosY+1][checkPosX+1] === marker)
                {
                    adjacentList.push((checkPosX+1) + "," + (checkPosY+1) + "," + marker);
                }
            }
        }

        return adjacentList;
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

    const hasMarker = (posX, posY) => (currentBoard[+posY][+posX] !== '');

    return { appendMarker, hasMarker, getAdjacent, makeALine, restartBoard }
})();

const gameController = (function() {
    let gamePlayers = [];
    let currentTurn = 0;
    let gameStatus = "";

    const cleanUpPlayers = () => {
        gamePlayers = [];
    }

    const appendPlayer = (playerName, playerMarker, playerPoints, playerType) => {
        gamePlayers.push(playerFactory(playerName, playerMarker, playerPoints, playerType));
    }

    const getGameStatus = () => gameStatus;

    const startGame = () => {
        currentTurn = 0;
        gameStatus = "started";
    }

    const restartGame = () => {
        currentTurn = 0;
        gameStatus = "restarted";
        gameBoardController.restartBoard();
    }

    const nextPlayer = () => gamePlayers[currentTurn];

    const playNextTurn = (posX, posY, playerMarker) => {
        if(gameStatus !== "finished")
        {

            if(!gameBoardController.hasMarker(posX, posY))
            {
                // Valid turn
                currentTurn += 1;

                if(currentTurn === gamePlayers.length)
                {
                    currentTurn = 0;
                }

                gameBoardController.appendMarker(posX, posY, playerMarker);

                return true;
            }

            return false;
        } else {
            return false;
        }
    };

    const checkVictory = (posX, posY, playerMarker) =>
    {
        let adjacentBoxes = gameBoardController.getAdjacent(posX, posY, playerMarker);
        if(adjacentBoxes.length > 0)
        {
            for(const box of adjacentBoxes)
            {
                let split = box.split(',');
                let secondaryAdjacentBoxes = gameBoardController.getAdjacent(split[0], split[1], split[2]);
                
                // clean up origin box
                if(secondaryAdjacentBoxes.includes((+posX) + "," + (+posY) + "," + playerMarker))
                {
                    let index = secondaryAdjacentBoxes.indexOf((+posX) + "," + (+posY) + "," + playerMarker);
                    secondaryAdjacentBoxes.splice(index, 1);
                }

                if(secondaryAdjacentBoxes.length > 0)
                {
                    // probable winner, check if it's in a line
                    for(const adjBox of secondaryAdjacentBoxes)
                    {
                        let adjSplit = adjBox.split(',');
                        if(gameBoardController.makeALine((+posX), (+posY), (+split[0]), (+split[1]), (+adjSplit[0]), (+adjSplit[1])))
                        {
                            // We won!
                            return true;
                        }
                    }
                    return false;
                }
            }

            return false;
        }

        return false;
    }

    const executeVictory = (winner) => {
        gameStatus = "finished";
        winner.playerWon();
    }

    return { getGameStatus, cleanUpPlayers, appendPlayer, nextPlayer, playNextTurn, checkVictory, executeVictory, startGame, restartGame };
})();

const mainController = (function(doc) {
    let gameOpponent;
    let gameMarker;
    let gamePlayerName, gamePlayerTwoName;
    const gameCaption = doc.querySelector('.content-box-caption');

    const registerOpponentSelection = () => {
        const selectComputer = doc.querySelector('#selectComputer');
        const selectPlayer = doc.querySelector('#selectPlayer');

        selectComputer.addEventListener("click", clickHandler);
        selectPlayer.addEventListener("click", clickHandler);
    };

    const clickHandler = (event) => {
        if(event.target.id === "selectComputer")
        {
            gameOpponent = "computer";
            appendPlayerMarker();
        } else if(event.target.id === "selectPlayer")
        {
            gameOpponent = "player";
            appendPlayerMarker();
        } else if(event.target.id === "selectX")
        {
            gameMarker = "X";
            appendPlayerNames();
        } else if(event.target.id === "selectO")
        {
            gameMarker = "O";
            appendPlayerNames();
        } else if(event.target.id === "restartGame")
        {
            restartGame();
        } else if(event.target.id === "diffEasy")
        {
            const diffCaption = document.querySelector('.content-box-difficulty-caption');
            diffCaption.textContent = "Computer difficulty: EASY";
        } else if(event.target.id === "diffMedium")
        {
            const diffCaption = document.querySelector('.content-box-difficulty-caption');
            diffCaption.textContent = "Computer difficulty: MEDIUM";
        } else if(event.target.id === "diffHard")
        {
            const diffCaption = document.querySelector('.content-box-difficulty-caption');
            diffCaption.textContent = "Computer difficulty: HARD";
        } else if(event.target.id === "diffUnbeatable")
        {
            const diffCaption = document.querySelector('.content-box-difficulty-caption');
            diffCaption.textContent = "Computer difficulty: UNBEATABLE";
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

            gamePlayerName = playerOne.value;

            if(gameOpponent !== "computer")
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

                gamePlayerTwoName = playerTwo.value;
            }

            startGame();

        } else if(event.target.classList.contains("box") && event.target.getAttribute("data-position").includes(","))
        {
            if(gameController.getGameStatus() !== "started" && gameController.getGameStatus() !== "restarted")
            {
                return;
            }

            let currentPlayer = gameController.nextPlayer();
            let position = event.target.getAttribute("data-position").split(',');
            if(gameController.playNextTurn(position[0], position[1], currentPlayer.playerMarker))
            {
                if(event.target.classList.contains("hov"))
                {
                    event.target.classList.remove("hov");
                }

                event.target.textContent = currentPlayer.playerMarker;
                if(gameController.checkVictory(position[0], position[1], currentPlayer.playerMarker))
                {
                    gameController.executeVictory(currentPlayer);
                    notifyVictory(currentPlayer);
                } else {
                    gameCaption.textContent = `It's ${gameController.nextPlayer().playerName}'s turn`;

                }
            }
        }
    }

    const appendPlayerMarker = () => {
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
        crossMarker.addEventListener("click", clickHandler);
        crossMarker.textContent = "X"; 
        selectParent.appendChild(crossMarker);

        let circleMarker = document.createElement("div");
        circleMarker.classList.add("content-box-select-button");
        circleMarker.setAttribute("id", "selectO");
        circleMarker.addEventListener("click", clickHandler);
        circleMarker.textContent = "O"; 
        selectParent.appendChild(circleMarker);

        gameCaption.textContent = "Please select a marker:";

    }

    const appendPlayerNames = () => {
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

        if(gameOpponent !== "computer")
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
        selectNamesButton.addEventListener("click", clickHandler);
        selectNamesButton.textContent = "Select names"; 
        endParent.appendChild(selectNamesButton);

        gameCaption.textContent = "Please input your name:";

    }

    const restartGame = () => {
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

    const startGame = () => {
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
        restartButton.addEventListener("click", clickHandler);
        restartButton.textContent = "Restart"; 
        endParent.appendChild(restartButton);

        if(gameOpponent === "computer")
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
            easyButton.addEventListener("click", clickHandler);
            easyButton.textContent = "Easy"; 
            difficultyBox.appendChild(easyButton);

            let mediumButton = document.createElement("div");
            mediumButton.classList.add("content-box-select-button");
            mediumButton.setAttribute("id", "diffMedium");
            mediumButton.addEventListener("click", clickHandler);
            mediumButton.textContent = "Medium"; 
            difficultyBox.appendChild(mediumButton);

            let hardButton = document.createElement("div");
            hardButton.classList.add("content-box-select-button");
            hardButton.setAttribute("id", "diffHard");
            hardButton.addEventListener("click", clickHandler);
            hardButton.textContent = "Hard"; 
            difficultyBox.appendChild(hardButton);

            let unbeatableButton = document.createElement("div");
            unbeatableButton.classList.add("content-box-select-button");
            unbeatableButton.setAttribute("id", "diffUnbeatable");
            unbeatableButton.addEventListener("click", clickHandler);
            unbeatableButton.textContent = "Unbeatable"; 
            difficultyBox.appendChild(unbeatableButton);

            endParent.appendChild(difficultyBox);
        }

        // cleanup (just in case) & append players
        gameController.cleanUpPlayers();
        gameController.appendPlayer(gamePlayerName, (gameMarker === "O") ? "O" : "X", 0, "player");
        gameController.appendPlayer((gameOpponent === "computer") ? "Computer" : gamePlayerTwoName, (gameMarker !== "O") ? "O" : "X", 0, (gameOpponent === "computer") ? "computer" : "player");

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
                gameSquare.addEventListener("click", clickHandler);
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

    const notifyVictory = (winner) => {
        gameCaption.textContent = `${winner.playerName} WON!`;
    };

    return { registerOpponentSelection };

})(document);

// General code
mainController.registerOpponentSelection();