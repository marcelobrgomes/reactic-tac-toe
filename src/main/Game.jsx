import React, {useState} from 'react'
import './Game.css'
import Button from '../components/Button';

const initialGameArray = [null, null, null, null, null, null, null, null, null]

const ROW_1 = [0,1,2]
const ROW_2 = [3,4,5]
const ROW_3 = [6,7,8]

const COLUMN_1 = [0,3,6]
const COLUMN_2 = [1,4,7]
const COLUMN_3 = [2,5,8]

const DIAGONAL_1 = [2,4,6]
const DIAGONAL_2 = [0,4,8]

const WINNING_POSSIBILITIES = [ROW_1, ROW_2, ROW_3, COLUMN_1, COLUMN_2, COLUMN_3, DIAGONAL_1, DIAGONAL_2]

const LOCAL_MULTIPLAYER_GAME = 1
const LOCAL_SINGLEPLAYER_GAME = 2

export default props => {
    let [lastPlayer, setLastPlayer] = useState('O')
    let [gameArray, setGameArray] = useState([...initialGameArray])
    let [message, setMessage] = useState('')
    let [gametype, setGameType] = useState(LOCAL_SINGLEPLAYER_GAME)
    let [gameTypeDescription, setGameTypeDescription] = useState('Singleplayer')
    let [gameOver, setGameOver] = useState(false)
    let [playerX, setPlayerX] = useState(undefined)
    let [playerO, setPlayerO] = useState('Computer')
    let [winner, setWinner] = useState(null)
    let [level, setLevel] = useState('normal')
    let [computerFirstPositionPlayed, setComputerFirstPositionPlayed] = useState(null)

    const play = (i) => {
        if(gameOver) {
            return;
        }

        if(lastPlayer === 'O') {
            gameArray[i] = 'X';
            lastPlayer = 'X'
        } else {
            gameArray[i] = 'O';
            lastPlayer = 'O'
        }

        setGameArray(gameArray)
        setLastPlayer(lastPlayer)

        checkGameOver()
    }

    const userPlay = (i) => {
        if(gameArray[i] === 'X' || gameArray[i] === 'O') {
            return;
        }

        play(i)
        computerPlay()
    }

    /*
    Levels:
    - Easy: just random moves
    - Normal: Defense moves
    - Hard: Atack and defense moves
    */
    const computerPlay = () => {
        if(gametype === LOCAL_SINGLEPLAYER_GAME) {
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    let move

                    switch(level) {
                        case 'easy':
                            move = easyMove()
                            break
                        case 'hard':
                            move = hardMove()
                            break
                        default:
                            move = normalMove()
                    }

                    play(move)
                    resolve("Your move")
                }, 500)
            }).then(() => {
                checkGameOver()
            })
        }
    }

    const easyMove = () => {
        let move = Math.floor(Math.random() * 9)

        while(gameArray[move] !== null) {
            if(!gameArray.includes(null)) {
                return;
            }
            move = Math.floor(Math.random() * 9)
        }

        return move;
    }

    const normalMove = () => {
        let move

        if(!computerFirstPositionPlayed) {
            console.log('first computer move')
            move = easyMove()
            setComputerFirstPositionPlayed(move)
            return move
        }

        let userWinningPossibilities = getWinningPossibilities(lastPlayer)
        let possibilitiesUserCanWinInTheNextMove = getPossibilitiesPlayerCanWinInTheNextMove(userWinningPossibilities)
        console.log(`possibilitiesUserCanWinInTheNextMove`, possibilitiesUserCanWinInTheNextMove)

        return defenseMove(userWinningPossibilities, possibilitiesUserCanWinInTheNextMove)
    }

    const getWinningPossibilities = (player) => {
        console.log(`player`, player)
        let userWinningPossibilities = []

        WINNING_POSSIBILITIES.forEach(possibility => {
            let checkArray = []

            possibility.forEach((position, i)=>{
                checkArray[i] = gameArray[position]
            })

            if(checkArray.includes(player) && !checkArray.includes(player === 'X' ? 'O' : 'X')) {
                userWinningPossibilities.push([checkArray, possibility])
            }
        })

        console.log('player winning possibilities', userWinningPossibilities)

        return userWinningPossibilities;
    }

    const getPossibilitiesPlayerCanWinInTheNextMove = (playerWinningPossibilities) => {
        return playerWinningPossibilities.filter(possibility => {
            return possibility[0].filter(move => {
                return move === null
            }).length === 1
        })
    }

    const defenseMove = (userWinningPossibilities, possibilitiesUserCanWinInTheNextMove) => {
        let defendedPossibilityIndex
        let possibilityToDefend
        let availablePosition
        
        if(possibilitiesUserCanWinInTheNextMove.length > 0) {
            //if exists more than one possibility of user wins in the next move, random choose a position for defend.
            defendedPossibilityIndex = Math.floor(Math.random() * possibilitiesUserCanWinInTheNextMove.length)
            possibilityToDefend = possibilitiesUserCanWinInTheNextMove[defendedPossibilityIndex]
            availablePosition = possibilityToDefend[0].lastIndexOf(null);

            console.log('Position of the user winning possibility', possibilityToDefend[1][availablePosition])
            return possibilityToDefend[1][availablePosition]
        }

        defendedPossibilityIndex = Math.floor(Math.random() * userWinningPossibilities.length)
        possibilityToDefend = userWinningPossibilities[defendedPossibilityIndex]

        if(possibilityToDefend) {
            availablePosition = possibilityToDefend[0].lastIndexOf(null);
            console.log('User cannot win in the next move, so playing in a empty slot', possibilityToDefend[1][availablePosition])
            return possibilityToDefend[1][availablePosition]
        }
        
        return gameArray.lastIndexOf(null) //else, return the last available position
    }

    const attackMove = (computerWinningPossibilities, possibilitiesComputerCanWinInTheNextMove) => {
        let attackPossibilityIndex
        let possibilityToAttack
        let availablePosition
        
        if(possibilitiesComputerCanWinInTheNextMove.length > 0) {
            //if exists more than one possibility of user wins in the next move, random choose a position for defend.
            attackPossibilityIndex = Math.floor(Math.random() * possibilitiesComputerCanWinInTheNextMove.length)
            possibilityToAttack = possibilitiesComputerCanWinInTheNextMove[attackPossibilityIndex]
            availablePosition = possibilityToAttack[0].lastIndexOf(null);

            console.log('Position of the computer winning possibility', possibilityToAttack[1][availablePosition])
            return possibilityToAttack[1][availablePosition]
        }

        attackPossibilityIndex = Math.floor(Math.random() * computerWinningPossibilities.length)
        possibilityToAttack = computerWinningPossibilities[attackPossibilityIndex]

        if(possibilityToAttack) {
            availablePosition = possibilityToAttack[0].lastIndexOf(null);
            console.log('Computer cannot win in the next move, so playing in a empty slot', possibilityToAttack[1][availablePosition])
            return possibilityToAttack[1][availablePosition]
        }
        
        return gameArray.lastIndexOf(null) //else, return the last available position
    }

    const hardMove = () => {
        let move

        if(!computerFirstPositionPlayed) {
            move = easyMove()
            setComputerFirstPositionPlayed(move)
            return move
        }

        let userWinningPossibilities = getWinningPossibilities(lastPlayer)
        let possibilitiesUserCanWinInTheNextMove = getPossibilitiesPlayerCanWinInTheNextMove(userWinningPossibilities)
        
        console.log(`possibilitiesUserCanWinInTheNextMove`, possibilitiesUserCanWinInTheNextMove)
        
        let computerWinningPossibilities = getWinningPossibilities(lastPlayer === 'X' ? 'O' : 'X')
        let possibilitiesComputerCanWinInTheNextMove = getPossibilitiesPlayerCanWinInTheNextMove(computerWinningPossibilities)

        console.log(`possibilitiesComputerCanWinInTheNextMove`, possibilitiesComputerCanWinInTheNextMove)

        if(possibilitiesComputerCanWinInTheNextMove.length > 0) {
            return attackMove(computerWinningPossibilities, possibilitiesComputerCanWinInTheNextMove)
        } else if(possibilitiesUserCanWinInTheNextMove.length > 0) {
            return defenseMove(userWinningPossibilities, possibilitiesUserCanWinInTheNextMove)
        } 

        return defenseMove(userWinningPossibilities, possibilitiesUserCanWinInTheNextMove)
    }

    const checkGameOver = () => {
        WINNING_POSSIBILITIES.forEach((possibility, i) => {
            let checkArray = []

            possibility.forEach((position, i)=>{
                checkArray[i] = gameArray[position]
            })
            
            if(checkArray.includes('X') && !checkArray.includes('O') && !checkArray.includes(null)) {
                setMessage(`${playerX ? playerX : 'Player X'} wins!`)
                setWinner(playerX)
                setLastPlayer('0');
                gameOver = true
                return;
            }
            
            if(checkArray.includes('O') && !checkArray.includes('X') && !checkArray.includes(null)) {
                setMessage(`${playerO ? playerO : 'Player O'} wins!`)
                setWinner(playerO)
                setLastPlayer('X');
                gameOver = true
                return;
            }
        });

        if(!gameOver && !gameArray.includes(null)) {
            setMessage('Tie in the game!')

            if(winner) {
                setLastPlayer(winner === playerX ? 'O' : 'X')
            }

            gameOver = true
        }

        setGameOver(gameOver)
    }

    const restart = (gameType) => {
        setGameArray([...initialGameArray])
        setGameType(gameType)
        setGameTypeDescription(getGametypeDescription(gameType))
        setMessage(null)
        setGameOver(false)
        setComputerFirstPositionPlayed(null)
        setLastPlayer(winner === playerX ? 'O' : 'X')

        if(winner === 'Computer') {
            gameArray = [...initialGameArray]
            computerFirstPositionPlayed = null
            gameOver = false
            
            computerPlay()
        }
    }

    const getGametypeDescription = (gameType) => {
        switch(gameType) {
            case LOCAL_SINGLEPLAYER_GAME:
                return 'Singleplayer'
            default:
                return 'Local Multiplayer'
        }
    }

    return (
        <div className="container">
            <div>
                <p className="gametype">{gameTypeDescription}</p>
                <div className="game">
                    <Button id="0" play={userPlay} value={gameArray[0]}/>
                    <Button id="1" play={userPlay} value={gameArray[1]}/>
                    <Button id="2" play={userPlay} value={gameArray[2]}/>
                    <Button id="3" play={userPlay} value={gameArray[3]}/>
                    <Button id="4" play={userPlay} value={gameArray[4]}/>
                    <Button id="5" play={userPlay} value={gameArray[5]}/>
                    <Button id="6" play={userPlay} value={gameArray[6]}/>
                    <Button id="7" play={userPlay} value={gameArray[7]}/>
                    <Button id="8" play={userPlay} value={gameArray[8]}/>
                </div>
            </div>
            <div className="options">
                <p className="playerName">Player X: <input type="text" id="playerOne" value={playerX} onChange={(e) => setPlayerX(e.target.value)}/></p>
                <p className="playerName">Player O: <input type="text" id="playerTwo" value={playerO} onChange={(e) => setPlayerO(e.target.value)}/></p>
                <div className="optionButtons">
                    <button onClick={()=> restart(LOCAL_SINGLEPLAYER_GAME)}>Singleplayer</button>
                    <select id="level" onChange={(e) => {restart(LOCAL_SINGLEPLAYER_GAME); setLevel(e.target.value)}} defaultValue="normal">
                        <option value="easy">Easy</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                    </select>
                    <button onClick={()=> restart(LOCAL_MULTIPLAYER_GAME)}>Local Multiplayer</button>
                </div>
            </div>
            <div className="message">
                <h2>{message}</h2>
            </div>
        </div>
    )
}