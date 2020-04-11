import React, {useState} from 'react'
import './Game.css'
import Button from '../components/Button';

const initialGameArray = [null, null, null, null, null, null, null, null, null]

const LOCAL_MULTIPLAYER_GAME = 1
const LOCAL_SINGLEPLAYER_GAME = 2

export default props => {
    let [lastPlayer, setLastPlayer] = useState(0)
    let [gameArray, setGameArray] = useState([...initialGameArray])
    let [message, setMessage] = useState('')
    let [gametype, setGameType] = useState(LOCAL_SINGLEPLAYER_GAME)
    let [gameTypeDescription, setGameTypeDescription] = useState('Single Player')
    let [gameOver, setGameOver] = useState(false)

    const play = (i) => {
        if(gameOver) {
            return;
        }

        if(lastPlayer === 0) {
            gameArray[i] = 'X';
            lastPlayer = 1
        } else {
            gameArray[i] = 'O';
            lastPlayer = 0
        }

        setGameArray(gameArray);
        setLastPlayer(lastPlayer);
    }

    const userPlay = (i) => {
        if(gameArray[i] === 'X' || gameArray[i] === 'O') {
            return;
        }

        play(i)

        if(gametype === LOCAL_SINGLEPLAYER_GAME) {
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    computerPlay()
                    resolve("Your move")
                }, 1000)
            }).then(() => {
                checkGameOver()
            })
        }

        checkGameOver()
    }

    const computerPlay = () => {
        let move = Math.floor(Math.random() * 9)

        while(gameArray[move] !== null) {
            if(!gameArray.includes(null)) {
                return;
            }
            move = Math.floor(Math.random() * 9)
        }

        play(move)
    }

    const checkGameOver = () => {
        let row1 = [0,1,2]
        let row2 = [3,4,5]
        let row3 = [6,7,8]
        
        let column1 = [0,3,6]
        let column2 = [1,4,7]
        let column3 = [2,5,8]

        let diagonal1 = [2,4,6]
        let diagonal2 = [0,4,8]

        let winningPossibilities = [row1, row2, row3, column1, column2, column3, diagonal1, diagonal2]
        
        winningPossibilities.forEach((possibility, i) => {
            let checkArray = []

            possibility.forEach((position, i)=>{
                checkArray[i] = gameArray[position]
            })
            
            if(checkArray.includes('X') && !checkArray.includes('O') && !checkArray.includes(null)) {
                setMessage('Jogador X venceu')
                setLastPlayer(0);
                gameOver = true
                return;
            }
            
            if(checkArray.includes('O') && !checkArray.includes('X') && !checkArray.includes(null)) {
                setMessage('Jogador 0 venceu')
                setLastPlayer(1);
                gameOver = true
                return;
            }
        });

        if(!gameOver && !gameArray.includes(null)) {
            setMessage('Deu velha!')
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
                <button onClick={()=> restart(LOCAL_SINGLEPLAYER_GAME)}>Singleplayer</button>
                <button onClick={()=> restart(LOCAL_MULTIPLAYER_GAME)}>Local Multiplayer</button>
            </div>
            <div className="message">
                <h2>{message}</h2>
            </div>
        </div>
    )
}