import React, {useState, useEffect} from 'react'
import {randomMove, easyMove, normalMove, hardMove} from './ComputerMoves'

import Gameboard from './Gameboard'
import { WINNING_POSSIBILITIES } from '../../Constants'

export default props => {
    const [level, setLevel] = useState('normal')
    const [computerPlayed, setComputerPlayed] = useState(true)
    const [computerWillStart, setComputerWillStart] = useState(false)

    /*
    Levels:
    - Very Easy: just random moves
    - Easy: Defense moves
    - Normal: Atack and defense moves 
    - Hard: Atack and defense moves with initial strategy
    */
    const computerPlay = () => {
        setTimeout(() => {
            let move
            switch(level) {
                case 'veryEasy':
                    move = randomMove(props.gameArray)
                    break
                case 'easy':
                    move = easyMove(props.getNextPlayer(props.nextPlayer), WINNING_POSSIBILITIES, props.gameArray)
                    break
                case 'hard':
                    move = hardMove(props.getNextPlayer(props.nextPlayer), WINNING_POSSIBILITIES, props.gameArray)
                    break
                default:
                    move = normalMove(props.getNextPlayer(props.nextPlayer), WINNING_POSSIBILITIES, props.gameArray)
            }
            props.play(move)
            setComputerPlayed(true)
            
        }, 500)
    }

    const userPlay = (i) => {
        if(props.gameOver) {
            props.restart()
            return
        }

        if(props.gameArray[i] !== null || props.nextPlayer === 'O') {
            return;
        }
        
        props.play(i)
        props.checkGameOver()
        
        if(!props.gameOver) {
            setComputerPlayed(false)
        }
    }
    
    useEffect(()=>{
        let computerWillMoveAgain = !props.gameOver && !computerPlayed
        if(computerWillMoveAgain) {
            computerPlay()
        }
    }, [computerPlayed])
    
    useEffect(()=>{    
        if(props.gameArray.every(element => element === null)) {
            setComputerWillStart(props.playerOWasLastWinner(props.winner ? props.winner : props.previousWinner))
            return
        }
        
        props.checkGameOver()
    }, [props.gameArray])

    useEffect(()=>{
        if(props.gameOver) {
            setComputerPlayed(true)
        }
    }, [props.gameOver])

    useEffect(()=> {
        if(computerWillStart) {
            setTimeout(() => { 
                computerPlay()
                setComputerWillStart(false)
            }, 2000)
            
        }
    }, [computerWillStart])

    useEffect(()=> {
       props.setXCount(0)
       props.setOCount(0)
    }, [level])

    return (
        <Gameboard 
            message={props.message}
            showLevelSwitch={true}
            level={level}
            setLevel={setLevel}
            userPlay={userPlay}
            gameArray={props.gameArray}
            xCount={props.xCount}
            oCount={props.oCount}
            restart={props.restart}
        />
    )
}