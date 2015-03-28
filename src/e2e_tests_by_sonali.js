/* https://github.com/angular/protractor/blob/master/docs/toc.md */
describe('Blokus', function() {

	'use strict';

	beforeEach(function() {
		browser.get('http://localhost:9000/game.min.html');
	});
	
	function setMatchState(matchState, playMode) {
		browser.executeScript(function(matchStateInJson, playMode) {
			var stateService = window.e2e_test_stateService;
			stateService.setMatchState(angular.fromJson(matchStateInJson));
			stateService.setPlayMode(angular.fromJson(playMode));
			angular.element(document).scope().$apply(); // to tell angular that things changes.
		}, JSON.stringify(matchState), JSON.stringify(playMode));
	}
	/*return the div element in board area, rotate area, or shape area*/
	function getDiv(row, col, area) {
		return element(by.id('e2e_test_' + area + '_div_'+ row + 'x' + col));
	}
	/*return div cover by div kind*/
	function getDivColor(divKind) {
		if (divKind === '0') {
			return 'red';
		}
		if (divKind === '1') {
			return 'green';
		}
		if (divKind === '2') {
			return 'blue';
		}
		if (divKind === '3') {
			return 'yellow';
		}
		return 'white';
	}
	
	/*expected the board div to be red, green, blue, yellow, or white*/
	function expectDiv(row, col, area, divKind) {
		var bgColor = getDivColor(divKind)
		var element = getDiv(row, col, area);
		expect(element.getAttribute('style')).toMatch('background-color: ' + bgColor);
	}
	/*expected the board area to be*/
	function expectBoard(board) {
		for (var row = 0; row < 20; row++) {
			for (var col = 0; col < 20; col++) {
				expectDiv(row, col,'board', board[row][col]);
			}
		}
	}
	function getInitialBoard() {
		var board = new Array(20);
		for (var i = 0; i < 20; i++) {
			board[i] = new Array(20);
			for (var j = 0; j < 20; j++) {
				board[i][j] = '';
			}
		}
		return board;
	}
	


	it('should place a red shape7 on board if I first click on shape area 15x7 to choose shape15, and then click 0x0 on board area', function () {
		getDiv(15, 7, 'shape').click(); // click on shape area 0x2 to choose shape15
		getDiv(0, 0, 'board').click(); // click on board area 0x0 to place shape 15
		var board = getInitialBoard();
		board[0][0] = '0';
		board[0][1] ='0';
		board[1][0]='0';
		board[1][1]='0';
		board[2][0]='0';
		expectBoard(board);
	});
	it('should place a red shape15 on 15x7 and green shape0 on 0x19', function () {
		getDiv(15, 7, 'shape').click(); // click on shape area 0x2 to choose shape0
		getDiv(0, 0, 'board').click(); // click on board area 0x0 to place shape 0
		getDiv(0, 2, 'shape').click(); // click on shape area 0x2 to choose shape0
		getDiv(0, 19, 'board').click(); // click on board area 0x0 to place shape 0
		var board = getInitialBoard();
		board[0][0] = '0';
		board[0][1] ='0';
		board[1][0]='0';
		board[1][1]='0';
		board[2][0]='0';
		board[0][19] = '1';
		expectBoard(board);
	});
	it('should ignore if I place a red shape15 on row 1x1', function () {
		getDiv(15, 7, 'shape').click(); // click on shape area 0x2 to choose shape0
		getDiv(1, 1, 'board').click(); // click on board area 0x0 to place shape 0
		var board = getInitialBoard();
		expectBoard(board);
	});
	it('ignore clicking on non-empty cell on the board area using shape15', function () {
		getDiv(15, 7, 'shape').click(); // player0 click on shape area 0x2 to choose shape0
		getDiv(0, 0, 'board').click(); // player0 click on board area 0x0 to place shape0
		var board = getInitialBoard();
		board[0][0] = '0';
		expectBoard(board);
		getDiv(15, 7, 'shape').click(); // player1 click on shape area 0x2 to choose shape0;
		getDiv(0, 0, 'board').click(); // player1 click the non-empty div on board area, this should be ignored
		expectBoard(board);
	});	
	var board1 = [['0','0','','0','1','','','0','0','0','1','1','1','','3','3','','','1','1'],
			      ['0','','0','0','1','1','1','0','','1','0','0','0','0','','','3','','','1'],
			      ['1','','1','0','1','0','0','1','1','1','3','3','3','','2','3','3','3','1',''],
			      ['','1','1','1','0','0','0','1','0','0','3','2','3','2','2','2','3','1','1','1'],
			      ['1','','1','3','3','1','1','0','0','2','2','2','2','3','3','2','1','2','2','2'],
			      ['1','','3','3','1','1','2','2','2','0','0','0','0','0','3','3','1','1','3',''],
			      ['','2','','3','1','2','1','1','2','2','3','3','3','3','0','3','1','1','3',''],
			      ['0','2','1','1','3','2','1','3','3','3','2','2','2','3','0','1','3','3','1','1'],
			      ['0','2','1','3','3','2','1','3','2','2','0','0','2','0','0','1','1','3','','1'],
			      ['0','2','1','1','3','2','1','3','2','2','0','0','2','0','1','0','1','3','3','1'],
			      ['2','0','0','2','3','2','3','1','3','3','1','1','0','2','1','0','2','2','1','3'],
			      ['2','','0','2','2','3','3','1','3','3','1','1','0','2','1','0','0','2','1','3'],
			      ['2','2','0','0','2','3','0','1','1','1','0','0','0','2','1','0','2','2','1','3'],
			      ['','0','2','2','0','3','0','0','0','0','1','1','2','2','1','2','0','','1',''],
			      ['','0','2','2','0','0','3','3','3','3','3','1','1','1','2','2','0','0','','2'],
			      ['0','0','0','2','1','0','0','1','1','1','1','3','3','2','2','0','0','2','','2'],
			      ['2','2','2','0','1','1','1','0','1','0','3','3','2','3','3','3','2','2','2',''],
			      ['','2','0','0','0','1','','0','0','0','2','2','2','3','3','2','3','2','',''],
			      ['2','','','0','','','3','3','3','3','2','','3','2','2','2','3','3','','3'],
			      ['2','2','0','','0','0','','2','2','2','3','3','3','','','2','3','','3','3']];
	var playerStatus1 = [false, false, true, true];
	
	var freeShapes1 = new Array(4);
	for(var i = 0; i < 4; i++) {
		freeShapes1[i] = new Array(21);
		for (var j = 0; j < 21; j++) {
			freeShapes1[i][j] = false;
		}
	}
	freeShapes1[2][0] = true; // player2 has shape0 free
	freeShapes1[3][0] = true; // player3 has shape0 free
	var delta1 = {shape : 0, placement : [[2,0]]};
	
	var board2 = [['0','0','','0','1','','','0','0','0','1','1','1','','3','3','','','1','1'],
			      ['0','','0','0','1','1','1','0','','1','0','0','0','0','','','3','','','1'],
			      ['1','','1','0','1','0','0','1','1','1','3','3','3','','2','3','3','3','1',''],
			      ['','1','1','1','0','0','0','1','0','0','3','2','3','2','2','2','3','1','1','1'],
			      ['1','','1','3','3','1','1','0','0','2','2','2','2','3','3','2','1','2','2','2'],
			      ['1','','3','3','1','1','2','2','2','0','0','0','0','0','3','3','1','1','3',''],
			      ['','2','','3','1','2','1','1','2','2','3','3','3','3','0','3','1','1','3',''],
			      ['0','2','1','1','3','2','1','3','3','3','2','2','2','3','0','1','3','3','1','1'],
			      ['0','2','1','3','3','2','1','3','2','2','0','0','2','0','0','1','1','3','','1'],
			      ['0','2','1','1','3','2','1','3','2','2','0','0','2','0','1','0','1','3','3','1'],
			      ['2','0','0','2','3','2','3','1','3','3','1','1','0','2','1','0','2','2','1','3'],
			      ['2','','0','2','2','3','3','1','3','3','1','1','0','2','1','0','0','2','1','3'],
			      ['2','2','0','0','2','3','0','1','1','1','0','0','0','2','1','0','2','2','1','3'],
			      ['','0','2','2','0','3','0','0','0','0','1','1','2','2','1','2','0','','1',''],
			      ['','0','2','2','0','0','3','3','3','3','3','1','1','1','2','2','0','0','','2'],
			      ['0','0','0','2','1','0','0','1','1','1','1','3','3','2','2','0','0','2','','2'],
			      ['2','2','2','0','1','1','1','0','1','0','3','3','2','3','3','3','2','2','2',''],
			      ['','2','0','0','0','1','','0','0','0','2','2','2','3','3','2','3','2','','2'],
			      ['2','','','0','','','3','3','3','3','2','','3','2','2','2','3','3','','3'],
			      ['2','2','0','','0','0','','2','2','2','3','3','3','','','2','3','','3','3']];
	var playerStatus2 = [false, false, false, true];
	
	var freeShapes2 = new Array(4);
	for(var i = 0; i < 4; i++) {
		freeShapes2[i] = new Array(21);
		for (var j = 0; j < 21; j++) {
			freeShapes2[i][j] = false;
		}
	}
	freeShapes2[3][0] = true; // player3 has shape0 free.
	var delta2 = {shape : 0, placement : [[17,19]]};
	
	var board3 = [['0','0','','0','1','','','0','0','0','1','1','1','','3','3','','3','1','1'],
			      ['0','','0','0','1','1','1','0','','1','0','0','0','0','','','3','','','1'],
			      ['1','','1','0','1','0','0','1','1','1','3','3','3','','2','3','3','3','1',''],
			      ['','1','1','1','0','0','0','1','0','0','3','2','3','2','2','2','3','1','1','1'],
			      ['1','','1','3','3','1','1','0','0','2','2','2','2','3','3','2','1','2','2','2'],
			      ['1','','3','3','1','1','2','2','2','0','0','0','0','0','3','3','1','1','3',''],
			      ['','2','','3','1','2','1','1','2','2','3','3','3','3','0','3','1','1','3',''],
			      ['0','2','1','1','3','2','1','3','3','3','2','2','2','3','0','1','3','3','1','1'],
			      ['0','2','1','3','3','2','1','3','2','2','0','0','2','0','0','1','1','3','','1'],
			      ['0','2','1','1','3','2','1','3','2','2','0','0','2','0','1','0','1','3','3','1'],
			      ['2','0','0','2','3','2','3','1','3','3','1','1','0','2','1','0','2','2','1','3'],
			      ['2','','0','2','2','3','3','1','3','3','1','1','0','2','1','0','0','2','1','3'],
			      ['2','2','0','0','2','3','0','1','1','1','0','0','0','2','1','0','2','2','1','3'],
			      ['','0','2','2','0','3','0','0','0','0','1','1','2','2','1','2','0','','1',''],
			      ['','0','2','2','0','0','3','3','3','3','3','1','1','1','2','2','0','0','','2'],
			      ['0','0','0','2','1','0','0','1','1','1','1','3','3','2','2','0','0','2','','2'],
			      ['2','2','2','0','1','1','1','0','1','0','3','3','2','3','3','3','2','2','2',''],
			      ['','2','0','0','0','1','','0','0','0','2','2','2','3','3','2','3','2','','2'],
			      ['2','','','0','','','3','3','3','3','2','','3','2','2','2','3','3','','3'],
			      ['2','2','0','','0','0','','2','2','2','3','3','3','','','2','3','','3','3']];
	var playerStatus3 = [false, false, false, false];
	var freeShapes3 = new Array(4);
	for(var i = 0; i < 4; i++) {
		freeShapes3[i] = new Array(21);
		for (var j = 0; j < 21; j++) {
			freeShapes3[i][j] = false;
		}
	}
	var delta3 = {shape : 0, placement : [[0,17]]};
	
	var matchState2 = {
		turnIndexBeforeMove: 2, // last move is performed by player2
		turnIndex: 3, // it's now player3's turn
		endMatchScores: null,
		lastMove: [{setTurn: {turnIndex: 3}},
			{set: {key: 'board', value: board2}},
			{set: {key: 'playerStatus', value: playerStatus2}},
			{set: {key: 'freeShapes', value: freeShapes2}},
			{set: {key: 'delta', value: delta2}}],
		lastState: {board: board1, playerStatus: playerStatus1, freeShapes: freeShapes1, delta: delta1},
		currentState: {board: board2, playerStatus: playerStatus2, freeShapes: freeShapes2, delta: delta2},
		lastVisibleTo: {},
		currentVisibleTo: {},
	};
	var matchState3 = {
		turnIndexBeforeMove: 3, // last move is performed by player3
		turnIndex: -2, // it's viewer mode cause the game already ended
		endMatchScores: [90, 90, 90, 90],
		lastMove: [{endMatch : {endMatchScores : [90, 90, 90, 90]}},
			{set: {key: 'board', value: board3}},
			{set: {key: 'playerStatus', value: playerStatus3}},
			{set: {key: 'freeShapes', value: freeShapes3}},
			{set: {key: 'delta', value: delta3}}],
		lastState: {board: board2, playerStatus: playerStatus2, freeShapes: freeShapes2, delta: delta2},
		currentState: {board: board3, playerStatus: playerStatus3, freeShapes: freeShapes3, delta: delta3},
		lastVisibleTo: {},
		currentVisibleTo: {},
	};
	it('can start from a match that is about to end, and win', function () {
		setMatchState(matchState2, 'passAndPlay');
		expectBoard(board2);
		getDiv(0, 2, 'shape').click(); // click on shape area 0x2 to choose shape0
		getDiv(0, 17, 'board').click(); // click on board area 0x17 to place shape0;
		expectBoard(board3);
	});
	
	it('cannot start from a match that already ended', function () {
		setMatchState(matchState3, 'passAndPlay');
		expectBoard(board3);
		getDiv(0, 2, 'shape').click(); // click on shape area 0x2 to choose shape0; should be ignored
		getDiv(0, 17, 'board').click(); // click on board area 0x17 to place shape0; should be ignored
		expectBoard(board3);
	});

	it('0x0 should be red and the others should be white', function () {
		getDiv(0, 2, 'shape').click(); 
		getDiv(0, 0, 'board').click(); 
		
		expectDiv (0, 0, 'board', 'red');
		expectDiv (1, 1, 'board', '');
		expectDiv (1, 2, 'board', '');
		expectDiv (0, 3, 'board', '');
		expectDiv (0, 4, 'board', '');
	});
	
	it('board should be red acc to shape15 and the rest should be white', function () {
		getDiv(15, 7, 'shape').click(); 
		getDiv(0, 0, 'board').click(); 
		
		board[0][0] = '0';
		board[0][1] ='0';
		board[1][0]='0';
		board[1][1]='0';
		board[2][0]='0';
		
		expectDiv (0, 0, 'board', 'red');
		expectDiv (0, 1, 'board', 'red');
		expectDiv (1, 0, 'board', 'red');
		expectDiv (1, 1, 'board', 'red');
		expectDiv (2, 0, 'board', 'red');
		
		expectDiv (2, 1, 'board', '');
		expectDiv (3, 2, 'board', '');
		expectDiv (0, 3, 'board', '');
		expectDiv (0, 4, 'board', '');
	});
});