'use strict';

angular.module('myApp', []).factory('gameLogic', function() {
/**
 * Returns the initial Blokus board, which is a 20 * 20 matrix containing ''.
 */
function getInitialBoard() {
//
	return [
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ],
			[ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
					'', '', '', '' ] ];
}

function getInitialFreeShapes() {
	return [[true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true], 
		    [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true],
		    [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true],
		    [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true]];
}

function getInitialPlayerStatus() {
	return [true, true, true, true];
}

function getPossibleMoves(state, turnIndex) {
	// example state = {board :[[...]...], playerStatus : [true, true, true,
	// true], freeShapes = [[true,true, false...], [], [], []],
	// delta : {shape : 0, placement : [[2,2]]}
	// all 4 players are alive. player0 has #0, #1 shapes free, #2 shape not
	// available. last shape is put on the board is #0, placed at (2, 2).
	var possibleMoves = [];
	var freeShapes = state.freeShapes;
	var board = state.board;
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			if (board[i][j] === '') {
				for (var shape = 0; shape < freeShapes[turnIndex].length; shape++) {
					if (!freeShapes[turnIndex][shape]) {
						continue;
					}
					for (var r = 0; r < 8; r++) {
						// there are total 8 possible rotations
						if (!isValidRotation(shape, r)) {
							continue;
						}
						var placement = getPlacement(i, j, shape, r);
						if (legalPlacement(board, placement, turnIndex)) {
							possibleMoves.push(createMove(state, placement,
									shape, turnIndex));
						}
					}
				}
			}
		}
	}
	return possibleMoves;
}
/*return true if the rotation is valid for the shape*/
function isValidRotation(shape, r) {
	// there are total 8 rotations: rotate clockwise by 0, 90, 180, 270 degress. Mirrow the shape, and rotate clockwise by 0, 90, 180, 270 degrees.
	// a rotation is valid only if the rotated shape is unique
	if (shape === 0 || shape === 8 || shape === 19) {
		return r === 0;
	}
	if (shape === 1 || shape === 2 || shape === 3 || shape === 4) {
		return r === 0 || r === 1;
	}
	if (shape === 5 || shape === 10 || shape === 11 || shape === 14 || shaper === 16 || shape === 17) {
		return r === 0 || r === 1 || r === 2 || r === 3;
	}
	if (shape === 7 || shape === 13) {
		return r === 0 || r === 1 || r === 4 || r === 5;
	}
	if (shape === 6 || shape === 9 || shape === 12 || shape === 15 || shape === 18 || shape === 20) {
		return true;
	}
	return false;
}

function createMove(stateBeforeMove, placement, shape, turnIndexBeforeMove) {
	// example move = {setTurn(2), setBoard([[...]]), setPlayerStatus(true,
	// false, true, true), setFreeShapes([...],[...],[...],[...])};
	if (stateBeforeMove === undefined || stateBeforeMove.board === undefined) {
		stateBeforeMove = {
				  board : getInitialBoard(),
		          playerStatus : getInitialPlayerStatus(),
		          freeShapes : getInitialFreeShapes(),
		          delta : {}};
	}
	var board = stateBeforeMove.board;
	var playerStatus = stateBeforeMove.playerStatus;
	var freeShapes = stateBeforeMove.freeShapes;
	if (!legalPlacement(board, placement, turnIndexBeforeMove)) {
		throw new Error("illegal placement of a shape!");
	}
	if (endOfMatch(playerStatus)) {
		throw new Error("Can only make a move if the game is not over!");
	}
	// set up the board after move
	var boardAfterMove = angular.copy(board);
	var label = turnIndexBeforeMove.toString();
	for (var i = 0; i < placement.length; i++) {
		var row = placement[i][0];
		var col = placement[i][1];
		boardAfterMove[row][col] = label;
	}
	var freeShapesAfterMove = updateFreeShapes(turnIndexBeforeMove, freeShapes,
			shape);
	var playerStatusAfterMove = updatePlayerStatus(boardAfterMove,
			freeShapesAfterMove, playerStatus);
	var firstOperation = updateTurnIndex(turnIndexBeforeMove,
			playerStatusAfterMove, freeShapesAfterMove);
	return [ firstOperation, {
		set : {
			key : 'board',
			value : boardAfterMove
		}
	}, {
		set : {
			key : 'playerStatus',
			value : playerStatusAfterMove
		}
	}, {
		set : {
			key : 'freeShapes',
			value : freeShapesAfterMove
		}
	}, {
		set : {
			key : 'delta',
			value : {
				shape : shape,
				placement : placement
			}
		}
	} ];
}

