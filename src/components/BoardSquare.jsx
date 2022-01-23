import React, {useState, useEffect} from 'react';
import Square from './Square';
import Piece from './Piece';
import {useDrop} from 'react-dnd';
import {gameSubject, handleMove} from '../Game';
import Promote from './Promote';
 
const BoardSquare = ({piece, isblack, position}) => {
    const [promote, setPromote] = useState(null);
    const [{isOver}, dropRef] = useDrop({
        accept: 'piece',
        drop: (item)=> {
            const [fromPosititon] = item.id.split('_')
            handleMove(fromPosititon, position )
        },
    })

    useEffect(()=> {
        const subscribe = gameSubject.subscribe(({pendingPromotion})=> {
            pendingPromotion && pendingPromotion.to === position ? setPromote(pendingPromotion) : setPromote(null);
        })

        return () => subscribe.unsubscribe();
    }, [position])
    return (
        <div className='board-square' ref={dropRef}>
            <Square isblack={isblack}>
                {promote ? (<Promote promote={promote} />) : piece ?( <Piece piece={piece} position={position}/> ): null}
            </Square>
        </div>
    )
}

export default BoardSquare
