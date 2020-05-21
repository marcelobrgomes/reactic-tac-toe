import React, {useState, useEffect} from 'react'
import { LOCAL_MULTIPLAYER_GAME, ONLINE_MULTIPLAYER_GAME, WINNING_POSSIBILITIES } from '../../Constants'
import MultiplayerGameboard from './MultiplayerGameboard'
import OnlineMultiplayerGameboard from './OnlineMultiplayerGameboard'
import SinglePlayerGameboard from './SinglePlayerGameboard'

const initialGameArray = [null, null, null, null, null, null, null, null, null]

export default props => {
    const [gameArray, setGameArray] = useState([...initialGameArray])
    const [nextPlayer, setNextPlayer] = useState('X')
    const [message, setMessage] = useState('')
    const [gameOver, setGameOver] = useState(false)
    const [winner, setWinner] = useState(null)
    const [previousWinner, setPreviousWinner] = useState(null)
    const [eventAnimationRegistered, setEventAnimationRegistered] = useState(false)
    const [xCount, setXCount] = useState(0)
    const [oCount, setOCount] = useState(0)

    const play = (i) => {
        gameArray[i] = nextPlayer;
        setNextPlayer(getNextPlayer(nextPlayer));
        setGameArray([...gameArray])
    }

    const getNextPlayer = (currentPlayer) => {
        return currentPlayer === 'X' ? 'O' : 'X'
    }

    const checkGameOver = () => {
        let _gameOver = false

        WINNING_POSSIBILITIES.forEach((possibility) => {
            let checkArray = []
            
            possibility.forEach((position, i)=>{
                checkArray[i] = gameArray[position]
            })
            
            if(checkArray.includes('X') && !checkArray.includes('O') && !checkArray.includes(null)) {
                setMessage(`X ganhou!`)
                setWinner('X')
                setGameOver(true)
                _gameOver = true
                return
            }
            
            if(checkArray.includes('O') && !checkArray.includes('X') && !checkArray.includes(null)) {
                setMessage(`O ganhou!`)
                setWinner('O')
                setGameOver(true)
                _gameOver = true
                return
            }
            
        });
        
        if(!_gameOver && !gameArray.includes(null)) {
            setMessage('Empatou!')
            setWinner(null)
            setGameOver(true)
            return
        }
    }

    const restart = () => {
        if(!gameOver && playerOWasLastWinner(winner ? winner : previousWinner)) {
            setNextPlayer('O')
        }

        setGameArray([...initialGameArray])
        setMessage(null)
        setGameOver(false)
        
        if(winner) {
            setPreviousWinner(winner)
        }
        
        //Animations
        const boardElement = document.querySelector('.board')
        boardElement.classList.add('rollOut')
        boardElement.classList.add('rollIn')
        boardElement.classList.add('fast')
        
        if(!eventAnimationRegistered) {
            boardElement.addEventListener('animationend', function(e) {
                setEventAnimationRegistered(true) 
                boardElement.classList.remove('rollOut')
            })
        }
    }

    const playerOWasLastWinner = (winner) => {
        return winner === 'O'
    }

    useEffect(()=> {
        if(winner) {
            setNextPlayer(winner)
        } else if(previousWinner) {
            setNextPlayer(previousWinner)
        } else { //if drawed in the first play
            setNextPlayer('X')
        }

        if(gameOver) {
            if(winner === 'X') {
                setXCount(xCount + 1)
            } else if(winner === 'O') {
                setOCount(oCount + 1)
            }
        }
    }, [gameOver])

    switch(props.gameMode) {
        case LOCAL_MULTIPLAYER_GAME:
            return <MultiplayerGameboard 
                        gameArray={gameArray}
                        play={play}
                        getNextPlayer={getNextPlayer}
                        nextPlayer={nextPlayer}
                        restart={restart}
                        gameOver={gameOver}
                        checkGameOver={checkGameOver}
                        setXCount={setXCount}
                        setOCount={setOCount}
                        xCount={xCount}
                        oCount={oCount}
                        message={message}
                        playerOWasLastWinner={playerOWasLastWinner}
                        winner={winner}
                        previousWinner={previousWinner}
                    />
        case ONLINE_MULTIPLAYER_GAME:
            return <OnlineMultiplayerGameboard />
        default:
            return <SinglePlayerGameboard 
                        gameArray={gameArray}
                        play={play}
                        getNextPlayer={getNextPlayer}
                        nextPlayer={nextPlayer}
                        restart={restart}
                        gameOver={gameOver}
                        checkGameOver={checkGameOver}
                        setXCount={setXCount}
                        setOCount={setOCount}
                        message={message}
                        playerOWasLastWinner={playerOWasLastWinner}
                        xCount={xCount}
                        oCount={oCount}
                        winner={winner}
                        previousWinner={previousWinner}
                    />
    }
}