
const CENTER_POSITION = 4

const randomMove = (gameArray) => {
    let move = Math.floor(Math.random() * 9)

    while(gameArray[move] !== null) {
        if(!gameArray.includes(null)) {
            return;
        }
        move = Math.floor(Math.random() * 9)
    }

    return move;
}

const easyMove = (lastPlayer, winningPossibilities, gameArray) => {
    let userWinningPossibilities = getWinningPossibilities(lastPlayer, winningPossibilities, gameArray)
    let possibilitiesUserCanWinInTheNextMove = getPossibilitiesPlayerCanWinInTheNextMove(userWinningPossibilities)

    return defenseMove(userWinningPossibilities, possibilitiesUserCanWinInTheNextMove, gameArray)
}

const getWinningPossibilities = (player, winningPossibilities, gameArray) => {
    let userWinningPossibilities = []

    winningPossibilities.forEach(possibility => {
        let checkArray = []

        possibility.forEach((position, i)=>{
            checkArray[i] = gameArray[position]
        })

        if(checkArray.includes(player) && !checkArray.includes(player === 'X' ? 'O' : 'X')) {
            userWinningPossibilities.push([checkArray, possibility])
        }
    })

    return userWinningPossibilities;
}

const getPossibilitiesPlayerCanWinInTheNextMove = (playerWinningPossibilities) => {
    return playerWinningPossibilities.filter(possibility => {
        return possibility[0].filter(move => {
            return move === null
        }).length === 1
    })
}

const defenseMove = (userWinningPossibilities, possibilitiesUserCanWinInTheNextMove, gameArray) => {
    let defendedPossibilityIndex
    let possibilityToDefend
    let availablePosition
    
    if(possibilitiesUserCanWinInTheNextMove.length > 0) {
        //if exists more than one possibility of user wins in the next move, random choose a position for defend.
        defendedPossibilityIndex = Math.floor(Math.random() * possibilitiesUserCanWinInTheNextMove.length)
        possibilityToDefend = possibilitiesUserCanWinInTheNextMove[defendedPossibilityIndex]
        availablePosition = possibilityToDefend[0].lastIndexOf(null);

        //Position of the user's winning possibility
        return possibilityToDefend[1][availablePosition]
    }

    defendedPossibilityIndex = Math.floor(Math.random() * userWinningPossibilities.length)
    possibilityToDefend = userWinningPossibilities[defendedPossibilityIndex]

    if(possibilityToDefend) {
        availablePosition = possibilityToDefend[0].lastIndexOf(null);
        //User cannot win in the next move, so playing in a empty slot
        return possibilityToDefend[1][availablePosition]
    }
    
    return gameArray.lastIndexOf(null) //else, return the last available position
}

const attackMove = (computerWinningPossibilities, possibilitiesComputerCanWinInTheNextMove, gameArray) => {
    let attackPossibilityIndex
    let possibilityToAttack
    let availablePosition
    
    if(possibilitiesComputerCanWinInTheNextMove.length > 0) {
        //if exists more than one possibility of user wins in the next move, random choose a position for defend.
        attackPossibilityIndex = Math.floor(Math.random() * possibilitiesComputerCanWinInTheNextMove.length)
        possibilityToAttack = possibilitiesComputerCanWinInTheNextMove[attackPossibilityIndex]
        availablePosition = possibilityToAttack[0].lastIndexOf(null);

        return possibilityToAttack[1][availablePosition]
    }

    attackPossibilityIndex = Math.floor(Math.random() * computerWinningPossibilities.length)
    possibilityToAttack = computerWinningPossibilities[attackPossibilityIndex]

    if(possibilityToAttack) {
        availablePosition = possibilityToAttack[0].lastIndexOf(null);
        //Computer cannot win in the next move, so playing in a empty slot
        return possibilityToAttack[1][availablePosition]
    }
    
    return gameArray.lastIndexOf(null) //else, return the last available position
}

