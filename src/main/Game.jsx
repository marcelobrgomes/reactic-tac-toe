import React, {useState} from 'react'
import './Game.css'
import GameButton from '../components/Button';
import classNames from "classnames";

import {
    Button,
    ButtonGroup,
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

const LOCAL_MULTIPLAYER_GAME = 'localMultiPlayer'
const LOCAL_SINGLEPLAYER_GAME = 'singlePlayer'

export default props => {
    let [gametype, setGameType] = useState(props.gameMode)
    let [level, setLevel] = useState('normal')
    let [lastPlayer, setLastPlayer] = useState('O')
    let [gameArray, setGameArray] = useState([...initialGameArray])
    let [message, setMessage] = useState('')
    let [gameOver, setGameOver] = useState(false)
    let [winner, setWinner] = useState(null)
    let [computerFirstPositionPlayed, setComputerFirstPositionPlayed] = useState(null)

    const getLevelName = () => {
        switch(level) {
            case 'easy':
                return 'Fácil'
            case 'hard':
                return 'Difícil'
            default:
                return 'Normal'
        }
    }

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
        if(gameOver) {
            restart(gametype)
            return
        }

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
                setMessage(`X ganhou!`)
                setWinner('X')
                setLastPlayer('0');
                gameOver = true
                return;
            }
            
            if(checkArray.includes('O') && !checkArray.includes('X') && !checkArray.includes(null)) {
                setMessage(`O ganhou!`)
                setWinner('O')
                setLastPlayer('X');
                gameOver = true
                return;
            }
        });

        if(!gameOver && !gameArray.includes(null)) {
            setMessage('Empatou!')

            if(winner) {
                setLastPlayer(winner === 'X' ? 'O' : 'X')
            }

            gameOver = true
        }

        setGameOver(gameOver)
    }

    const restart = (gameType) => {
        setGameArray([...initialGameArray])
        setMessage(null)
        setGameOver(false)
        setComputerFirstPositionPlayed(null)

        if(gameType !== gametype) {
            setLastPlayer('O')
        } else if(winner !== null) {
            lastPlayer = winner === 'X' ? 'O' : 'X'
            setLastPlayer(lastPlayer)
        }

        setGameType(gameType)

        if(winner === 'O' && gameType === LOCAL_SINGLEPLAYER_GAME) { //computer
            gameArray = [...initialGameArray]
            computerFirstPositionPlayed = null
            gameOver = false
            
            computerPlay()
        }
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
                      <ButtonGroup
                        className="btn-group-toggle float-right"
                        data-toggle="buttons"
                      >
                        <Button
                          tag="label"
                          className={classNames("btn-simple", {
                            active: level === "easy"
                          })}
                          color="info"
                          id="0"
                          size="sm"
                          onClick={() => { restart(LOCAL_SINGLEPLAYER_GAME); setLevel('easy')}}
                        >
                          <input
                            defaultChecked
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Fácil
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-single-02" />
                          </span>
                        </Button>
                        <Button
                          color="info"
                          id="1"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: level === "normal"
                          })}
                          onClick={() => { restart(LOCAL_SINGLEPLAYER_GAME); setLevel('normal')}}
                        >
                          <input
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Normal
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-gift-2" />
                          </span>
                        </Button>
                        <Button
                          color="info"
                          id="2"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: level === "hard"
                          })}
                          onClick={() => { restart(LOCAL_SINGLEPLAYER_GAME); setLevel('hard') }}
                        >
                          <input
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Difícil
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-tap-02" />
                          </span>
                        </Button>
                      </ButtonGroup>
                    </Col>
                    : null}
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <div className="board">
                        <div></div>
                        <GameButton id="0" play={userPlay} value={gameArray[0]}/>
                        <GameButton id="1" play={userPlay} value={gameArray[1]}/>
                        <GameButton id="2" play={userPlay} value={gameArray[2]} className="top-right"/>
                        <div></div>
                        <div></div>
                        <GameButton id="3" play={userPlay} value={gameArray[3]}/>
                        <GameButton id="4" play={userPlay} value={gameArray[4]}/>
                        <GameButton id="5" play={userPlay} value={gameArray[5]} className="middle-right"/>
                        <div></div>
                        <div></div>
                        <GameButton id="6" play={userPlay} value={gameArray[6]} className="bottom-left"/>
                        <GameButton id="7" play={userPlay} value={gameArray[7]} className="bottom-middle"/>
                        <GameButton id="8" play={userPlay} value={gameArray[8]} className="bottom-right"/>
                        <div></div>
                    </div>
                  </div>
                </CardBody>
              </Card>
        </React.Fragment>
    )
}