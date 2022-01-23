import React, {useEffect, useState} from 'react';
import BoardSquare from './BoardSquare';

const Board = ({board, position }) => {

    const [currBoard, setCurrBoard] = useState([]);

    useEffect(()=> {
        setCurrBoard(
         position ==='w'? board.flat() : board.flat().reverse()
        )
    }, [board, position])

    const getXYPOsition= (i) => {
        const x = position === 'w' ? i % 8: Math.abs((i%8) - 7);
        const y = position === 'w' ? Math.abs(Math.floor(i / 8 ) - 7 ) : Math.floor(i/8)

        return {x, y}
    }

    const isBlack = (i) => {
        const {x, y } = getXYPOsition(i)
        return (x + y ) %2 === 1
    }

    const getPosition = (i) => {
        const {x,y} = getXYPOsition(i)
        const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

        return (`${letter[x]}${y+1}`)
    }

    return (
        <div className="board">
            {currBoard.flat().map((piece, i)=> (
                <div key={i} className="square">
                    <BoardSquare piece={piece} isblack={isBlack(i)} position={getPosition(i)}/>
                </div>
            ))}            
        </div>
    )
}

export default Board
