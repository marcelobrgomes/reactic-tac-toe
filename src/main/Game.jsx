import React, {useState} from 'react'
import './Game.css'
import Button from '../components/Button';

const initialGameArray = [null, null, null, null, null, null, null, null, null]

export default props => {
    let [lastPlayer, setLastPlayer] = useState(0)
    let [gameArray, setGameArray] = useState([...initialGameArray])
    let [message, setMessage] = useState('')

    const play = (i) => {
        if(gameArray[i] === 'X' || gameArray[i] === 'O') {
            return;
        }

        if(lastPlayer === 0) {
            gameArray[i] = 'X';
            setGameArray(gameArray);
            setLastPlayer(1);
        } else {
            gameArray[i] = 'O';
            setGameArray(gameArray);
            setLastPlayer(0);
        }

        checkGameOver();
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
                return;
            }
            
            if(checkArray.includes('O') && !checkArray.includes('X') && !checkArray.includes(null)) {
                setMessage('Jogador 0 venceu')
                setLastPlayer(1);
                return;
            }
        });

        if(!gameArray.includes(null)) {
            setMessage('Deu velha!')
        }
    }

    const restart = () => {
        setGameArray([...initialGameArray])
    }

    return (
        <div className="container">
            <div className="game">
                <Button id="0" play={play} value={gameArray[0]}/>
                <Button id="1" play={play} value={gameArray[1]}/>
                <Button id="2" play={play} value={gameArray[2]}/>
                <Button id="3" play={play} value={gameArray[3]}/>
                <Button id="4" play={play} value={gameArray[4]}/>
                <Button id="5" play={play} value={gameArray[5]}/>
                <Button id="6" play={play} value={gameArray[6]}/>
                <Button id="7" play={play} value={gameArray[7]}/>
                <Button id="8" play={play} value={gameArray[8]}/>
            </div>
            <div className="options">
                <button onClick={()=> restart()}>Novo Jogo</button>
            </div>
            <div className="message">
                <h2>{message}</h2>
            </div>
        </div>
    )
}