import React, {useState, useEffect} from 'react'
import './Gameboard.css'
import GameButton from '../GameButton/GameButton';
import LevelSwitch from './LevelSwitch'
import {LOCAL_SINGLEPLAYER_GAME} from '../../Constants'
import {easyMove, normalMove, hardMove} from './ComputerMoves'

import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Label,
    FormGroup,
    Input,
    Table,
    Row,
    Col,
    UncontrolledTooltip
  } from "reactstrap";

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

export default props => {
    const [level, setLevel] = useState('normal')
    const [lastPlayer, setLastPlayer] = useState('O')
    const [gameArray, setGameArray] = useState([...initialGameArray])
    const [message, setMessage] = useState('')
    const [gameOver, setGameOver] = useState(false)
    const [winner, setWinner] = useState(null)
    const [previousWinner, setPreviousWinner] = useState(null)
    const [eventAnimationRegistered, setEventAnimationRegistered] = useState(false)
    const [computerPlayed, setComputerPlayed] = useState(true)

    /*
    Levels:
    - Easy: just random moves
    - Normal: Defense moves
    - Hard: Atack and defense moves
    */
    const computerPlay = () => {
        setTimeout(() => {
            let move
            switch(level) {
                case 'easy':
                    move = easyMove(gameArray)
                    break
                case 'hard':
                    move = hardMove(lastPlayer, WINNING_POSSIBILITIES, gameArray)
                    break
                default:
                    move = normalMove(lastPlayer, WINNING_POSSIBILITIES, gameArray)
            }
            play(move)
            setComputerPlayed(true)
            
        }, 500)
    }

    const play = (i) => {
        let player = getNextPlayer(lastPlayer)
        gameArray[i] = player;
        setLastPlayer(player);
        setGameArray([...gameArray])
    }

    const userPlay = (i) => {
        if(gameOver) {
            restart()
            return
        }

        if(gameArray[i] !== null) {
            return;
        }
        
        play(i)
        setComputerPlayed(false)
    }
    
    useEffect(()=>{
        console.log('useEffect computerPlayed')
        let computerWillMoveAgain = !gameOver && props.gameMode === LOCAL_SINGLEPLAYER_GAME && !computerPlayed
        if(computerWillMoveAgain) {
            console.log('computer will play now')
            computerPlay()
        }
    }, [computerPlayed])

    const getNextPlayer = (currentPlayer) => {
        return currentPlayer === 'X' ? 'O' : 'X'
    }
    
    useEffect(()=>{    
        console.log('useEffect gameArray');
        
        if(gameArray.every(element => element === null)) {
            console.log('gamearray reiniciou')
            
            if(computerWonLastGame(winner ? winner : previousWinner)) {
                console.log('computer won');
                setTimeout(() => {
                        computerPlay()
                    },
                    2000
                )
            }
            return
        }
        
        checkGameOver()

    }, [gameArray])
    
    const checkGameOver = () => {
        WINNING_POSSIBILITIES.forEach((possibility, i) => {
            let checkArray = []
            
            possibility.forEach((position, i)=>{
                checkArray[i] = gameArray[position]
            })
            
            if(checkArray.includes('X') && !checkArray.includes('O') && !checkArray.includes(null)) {
                setMessage(`X ganhou!`)
                setWinner('X')
                setGameOver(true)
                return;
            }
            
            if(checkArray.includes('O') && !checkArray.includes('X') && !checkArray.includes(null)) {
                setMessage(`O ganhou!`)
                setWinner('O')
                setGameOver(true)
                return;
            }
            //console.log('checkarray', checkArray)
        });
        
        if(!gameOver && !gameArray.includes(null)) {
            console.log('gamearray empate ', gameArray)
            setMessage('Empatou!')
            setWinner(null)
            setGameOver(true)
        }
    }
    
    useEffect(()=> {
        console.log('useEffect gameOver')
        if(gameOver) {
            if(winner) {
                setLastPlayer(getNextPlayer(winner))
                console.log('winner', winner)
            } else if(previousWinner) {
                setLastPlayer(getNextPlayer(previousWinner))
                console.log(previousWinner)
            } else { //if drawed in the first play
                console.log('drawed first')
                setLastPlayer('O')
            }
        } 
    }, [gameOver])
    
    useEffect(()=>{
        console.log('useEffect level')
        setLastPlayer('O')
        setGameArray([...initialGameArray])
        setMessage('')
        setGameOver(false)
        setWinner(null)
        setPreviousWinner(null)
        setComputerPlayed(true)
    }, [level])

    const restart = () => {
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
        
        if(!eventAnimationRegistered) {
            boardElement.addEventListener('animationend', function(e) {
                setEventAnimationRegistered(true) 
                boardElement.classList.remove('rollOut')
        
                if(e.animationName === 'rollIn') {
                    // if(computerWonLastGame()) {
                    //     console.log('computer won');
                        
                    //     computerPlay()
                    // }
                }
            })
        }
    }

    const computerWonLastGame = (winner) => {
        return winner === 'O' && props.gameMode === LOCAL_SINGLEPLAYER_GAME
    }

    return (
        <React.Fragment>
            <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                      <h5 className="card-category">Placar: </h5>
                      <CardTitle tag="h2">{message}&nbsp;</CardTitle>
                    </Col>
                    {props.gameMode === LOCAL_SINGLEPLAYER_GAME ? 
                        <Col sm="6">
                            <LevelSwitch 
                                level={level} 
                                setLevel={setLevel}
                                restart={restart}
                            />
                        </Col>
                    : 
                        null}
                  </Row>
                </CardHeader>
                <CardBody>
                    <div className={`board animated`}>
                        <div></div>
                        <GameButton id="0" key={0} play={userPlay} value={gameArray[0]}/>
                        <GameButton id="1" key={1} play={userPlay} value={gameArray[1]}/>
                        <GameButton id="2" key={2} play={userPlay} value={gameArray[2]} className="top-right"/>
                        <div></div>
                        <div></div>
                        <GameButton id="3" key={3} play={userPlay} value={gameArray[3]}/>
                        <GameButton id="4" key={4} play={userPlay} value={gameArray[4]}/>
                        <GameButton id="5" key={5} play={userPlay} value={gameArray[5]} className="middle-right"/>
                        <div></div>
                        <div></div>
                        <GameButton id="6" key={6} play={userPlay} value={gameArray[6]} className="bottom-left"/>
                        <GameButton id="7" key={7} play={userPlay} value={gameArray[7]} className="bottom-middle"/>
                        <GameButton id="8" key={8} play={userPlay} value={gameArray[8]} className="bottom-right"/>
                        <div></div>
                    </div>
                </CardBody>
              </Card>
        </React.Fragment>
    )
}