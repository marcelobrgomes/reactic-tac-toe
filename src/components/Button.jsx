import React from 'react'
import './Button.css'

export default props =>
    <div 
        className={`button ${props.value === 'X' ? 'x' : ''} ${props.value === 'O' ? 'o' : ''} ${props.className ? props.className : ''}`}
        onClick={() => props.play(props.id)}
    >
        {props.value}
    </div>