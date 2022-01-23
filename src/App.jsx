import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Home';
import UserForm from './components/UserForm';
import GameApp from './GameApp';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from './firebase';

export default function App(){
    const [user, loading, error] = useAuthState(auth);
    if(loading){
        return 'Loading..'
    }
    if (error){
        return 'Sorry there was an error'
    }
    if(!user){
        return <UserForm/>
    }
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/game/:id" element={<GameApp/>}/>
            </Routes>
        </Router>
    )
}