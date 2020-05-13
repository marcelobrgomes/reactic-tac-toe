
const easyMove = (gameArray) => {
    let move = Math.floor(Math.random() * 9)

    while(gameArray[move] !== null) {
        if(!gameArray.includes(null)) {
            return;
        }
        move = Math.floor(Math.random() * 9)
    }

    return move;
}

const normalMove = (lastPlayer, winningPossibilities, gameArray) => {
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

const hardMove = (lastPlayer, winningPossibilities, gameArray) => {
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


export {easyMove, normalMove, hardMove}