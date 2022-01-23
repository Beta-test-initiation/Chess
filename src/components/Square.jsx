import React from 'react'

const Square = ({children, isblack}) => {
    const bgClass = isblack ? 'square-black': 'square-white';

    return (
        <div className={`${bgClass} board-square`} >
            {children}
        </div>
    )
}

export default Square