function isMoveOk(params) {
	var move = params.move;
	var stateBeforeMove = params.stateBeforeMove;
	var turnIndexBeforeMove = params.turnIndexBeforeMove;
	try {
		var shape = move[4].set.value.shape;
		var placement = move[4].set.value.placement;
		var expectedMove = createMove(stateBeforeMove, placement, shape,
				turnIndexBeforeMove);
		if (!angular.equals(move, expectedMove)) {
			return false;
		}
	} catch (e) {
		// if there are any exceptions then the move is illegal
		return false;
	}
	return true;
}

/** return the updated state.freeShapes after a move is completed */
function updateFreeShapes(turnIndexBeforeMove, freeShapes, shape) {
	var freeShapesAfterMove = angular.copy(freeShapes);
	if (freeShapesAfterMove[turnIndexBeforeMove][shape] == false) {
		throw new Error("the shape is already used by the player!");
	} else {
		freeShapesAfterMove[turnIndexBeforeMove][shape] = false;
	}
	return freeShapesAfterMove;
}

/** check whether the current player can make a move using shape available */
function canMove(board, freeShapes, turnIndex) {
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			if (board[i][j] !== '') {
				continue;
			}
			for (var shape = 0; shape < 21; shape++) {
				if (!freeShapes[turnIndex][shape]) {
					continue;
				}
				var totalRotateCounts = getTotalRotateCount(shape);
				for (var r = 0; r < totalRotateCounts; r++) {
					// rotate the shape
					var placement = getPlacement(i, j, shape, r);
					if (legalPlacement(board, placement, turnIndex)) {
						return true;
					}
				}
			}
		}
	}
	return false;
}

function getTotalRotateCount(shape) {
	if (shape === 1 || shape === 2 || shape === 3 || shape === 4 || shape === 5
			|| shape === 8 || shape === 10 || shape === 11 || shape === 14
			|| shape === 16 || shape === 17 || shape === 19) {
		return 4;
	} else if (shape === 0) {
		return 1;
	} else {
		return 8;
	}
}

/** return the updated state.playerStatus after a move is completed */
function updatePlayerStatus(boardAfterMove, freeShapes, playerStatus) {
	var playerStatusAfterMove = angular.copy(playerStatus);
	// a player dies when used up all the shapes
	for (var i = 0; i < 4; i++) {
		if (shapeUsedUp(i, freeShapes)) {
			console.log("player " + i + "used up shapes");
			playerStatusAfterMove[i] = false;
		}
	}
	// a player dies when the player cannot make a legal move using the remaining shapes
	for (var i = 0; i < 4; i++) {
		// skip dead player
		if (!playerStatusAfterMove[i]) {
			continue;
		}
		playerStatusAfterMove[i] = canMove(boardAfterMove, freeShapes, i);
	}
	return playerStatusAfterMove;
}

/** return true if player i used up all the shapes*/
function shapeUsedUp(turnIndex, freeShapes) {
	for (var shape = 0; shape < 21; shape++) {
		if (freeShapes[turnIndex][shape]) {
			return false;
		}
	}
	return true;
}
/** update updateTurnIndex after a move is completed */
function updateTurnIndex(turnIndexBeforeMove, playerStatusAfterMove, freeShapes) {
	var firstOperation = {};
	if (endOfMatch(playerStatusAfterMove)) {
		firstOperation = {
			endMatch : {
				endMatchScores : getScore(freeShapes)
			}
		};
	} else {
		var nextPlayer = (turnIndexBeforeMove + 1) % 4;
		// find the next alive player
		while (playerStatusAfterMove[nextPlayer] === false) {
			nextPlayer = (nextPlayer + 1) % 4;
		}
		firstOperation = {
			setTurn : {
				turnIndex : nextPlayer
			}
		};
	}
	return firstOperation;
}

