import React, {useState, useEffect} from 'react'
import './Gameboard.css'
import GameButton from '../GameButton/GameButton';
import LevelSwitch from './LevelSwitch'
import {LOCAL_SINGLEPLAYER_GAME} from '../../Constants'
import {randomMove, easyMove, normalMove, hardMove} from './ComputerMoves'

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
    UncontrolledTooltip,
    CardFooter
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
    const [nextPlayer, setNextPlayer] = useState('X')
    const [gameArray, setGameArray] = useState([...initialGameArray])
    const [message, setMessage] = useState('')
    const [gameOver, setGameOver] = useState(false)
    const [winner, setWinner] = useState(null)
    const [previousWinner, setPreviousWinner] = useState(null)
    const [eventAnimationRegistered, setEventAnimationRegistered] = useState(false)
    const [computerPlayed, setComputerPlayed] = useState(true)
    const [computerWillStart, setComputerWillStart] = useState(false)
    const [xCount, setXCount] = useState(0)
    const [oCount, setOCount] = useState(0)

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
                    move = randomMove(gameArray)
                    break
                case 'easy':
                    move = easyMove(getNextPlayer(nextPlayer), WINNING_POSSIBILITIES, gameArray)
                    break
                case 'hard':
                    move = hardMove(getNextPlayer(nextPlayer), WINNING_POSSIBILITIES, gameArray)
                    break
                default:
                    move = normalMove(getNextPlayer(nextPlayer), WINNING_POSSIBILITIES, gameArray)
            }
            play(move)
            setComputerPlayed(true)
            
        }, 500)
    }

    const play = (i) => {
        gameArray[i] = nextPlayer;
        setNextPlayer(getNextPlayer(nextPlayer));
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
        checkGameOver()
        
        if(!gameOver) {
            setComputerPlayed(false)
        }
    }
    
    useEffect(()=>{
        let computerWillMoveAgain = !gameOver && props.gameMode === LOCAL_SINGLEPLAYER_GAME && !computerPlayed
        if(computerWillMoveAgain) {
            computerPlay()
        }
    }, [computerPlayed])

    const getNextPlayer = (currentPlayer) => {
        return currentPlayer === 'X' ? 'O' : 'X'
    }
    
    useEffect(()=>{    
        if(gameArray.every(element => element === null)) {
            setComputerWillStart(computerWonLastGame(winner ? winner : previousWinner))
            return
        }
        
        checkGameOver()

    }, [gameArray])

    useEffect(()=> {
        if(computerWillStart) {
            setTimeout(() => { 
                computerPlay()
                setComputerWillStart(false)
            }, 2000)
            
        }
    }, [computerWillStart])
    
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
                setComputerPlayed(true)
                _gameOver = true
                return
            }
            
            if(checkArray.includes('O') && !checkArray.includes('X') && !checkArray.includes(null)) {
                setMessage(`O ganhou!`)
                setWinner('O')
                setGameOver(true)
                setComputerPlayed(true)
                _gameOver = true
                return
            }
            
        });
        
        if(!_gameOver && !gameArray.includes(null)) {
            setMessage('Empatou!')
            setWinner(null)
            setGameOver(true)
            setComputerPlayed(true)
            return
        }
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

    useEffect(()=> {
       setXCount(0)
       setOCount(0)
    }, [level])

    const restart = () => {
        if(!gameOver && computerWonLastGame(winner ? winner : previousWinner)) {
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

    const computerWonLastGame = (winner) => {
        return winner === 'O' && props.gameMode === LOCAL_SINGLEPLAYER_GAME
    }

    return (
        <React.Fragment>
            <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                        <CardTitle tag="h4">{message}&nbsp;</CardTitle>
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
                <CardFooter>
                    <div className="board-footer">
                        <CardTitle tag="h4">{`Jogador X: ${xCount}`}</CardTitle>
                        <CardTitle tag="h4">{`Jogador O: ${oCount}`}</CardTitle>
                        {/* <span><h5 className="card-category">Zerar o Placar</h5></span> */}
                    </div>
                </CardFooter>
              </Card>
        </React.Fragment>
    )
}