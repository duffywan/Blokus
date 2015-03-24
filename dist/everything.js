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
			if (board[i][j] !== '') {
				continue;
			}
			if (squareEdgeConnected(board, i, j, turnIndex)) {
				continue;
			}
			if (!isFirstMove && !squareCornerConnected(board, i, j, turnIndex)) {
				continue;
			}
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
	if (shape === 5 || shape === 10 || shape === 11 || shape === 14 || shape === 16 || shape === 17) {
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
	if (isFirstMove(board, turnIndex)) {
		return true;
	}
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			if (board[i][j] !== '') {
				continue;
			}
			if (squareEdgeConnected(board, i, j, turnIndex)) {
				continue;
			}
			if (!squareCornerConnected(board, i, j, turnIndex)) {
				continue;
			}
			for (var shape = 0; shape < 21; shape++) {
				if (!freeShapes[turnIndex][shape]) {
					continue;
				}
				for (var r = 0; r < 8; r++) {
					if (!isValidRotation(shape, r)) {
						continue;
					}
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

/** return the updated state.playerStatus after a move is completed */
function updatePlayerStatus(boardAfterMove, freeShapes, playerStatus) {
	var playerStatusAfterMove = angular.copy(playerStatus);
	// a player dies when used up all the shapes
	for (var i = 0; i < 4; i++) {
		if (shapeUsedUp(i, freeShapes)) {
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


/** check whether the board square has an edge connection to another square of the same player 03/22 */
function squareCornerConnected(board, row, col, turnIndex) {
	var label = turnIndex.toString();
	if (inBounds(board, row + 1, col + 1) && board[row + 1][col + 1] === label || 
		inBounds(board, row + 1, col - 1) && board[row + 1][col - 1] === label ||
		inBounds(board, row - 1, col + 1) && board[row - 1][col + 1] === label || 
		inBounds(board, row - 1, col - 1) && board[row - 1][col - 1] === label) {
		return true;
	} else {
		return false;
	}
}
/** check whether the placement is contains corner-to-corner connections */
function cornerConnected(board, placement, turnIndex) {
	for (var i = 0; i < placement.length; i++) {
		var label = turnIndex.toString();
		var row = placement[i][0];
		var col = placement[i][1];
		if (squareCornerConnected(board, row, col, turnIndex)) {
			return true;
		}
	}
	return false;
}

/** check whether the board square has an edge connection to another square of the same player 03/22 */
function squareEdgeConnected(board, row, col, turnIndex) {
	var label = turnIndex.toString();
	if (inBounds(board, row + 1, col) && board[row + 1][col] === label || 
		inBounds(board, row - 1, col) && board[row - 1][col] === label ||
		inBounds(board, row, col + 1) && board[row][col + 1] === label || 
		inBounds(board, row, col - 1) && board[row][col - 1] === label) {
		return true;
	} else {
		return false;
	}
}

/** check whether the placement contains edge-to-edge connections */
function edgeConnected(board, placement, turnIndex) {
	for (var i = 0; i < placement.length; i++) {
		var label = turnIndex.toString();
		var row = placement[i][0];
		var col = placement[i][1];
		if (squareEdgeConnected(board, row, col, turnIndex)) {
			return true;
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
	if (turnIndex === 0) {
		return board[0][0] !== '0';
	}
	if (turnIndex === 1) {
		return board[0][19] !== '1';
	}
	if (turnIndex === 2) {
		return board[19][0] !== '2';
	}
	if (turnIndex === 3) {
		return board[19][19] !== '3';
	}
	return false;
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
      getPossibleMoves: getPossibleMoves
  };
});;angular.module('myApp')
  .controller('Ctrl',
      ['$scope', '$log', '$timeout',
       'gameService', 'stateService', 'gameLogic', 'resizeGameAreaService',
		function ($scope, $log, $timeout,
			gameService, stateService, gameLogic, resizeGameAreaService) {

    'use strict';

    resizeGameAreaService.setWidthToHeight(1.6);
	
	window.e2e_test_stateService = stateService; //to allow us to load any state in our e2e tests.
	
	// Before getting any updateUI, we initialize $scope variables (such as board)
    // and show an empty board to a viewer (so you can't perform moves).
    // updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2}); this is a fake call;
	gameService.setGame({
		gameDeveloperEmail: "yw1840@nyu.edu",
		minNumberOfPlayers: 4,
		maxNumberOfPlayers: 4,
		isMoveOk: gameLogic.isMoveOk,
		updateUI: updateUI
    });
	

	function updateUI(params) {
		/*
			example of params = {stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2}
		*/
		$scope.state = params.stateAfterMove;
		$scope.state.board = params.stateAfterMove.board;
		$scope.state.delta = params.stateAfterMove.delta;
		$scope.state.freeShapes = params.stateAfterMove.freeShapes;
		$scope.state.playerStatus = params.stateAfterMove.playerStatus;
		$scope.shape = -1; //initialize the shape being selected by current player, DEV USE
		$scope.rotate = 0; //initialize the rotate direction, DEV USE
		

		if ($scope.state.board === undefined) {
			$scope.state.board = gameLogic.getInitialBoard();
			$scope.state.freeShapes = gameLogic.getInitialFreeShapes();
			$scope.state.playerStatus = gameLogic.getInitialPlayerStatus();
		}
		$scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
			params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
		$scope.turnIndex = params.turnIndexAfterMove;
		// Is it the computer's turn?
		if ($scope.isYourTurn &&
			params.playersInfo[params.yourPlayerIndex].playerId === '') {
			$scope.isYourTurn = false; // to make sure the UI won't send another move.
			// Waiting 0.5 seconds to let the move animation finish; if we call aiService
			// then the animation is paused until the javascript finishes.
			$timeout(sendComputerMove, 500);
		}
    }
	function sendComputerMove() {
      // just randomly send a possible move;
	  var items = gameLogic.getPossibleMoves($scope.state, $scope.turnIndex);
      gameService.makeMove(items[Math.floor(Math.random()*items.length)]);
    }
	
	function isReferencingPoint(row, col) {
		if($scope.shape === 0) {
			if(row===2&&col===2) {
				return true;
			}
		}
		if($scope.shape === 1) {
			if(row===2&&col===2 || row===7&&col===2) {
				return true;
			}
		}
		if($scope.shape === 2) {
			if(row===2&&col===2 || row===7&&col===1) {
				return true;
			}
		}
		if($scope.shape === 3) {
			if(row===3&&col===2 || row===7&&col===1) {
				return true;
			}
		}
		if($scope.shape === 4) {
			if(row===4&&col===2 || row===7&&col===0) {
				return true;
			}
		}
		if($scope.shape === 5) {
			if(row===2&&col===2 || row===7&&col===2 || row===12&&col===2 || row===17&&col===2) {
				return true;
			}
		}
		if($scope.shape === 6) {
			if(row===2&&col===2 || row==6&&col===2 || row===12&&col===3 || row===12&&col===3 || row===17&&col===2 || row===22&&col===2 || row===27&&col===2 || row===32&&col===2 || row===36&&col===3) {
				return true;
			}
		}
		if($scope.shape === 7) {
			if (row===2&&col===2 || row===7&&col===1 || row===22&&col===2 || row===27&&col===2) {
				return true;
			}
		}
		if($scope.shape === 8) {
			if (row===2&&col==2) {
				return true;
			}
		}
		if($scope.shape === 9) {
			if(row===2&&col===1 || row===6&&col===2 || row===12&&col===3 || row===18&&col===2 || row===22&&col===3 || row===28&&col===2 || row===31&&col===1 || row===36&&col===2) {
				return true;
			}
		}
		if($scope.shape === 10) {
			if (row===3&&col===2 || row===7&&col===1 || row===11&&col===2 || row===17&&col===3) {
				return true;
			}
		}
		if($scope.shape === 11) {
			if (row===3&&col===1 || row===6&&col===1 || row===11&&col===3 || row===18&&col===3) {
				return true;
			}
		}
		if($scope.shape === 12) {
			if (row===1&&col===2 || row===7&&col===3 || row===13&&col===2 || row===17&&col===2 || row===21&&col===2 || row===27&&col===3 || row===32&&col===2 || row===37&&col===2 ){
				return true;
			}
		}
		if($scope.shape === 13) {
			if (row===2&&col===2 || row===7&&col==2 || row===22&&col==2 || row===27&&col===2) {
				return true;
			}
		}
		if($scope.shape === 14) {
			if (row===2&&col==2 || row===7&&col===2 || row===12&&col===2 || row===17&&col==2) {
				return true;
			}
		}
		if($scope.shape === 15) {
			if(row===1&&col===1 || row===6&&col==3 || row===13&&col===3 || row===17&&col===1 || row===21&&col===3 || row===27&&col===3 || row==33&&col===1 || row===36&&col===1) {
				return true;
			}
		}
		if($scope.shape === 16) {
			if (row===2&&col==2 || row===7&&col===2 || row===12&&col===2 || row===17&&col===2) {
				return true;
			}
		}	
		if($scope.shape === 17) {
			if (row===2&&col===1 || row===6&&col===2 || row===12&&col===3 || row===17&&col===2) {
				return true;
			}
		}	
		if($scope.shape === 18) {
			if (col===2 && (row===2 || row===7 || row=== 12 || row===17 || row=== 22 || row===27 || row===32 || row===37)) {
				return true;
			}
		}	
		if($scope.shape === 19) {
			if(row===2&&col===2) {
				return true;
			}
		}	
		if($scope.shape === 20) {
			if (col===2 && (row===2 || row===7 || row===12 || row===17 || row===22||row===28||row===32||row===37)) {
				return true;
			}
		}			
		return false;
	}
	$scope.getRotateAreaSquareColor = function(row, col) {
		if ($scope.getRotate(row, col) === -1) { // if this square is not a part of a rotated shape
			return { backgroundColor : 'white' };
		} else {
			if ($scope.turnIndex === 0) {
				if(isReferencingPoint(row, col)) {
					return { backgroundColor : 'grey'};
				} else {
					return { backgroundColor : 'red'};
				}
			}
			if ($scope.turnIndex === 1) {
				if(isReferencingPoint(row, col)) {
					return { backgroundColor : 'grey'};
				} else {
					return { backgroundColor : 'green'};
				}
			}
			if ($scope.turnIndex === 2) {
				if(isReferencingPoint(row, col)) {
					return { backgroundColor : 'grey'};
				} else {
					return { backgroundColor : 'blue'};
				}
			}
			if ($scope.turnIndex === 3) {
				if(isReferencingPoint(row, col)) {
					return { backgroundColor : 'grey'};
				} else {
					return { backgroundColor : 'yellow'};
				}
			}
		}
	}

	$scope.getRotate = function(row, col) {
		var rotate = -1; // -1 denotes that the square does not belong to any rotated shape
		if ($scope.shape === 0) {
			if (row === 2 && col === 2) {
				rotate = 0;
			}
		}
		if ($scope.shape === 1) {
			if (row===1 && col === 2 || row === 2 && col === 2) {
				rotate = 0;
			}
			if (row===7 && col === 2 || row === 7 && col === 3) {
				rotate = 1;
			}
		}
		if ($scope.shape === 2) {
			if (row === 0 && col === 2 || row === 1 && col === 2 || row === 2 && col === 2) {
				rotate = 0;
			}
			if (row === 7 && col ===1 || row === 7 && col === 2 || row === 7 && col === 3) {
				rotate = 1;
			}
		}
		if ($scope.shape === 3) {
			if (row === 0 && col === 2 || row === 1 && col === 2 || row === 2 && col === 2 || row === 3 && col === 2) {
				rotate = 0;
			}
			if (row === 7 && col ===1 || row === 7 && col === 2 || row === 7 && col === 3 || row === 7 && col === 4) {
				rotate = 1;
			}
		}
		if ($scope.shape === 4) {
			if (row === 0 && col === 2 || row === 1 && col === 2 || row === 2 && col === 2 || row === 3 && col === 2 || row === 4 && col === 2) {
				rotate = 0;
			}
			if (row === 7 && col === 0 || row === 7 && col ===1 || row === 7 && col === 2 || row === 7 && col === 3 || row === 7 && col === 4) {
				rotate = 1;
			}
		}
		if ($scope.shape === 5) {
			if (row===1 && col === 2 || row === 2 && col === 2 || row === 2 && col === 3) {
				rotate = 0;
			}
			if (row===7 && col === 2 || row === 7 && col === 3 || row === 8 && col === 2) {
				rotate = 1;
			}
			if (row===12&&col===1 || row===12&&col===2 || row===13&&col===2) {
				rotate = 2;
			}
			if (row===16&&col===2 || row===17&&col===1 || row===17&&col===2) {
				rotate = 3;
			}
		}
		if ($scope.shape === 6) {
			if(row===0&&col===2 || row===1&&col===2 || row===2&&col===2 || row===2&&col===3){
				rotate = 0;
			}
			if(row===6&&col===2 || row===6&&col===3 || row===6&&col===4 || row===7&&col===2) {
				rotate = 1;
			}
			if(row===12&&col===2 || row===12&&col===3 || row===13&&col===3 || row===14&&col===3){
				rotate = 2;
			}
			if(row===16&&col===2 || row===17&&col===0 || row===17&&col===1 || row===17&&col===2){
				rotate = 3;
			}
			if (row===22&&col===1 || row===20&&col===2 || row===21&&col===2 || row===22&&col===2) {
				rotate = 4;
			}
			if (row===26&&col===2 || row===27&&col===2 || row===27&&col===3 || row===27&&col===4) {
				rotate = 5;
			}
			if (row===32&&col===3 || row===32&&col===2 || row===33&&col===2 || row===34&&col===2) {
				rotate = 6;
			}
			if(row===36&&col===1 || row===36&&col===2 || row===36&&col===3 || row===37&&col===3){
				rotate = 7;
			}
		}
		if ($scope.shape === 7) {
			if(row===1&&col===2 || row===1&&col===3 || row===2&&col===1 || row===2&&col===2){
				rotate = 0;
			}
			if(row===6&&col===1 || row===7&&col===1 || row===7&&col===2 || row===8&&col===2){
				rotate = 1;
			}
			if(row===21&&col===1 || row===21&&col===2 || row===22&&col===2 || row===22&&col===3){
				rotate = 4;
			}
			if(row===27&&col===2 || row===28&&col===2 || row===26&&col===3 || row===27&&col===3){
				rotate = 5;
			}
		}
		if ($scope.shape === 8) {
			if(row===1&&col===2 || row===1&&col===3 || row===2&&col===2 || row===2&&col===3) {
				rotate = 0;
			}
		}
		if ($scope.shape === 9) {
			if(row===1&&col===1 || row===2&&col===1 || row===2&&col===2 || row===2&&col===3 || row===2&&col===4){
				rotate = 0;
			}
			if (row===6&&col===3 || row===6&&col===2 || row===7&&col===2 || row===8&&col===2 || row===9&&col===2){
				rotate = 1;
			}
			if(row===12&&col===0 || row===12&&col===1 || row===12&&col===2 || row===12&&col===3 || row===13&&col===3){
				rotate = 2;
			}
			if (row===15&&col===2 || row===16&&col===2 || row===17&&col===2 || row===18&&col===2 || row===18&&col===1) {
				rotate = 3;
			}
			if (row===21&&col===3 || row===22&&col===0 || row===22&&col===1 || row===22&&col===2 || row===22&&col===3) {
				rotate = 4;
			}
			if (row===25&&col===2 || row===26&&col===2 || row===27&&col===2 || row===28&&col===2 || row===28&&col===3) {
				rotate = 5;
			}
			if (row===31&&col===1 || row===31&&col===2 || row===31&&col===3 || row===31&&col===4 || row===32&&col===1) {
				rotate = 6;
			}
			if (row===36&&col===1 || row===36&&col===2 || row===37&&col===2 || row===38&&col===2 || row===39&&col===2) {
				rotate = 7;
			}
		}
		if ($scope.shape === 10) {
			if(row===1&&col===2 || row===2&&col===2 || row===3&&col===1 || row===3&&col===2 || row===3&&col===3) {
				rotate = 0;
			}
			if(row===6&&col===1 || row===7&&col===1 || row===8&&col===1 || row===7&&col===2 || row===7&&col===3) {
				rotate = 1;
			}
			if (row===11&&col===1 || row===11&&col===2 || row===11&&col===3 || row===12&&col===2 || row===13&&col===2) {
				rotate = 2;
			}
			if(row===17&&col===1 || row===17&&col===2 || row===16&&col===3 || row===17&&col===3 || row===18&&col===3) {
				rotate = 3;
			}
		}
		if($scope.shape === 11){
			if(row===1&&col===1 || row===2&&col===1 || row===3&&col===1 || row===3&&col===2 || row===3&&col===3) {
				rotate = 0;
			}
			if(row===6&&col===1 || row===6&&col===2 || row===6&&col===3 || row===7&&col===1 || row===8&&col===1) {
				rotate = 1;
			}
			if(row===11&&col===1 || row===11&&col===2 || row===11&&col===3 || row===12&&col===3 || row===13&&col===3) {
				rotate = 2;
			}
			if(row===16&&col===3 || row===17&&col===3 || row===18&&col===1 || row===18&&col===2 || row===18&&col===3) {
				rotate = 3;
			}
		}
		if($scope.shape === 12) {
			if(row===1&&col===2 || row===1&&col===3 || row===1&&col===4 || row===2&&col===1 || row===2&&col==2) {
				rotate = 0;
			}
			if(row===6&&col===2 || row===7&&col===2 || row===7&&col===3 || row===8&&col===3 || row===9&&col===3) {
				rotate = 1;
			}
			if(row===12&&col===2 || row===12&&col===3 || row===13&&col===0 || row===13&&col===1 || row===13&&col===2) {
				rotate = 2;
			}
			if(row===15&&col===2 || row===16&&col===2 || row===17&&col===2 || row===17&&col===3 || row===18&&col===3) {
				rotate = 3;
			}
			if(row===21&&col===0 || row===21&&col===1 || row===21&&col===2 || row===22&&col===2 || row===22&&col===3) {
				rotate = 4;
			}
			if(row===25&&col===3 || row===26&&col===3 || row===27&&col===3 || row===27&&col===2 || row===28&&col===2) {
				rotate = 5;
			}
			if(row===31&&col===1 || row===31&&col===2 || row===32&&col===2 || row===32&&col===3 || row===32&&col===4) {
				rotate = 6;
			}
			if(row===36&&col===3 || row===37&&col===3 || row===37&&col===2 || row===38&&col===2 || row===39&&col==2) {
				rotate = 7;
			}
		}
		if($scope.shape === 13) {
			if(row===1&&col===3 || row===2&&col===1 || row===2&&col===2 || row===2&&col===3 || row===3&&col===1) {
				rotate = 0;
			} 
			if(row===6&&col===1 || row===6&&col===2 || row===7&&col===2 || row===8&&col===2 || row===8&&col===3) {
				rotate = 1;
			}
			if(row===21&&col===1 || row===22&&col===1 || row===22&&col===2 || row===22&&col===3 || row===23&&col===3) {
				rotate = 4;
			}
			if(row===26&&col===2 || row===26&&col===3 || row===27&&col===2 || row===28&&col===1 || row===28&&col===2) {
				rotate = 5;
			}
		}
		if ($scope.shape === 14) {
			if(row===1&&col===2 || row===2&&col===1 || row===2&&col===2 || row===2&&col===3) {
				rotate = 0;
			}
			if(row===6&&col===2 || row===7&&col===2 || row===8&&col===2 || row===7&&col===3) {
				rotate = 1;
			}
			if(row===12&&col===1 || row===12&&col===2 || row===12&&col===3 || row===13&&col===2) {
				rotate = 2;
			} 
			if(row===16&&col===2 || row===17&&col===2 || row===18&&col===2 || row===17&&col===1) {
				rotate = 3;
			}
		}
		if ($scope.shape === 15) {
			if(row===1&&col===1 || row===1&&col===2 || row===2&&col===1 || row===2&&col===2 || row===3&&col===1) {
				rotate = 0;
			}
			if(row===6&&col===1 || row===6&&col===2 || row===6&&col===3 || row===7&&col===2 || row===7&&col===3) {
				rotate = 1;
			}
			if(row===12&&col===2 || row===13&&col===2 || row===11&&col===3 || row===12&&col===3 || row===13&&col===3) {
				rotate = 2;
			}
			if(row===16&&col===1 || row===16&&col===2 || row===17&&col===1 || row===17&&col===2 || row===17&&col===3) {
				rotate = 3;
			}
			if(row===21&&col===2 || row===22&&col===2 || row===21&&col===3 || row===22&&col===3 || row===23&&col===3) {
				rotate = 4;
			}
			if(row===26&&col===2 || row===26&&col===3 || row===27&&col===1 || row===27&&col===2 || row===27&&col===3) {
				rotate = 5;
			}
			if(row===31&&col===1 || row===32&&col===1 || row===33&&col===1 || row===32&&col===2 || row===33&&col===2) {
				rotate = 6;
			}
			if(row===36&&col===1 || row===36&&col===2 || row===36&&col===3 || row===37&&col===1 || row===37&&col===2) {
				rotate = 7;
			}
		}
		if($scope.shape === 16) {
			if(row===1&&col===2 || row===1&&col===3 || row===2&&col===1 || row===2&&col===2 || row===3&&col===1) {
				rotate = 0;
			}
			if(row===6&&col===1 || row===6&&col===2 || row===7&&col===2 || row===7&&col===3 || row===8&&col===3) {
				rotate = 1;
			}
			if(row===11&&col===3 || row===12&&col===3 || row===12&&col===2 || row===13&&col===2 || row===13&&col===1){
				rotate = 2;
			}
			if(row===16&&col==1 || row===17&&col===1 || row===17&&col==2 || row===18&&col===2 || row===18&&col===3){
				rotate = 3;
			}
		}
		if($scope.shape === 17) {
			if(row===1&&col===1 || row===1&&col===2 || row===2&&col===1 || row===3&&col===1 || row===3&&col===2) {
				rotate = 0;
			}
			if(row===6&&col===1 || row===6&&col===2 || row===6&&col===3 || row===7&&col===1 || row===7&&col===3) {
				rotate = 1;
			}
			if(row===11&&col===3 || row===12&&col===3 || row===13&&col===3 || row===11&&col===2 || row===13&&col===2) {
				rotate = 2;
			}
			if(row===17&&col===1 || row===17&&col===2 || row===17&&col===3 ||row===16&&col===1 || row===16&&col===3) {
				rotate = 3;
			}
		}
		if ($scope.shape === 18) {
			if(row===1&&col===2 || row===2&&col===2 || row===3&&col===2 || row===1&&col===3 || row===2&&col===1) {
				rotate = 0;
			}
			if(row===7&&col===1 || row===7&&col===2 || row===7&&col===3 || row===6&&col===2 || row===8&&col===3) {
				rotate = 1;
			}
			if(row===11&&col===2 || row===12&&col===2 || row===13&&col===2 || row===12&&col===3 || row===13&&col===1) {
				rotate = 2;
			}
			if (row===17&&col===1 || row===17&&col===2 || row===17&&col===3 || row===16&&col===1 || row===18&&col===2) {
				rotate = 3;
			}
			if(row===21&&col===2 || row===22&&col===2 || row===23&&col===2 || row===21&&col===1 || row===22&&col===3) {
				rotate = 4;
			}
			if(row===27&&col===1 || row===27&&col===2 || row===27&&col===3 || row===26&&col===3 || row===28&&col===2) {
				rotate = 5;
			}
			if(row===31&&col===2 || row===32&&col===2 || row===33&&col==2 || row===32&&col===1 || row===33&&col===3) {
				rotate = 6;
			}
			if(row===37&&col===1 || row===37&&col===2 || row===37&&col===3 || row===36&&col===2 || row===38&&col===1) {
				rotate = 7;
			}
		}
		if ($scope.shape === 19) {
			if (row===1&&col===2 || row===2&&col===1 || row===2&&col===2 || row===2&&col===3 || row===3&&col===2) {
				rotate = 0;
			}
		}
		if ($scope.shape === 20) {
			if(row===1&&col===2 || row===2&&col===1 || row===2&&col===2 || row===2&&col===3 || row===2&&col===4) {
				rotate = 0;
			}
			if(row===6&&col===2 || row===7&&col===2 || row===8&&col===2 || row===9&&col===2 || row===7&&col===3) {
				rotate = 1;
			}
			if(row===12&&col===0 || row===12&&col===1 || row===12&&col===2 || row===12&&col===3 || row===13&&col===2) {
				rotate = 2;
			}
			if(row===15&&col===2 || row===16&&col===2 || row===17&&col===2 || row===18&&col===2 || row===17&&col===1) {
				rotate = 3;
			}
			if(row===22&&col===0 || row===22&&col===1 || row===22&&col===2 || row===22&&col===3 || row===21&&col===2) {
				rotate = 4;
			}
			if(row===26&&col===2 || row===27&&col===2 || row===28&&col===2 || row===29&&col===2 || row===28&&col===3) {
				rotate = 5;
			}
			if(row===32&&col===1 || row===32&&col===2 || row===32&&col===3 || row===32&&col===4 || row===33&&col===2) {
				rotate = 6;
			}
			if(row===36&&col===2 || row===37&&col===2 || row===38&&col===2 || row===39&&col===2 || row===37&&col===1) {
				rotate = 7;
			}
		}
		return rotate;
	}
	
	$scope.rotateAreaCellClicked = function(row, col) {
		var rotate = $scope.getRotate(row,col);
		if (rotate >= 0) {
			$scope.rotate = rotate; // if the player clicks on a legal rotation, store the rotation in $scope.rotate
		} else {
			$scope.rotate = 0; // else default rotation to 0;
		}
		
	}
	/** get the color style of a cell on the boardArea by examining the board*/
	$scope.getCellColorStyle = function (row, col) {
		var color = $scope.getCellColor(row, col);
		return {backgroundColor: color};
	}
	
	/** get the color of a cell on the boardArea by examining the board*/
	$scope.getCellColor = function (row, col) {
		var cell = $scope.state.board[row][col];
		var color = '';
		if (cell === '0') {
			color = 'red';
		} else if (cell === '1') {
			color = 'green';
		} else if (cell === '2') {
			color = 'blue';
		} else if (cell === '3'){
			color = 'yellow';
		} else {
			color = 'white';
		}
		return color;
	}	
	
	$scope.shapeClicked = function (shape) {
		$scope.shape = shape;
	}
	
	$scope.boardAreaCellClicked = function (row, col) {
		$log.info(["Clicked on cell:", row, col]);
		if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
			throw new Error("Throwing the error because URL has '?throwException'");
		}
		if (!$scope.isYourTurn) {
			return;
		}
		if ($scope.shape === -1) { // if the player haven't select a shape, the game should do nothing
			return;
		}
		try {

			var placement = gameLogic.getPlacement(row, col, $scope.shape, $scope.rotate);
			var move = gameLogic.createMove($scope.state, placement, $scope.shape, $scope.turnIndex);
			$scope.isYourTurn = false; // to prevent making another move
			$scope.shape = -1; // to reset the shape being selected
			/**need to reset $scope.rotate also*/
			gameService.makeMove(move);
		} catch (e) {
			$log.info(["This is an illegal move:", row, col]);
			return;
		}
    };

    $scope.shapAreaCellClicked = function (row, col) {
      // row = row - 1;
      var shapeNum = getShape(row, col);
	  $log.info(["Clicked on shape:", shapeNum]);
      $scope.shape = shapeNum;
    };

	$scope.getShapeCellColorStyle= function(row, col) {
      /*if(getShape(row, col) >= 0 && shapeAvaiable(row, col, $scope.turnIndex)) {*/
		var shapeNum = getShape(row, col);
		if (shapeNum >= 0 && $scope.state.freeShapes[$scope.turnIndex] != undefined && $scope.state.freeShapes[$scope.turnIndex][shapeNum]) {
			switch ($scope.turnIndex) {
				case 0:
					return { backgroundColor : 'red' };
					break;
				case 1:
					return { backgroundColor : 'green' };
					break;
				case 2:
					return { backgroundColor : 'blue' };
					break;
				case 3:
					return { backgroundColor : 'yellow' };
					break;
			}
      } else {
        return { backgroundColor : 'white' };
      }
    }
function getShape(row, col) {
      if (row === 0 && col === 2) {
        return 0;
      }
      if (col === 2 && (row === 2 || row === 3)) {
        return 1;
      }
      if (col === 2 && (row === 5 || row === 6 || row === 7)) {
        return 2;
      }
      if (col === 2 && (row === 9 || row === 10 || row === 11 || row === 12)) {
        return 3;
      }
      if (col === 2 && (row === 14 || row === 15 || row === 16 || row === 17 || row === 18)) {
        return 4;
      }
      if ((col === 2 && (row === 20 || row === 21)) || (row == 21 && col === 3)) {
        return 5;
      }
      if ((col === 2 && (row === 23 || row === 24 || row === 25)) || (row === 25 && col === 3)) {
        return 6;
      }
      if ((row === 27 && (col === 2 || col === 3)) || row === 28 && (col === 1 || col === 2)) {
        return 7;
      }
      if ((row === 30 && (col === 1 || col === 2)) || (row === 31 && (col === 1 || col === 2))) {
        return 8;
      }
      if ((row === 33 && col === 1) || (row === 34 && (col === 1 || col === 2 || col === 3 || col === 4))) {
        return 9;
      }
      if ((col === 2 && (row === 36 || row === 37 || row === 38)) || (row === 38 && (col === 1 || col === 3))) {
        return 10;
      }
      if ((col === 6 && (row === 0 || row === 1 || row === 2)) || (row === 2 && (col === 7 || col === 8))) {
        return 11;
      }
      if ((row === 4 && (col === 7 || col === 8 || col === 9)) || (row === 5 && (col === 6 || col === 7))) {
        return 12;
      }
      if ((row === 7 && col === 8) || (row === 8 && (col === 6 || col === 7 || col === 8)) || (row === 9 && col === 6)) {
        return 13;
      }
      if ((row === 11 && col === 7) || (row === 12 && (col === 6 || col === 7 || col === 8))) {
        return 14;
      }
      if ((col === 6 && (row === 14 || row === 15 || row === 16)) || (col === 7 && (row === 14 || row === 15))) {
        return 15;
      }
      if ((row === 18 && (col === 7 || col === 8)) || (row === 19 && (col === 6 || col === 7)) || (row === 20 && col === 6)) {
        return 16;
      }
      if ((col ===6 && (row === 22 || row === 23 || row === 24)) || (col === 7 && (row === 22 || row === 24))) {
        return 17;
      }
      if ((row === 27 && (col === 7 || col === 8)) || (row === 28 && (col === 6 || col === 7)) || (row === 29 && col === 7)) {
        return 18;
      }
      if ((row === 32 && col === 7) || (row === 33 && (col === 6 || col === 7 || col === 8)) || (row === 34 && col === 7)) {
        return 19;
      }
      if ((row === 37 && col === 7) || (row === 38 && (col === 6 || col === 7 || col === 8 || col === 9))) {
        return 20;
      }
      return -1;
    };
	
  }]);