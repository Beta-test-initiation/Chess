import React from 'react';
import {useDrag, DragPreviewImage} from 'react-dnd';

const Piece = ({piece: {type, color}, position}) => {
    const [ {isDragging}, dragRef , preview] = useDrag({
        type:'piece',
        item: { id: `${position}_${type}_${color}` },
        collect: (monitor) => {
            return {isDragging: !!monitor.isDragging()}
        },
    })
    const pieceImg = require(`../assets/${type}_${color}.png`);
    return (
        <>
            <DragPreviewImage connect={preview} src={pieceImg} className="moving-image"/>
            <div className="piece-container" ref={dragRef} style={{opacity: isDragging ? 0 : 1 }}>
                <img src={pieceImg} alt={type} className="piece" />
            </div>
        </>
    )
}

export default Piece