/** return true if all the players die */
function endOfMatch(playerStatus) {
	for (var i = 0; i < playerStatus.length; i++) {
		if (playerStatus[i]) {
			return false;
		}
	}
	return true;
}

/** implemented later */
function getScore(freeShapes) {
	var totalSquares = 90;
	var score = [ 0, 0, 0, 0 ];
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < freeShapes[i].length; j++) {
			if (freeShapes[i][j]) {
				if (j === 0) {
					score[i] += 1;
				}
				if (j === 1) {
					score[i] += 2;
				}
				if (j === 2 || j === 5) {
					score[i] += 3;
				}
				if (j === 3 || j === 6 || j === 7 || j === 8 || j === 14) {
					score[i] += 4;
				}
				if (j === 4 || j === 9 || j === 10 || j === 11 || j === 12
						|| j === 13 || j === 15 || j === 16
						|| j === 18 || j === 19 || j === 20) {
					score[i] += 5;
				}
			}
		}

	}
	for (var i = 0; i < 4; i++) {
		score[i] = totalSquares - score[i];
	}
	return score;
}

/** check whether a board cell is in bound of the board */
function inBounds(board, row, col) {
	return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
}

/** check whether the placement is contains corner-to-corner connections */
function cornerConnected(board, placement, turnIndex) {
	for (var i = 0; i < placement.length; i++) {
		var label = turnIndex.toString();
		var row = placement[i][0];
		var col = placement[i][1];
		if (inBounds(board, row + 1, col + 1)) {
			
			if (board[row + 1][col + 1] === label) {
				return true;
			}
		}
		if (inBounds(board, row + 1, col - 1)) {
			if (board[row + 1][col - 1] === label) {
				return true;
			}
		}
		if (inBounds(board, row - 1, col + 1)) {
			if (board[row - 1][col + 1] === label) {
				return true;
			}
		}
		if (inBounds(board, row - 1, col - 1)) {
			if (board[row - 1][col - 1] === label) {
				return true;
			}
		}
	}
	return false;
}

/** check whether the placement contains edge-to-edge connections */
function edgeConnected(board, placement, turnIndex) {
	for (var i = 0; i < placement.length; i++) {
		var label = turnIndex.toString();
		var row = placement[i][0];
		var col = placement[i][1];
		if (inBounds(board, row + 1, col)) {
			if (board[row + 1][col] === label) {
				return true;
			}
		}
		if (inBounds(board, row - 1, col)) {
			if (board[row - 1][col] === label) {
				return true;
			}
		}
		if (inBounds(board, row, col + 1)) {
			if (board[row][col + 1] === label) {
				return true;
			}
		}
		if (inBounds(board, row, col - 1)) {
			if (board[row][col - 1] === label) {
				return true;
			}
		}
	}
	return false;
}

/** check whether the placement is already occupied by other squares */
function isOccupied(board, placement) {
	var i;
	for (i = 0; i < placement.length; i++) {
		var row = placement[i][0];
		var col = placement[i][1];
		if (board[row][col] !== '') {
			return true;
		}
	}
	return false;
}

/** check whether the placement is in bound of the board */
function placementInBound(board, placement) {
	for (var i = 0; i < placement.length; i++) {
		var row = placement[i][0];
		var col = placement[i][1];
		if (!inBounds(board, row, col)) {
			return false;
		}
	}
	return true;
}

function isFirstMove(board, turnIndex) {
	var label = turnIndex.toString();
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			if (board[i][j] === label) {
				return false;
			}
		}
	}
	return true;
}

