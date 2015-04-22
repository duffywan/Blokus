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
/*
function getPossibleMoves(state, turnIndex) {
	// example state = {board :[[...]...], playerStatus : [true, true, true,
	// true], freeShapes = [[true,true, false...], [], [], []],
	// delta : {shape : 0, placement : [[2,2]]}
	// all 4 players are alive. player0 has #0, #1 shapes free, #2 shape not
	// available. last shape is put on the board is #0, placed at (2, 2).
	var possibleMoves = [];
	var freeShapes = state.freeShapes;
	var board = state.board;
	var shapeOf5Squares = [4,9,10,11,12,13,15,16,17,18,19,20];
	var shapeOf4Squares = [3,6,7,8,14];
	var shapeOfLessThan4Squares = [0,1,2,5];
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			if (board[i][j] !== '') {
				continue;
			}
			if (squareEdgeConnected(board, i, j, turnIndex)) {
				continue;
			}
			
			for (var k = 0; k < shapeOf5Squares.length; k++) {
				var shape = shapeOf5Squares[k];
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
						possibleMoves.push(createMove(state, placement,shape, turnIndex));
					}
				}
			}

		}
	}
	if (possibleMoves.length > 0) {
		return possibleMoves;
	}
	return possibleMoves;
}
*/

function getPossibleMoves(state, turnIndex){
	var possibleMoves = getPossibleMovesWithSqaureN(state, turnIndex, 5);
	if (possibleMoves.length > 0) {
		return possibleMoves;
	} else {
		possibleMoves = getPossibleMovesWithSqaureN(state, turnIndex, 4);
		if (possibleMoves.length > 0) {
			return possibleMoves;
		} else {
			return getPossibleMovesWithSqaureN(state, turnIndex, 3);
		}
	}
}

function traverseBoard(){
	var row_col = [];
	var num = 1;
	var i;
	var j;
	for (var level = 9; level >=0; level--) {
		i = level; 
		j = level;
		// going right;
		for (; j < level + num; j++) {
			row_col.push([i,j]);
		}
		// going down
		for (; i < level + num; i++) {
			row_col.push([i,j]);
		}
		// going left
		for (; j > level; j--) {
			row_col.push([i,j]);
		}
		// going up
		for (; i > level; i--) {
			row_col.push([i,j]);
		}
		num += 2;
	}
	return row_col;
}

function shuffle(array) {
    var n = array.length;
    for (var i = 0; i < n; i++) {
        // choose index uniformly in [i, n-1]
        var r = i + Math.floor((Math.random() * (n - i)));
		var swap = array[r];
		array[r] = array[i];
        array[i] = swap;
	}
	return array;
}

