import React, {useEffect} from 'react'
import Gameboard from './Gameboard'

export default props => {
    const userPlay = (i) => {
        if(props.gameOver) {
            props.restart()
            return
        }

        if(props.gameArray[i] !== null) {
            return;
        }
        
        props.play(i)
        props.checkGameOver()
    }
    
    useEffect(()=>{    
        props.checkGameOver()
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