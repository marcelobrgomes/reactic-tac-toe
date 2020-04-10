import React from 'react'
import './Button.css'

export default props =>
    <button 
        className={`button ${props.value === 'X' ? 'x' : ''} ${props.value === 'O' ? 'o' : ''}`}
        onClick={() => props.play(props.id)}
    >
        {props.value}
    </button>