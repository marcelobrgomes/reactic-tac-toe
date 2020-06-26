import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'

import Gameboard from './Gameboard'

export default props => {
    const [socket, setSocket] = useState(io('http://localhost:3001'))
    const [waitingOponent, setWaitingOponent] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState(null)
    const [oponentId, setOponentId] = useState(null)

    useEffect(()=> {
        if(!props.message) {
            props.setMessage('Conectando no servidor...')
        }
        
        socket.emit('join')

        socket.on('playerConnected', (connectionData) => {
            props.setMessage(connectionData.message)

            if(connectionData.room) {
                setWaitingOponent(connectionData.room.length < 2)            
            }

            setCurrentPlayer(connectionData.player)
        })

        socket.on('updateBoard', gameData => {
            props.setGameArray(gameData.gameArray)
            props.setNextPlayer(gameData.nextPlayer)
            props.setMessage(gameData.message)
            setWaitingOponent(false)
        })

        socket.on('youWin', gameData => {
            props.setMessage(gameData.message)
        })

        socket.on('youLose', gameData => {
            props.setMessage(gameData.message)
        })
    }, [socket])

    const userPlay = (i) => {
        if(waitingOponent) {
            return
        }

        props.userPlay(i)
        setWaitingOponent(true)

        socket.emit('play', {
            gameArray: props.gameArray,
            nextPlayer: props.getNextPlayer(props.nextPlayer)
        })

        props.setMessage('Aguardando oponente')
    }

    useEffect(()=>{    
        props.checkGameOver()

        if(props.gameOver) {
            socket.emit('gameOver', {
                winner: props.winner === currentPlayer,
                gameArray: props.gameArray,
                nextPlayer: props.getNextPlayer(props.nextPlayer)
            })
        }
    }, [props.gameArray])

    return (
        <Gameboard
            message={props.message}
            showLevelSwitch={false}
            userPlay={userPlay}
            gameArray={props.gameArray}
            xCount={props.xCount}
            oCount={props.oCount}
            restart={props.restart}
        />
    )
}