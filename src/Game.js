//keeping track of all things we need

import * as Chess from 'chess.js';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { auth } from './firebase';
import { fromDocRef } from 'rxfire/firestore';

//fen notation for chess

let gameRef;
let member;

const chess = new Chess();

export let gameSubject;

export const initGame = async (gameRefFb) => {
	const { currentUser } = auth;
	if (gameRefFb) {
		gameRef = gameRefFb;
		const initialGame = await gameRefFb.get().then((doc) => doc.data());
		if (!initialGame) {
			return 'notfound';
		}
		const creator = initialGame.members.find((m) => m.creator === true);

		if (initialGame.status === 'waiting' && creator.uid !== currentUser.uid) {
			const currUser = {
				uid: currentUser.uid,
				name: localStorage.getItem('userName'),
				piece: creator.piece === 'w' ? 'b' : 'w'
			};
			const updatedMembers = [ ...initialGame.members, currUser ];
			await gameRefFb.update({ members: updatedMembers, status: 'ready' });
		} else if (!initialGame.members.map((m) => m.uid).includes(currentUser.uid)) {
			return 'imposter';
		}
		chess.reset();

		gameSubject = fromDocRef(gameRefFb).pipe(
            map(gameDoc => {
                const game = gameDoc.data()
                const {pendingPromotion, gameData, ...restOfGame} = game
                member = game.members.find(m => m.uid=== currentUser.uid)
                const opponent =  game.members.find(m => m.uid !== currentUser.uid)

                if(gameData) {
                    chess.load(gameData)
                }
                const isGameOver = chess.game_over()
                return{
                    board: chess.board(),
                    pendingPromotion,
                    isGameOver,
                    position: member.piece,
                    member,
                    opponent,
                    result: isGameOver ? getGameResult() : null,
                    ...restOfGame

                }
            })
        )


	} else {
        gameRef = null;
		gameSubject = new BehaviorSubject();
		const savedGame = localStorage.getItem('savedGame');
		if (savedGame) {
			chess.load(savedGame);
		}
		updateGame();
	}
};

export const resetGame = async() => {
	if(gameRef){
		await updateGame(null, true);
		chess.reset()
	}else{
		chess.reset();
		updateGame();
	}
	
};

export const handleMove = (from, to) => {
	const promotions = chess.moves({ verbose: true }).filter((move) => move.promotion);
	console.table(promotions);
	let pendingPromotion

	//important
	if (promotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)) {
		pendingPromotion = { from, to, color: promotions[0].color };
		updateGame(pendingPromotion);
	}
	
	if (!pendingPromotion) {
		move(from, to);
	}
};

//chess notations
export const move = (from, to, promotion) => {
	let tempMove = { from, to };
	if (promotion) {
		tempMove.promotion = promotion;
	}
	if(gameRef){
		if(member.piece === chess.turn()){
			const legalMove = chess.move(tempMove);
			if (legalMove) {
				updateGame();
			}
		}

	}else{
		const legalMove = chess.move(tempMove);

		if (legalMove) {
			updateGame();
		}

	}
	
};

const updateGame = async(pendingPromotion , reset) => {
	const isGameOver = chess.game_over();

	if(gameRef) {
		const updatedData = {gameData: chess.fen(), pendingPromotion: pendingPromotion || null}
		if(reset){
			updatedData.status = "over"
		}
		await gameRef.update(updatedData)
	} else{
		const newGame = {
			board: chess.board(),
			pendingPromotion,
			isGameOver,
			position: chess.turn(),
			result: isGameOver ? getGameResult() : null
		};
	
		localStorage.setItem('savedGame', chess.fen());
	
		gameSubject.next(newGame);

	}

	
};

const getGameResult = () => {
	if (chess.in_checkmate()) {
		const winner = chess.turn() === 'w' ? 'BLACK' : 'WHITE';
		return `CHECKMATE -- WINNER -- ${winner}`;
	} else if (chess.in_draw()) {
		let reason = '50 - MOVES - RULE';
		if (chess.in_stalemate()) {
			reason = 'STALEMATE';
		} else if (chess.in_threefold_repetition()) {
			reason = 'REPETITION';
		} else if (chess.insufficient_material()) {
			reason = 'INSUFFICENT MATERIAL';
		}
		return `DRAW -- ${reason}`;
	} else {
		return 'UNKNOWN REASON ';
	}
};
