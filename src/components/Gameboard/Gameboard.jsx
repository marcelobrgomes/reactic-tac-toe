import React, {useState, useEffect} from 'react'
import './Gameboard.css'
import GameButton from '../GameButton/GameButton';
import LevelSwitch from './LevelSwitch'
import {LOCAL_SINGLEPLAYER_GAME} from '../../Constants'

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
    let [gameType, setGameType] = useState(props.gameMode)
    let [level, setLevel] = useState('normal')
    let [lastPlayer, setLastPlayer] = useState('O')
    const [gameArray, setGameArray] = useState([...initialGameArray])
    let [message, setMessage] = useState('')
    let [gameOver, setGameOver] = useState(false)
    let [winner, setWinner] = useState(null)
    let [previousWinner, setPreviousWinner] = useState(null)
    let [computerFirstPositionPlayed, setComputerFirstPositionPlayed] = useState(null)
    let [eventAnimationRegistered, setEventAnimationRegistered] = useState(false)

    

    /*
    Levels:
    - Easy: just random moves
    - Normal: Defense moves
    - Hard: Atack and defense moves
    */
    // const computerPlay = () => {
    //     if(gameType === LOCAL_SINGLEPLAYER_GAME) {
    //         //new Promise((resolve, reject) => {
    //             setTimeout(() => {
    //                 let move

    //                 switch(level) {
    //                     case 'easy':
    //                         move = easyMove()
    //                         break
    //                     case 'hard':
    //                         move = hardMove()
    //                         break
    //                     default:
    //                         move = normalMove()
    //                 }

    //                 play(move)
    //                 //checkGameOver()
    //             //    resolve("Your move")
    //             }, 500)
    //         //}).then(() => {
    //         //})
    //     }
    // }

    /*const easyMove = () => {
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
        //console.log(`possibilitiesUserCanWinInTheNextMove`, possibilitiesUserCanWinInTheNextMove)

        return defenseMove(userWinningPossibilities, possibilitiesUserCanWinInTheNextMove)
    }

    const getWinningPossibilities = (player) => {
        //console.log(`player`, player)
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

        //console.log('player winning possibilities', userWinningPossibilities)

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

            //console.log('Position of the user winning possibility', possibilityToDefend[1][availablePosition])
            return possibilityToDefend[1][availablePosition]
        }

        defendedPossibilityIndex = Math.floor(Math.random() * userWinningPossibilities.length)
        possibilityToDefend = userWinningPossibilities[defendedPossibilityIndex]

        if(possibilityToDefend) {
            availablePosition = possibilityToDefend[0].lastIndexOf(null);
            //console.log('User cannot win in the next move, so playing in a empty slot', possibilityToDefend[1][availablePosition])
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
    }*/

    const play = (i) => {
        
    }

    const userPlay = (i) => {
        if(gameOver) {
            restart()
            return
        }

        if(gameArray[i] !== null) {
            return;
        }
        
        let player = getNextPlayer(lastPlayer)
        gameArray[i] = player;
        setLastPlayer(player);
        setGameArray([...gameArray])
    }

    const getNextPlayer = (currentPlayer) => {
        return currentPlayer === 'X' ? 'O' : 'X'
    }

    useEffect(()=>{    
        if(gameArray.every(element => element === null)) {
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
                setWinner('X') //Se o jogador ganhar duas vezes seguidas precisa atualizar o objeto para o useEffect ser disparado
                gameOver = true
                return;
            }
            
            if(checkArray.includes('O') && !checkArray.includes('X') && !checkArray.includes(null)) {
                setMessage(`O ganhou!`)
                setWinner('O')
                gameOver = true
                return;
            }
        });

        if(!gameOver && !gameArray.includes(null)) {
            setMessage('Empatou!')
            setWinner(null)
            gameOver = true
        }

        setGameOver(gameOver)
    }

    useEffect(()=> {
        if(winner) {
            setLastPlayer(getNextPlayer(winner))
        } else if(previousWinner) {
            setLastPlayer(getNextPlayer(previousWinner))
        }
    }, [gameOver])
    
    const restart = () => {
        setGameArray([...initialGameArray])
        setMessage(null)
        setGameOver(false)
        
        if(winner) {
            setPreviousWinner(winner)
        }
        
        // setComputerFirstPositionPlayed(null)
        
        // if(!winner && !previousWinner) {
        //     setLastPlayer('O')
        // }
        
        
        // //Animations
        // const boardElement =  document.querySelector('.board')
        // boardElement.classList.add('rollOut')
        // boardElement.classList.add('rollIn')
        
        // if(!eventAnimationRegistered) {
        //     console.log('registrando animationend');
            
        //     boardElement.addEventListener('animationend', function(e) {
        //         setEventAnimationRegistered(true) 
        //         boardElement.classList.remove('rollOut')
                
        //         // if(computerWonLastGame()) {
        //         //     console.log('computador ganhou o ultimo');
                    
        //         //     gameArray = [...initialGameArray]
        //         //     computerFirstPositionPlayed = null
        //         //     gameOver = false
        //         //     lastPlayer = 'X'
                    
        //         //     //boardElement.removeEventListener('animationend', function() {})
                    
        //         //     if(e.animationName == 'rollIn') {
        //         //         console.log('primeira jogada')
        //         //         computerPlay()
        //         //     }
        //         // }
        //     })
        // }
    }

    // const computerWonLastGame = () => {
    //     return winner === 'O' && gameType === LOCAL_SINGLEPLAYER_GAME
    // }


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