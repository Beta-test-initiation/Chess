import React, {useEffect, useState} from 'react';
import './App.css';
import {gameSubject, initGame, resetGame} from './Game';
import Board from './components/Board';
import {useParams, useNavigate } from 'react-router-dom';
import {db} from './firebase';

 
function GameApp() {
  const [board, setBoard] = useState([])
  const [isGameOver, setIsGameOver] = useState()
  const [result, setResult] = useState()
  const [position, setPosition] = useState()
  const {id} = useParams()
  const [initResult, setInitResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [game, setGame] = useState({})
  const navigate = useNavigate();

  const shareableLink = window.location.href
  

  useEffect(()=> {
    let subscribe
    async function  init() {
        const res = await initGame(id !== 'local' ? db.doc(`games/${id}`) : null) 
        setInitResult(res)
        setLoading(false)
        if(!res){
          subscribe = gameSubject.subscribe(game=> {
            setBoard(game.board) 
            setIsGameOver(game.isGameOver)
            setResult(game.result)
            setPosition(game.position)
            setStatus(game.status)
            setGame(game)
          })

        }
        
    }
    
    init()

    return () => subscribe && subscribe.unsubscribe()
  },[id]);

  const copyToClipBoard = async() => {
    await navigator.clipBoard.writeText(shareableLink);
  }

  if(loading){
    return 'Loading'
  }

  if(initResult==='notfound'){
    return 'Game Not Found'
  }

  if(initResult ==='imposter'){
    return 'Go away imposter'
  }

  return (
    <div className="app-container">
      {isGameOver && (
          <h2 className="vertical-text"> 
            GAME OVER
              <button onClick={async() => {
                 await resetGame()
                 navigate('/')
              }}>
                <span className='vertical-text'>
                  NEW GAME
                </span>
            </button>
          </h2>
          
        )
      }
      <div className="board-container">
        {game.opponent && game.opponent.name && <span className="tag is-link">{game.opponent.name}</span>}
        <Board board={board} position ={position}/>
        {game.member && game.member.name && <span className="tag is-link">{game.member.name}</span>}

      </div>  
      {result && <p className='vertical-text'>{result}</p>}
      {status ==='waiting' &&(
        <div className="notification is-link share-game">
          <strong>Share the game link to play with another player: </strong>
          <br />
          <br />
          <div className="field has-addons">
            <div className="control is-expanded">
              <input type="text" className='input' readOnly value={shareableLink}/>
            </div>
            <div className="control">
              <div className="button is-info"onClick={copyToClipBoard}>Copy</div>
            </div>
          </div>
        </div>
      )}
        
    </div>
    )
}

export default GameApp
