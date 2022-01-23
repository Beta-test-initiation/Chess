import React from 'react';
import Square from './Square';
import {move} from '../Game'

const promotionPieces = ['r', 'n', 'b', 'q']

const Promote = ({promote: {from, to, color},

}) => {
    return (
        <div className="board">
            {promotionPieces.map((p, i) => (
                <div key={i} className='promote-square'>
                    <Square black = {i%3===0}>
                        <div className="piece-container" onClick={()=> move(from, to, p)}>
                            <img 
                                src={require(`../assets/${p}_${color}.png`)} 
                                alt={p}
                                className='piece cursor-pointer'/>
                        </div>
                    </Square>
                    
                    
                </div>
            ))}
        </div>
    )
}

export default Promote
