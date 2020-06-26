import React, {useEffect} from 'react'
import Gameboard from './Gameboard'

export default props => {
    useEffect(()=>{    
        props.checkGameOver()
    }, [props.gameArray])

    return (
        <Gameboard 
            message={props.message}
            showLevelSwitch={false}
            userPlay={props.userPlay}
            gameArray={props.gameArray}
            xCount={props.xCount}
            oCount={props.oCount}
            restart={props.restart}
        />
    )
}