const normalMove = (lastPlayer, winningPossibilities, gameArray) => {
    let userWinningPossibilities = getWinningPossibilities(lastPlayer, winningPossibilities, gameArray)
    let possibilitiesUserCanWinInTheNextMove = getPossibilitiesPlayerCanWinInTheNextMove(userWinningPossibilities)
    
    let computerWinningPossibilities = getWinningPossibilities(lastPlayer === 'X' ? 'O' : 'X', winningPossibilities, gameArray)
    let possibilitiesComputerCanWinInTheNextMove = getPossibilitiesPlayerCanWinInTheNextMove(computerWinningPossibilities)

    if(possibilitiesComputerCanWinInTheNextMove.length > 0) {
        return attackMove(computerWinningPossibilities, possibilitiesComputerCanWinInTheNextMove, gameArray)
    } else if(possibilitiesUserCanWinInTheNextMove.length > 0) {
        return defenseMove(userWinningPossibilities, possibilitiesUserCanWinInTheNextMove, gameArray)
    } 

    return defenseMove(userWinningPossibilities, possibilitiesUserCanWinInTheNextMove, gameArray)
}

const isFirstGameMove = (gameArray) => {
    return gameArray.every(element => element === null)
}

const isSecondGameMove = (gameArray) => {
    return gameArray.filter(element => element !== null).length === 1
}

const cornerMove = (gameArray) => {
    let cornerPositions = [0, 2, 6, 8]
    let emptyCornerPositions = cornerPositions.filter(position => gameArray[position] === null)

    return emptyCornerPositions[Math.floor(Math.random() * emptyCornerPositions.length)]
}

const edgeMove = (gameArray) => {
    let edgePositions = [1, 3, 5, 7]
    let emptyEdgePositions = edgePositions.filter(position => gameArray[position] === null)

    return emptyEdgePositions[Math.floor(Math.random() * emptyEdgePositions.length)]
}

const getFilledCornerPositions = (gameArray) => {
    let cornerPositions = [0, 2, 6, 8]
    return cornerPositions.filter(position => gameArray[position] !== null)
}

const isUserDoingATriangle = (gameArray) => {
     let filledCorners = getFilledCornerPositions(gameArray)

     return gameArray[CENTER_POSITION] === 'O' && filledCorners.length === 2 &&
        gameArray.filter(position => gameArray[position] !== null).length === 3 &&
        ((filledCorners.includes(0) && filledCorners.includes(8)) ||  
        (filledCorners.includes(2) && filledCorners.includes(6)) )  
}

const hardMove = (lastPlayer, winningPossibilities, gameArray) => {
    if(isFirstGameMove(gameArray)) {
        return cornerMove(gameArray)
    } else if(isSecondGameMove(gameArray)) {
        return gameArray[CENTER_POSITION] !== null ? cornerMove(gameArray) : CENTER_POSITION
    }
    
    let userWinningPossibilities = getWinningPossibilities(lastPlayer, winningPossibilities, gameArray)
    let possibilitiesUserCanWinInTheNextMove = getPossibilitiesPlayerCanWinInTheNextMove(userWinningPossibilities)
    
    let computerWinningPossibilities = getWinningPossibilities(lastPlayer === 'X' ? 'O' : 'X', winningPossibilities, gameArray)
    let possibilitiesComputerCanWinInTheNextMove = getPossibilitiesPlayerCanWinInTheNextMove(computerWinningPossibilities)

    if(isUserDoingATriangle(gameArray)) {
        return edgeMove(gameArray)
    } else if(possibilitiesComputerCanWinInTheNextMove.length > 0) {
        return attackMove(computerWinningPossibilities, possibilitiesComputerCanWinInTheNextMove, gameArray)
    } else if(possibilitiesUserCanWinInTheNextMove.length > 0) {
        return defenseMove(userWinningPossibilities, possibilitiesUserCanWinInTheNextMove, gameArray)
    } 

    return defenseMove(userWinningPossibilities, possibilitiesUserCanWinInTheNextMove, gameArray)
}

export {randomMove, easyMove, normalMove, hardMove}