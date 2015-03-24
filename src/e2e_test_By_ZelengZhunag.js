/* https://github.com/angular/protractor/blob/master/docs/toc.md */

//test added by Zeleng Zhuang, no bug found.
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
	
	it('should have a title', function () {
		expect(browser.getTitle()).toEqual('Blokus');
	});

	it('every element in the board should be white in the init state', function(){
		var board = getInitialBoard ();
		expectBoard (board);
		});

	it('the first five elements in the first row should be red', function () {
		getDiv(14, 2, 'shape').click(); 
		getDiv(0, 0, 'board').click(); 
		
		expectDiv (0, 0, 'board', 0);
		expectDiv (0, 1, 'board', 0);
		expectDiv (0, 2, 'board', 0);
		expectDiv (0, 3, 'board', 0);
		expectDiv (0, 4, 'board', 0);
	});

	it('the first five elements in the first row should be red and the last element in the first row should be green', function () {
		getDiv(14, 2, 'shape').click(); 
		getDiv(0, 0, 'board').click(); 
		getDiv(0, 2, 'shape').click(); 
		getDiv(0, 19, 'board').click(); 

		expectDiv (0, 0, 'board', 0);
		expectDiv (0, 1, 'board', 0);
		expectDiv (0, 2, 'board', 0);
		expectDiv (0, 3, 'board', 0);
		expectDiv (0, 4, 'board', 0);
		expectDiv (0, 19, 'board', 1);
	});

	it('ilegle move should be ignored', function () {
		getDiv(0, 2, 'shape').click(); 
		getDiv(1, 1, 'board').click(); 
		var board = getInitialBoard();
		expectBoard(board);
	});
    
    it('If click on the non-empty element all action will be ignored', function () {
		getDiv(0, 2, 'shape').click(); 
		getDiv(0, 0, 'board').click();
		var board = getInitialBoard();
		board[0][0] = '0';
		expectBoard(board);
		getDiv(0, 2, 'shape').click(); 
		getDiv(0, 0, 'board').click(); 
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
			      ['','2','0','0','0','1','','0','0','0','2','2','2','3','3','2','3','2','','2'],
			      ['2','','','0','','','3','3','3','3','2','','3','2','2','2','3','3','','3'],
			      ['2','2','0','','0','0','','2','2','2','3','3','3','','','2','3','','3','3']];
	var playerStatus1 = [false, false, false, true];
	
	var freeShapes1 = new Array(4);
	for(var i = 0; i < 4; i++) {
		freeShapes1[i] = new Array(21);
		for (var j = 0; j < 21; j++) {
			freeShapes1[i][j] = false;
		}
	}
	freeShapes1[3][0] = true; 
	var delta1 = {shape : 0, placement : [[17,19]]};
	
	var board2 = [['0','0','','0','1','','','0','0','0','1','1','1','','3','3','','3','1','1'],
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
	var playerStatus2 = [false, false, false, false];
	var freeShapes2 = new Array(4);
	for(var i = 0; i < 4; i++) {
		freeShapes2[i] = new Array(21);
		for (var j = 0; j < 21; j++) {
			freeShapes2[i][j] = false;
		}
	}
	var delta2 = {shape : 0, placement : [[0,17]]};

    
	var matchState1 = {
		turnIndexBeforeMove: 3, 
		turnIndex: -2, 
		endMatchScores: [90, 90, 90, 90],
		lastMove: [{endMatch : {endMatchScores : [90, 90, 90, 90]}},
			{set: {key: 'board', value: board2}},
			{set: {key: 'playerStatus', value: playerStatus2}},
			{set: {key: 'freeShapes', value: freeShapes2}},
			{set: {key: 'delta', value: delta2}}],
		lastState: {board: board1, playerStatus: playerStatus1, freeShapes: freeShapes1, delta: delta1},
		currentState: {board: board2, playerStatus: playerStatus2, freeShapes: freeShapes2, delta: delta2},
		lastVisibleTo: {},
		currentVisibleTo: {},
	};

    it('when the game is already ended u cant start', function () {
		setMatchState(matchState1, 'passAndPlay');
		expectBoard(board2);
		getDiv(0, 2, 'shape').click(); 
		getDiv(0, 17, 'board').click(); 
		expectBoard(board2);
	});

	it('the first five elements in the first row should be red, and the others should be white', function () {
		getDiv(0, 2, 'shape').click(); 
		getDiv(0, 0, 'board').click(); 
		
		expectDiv (1, 1, 'board', '');
		expectDiv (1, 2, 'board', '');
		expectDiv (0, 3, 'board', '');
		expectDiv (0, 4, 'board', '');
	});

	it('the first two elements in the first row should be red and the last element in the first row should be green', function () {
		getDiv(14, 2, 'shape').click(); 
		getDiv(0, 0, 'board').click(); 
		getDiv(0, 2, 'shape').click(); 
		getDiv(0, 19, 'board').click(); 

		expectDiv (0, 0, 'board', 0);
		expectDiv (0, 1, 'board', 0);
	});

	it('the last element in the first row should be green', function () {
		getDiv(14, 2, 'shape').click(); 
		getDiv(0, 0, 'board').click(); 
		getDiv(0, 2, 'shape').click(); 
		getDiv(0, 19, 'board').click(); 

		expectDiv (0, 19, 'board', 1);
	});


});	