function legalPlacement(board, placement, turnIndex) {
	var corner;
	switch (turnIndex) {
	case 0:
		corner = [ 0, 0 ];
		break;
	case 1:
		corner = [ 0, board[0].length - 1 ];
		break;
	case 2:
		corner = [ board.length - 1, 0 ];
		break;
	case 3:
		corner = [ board.length - 1, board[0].length - 1 ];
		break;
	}
	if (isFirstMove(board, turnIndex)) {
		for (var i = 0; i < placement.length; i++) {
			if (angular.equals(placement[i], corner)) {
				return placementInBound(board, placement)
						&& !isOccupied(board, placement);
			}
		}
		return false;
	} else {
		return placementInBound(board, placement)
				&& !isOccupied(board, placement)
				&& !edgeConnected(board, placement, turnIndex)
				&& cornerConnected(board, placement, turnIndex);
	}
}

function getPlacement(row, col, shape, r) {

	var placement = [];
	switch (shape) {
	case 0:
		placement.push([ row, col ]);
		break;
	case 1:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ]);
		}
		break;
	case 2:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ], [ row, col + 2 ]);
		}
		break;
	case 3:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ], [
					row - 3, col ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ], [ row, col + 2 ], [
					row, col + 3 ]);
		}
		break;
	case 4:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ], [
					row - 3, col ], [ row - 4, col ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ], [ row, col + 2 ], [
					row, col + 3 ], [ row, col + 4 ]);
		}
		break;
	case 5:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row, col + 1 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ], [ row + 1, col ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row + 1, col ], [ row, col - 1 ]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row, col - 1 ], [ row - 1, col ]);
		}
		break;
	case 6:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ], [
					row, col + 1 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ], [ row, col + 2 ], [
					row + 1, col ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row + 1, col ], [ row + 2, col ], [
					row, col - 1 ]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row, col - 1 ], [ row, col - 2 ], [
					row - 1, col ]);
		}
		if (r === 4) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ], [
					row, col - 1 ]);
		}
		if (r === 5) {
			placement.push([ row, col ], [ row, col + 1 ], [ row, col + 2 ], [
					row - 1, col ]);
		}
		if (r === 6) {
			placement.push([ row, col ], [ row + 1, col ], [ row + 2, col ], [
					row, col + 1 ]);
		}
		if (r === 7) {
			placement.push([ row, col ], [ row, col - 1 ], [ row, col - 2 ], [
					row + 1, col ]);
		}
		break;
	case 7:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ],
					[ row - 1, col + 1 ], [ row, col - 1 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ],
					[ row + 1, col + 1 ], [ row - 1, col ]);
		}
		if (r === 4) {
			placement.push([ row, col ], [ row - 1, col ],
					[ row - 1, col - 1 ], [ row, col + 1 ]);
		}
		if (r === 5) {
			placement.push([ row, col ], [ row, col + 1 ],
					[ row - 1, col + 1 ], [ row + 1, col]);
		}
		break;
	case 8:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ],
					[ row - 1, col + 1 ], [ row, col + 1 ]);
		}
		break;
	case 9:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row, col + 1 ], [
					row, col + 2 ], [ row, col + 3 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ], [ row + 1, col ], [
					row + 2, col ], [ row + 3, col ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row + 1, col ], [ row, col - 1 ], [
					row, col - 2 ], [ row, col - 3 ]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row, col - 1 ], [ row - 1, col ], [
					row - 2, col ], [ row - 3, col ]);
		}
		if (r === 4) {
			placement.push([ row, col ], [ row - 1, col ], [ row, col - 1 ], [
					row, col - 2 ], [ row, col - 3 ]);
		}
		if (r === 5) {
			placement.push([ row, col ], [ row, col + 1 ], [ row - 1, col ], [
					row - 2, col ], [ row - 3, col ]);
		}
		if (r === 6) {
			placement.push([ row, col ], [ row + 1, col ], [ row, col + 1 ], [
					row, col + 2 ], [ row, col + 3 ]);
		}
		if (r === 7) {
			placement.push([ row, col ], [ row, col - 1 ], [ row + 1, col ], [
					row + 2, col ], [ row + 3, col ]);
		}
		break;
	case 10:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ], [
					row, col + 1 ], [ row, col - 1 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ], [ row, col + 2 ], [
					row - 1, col ], [ row + 1, col ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row + 1, col ], [ row + 2, col ], [
					row, col - 1 ], [ row, col + 1 ]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row, col - 1 ], [ row, col - 2 ], [
					row - 1, col ], [ row + 1, col ]);
		}
		break;
	case 11:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ], [
					row, col + 1 ], [ row, col + 2 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ], [ row, col + 2 ], [
					row + 1, col ], [ row + 2, col ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row + 1, col ], [ row + 2, col ], [
					row, col - 1 ], [ row, col - 2 ]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row, col - 1 ], [ row, col - 2 ], [
					row - 1, col ], [ row - 2, col ]);
		}
		break;

	case 12:
		if (r === 0) {
			placement.push([ row, col ], [ row, col + 1 ], [ row, col + 2 ], [
					row + 1, col ], [ row + 1, col - 1 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row + 1, col ], [ row + 2, col ], [
					row, col - 1 ], [ row - 1, col - 1 ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row, col - 1 ], [ row, col - 2 ], [
					row - 1, col ], [ row - 1, col + 1 ]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ], [
					row, col + 1 ], [ row + 1, col + 1 ]);
		}
		if (r === 4) {
			placement.push([ row, col ], [ row, col - 1 ], [ row, col - 2 ], [
					row + 1, col ], [ row + 1, col + 1 ]);
		}
		if (r === 5) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ], [
					row, col - 1 ], [ row + 1, col - 1 ]);
		}
		if (r === 6) {
			placement.push([ row, col ], [ row, col + 1 ], [ row, col + 2 ], [
					row - 1, col ], [ row - 1, col - 1 ]);
		}
		if (r === 7) {
			placement.push([ row, col ], [ row + 1, col ], [ row + 2, col ], [
					row, col + 1 ], [ row - 1, col + 1 ]);
		}
		break;

	case 13:
		if (r === 0) {
			placement.push([ row, col ], [ row, col + 1 ],
					[ row - 1, col + 1 ], [ row, col - 1 ],
					[ row + 1, col - 1 ]);

		}
		if (r === 1) {
			placement.push([ row, col ], [ row + 1, col ],
					[ row + 1, col + 1 ], [ row - 1, col ],
					[ row - 1, col - 1 ]);
		}
		if (r === 4) {
			placement.push([ row, col ], [ row, col - 1 ],
					[ row - 1, col - 1 ], [ row, col + 1 ],
					[ row + 1, col + 1 ]);

		}
		if (r === 5) {
			placement.push([ row, col ], [ row - 1, col ],
					[ row - 1, col + 1 ], [ row + 1, col ],
					[ row + 1, col - 1 ]);
		}
		break;
	case 14:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row, col + 1 ], [
					row, col - 1 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ], [ row + 1, col ], [
					row - 1, col ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row + 1, col ], [ row, col - 1 ], [
					row, col + 1 ]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row, col - 1 ], [ row - 1, col ], [
					row + 1, col ]);
		}
		break;
	case 15:
		if (r === 0) {
			placement.push([ row, col ], [ row, col + 1 ],
					[ row + 1, col], [ row + 1, col + 1], [ row + 2, col ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row + 1, col ],
					[ row + 1, col - 1 ], [ row, col - 1 ], [ row, col - 2 ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row, col - 1 ],
					[ row - 1, col], [ row - 1, col - 1 ], [ row - 2, col]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row - 1, col ],
					[ row - 1, col + 1 ], [ row, col + 1 ], [ row, col + 2 ]);
		}
		if (r === 4) {
			placement.push([ row, col ], [ row, col - 1 ],
					[ row + 1, col - 1 ], [ row + 1, col ], [ row + 2, col ]);
		}
		if (r === 5) {
			placement.push([ row, col ], [ row - 1, col ],
					[ row - 1, col - 1 ], [ row, col - 1 ], [ row, col - 2 ]);
		}
		if (r === 6) {
			placement.push([ row, col ], [ row, col + 1 ],
					[ row - 1, col + 1 ], [ row - 1, col ], [ row - 2, col ]);
		}
		if (r === 7) {
			placement.push([ row, col ], [ row, col + 1 ],
					[ row, col + 2 ], [ row + 1, col], [ row + 1, col + 1]);
		}
		break;
	case 16:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ],
					[ row - 1, col + 1 ], [ row, col - 1 ],
					[ row + 1, col - 1 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ],
					[ row + 1, col + 1 ], [ row - 1, col ],
					[ row - 1, col - 1 ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row + 1, col ],
					[ row + 1, col - 1 ], [ row, col + 1 ],
					[ row - 1, col + 1 ]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row, col - 1 ],
					[ row - 1, col - 1 ], [ row + 1, col ],
					[ row + 1, col + 1 ]);
		}
		break;
	case 17:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ],
					[ row - 1, col + 1 ], [ row + 1, col ],
					[ row + 1, col + 1 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ],
					[ row + 1, col + 1 ], [ row, col - 1 ],
					[ row + 1, col - 1 ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row + 1, col ],
					[ row + 1, col - 1 ], [ row - 1, col ],
					[ row - 1, col - 1 ]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row, col - 1 ],
					[ row - 1, col - 1 ], [ row, col + 1 ],
					[ row - 1, col + 1 ]);
		}
		break;
	case 18:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ],
					[ row - 1, col + 1 ], [ row + 1, col ], [ row, col - 1 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ],
					[ row + 1, col + 1 ], [ row, col - 1 ], [ row - 1, col ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row + 1, col ],
					[ row + 1, col - 1 ], [ row - 1, col ], [ row, col + 1 ]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row, col - 1 ],
					[ row - 1, col - 1 ], [ row, col + 1 ], [ row + 1, col ]);
		}
		if (r === 4) {
			placement.push([ row, col ], [ row - 1, col ],
					[ row - 1, col - 1 ], [ row + 1, col ], [ row, col + 1 ]);
		}
		if (r === 5) {
			placement.push([ row, col ], [ row, col + 1 ],
					[ row - 1, col + 1 ], [ row, col - 1 ], [ row + 1, col ]);
		}
		if (r === 6) {
			placement.push([ row, col ], [ row + 1, col ],
					[ row + 1, col + 1 ], [ row - 1, col ], [ row, col - 1 ]);
		}
		if (r === 7) {
			placement.push([ row, col ], [ row, col - 1 ],
					[ row + 1, col - 1 ], [ row, col + 1 ], [ row - 1, col ]);

		}
		break;
	case 19:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row, col + 1 ], [
					row + 1, col ], [ row, col - 1 ]);
		}
		break;
	case 20:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row, col + 1 ], [
					row, col + 2 ], [ row, col - 1 ]);
		}
		if (r === 1) {
			placement.push([ row, col ], [ row, col + 1 ], [ row + 1, col ], [
					row + 2, col ], [ row - 1, col ]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row + 1, col ], [ row, col - 1 ], [
					row, col - 2 ], [ row, col + 1 ]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row, col - 1 ], [ row - 1, col ], [
					row - 2, col ], [ row + 1, col ]);
		}
		if (r === 4) {
			placement.push([ row, col ], [ row - 1, col ], [ row, col - 1 ], [
					row, col - 2 ], [ row, col + 1 ]);
		}
		if (r === 5) {
			placement.push([ row, col ], [ row, col + 1 ], [ row - 1, col ], [
					row - 2, col ], [ row + 1, col ]);
		}
		if (r === 6) {
			placement.push([ row, col ], [ row + 1, col ], [ row, col + 1 ], [
					row, col + 2 ], [ row, col - 1 ]);
		}
		if (r === 7) {
			placement.push([ row, col ], [ row, col - 1 ], [ row + 1, col ], [
					row + 2, col ], [ row - 1, col ]);
		}
		break;
	}
	return placement;
}
  return {
      getScore: getScore,
	  endOfMatch: endOfMatch,
      getInitialBoard: getInitialBoard,
	  getInitialFreeShapes: getInitialFreeShapes,
	  getInitialPlayerStatus: getInitialPlayerStatus,
      createMove: createMove,
      isMoveOk: isMoveOk,
      legalPlacement: legalPlacement,
	  getPlacement: getPlacement,
      getPossibleMoves: getPossibleMoves,
	  getTotalRotateCount: getTotalRotateCount
  };
});