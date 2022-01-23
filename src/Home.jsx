import React, {useState} from 'react';
import {auth, db} from './firebase';
import {useNavigate} from 'react-router-dom'
import GameApp from './GameApp'


const Home = () => {
    const {currentUser}=auth;
    const options = [
        {label: 'Black pieces', value:'b'},
        {label: 'White pieces', value:'w'} ,
        {label: 'Random pieces', value:'r'} 

    ];

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    
    const handlePlayOnline = () => {
        setShowModal(true);

    }

    const PlayOffline = () =>{
       navigate('/game/local')
      
    }
        
    

    const startOnlineGame = async(startingPiece) => {
        const member = {
            uid : currentUser.uid,
            piece: startingPiece === 'r' ? ['b','w'][Math.round(Math.random())] : startingPiece,
            name: localStorage.getItem('userName'),
            creator: true
        }
        const game = {
            status : 'waiting',
            members : [member],
            gameId: `${Math.random().toString(36).substring(2.9)}_${Date.now()}`  
        }

        await db.collection('games').doc(game.gameId).set(game)
        navigate(`/game/${game.gameId}`)

    }
    
    return (

        <>
            <div className="columns home">
                <div className="column has-background-primary">
                    <button className="button is-link" onClick={PlayOffline}>
                        Play Locally
                    </button>
                </div>
                <div className="column has-background-link">
                    <button className="button is-primary" onClick={handlePlayOnline}>
                        Play Online
                    </button>
                </div>
            </div>
            {showModal && (<div className="modal">
                <div className="modal-background"> </div>
                    <div className="modal-content ">
                        <div className="card ">
                            <div className="card-content">
                                Please Choose the Piece
                            </div>
                            <footer className="card-footer">
                                {options.map(({label, value})=> (
                                    <span className="card-footer-item pointer" key={value} onClick={()=> startOnlineGame(value)}>
                                        {label}
                                    </span>
                                ))}
                            </footer>
                        </div>
                    </div>
                    <button className="modal-close is-large" onClick={() => setShowModal(false)}></button>  
            </div>)}
        </>
    );
}

export default Home;