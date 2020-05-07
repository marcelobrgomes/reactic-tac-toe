import React from 'react'
import './GameButton.css'
import 'animate.css'

export default props => {
    let divValue = ''
    
    if(props.value === 'X') {
        divValue = (
            <div className="animated flipInX fast">
                <div className="x">&nbsp;</div>
                <div className="x1">&nbsp;</div>
            </div>
        )
    } else if(props.value === 'O') {
        divValue = (
            <div className="o animated rubberBand faster">&nbsp;</div>
        )
    }

    return (
        <div 
            className={`button ${props.className ? props.className : ''}`}
            onClick={() => props.play(props.id)}
        >
            {divValue}
        </div>
    )
}