/*return the possible moves which places a n-square shape*/
function getPossibleMovesWithSqaureN(state, turnIndex, n){
	var shapes = [];
	var possibleMoves = [];
	var freeShapes = state.freeShapes;
	var board = state.board;
	var count = 0;
	if (n === 5) {
		shapes = shuffle([4,9,10,11,12,13,15,16,17,18,19,20]); // shapes with 5 squares;
	} else if (n === 4) {
		shapes = shuffle([3,6,7,8,14]); // shapes with four squares;
	} else {
		shapes = shuffle([0,1,2,5]); // shapes with less than 4 squares;
	}
	var row_col = traverseBoard();
	for (var h = 0; h < row_col.length && count < 1; h++) {
		var i = row_col[h][0];
		var j = row_col[h][1];
		if (board[i][j] !== '') {
			continue;
		}
		if (squareEdgeConnected(board, i, j, turnIndex)) {
			continue;
		}
		for (var k = 0; k < shapes.length && count < 1; k++) {
			var shape = shapes[k];
			if (!freeShapes[turnIndex][shape]) {
				continue;
			}
			var rotations = shuffle(getPossibleRotations(shape));
			for (var r = 0; r < rotations.length && count < 1; r++) {
				// there are total 8 possible rotations
				var placement = getPlacement(i, j, shape, r);
				if (legalPlacement(board, placement, turnIndex) && count < 1) {
					possibleMoves.push(createMove(state, placement,shape, turnIndex));
					count++;
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

/*return the possible rotations for a given shape*/
function getPossibleRotations(shape) {
	var rotations = [];
	if (shape === 0 || shape === 8 || shape === 19) {
		rotations.push(0);
	}
	if (shape === 1 || shape === 2 || shape === 3 || shape === 4) {
		rotations.push(0, 1);
	}
	if (shape === 5 || shape === 10 || shape === 11 || shape === 14 || shape === 16 || shape === 17) {
		rotations.push(0, 1, 2, 3);
	}
	if (shape === 7 || shape === 13) {
		rotations.push(0, 1, 4, 5);
	}
	if (shape === 6 || shape === 9 || shape === 12 || shape === 15 || shape === 18 || shape === 20) {
		rotations.push(0, 1, 2, 3, 4, 5, 6, 7);
	}
	return rotations;
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
	
	for (var i = 0; i < 20; i++) {
		for (var j = 0; j < 20; j++) {
			if (board[i][j] !== '') {
				continue;
			}
			if (squareEdgeConnected(board, i, j, turnIndex)) {
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
					if (placementInBound(board, placement) && !isOccupied(board, placement) && 
						!edgeConnected(board, placement, turnIndex) && cornerConnected(board, placement, turnIndex)) {
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
	var label = turnIndex.toString();
	if (board[0][0] === label || board[0][19] === label || board[19][0] === label || board[19][19] === label) {
		return false;
	}
	return true;
}

function legalPlacement(board, placement, turnIndex) {
	/*
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
	*/
	if (isFirstMove(board, turnIndex)) {
		for (var i = 0; i < placement.length; i++) {
			if (angular.equals(placement[i], [0,0]) || angular.equals(placement[i], [0,19]) || 
				angular.equals(placement[i], [19,0]) || angular.equals(placement[i], [19,19])) {
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
			placement.push([row, col - 1], [row, col]);
		}
		break;
	case 2:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ]);
		}
		if (r === 1) {
			placement.push([ row, col - 2], [ row, col - 1 ], [ row, col ]);
		}
		break;
	case 3:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ], [
					row - 3, col ]);
		}
		if (r === 1) {
			placement.push([row, col - 3],[row, col - 2],[row, col - 1], [row, col]);
		}
		break;
	case 4:
		if (r === 0) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ], [
					row - 3, col ], [ row - 4, col ]);
		}
		if (r === 1) {
			placement.push([row, col - 4],[row, col - 3],[row, col - 2],[row, col - 1], [row, col]);
		}
		break;
	case 5:
		if (r === 0) {
			placement.push([row, col],[row, col - 1], [row - 1, col - 1]);
		}
		if (r === 1) {
			placement.push([row, col],[row, col - 1], [row + 1, col - 1]);
		}
		if (r === 2) {
			placement.push([row, col],[row - 1, col], [row - 1, col - 1]);
		}
		if (r === 3) {
			placement.push([row, col],[row - 1, col],[row, col - 1]);
		}
		break;
	case 6:
		if (r === 0) {
			placement.push([row, col],[row, col - 1],[row - 1, col - 1],[row - 2, col - 1]);
		}
		if (r === 1) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row + 1, col - 2]);
		}
		if (r === 2) {
			placement.push([row, col],[row - 1, col],[row - 2, col],[row - 2, col - 1]);
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
			placement.push([row, col],[row, col - 1],[row, col - 2],[row - 1, col - 2]);
		}
		if (r === 6) {
			placement.push([row, col],[row, col - 1],[row + 1, col - 1],[row + 2, col - 1]);
		}
		if (r === 7) {
			placement.push([row, col],[row - 1, col],[row - 1, col - 1], [row - 1, col - 2]);
		}
		break;
	case 7:
		if (r === 0) {
			placement.push([row, col],[row, col - 1],[row + 1, col - 1],[row + 1, col - 2]);
		}
		if (r === 1) {
			placement.push([row, col], [row - 1, col], [row - 1, col - 1], [row - 2, col - 1]);
		}
		if (r === 4) {
			placement.push([row, col], [row, col - 1],[row - 1, col - 1],[row - 1, col - 2]);
		}
		if (r === 5) {
			placement.push([row, col],[row - 1, col],[row, col - 1],[row + 1, col - 1]);
		}
		break;
	case 8:
		if (r === 0) {
			placement.push([row, col],[row - 1, col],[row, col - 1],[row - 1, col - 1]);
		}
		break;
	case 9:
		if (r === 0) {
			placement.push([row, col],[row, col - 1],[row, col - 2], [row, col - 3],[row - 1, col - 3]);
		}
		if (r === 1) {
			placement.push([row, col],[row, col - 1],[row + 1, col - 1],[row + 2, col - 1],[row + 3, col - 1]);
		}
		if (r === 2) {
			placement.push([row, col],[row - 1, col], [row - 1, col - 1],[row - 1, col - 2],[row - 1, col - 3]);
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
			placement.push([row, col],[row, col - 1],[row - 1, col - 1],[row - 2, col - 1],[row - 3, col - 1]);
		}
		if (r === 6) {
			placement.push([row, col],[row, col - 1],[row, col - 2], [row, col - 3], [row + 1, col - 3]);
		}
		if (r === 7) {
			placement.push([row, col], [row - 1, col],[row - 2, col], [row - 3, col], [row - 3, col - 1]);
		}
		break;
	case 10:
		if (r === 0) {
			placement.push([row, col],[row, col - 1],[row, col - 2], [row - 1, col - 1],[row - 2, col - 1]);
		}
		if (r === 1) {
			placement.push([row, col], [row, col - 1],[row, col - 2], [row - 1, col - 2],[row + 1, col - 2]);
		}
		if (r === 2) {
			placement.push([row, col],[row - 1, col],[row - 2, col],[row - 2, col - 1],[row - 2, col + 1]);
		}
		if (r === 3) {
			placement.push([row, col],[row - 1, col],[row - 2, col],[row - 1, col - 1],[row - 1, col - 2]);
		}
		break;
	case 11:
		if (r === 0) {
			placement.push([row, col], [row, col - 1],[row, col - 2], [row - 1, col - 2],[row - 2, col - 2]);
		}
		if (r === 1) {
			placement.push([row, col],[row, col - 1],[row, col - 2], [row + 1, col - 2],[row + 2, col - 2]);
		}
		if (r === 2) {
			placement.push([row, col],[row - 1, col],[row - 2, col],[row - 2, col - 1],[row - 2, col - 2]);
		}
		if (r === 3) {
			placement.push([ row, col ], [ row, col - 1 ], [ row, col - 2 ], [
					row - 1, col ], [ row - 2, col ]);
		}
		break;

	case 12:
		if (r === 0) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row + 1, col - 2], [row + 1, col - 3]);
		}
		if (r === 1) {
			placement.push([row, col],[row - 1, col],[row - 2, col],[row - 2, col - 1],[row - 3, col - 1]);
		}
		if (r === 2) {
			placement.push([row, col],[row, col - 1],[row + 1, col - 1],[row + 1, col - 2], [row + 1, col - 3]);
		}
		if (r === 3) {
			placement.push([row, col],[row - 1, col],[row - 1, col - 1],[row - 2, col - 1],[row - 3, col - 1]);
		}
		if (r === 4) {
			placement.push([row, col],[row, col - 1],[row - 1, col - 1],[row - 1, col - 2],[row - 1, col - 3]);
		}
		if (r === 5) {
			placement.push([ row, col ], [ row - 1, col ], [ row - 2, col ], [
					row, col - 1 ], [ row + 1, col - 1 ]);
		}
		if (r === 6) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row - 1, col - 2], [row - 1, col - 3]);
		}
		if (r === 7) {
			placement.push([row, col],[row - 1, col],[row , col - 1],[row + 1, col - 1],[row + 2, col - 1]);
		}
		break;

	case 13:
		if (r === 0) {
			placement.push([row, col],[row - 1, col],[row, col - 1],[row, col - 2],[row + 1, col - 2]);

		}
		if (r === 1) {
			placement.push([row, col],[row, col - 1],[row - 1, col - 1],[row - 2, col - 1],[row - 2, col - 2]);
		}
		if (r === 4) {
			placement.push([row, col],[row - 1, col],[row - 1, col - 1],[row - 1, col - 2],[row - 2, col - 2]);

		}
		if (r === 5) {
			placement.push([row, col],[row, col - 1],[row + 1, col - 1],[row + 2, col - 1],[row + 2, col - 2]);
		}
		break;
	case 14:
		if (r === 0) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row - 1, col - 1]);
		}
		if (r === 1) {
			placement.push([row, col],[row + 1, col - 1],[row, col - 1],[row - 1, col - 1]);
		}
		if (r === 2) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row + 1, col - 1]);
		}
		if (r === 3) {
			placement.push([row, col],[row - 1, col],[row - 2, col],[row - 1, col - 1]);
		}
		break;
	case 15:
		if (r === 0) {
			placement.push([row, col],[row - 1, col],[row - 1, col - 1],[row, col - 1],[row + 1, col - 1]);
		}
		if (r === 1) {
			placement.push([row, col],[row - 1, col],[row, col - 1],[row - 1, col - 1],[row - 1, col - 2]);
		}
		if (r === 2) {
			placement.push([ row, col ], [ row, col - 1 ],
					[ row - 1, col], [ row - 1, col - 1 ], [ row - 2, col]);
		}
		if (r === 3) {
			placement.push([row, col],[row - 1, col - 1],[row, col - 1],[row - 1, col - 2],[row, col - 2]);
		}
		if (r === 4) {
			placement.push([row, col],[row - 1, col],[row - 2, col],[row - 1, col - 1],[row - 2, col - 1]);
		}
		if (r === 5) {
			placement.push([ row, col ], [ row - 1, col ],
					[ row - 1, col - 1 ], [ row, col - 1 ], [ row, col - 2 ]);
		}
		if (r === 6) {
			placement.push([row, col],[row - 1, col],[row, col - 1],[row - 1, col - 1],[row - 2, col - 1]);
		}
		if (r === 7) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row + 1, col - 1],[row + 1, col - 2]);
		}
		break;
	case 16:
		if (r === 0) {
			placement.push([row, col],[row, col - 1],[row + 1, col - 1],[row + 1, col - 2],[row + 2, col - 2]);
		}
		if (r === 1) {
			placement.push([row, col],[row - 1, col],[row - 1, col - 1],[row - 2, col - 1],[row - 2, col - 2]);
		}
		if (r === 2) {
			placement.push([row, col],[row - 1, col],[row, col - 1],[row + 1, col - 1],[row + 1, col - 2]);
		}
		if (r === 3) {
			placement.push([row, col],[row, col - 1],[row - 1, col - 1],[row - 1, col - 2],[row - 2, col - 2]);
		}
		break;
	case 17:
		if (r === 0) {
			placement.push([row, col],[row, col - 1],[row - 1, col - 1],[row - 2, col - 1],[row - 2, col]);
		}
		if (r === 1) {
			placement.push([row, col],[row - 1, col],[row - 1, col - 1],[row - 1, col - 2],[row, col - 2]);
		}
		if (r === 2) {
			placement.push([row, col],[row, col - 1],[row - 1, col],[row - 2, col],[row - 2, col - 1]);
		}
		if (r === 3) {
			placement.push([row, col],[row - 1, col],[row, col - 1],[row, col - 2],[row - 1, col - 2]);
		}
		break;
	case 18:
		if (r === 0) {
			placement.push([row, col],[row, col - 1],[row + 1, col - 1],[row + 2, col - 1],[row + 1, col - 2]);
		}
		if (r === 1) {
			placement.push([row, col],[row - 1, col],[row - 1, col - 1],[row - 1, col - 2],[row - 2, col - 1]);
		}
		if (r === 2) {
			placement.push([row, col],[row - 1, col - 1],[row, col - 1],[row + 1, col - 1],[row + 1, col - 2]);
		}
		if (r === 3) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row - 1, col - 2],[row + 1, col - 1]);
		}
		if (r === 4) {
			placement.push([row, col],[row - 1, col - 1],[row, col - 1],[row + 1, col - 1],[row - 1, col - 2]);
		}
		if (r === 5) {
			placement.push([row, col],[row - 1, col],[row, col - 1],[row, col - 2],[row + 1, col - 1]);
		}
		if (r === 6) {
			placement.push([row, col],[row, col - 1],[row - 1, col - 1],[row - 2, col - 1],[row - 1, col - 2]);
		}
		if (r === 7) {
			placement.push([row, col],[row - 1, col - 1],[row, col - 1],[row, col - 2],[row + 1, col - 2]);

		}
		break;
	case 19:
		if (r === 0) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row - 1, col - 1],[row + 1, col - 1]);
		}
		break;
	case 20:
		if (r === 0) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row, col - 3],[row - 1, col -2]);
		}
		if (r === 1) {
			placement.push([row, col],[row - 1, col - 1],[row, col - 1],[row + 1, col - 1],[row + 2, col - 1]);
		}
		if (r === 2) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row, col - 3],[row + 1, col - 1]);
		}
		if (r === 3) {
			placement.push([row, col],[row - 1, col],[row - 2, col],[row - 3, col],[row - 1, col - 1]);
		}
		if (r === 4) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row, col - 3],[row - 1, col - 1]);
		}
		if (r === 5) {
			placement.push([row, col],[row + 1, col - 1],[row, col - 1],[row - 1, col - 1],[row - 2, col - 1]);
		}
		if (r === 6) {
			placement.push([row, col],[row, col - 1],[row, col - 2],[row, col - 3],[row + 1, col - 2]);
		}
		if (r === 7) {
			placement.push([row, col],[row - 1, col],[row - 2, col],[row - 3, col],[row - 2, col - 1]);
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
	  isOccupied:isOccupied,
	  placementInBound: placementInBound,
	  getPossibleMovesWithSqaureN: getPossibleMovesWithSqaureN
  };
});;angular.module('myApp')
  .controller('Ctrl', 
      ['$scope', '$rootScope', '$log', '$timeout',
       'gameService', 'stateService', 'gameLogic', 'resizeGameAreaService',
		function ($scope,$rootScope, $log, $timeout,
			gameService, stateService, gameLogic, resizeGameAreaService) {

    'use strict';
		
	/*set background color of boardArea square when dragging */
	function setSquareBackgroundColor(row, col, color) {
		document.getElementById('e2e_test_board_div_' + row + 'x' + col).style.background = color;
		
	}
	/*set background color of boardArea when dragging*/
    function setBoardBackgroundColor() {
		var num = getRowColNum('board');
        for (var row = 0; row < num.rowsNum; row++) {
			for (var col = 0; col < num.colsNum; col++) {
				setSquareBackgroundColor(row, col, getBoardSquareColor(row, col));
			}
		}
    }
	/*set the style for boardArea square*/
	$scope.setBoardAreaSquareStyle = function(row, col) {
		var color = getBoardSquareColor(row, col);
		return {background:color};
		
	}
	/*return the square color on the boardArea. Red, green, blue, yellow for player0, 1, 2, 3. Grey for empty board square*/
	function getBoardSquareColor(row, col) {
		if ($scope.state.board[row][col] === '0') {
			return '#33CCFF';
		} else if ($scope.state.board[row][col] === '1') {
			return  '#FF9900';
		} else if ($scope.state.board[row][col] === '2') {
			return '#FF3399';
		} else if ($scope.state.board[row][col] === '3') {
			return '#99FF33';
		} else {
			return '#F0F0F0';
		}
	}

	function getTurnColor() {
		var color = ['#33CCFF', '#FF9900','#FF3399', '#99FF33'];
		return color[$scope.turnIndex];
	}
    function setPlacementBackgroundColor(placement) {
        for (var i = 0; i < placement.length; i++) {
			var row = placement[i][0];
			var col = placement[i][1];
			setSquareBackgroundColor(row, col, getTurnColor());
        }
    }
	function clearDrag(dragType) {
		if (dragType === 'board') {
			// reset boardArea background color;
			for (var i = 0; i < $scope.preview.length; i++) {
				var row = $scope.preview[i][0];
				var col = $scope.preview[i][1];
				setSquareBackgroundColor(row, col, getBoardSquareColor(row, col));
			}
			//setBoardBackgroundColor();
		}
		var draggingLines = document.getElementById(dragType+"DraggingLines");
		draggingLines.style.display = "none";
    }
	
	window.handleDragEvent = handleDragEvent;
	
	function getAreaSize(type) {
		var area = document.getElementById(type + "Area");
		return {width:area.clientWidth, height:area.clientHeight};
	}
	
	/*return true if the board square row X col is newly added, used for animation*/
	$scope.newlyPlaced = function(row, col) {
		/*for the initial state, there is no newly added square*/
		if ($scope.state.delta === undefined) {
			return false;
		}
		var lastPlacement = $scope.state.delta.placement;
		for (var i = 0; i < lastPlacement.length; i++) {
			if (lastPlacement[i][0] === row && lastPlacement[i][1] === col) {
				return true;
			}
		}
		return false;
	}
	
	function handleDragEvent(type, clientX, clientY) {
		var gameArea = document.getElementById("gameArea");
		var boardArea = document.getElementById("boardArea");
		var shapeArea = document.getElementById("shapeArea");
		var rotateArea = document.getElementById("rotateArea");
		if (gameLogic.endOfMatch($scope.state.playerStatus)) {
			return;
		}
		if (!$scope.isYourTurn) {
			return;
		}
		//clearDrag("rotate");
		//clearDrag("shape");
		// compute horizontal and vertical offset relative to boardArea, shapeArea, and rotateArea
		// boardArea.offsetLeft = 0; boardArea.offsetTop = 0;
		var boardX = clientX - gameArea.offsetLeft - boardArea.offsetLeft;
		var shapeX = clientX - gameArea.offsetLeft - shapeArea.offsetLeft;
		var rotateX = clientX - gameArea.offsetLeft - rotateArea.offsetLeft;
        var boardY = clientY - gameArea.offsetTop - boardArea.offsetTop;
        var shapeY = clientY - gameArea.offsetTop - shapeArea.offsetTop;
        var rotateY = clientY - gameArea.offsetTop - rotateArea.offsetTop;
		var dragType = '';
		// initialize dragType
		var boardSize = getAreaSize('board');
		var shapeSize = getAreaSize('shape');
		var rotateSize = getAreaSize('rotate');
		var x, y;
		// ignore drag and drop if it's the computers turn
        if (boardX > 0 && boardX < boardSize.width && boardY > 0 && boardY < boardSize.height) {
			x = boardX;
			y = boardY;
			dragType = 'board';
        } else if ($scope.shape>=0&&$scope.rotate===-1&&rotateX > 0 && rotateX < rotateSize.width && rotateY > 0 && rotateY < rotateSize.height){
			x = rotateX;
			y = rotateY
			dragType = 'rotate';
		} else if (($scope.shape===-1&&$scope.rotate===-1 || $scope.shape>=0&&$scope.rotate>=0)
					&& shapeX < shapeSize.width && shapeY > 0 && shapeY < shapeSize.height){
			x = shapeX;
			y = shapeY;
			dragType = 'shape';
		} 
		// ignore if none of the valid drag
		if (dragType === '') {
			clearDrag('board');
			clearDrag('shape');
			clearDrag('rotate');
			return;
		}
		// Inside gameArea. Let's find the containing square's row and col
		var num = getRowColNum(dragType);
		var areaSize = getAreaSize(dragType);
		var col = Math.floor(num.colsNum * x / areaSize.width);
		var row = Math.floor(num.rowsNum * y / areaSize.height);
	
		if (dragType === 'board') {
			// ignore the drag if the player didn't choose a shape; 
			if ($scope.shape === -1) {
				return;
			}
			if ($scope.rotate === -1) {
				return;
			}
			// Is the entire placement inside the board?
			var placement = gameLogic.getPlacement(row, col, $scope.shape, $scope.rotate); /*find a way to get placement*/
			if (!gameLogic.placementInBound($scope.state.board, placement) || gameLogic.isOccupied($scope.state.board, placement)){
				return;
			}
			if(!angular.equals($scope.preview, placement)) {
				clearDrag('board');
				setPlacementBackgroundColor(placement);
				$scope.preview = placement;
			}
			
		}

		// displaying the dragging lines 
		var draggingLines = document.getElementById(dragType + "DraggingLines");
		var horizontalDraggingLine = document.getElementById(dragType + "HorizontalDraggingLine");
		var verticalDraggingLine = document.getElementById(dragType + "VerticalDraggingLine");
		draggingLines.style.display = "inline";
		var centerXY = getSquareCenterXY(row, col, dragType);
		verticalDraggingLine.setAttribute("x1", centerXY.x);
		verticalDraggingLine.setAttribute("x2", centerXY.x);
		horizontalDraggingLine.setAttribute("y1", centerXY.y);
		horizontalDraggingLine.setAttribute("y2", centerXY.y);
		//var topLeft = getSquareTopLeft(row, col, dragType);
		
		if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
			// drag ended
			dragDone(row, col, dragType);
			clearDrag(dragType);
        }
	}
	function getRowColNum(type) {
		if (type === 'board') {
			return {rowsNum: 20, colsNum: 20};
		} 
		if (type === 'shape') {
			return {rowsNum: 12, colsNum: 20};
		} 
		if (type === 'rotate') {
			return {rowsNum: 12, colsNum: 20};
		} 
	}
	function getSquareWidthHeight(type) {
		var size = getAreaSize(type);
		var num = getRowColNum(type);
		return {
			width: size.width / num.colsNum,
			height: size.height / num.rowsNum
        };
    }
	/*
	function getSquareTopLeft(row, col, type) {
		var size = getSquareWidthHeight(type);
        return {top: row * size.height, left: col * size.width}
    }
	*/
	function getSquareCenterXY(row, col, type) {
        var size = getSquareWidthHeight(type);
        return {
			x: col * size.width + size.width / 2,
			y: row * size.height + size.height / 2
        };
    }

    resizeGameAreaService.setWidthToHeight(0.6);
	function dragDone(row, col, dragType) {
        $rootScope.$apply(function () {
			if (dragType === 'board') {
				$scope.boardAreaCellClicked(row, col);
			}
			if (dragType === 'shape') {
				$scope.shapeAreaCellClicked(row, col);
			}
			if (dragType === 'rotate') {
				$scope.rotateAreaCellClicked(row, col);
			}
        });
    }
	
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
		//$scope.state.board = params.stateAfterMove.board;
		//$scope.state.delta = params.stateAfterMove.delta;
		//$scope.state.freeShapes = params.stateAfterMove.freeShapes;
		//$scope.state.playerStatus = params.stateAfterMove.playerStatus;
		$scope.shape = -1; //initialize the shape being selected by current player
		$scope.rotate = -1; //initialize the rotate direction, DEV USE//03/31
		$scope.preview = []; // initialize the placement to be previewed on the board

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
	$scope.getRotateAreaSquareColor = function(row, col) {
		if ($scope.getRotate(row, col) === -1) { // if this square is not a part of a rotated shape
			return {background: '#F0F0F0'};
		}
		var color = getTurnColor();
		return {
			border: '1pt solid white',
			background: color};
	}
	/*updated on 04/01/2015*/
	/*return the rotation index for the selected shape*/
	$scope.getRotate = function(row, col) {
		var rotate = -1; // the square does not belong to any rotated shape
		if ($scope.shape === 0) {
			if (row === 1 && col === 1) {
				rotate = 0;
			}
		}
		if ($scope.shape === 1) {
			if (row===0 && col === 1 || row === 1 && col === 1) {
				rotate = 0;
			}
			if (row===1 && col === 5 || row === 1 && col === 6) {
				rotate = 1;
			}
		}
		if ($scope.shape === 2) {
			if (row >= 0 && row <= 2 && col === 1) {
				rotate = 0;
			}
			if (col >= 5 && col <= 7 && row === 1) {
				rotate = 1;
			}
		}
		if ($scope.shape === 3) {
			if (row >= 0 && row <= 3 && col === 1) {
				rotate = 0;
			}
			if (col >= 5 && col <= 8 && row === 2) {
				rotate = 1;
			}
		}
		if ($scope.shape === 4) {
			if (row >= 0 && row <= 4 && col === 1) {
				rotate = 0;
			}
			if (col >= 5 && col <= 9 && row === 2) {
				rotate = 1;
			}
		}
		if ($scope.shape === 5) {
			if (row===1 && col === 1 || row === 2 && col === 1 || row === 2 && col === 2) {
				rotate = 0;
			}
			if (row===1 && col === 6 || row === 1 && col === 7 || row === 2 && col === 6) {
				rotate = 1;
			}
			if (row===1&&col===11 || row===1&&col===12 || row===2&&col===12) {
				rotate = 2;
			}
			if (row===2&&col===17 || row===2&&col===18 || row===1&&col===18) {
				rotate = 3;
			}
		}
		if ($scope.shape === 6) {
			if(row >= 0 && row <= 2 && col === 1 || row === 2 && col === 2){
				rotate = 0;
			}
			if(col >= 6 && col <= 8 && row === 1 || row === 2 && col === 6) {
				rotate = 1;
			}
			if(row >= 0 && row <= 2 && col === 12 || row === 0 && col === 11){
				rotate = 2;
			}
			if(col >= 16 && col <= 18 && row === 2 || row === 1 && col === 18){
				rotate = 3;
			}
			if (row >= 4 && row <= 6 && col === 2 || row === 6 && col === 1) {
				rotate = 4;
			}
			if (col >= 6 && col <= 8 && row === 6 || row === 5 && col === 6) {
				rotate = 5;
			}
			if (row >= 4 && row <= 6 && col === 11 || row === 4 && col === 12) {
				rotate = 6;
			}
			if(col >= 16 && col <= 18 && row === 5 || row === 6 && col === 18){
				rotate = 7;
			}
		}
		if ($scope.shape === 7) {
			if(row===1&&col===2 || row===1&&col===3 || row===2&&col===1 || row===2&&col===2){
				rotate = 0;
			}
			if(row===0&&col===6 || row===1&&col===6 || row===1&&col===7 || row===2&&col===7){
				rotate = 1;
			}
			if(row===1&&col===11 || row===1&&col===12 || row===2&&col===12 || row===2&&col===13){
				rotate = 4;
			}
			if(row===1&&col===17 || row===2&&col===17 || row===0&&col===18 || row===1&&col===18){
				rotate = 5;
			}
		}
		if ($scope.shape === 8) {
			if(row===0&&col===1 || row===0&&col===2 || row===1&&col===1 || row===1&&col===2) {
				rotate = 0;
			}
		}
		if ($scope.shape === 9) {
			if(col>=0&&col<=3&&row===3 || row===2&&col===0){
				rotate = 0;
			}
			if(row>=0&&row<=3&&col===6 || row===0&&col===7){
				rotate = 1;
			}
			if(col>=10&&col<=13&&row===2 || row===3&&col===13){
				rotate = 2;
			}
			if (row>=0&&row<=3&&col===17 || row===3&&col===16) {
				rotate = 3;
			}
			if (col>=0&&col<=3&&row===8 || row===7&&col===3) {
				rotate = 4;
			}
			if (row>=5&&row<=8&&col===6 || row===8&&col===7) {
				rotate = 5;
			}
			if (col>=10&&col<=13&&row===7 || row===8&&col===10) {
				rotate = 6;
			}
			if (row>=5&&row<=8&&col===17 || row===5&&col===16) {
				rotate = 7;
			}
		}
		if ($scope.shape === 10) {
			if(row===2&&col===1 || row===2&&col===2 || row===2&&col===3 || row===0&&col===2 || row===1&&col===2) {
				rotate = 0;
			}
			if(row===0&&col===6 || row===1&&col===6 || row===2&&col===6 || row===1&&col===7 || row===1&&col===8) {
				rotate = 1;
			}
			if (row===0&&col===11 || row===0&&col===12 || row===0&&col===13 || row===1&&col===12 || row===2&&col===12) {
				rotate = 2;
			}
			if(row===1&&col===16 || row===1&&col===17 || row===1&&col===18 || row===0&&col===18 || row===2&&col===18) {
				rotate = 3;
			}
		}
		if($scope.shape === 11){
			if(row===0&&col===1 || row===1&&col===1 || row===2&&col===1 || row===2&&col===2 || row===2&&col===3) {
				rotate = 0;
			}
			if(row===0&&col===6 || row===0&&col===7 || row===0&&col===8 || row===1&&col===6 || row===2&&col===6) {
				rotate = 1;
			}
			if(row===0&&col===11 || row===0&&col===12 || row===0&&col===13 || row===1&&col===13 || row===2&&col===13) {
				rotate = 2;
			}
			if(row===2&&col===16 || row===2&&col===17 || row===2&&col===18 || row===0&&col===18 || row===1&&col===18) {
				rotate = 3;
			}
		}
		if($scope.shape === 12) {
			if(row===2&&col>=0&&col<=1 || row===1&&col>=1&&col<=3) {
				rotate = 0;
			}
			if(row>=0&&row<=1&&col===6 || row>=1&&row<=3&&col===7) {
				rotate = 1;
			}
			if(row===2&&col>=11&&col<=13 || row===1&&col>=13&&col<=14) {
				rotate = 2;
			}
			if(row>=0&&row<=2&&col===17 || row>=2&&row<=3&&col===18) {
				rotate = 3;
			}
			if(row===6&&col>=0&&col<=2 || row===7&&col>=2&&col<=3) {
				rotate = 4;
			}
			if(row>=7&&row<=8&&col===6 || row>=5&&row<=7&&col===7) {
				rotate = 5;
			}
			if(row===6&&col>=11&&col<=12 || row===7&&col>=12&&col<=14) {
				rotate = 6;
			}
			if(row>=6&&row<=8&&col===17 || row>=5&&row<=6&&col===18) {
				rotate = 7;
			}
		}
		if($scope.shape === 13) {
			if(row===1&&col>=1&&col<=3 || row===0&&col===3 || row===2&&col===1) {
				rotate = 0;
			} 
			if(row>=0&&row<=2&&col===7 || row===0&&col===6 || row===2&&col===8) {
				rotate = 1;
			}
			if(row===1&&col>=11&&col<=13 || row===0&&col===11|| row===2&&col===13) {
				rotate = 4;
			}
			if(row>=0&&row<=2&&col===17 || row===2&&col===16 || row===0&&col===18) {
				rotate = 5;
			}
		}
		if ($scope.shape === 14) {
			if(row===1&&col>=0&&col<=2 || row===0&&col===1) {
				rotate = 0;
			}
			if(row>=0&&row<=2&&col===6 || row===1&&col===7) {
				rotate = 1;
			}
			if(row===0&&col>=11&&col<=13 || row===1&&col===12) {
				rotate = 2;
			} 
			if(row>=0&&row<=2&&col===18 || row===1&&col===17) {
				rotate = 3;
			}
		}
		if ($scope.shape === 15) {
			if(row>=0&&row<=1&&col>=1&&col<=2 || row===2&&col===1) {
				rotate = 0;
			}
			if(row>=1&&row<=2&&col>=7&&col<=8 || row===1&&col===6) {
				rotate = 1;
			}
			if(row>=1&&row<=2&&col>=12&&col<=13 || row===0&&col===13) {
				rotate = 2;
			}
			if(row>=1&&row<=2&&col>=17&&col<=18 || row===2&&col===19) {
				rotate = 3;
			}
			if(row>=4&&row<=5&&col>=1&&col<=2 || row===6&&col===2) {
				rotate = 4;
			}
			if(row>=5&&row<=6&&col>=7&&col<=8 || row===6&&col===6) {
				rotate = 5;
			}
			if(row>=5&&row<=6&&col>=12&&col<=13 || row===4&&col===12) {
				rotate = 6;
			}
			if(row>=5&&row<=6&&col>=17&&col<=18 || row===5&&col===19) {
				rotate = 7;
			}
		}
		if($scope.shape === 16) {
			if(row===0&&col===2 || row===0&&col===3 || row===1&&col===1 || row===1&&col===2 || row===2&&col===1) {
				rotate = 0;
			}
			if(row===0&&col===6 || row===0&&col===7 || row===1&&col===7 || row===1&&col===8 || row===2&&col===8) {
				rotate = 1;
			}
			if(row===2&&col===12 || row===2&&col===13 || row===1&&col===13 || row===1&&col===14 || row===0&&col===14){
				rotate = 2;
			}
			if(row===0&&col==17 || row===1&&col===17 || row===1&&col==18 || row===2&&col===18 || row===2&&col===19){
				rotate = 3;
			}
		}
		if($scope.shape === 17) {
			if(row>=0&&row<=2&&col===1 || row===0&&col===2 || row===2&&col===2) {
				rotate = 0;
			}
			if(row===1&&col>=6&&col<=8 || row===2&&col===6 || row===2&&col===8) {
				rotate = 1;
			}
			if(row>=0&&row<=2&&col===13 || row===0&&col===12 || row===2&&col===12) {
				rotate = 2;
			}
			if(row===2&&col>=17&&col<=19 || row===1&&col===17 || row===1&&col===19) {
				rotate = 3;
			}
		}
		if ($scope.shape === 18) {
			if(row>=0&&row<=2&&col===2 || row===1&&col===1 || row===0&&col===3) {
				rotate = 0;
			}
			if(row===1&&col>=6&&col<=8 || row===0&&col===7 || row===2&&col===8) {
				rotate = 1;
			}
			if(row>=0&&row<=2&&col===13 || row===2&&col===12 || row===1&&col===14) {
				rotate = 2;
			}
			if (row===1&&col>=17&&col<=19 || row===0&&col===17 || row===2&&col===18) {
				rotate = 3;
			}
			if(row>=4&&row<=6&&col===2 || row===4&&col===1 || row===5&&col===3) {
				rotate = 4;
			}
			if(row===5&&col>=6&&col<=8 || row===6&&col===7 || row===4&&col===8) {
				rotate = 5;
			}
			if(row>=4&&row<=6&&col===13 || row===5&&col===12 || row===6&&col===14) {
				rotate = 6;
			}
			if(row===5&&col>=17&&col<=19 || row===6&&col==17 || row===4&&col===18) {
				rotate = 7;
			}
		}
		if ($scope.shape === 19) {
			if (row===0&&col===2 || row===1&&col===2 || row===2&&col===2 || row===1&&col===1 || row===1&&col===3) {
				rotate = 0;
			}
		}
		if ($scope.shape === 20) {
			if(row===2&&col>=0&&col<=3 || row===1&&col===1) {
				rotate = 0;
			}
			if(row>=0&&row<=3&&col===6 || row===1&&col===7) {
				rotate = 1;
			}
			if(row===1&&col>=11&&col<=14 || row===2&&col===13) {
				rotate = 2;
			}
			if(row>=0&&row<=3&&col===18 || row===2&&col===17) {
				rotate = 3;
			}
			if(row===7&&col>=0&&col<=3 || row===6&&col===2) {
				rotate = 4;
			}
			if(row>=5&&row<=8&&col===6 || row===7&&col===7) {
				rotate = 5;
			}
			if(row===6&&col>=11&&col<=14 || row===7&&col===12) {
				rotate = 6;
			}
			if(row>=5&&row<=8&&col===18 || row===6&&col===17) {
				rotate = 7;
			}
		}
		return rotate;
	}
	
	$scope.rotateAreaCellClicked = function(row, col) {
		var rotate = $scope.getRotate(row,col);
		if (rotate >= 0) {
			$scope.rotate = rotate; // if the player clicks on a legal rotation, store the rotation in $scope.rotate
		}
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
		if ($scope.rotate === -1) { // if the player haven't select a rotation, the game should do nothing
			return;
		}
		try {
			var placement = gameLogic.getPlacement(row, col, $scope.shape, $scope.rotate);
			var move = gameLogic.createMove($scope.state, placement, $scope.shape, $scope.turnIndex);
			$scope.isYourTurn = false; // to prevent making another move
			gameService.makeMove(move);
			$scope.shape = -1; // to reset the shape being selected
			$scope.rotate = -1; // reset the rotate
		} catch (e) {
			$log.info(["This is an illegal move:", row, col]);
			return;
		}
    };

    $scope.shapeAreaCellClicked = function (row, col) {
		// row = row - 1;
		var shapeNum = $scope.getShape(row, col);
		// ignore if the shape has been used
		if (!$scope.state.freeShapes[$scope.turnIndex][shapeNum]) {
			return;
		}
	  $log.info(["Clicked on shape:", shapeNum]);
      $scope.shape = shapeNum;
	  $scope.rotate = -1;
    };
	/*need to edit 03/26*/
	$scope.getShapeCellColorStyle= function(row, col) {
		var shapeNum = $scope.getShape(row, col);
		if (shapeNum >= 0 && $scope.state.freeShapes[$scope.turnIndex] != undefined && $scope.state.freeShapes[$scope.turnIndex][shapeNum]) {
			var color = getTurnColor();
			return {
				border: '1pt solid white',
				background: color};
		} else {
			return {background: '#F0F0F0'};
		}
    }
	/*updated on 04/01/2015*/
	$scope.getShape = function(row, col) {
      if (row === 0 && col === 4) {
        return 0;
      } 
      if (col === 0 && (row === 3 || row === 4)) {
        return 1;
      }
      if (col === 2 && (row === 2 || row === 3 || row === 4)) {
        return 2;
      }
      if (col === 7 && (row === 1 || row === 2 || row === 3 || row === 4)) {
        return 3;
      }
      if (col === 9 && (row >=0 && row <= 4)) {
        return 4;
      }
      if (row === 3 && col === 11 || row === 4 && col === 11 || row === 4 && col === 12) {
        return 5;
      }
      if (row === 0 && (col >= 0 && col <= 2) ||row === 1 && col === 0) {
        return 6;
      }
      if ((row === 1 && (col === 11 || col === 12)) || row === 0 && (col === 12 || col === 13)) {
        return 7;
      }
      if ((row === 0 && (col === 15 || col === 16)) || (row === 1 && (col === 15 || col === 16))) {
        return 8;
      }
      if ((row === 0 && col === 18) || (col === 19 && row >= 0 && row <= 3)) {
        return 9;
      }
      if (row === 7 && (col === 0 || col === 1) || col === 2 && (row >= 6 && row <= 8)) {
        return 10;
      }
      if ((col === 0 && (row === 9 || row === 10 || row === 11)) || (row === 11 && (col === 1 || col === 2))) {
        return 11;
      }
      if ((row === 10 && (col === 16 || col === 17) || (row === 11 && (col === 17 || col === 18 || col === 19)))) {
        return 12;
      }
      if ((row === 9 && col === 12) || (row === 10 && (col === 10 || col === 11 || col === 12)) || (row === 11 && col === 10)) {
        return 13;
      }
      if ((row === 3 && col === 5) || (col === 4 && (row >= 2 && row <= 4))) {
        return 14;
      }
      if ((row === 7 && (col === 18 || col === 19)) || row === 6 && (col >= 17 && col <= 19)) {
        return 15;
      }
	  if (row === 11 && (col === 4 || col === 5) || row === 10 && (col === 5 || col === 6) || row === 9 && col === 6) {
		  return 16;
	  }
      if (row === 3 && (col === 14 || col === 16) || row === 4 && col >= 14 && col <= 16) {
        return 17;
      }
      if (row === 6 && col === 9 || col === 10 && row >= 6 && row <= 8 || row === 7 && col === 11) {
        return 18;
      }
      if ((row === 6 && col === 14) || (row === 7 && (col === 13|| col === 14 || col === 15)) || (row === 8 && col === 14)) {
        return 19;
      }
      if (row === 7 && col === 5 || row === 6 && col >= 4 && col <= 7) {
        return 20;
      }
      return -1;
    };
	
  }]);