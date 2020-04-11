import React, {useState} from 'react'
import './Game.css'
import Button from '../components/Button';

const initialGameArray = [null, null, null, null, null, null, null, null, null]

const row1 = [0,1,2]
const row2 = [3,4,5]
const row3 = [6,7,8]

const column1 = [0,3,6]
const column2 = [1,4,7]
const column3 = [2,5,8]

const diagonal1 = [2,4,6]
const diagonal2 = [0,4,8]

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
                }, 1000)
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

        return defenseMove()
    }

    const defenseMove = () => {
        let winningPossibilities = [row1, row2, row3, column1, column2, column3, diagonal1, diagonal2]
        let userWinningPossibilities = []
        
        winningPossibilities.forEach(possibility => {
            let checkArray = []

            possibility.forEach((position, i)=>{
                checkArray[i] = gameArray[position]
            })

            if(checkArray.includes(lastPlayer) && !checkArray.includes(lastPlayer === 'O' ? 'X' : 'O')) {
                userWinningPossibilities.push([checkArray, possibility])
            }
        })

        console.log('userWinningPossibilities', userWinningPossibilities)
        
        let possibilitiesUserCanWinInTheNextMove = userWinningPossibilities.filter(possibility => {
            return possibility[0].filter(move => {
                return move === null
            }).length === 1
        })
        
        console.log(`possibilitiesUserCanWinInTheNextMove`, possibilitiesUserCanWinInTheNextMove)
        
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

    const hardMove = () => {
        console.log('hard move')
    }

    const checkGameOver = () => {
        let winningPossibilities = [row1, row2, row3, column1, column2, column3, diagonal1, diagonal2]
        
        winningPossibilities.forEach((possibility, i) => {
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
            case LOCAL_MULTIPLAYER_GAME:
                return 'Local Multiplayer'
            case LOCAL_SINGLEPLAYER_GAME:
                return 'Singleplayer'
        }

        return ''
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