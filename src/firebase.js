import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCyrgA6FQxZcc7UMCan-ccriRV8rAuKI8U",
    authDomain: "react-chess-b640c.firebaseapp.com",
    projectId: "react-chess-b640c",
    storageBucket: "react-chess-b640c.appspot.com",
    messagingSenderId: "811134257894",
    appId: "1:811134257894:web:af09be60c7c2d627e00927"
  };

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();

export default firebase;