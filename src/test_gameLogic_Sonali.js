 describe("Blokus", function() {
	 
		/**
		 * authored by Sonali
		 * 
		 * Found bug for placing different shapes on board. Test which places any shape other than shape ID 0 fails.
		 * 
		 * Also found bug for passing turn to players.
		 * 
		 * Also bug found for placing corner to corner connected shape by same player. 
		 * The test fails if any shape other than shape ID 0 is placed corner to corner connected.
		 * **/
	 
  var _gameLogic;

  beforeEach(module("myApp"));

  beforeEach(inject(function (gameLogic) {
    _gameLogic = gameLogic;
  }));
  
  function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
	    expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
	      stateBeforeMove: stateBeforeMove,
	      move: move})).toBe(true);
	  }
  function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
	    expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
	      stateBeforeMove: stateBeforeMove,
	      move: move})).toBe(false);
	  } 
  
  
  
//fails
 it ("check isMoveOk logic by making legal move of corner to corner connection of same color", function() {
		// example state = {board : [[...]...],
			// playerStatus : [true, true, true, true], freeShapes = [[true, true,
			// false...], [], [], []],
			// delta : {shape : 0, placement : [[2,2]]}
	 var stateBeforeMove = {
			  board : [['0','1','2','3','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','','']],
	          playerStatus : [true, true, true, true],
	          freeShapes : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
	          delta : {shape : 0, placement : [[0,3]]}};
		  var placement = [[0,0]];
		  var shape = 0;
		  var turnIndex = 0;
		  var expectedMove = [{setTurn : {turnIndex : 1}},
		        			  {set : {key : 'board', value : [['0','1','2','3','','','','','','','','','','','','','','','',''],
		        			          	                   ['','0','0','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','0','0','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
		        			  {set : {key : 'playerStatus', value : [true, true, true, true]}},
		        			  {set : {key : 'freeShapes', value : [[false, true, true, false, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		        			           	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
		        			  {set : {key : 'delta', value : {shape : 0, placement : [[1,1],[1,2],[2,1],[2,2]]}}}];
		        	//   var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expectMoveOk(0,stateBeforeMove,expectedMove);
	  });
 
//fails
 it ("check isMoveOk logic by making legal move of placing shape ID 1 by player 2", function() {
		
	 var stateBeforeMove = {
			  board : [['0','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','','']],
	          playerStatus : [true, true, true, true],
	          freeShapes : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
	          delta : {shape : 0, placement : [[0,0]]}};
		  var placement = [[0,0]];
		  var shape = 0;
		  var turnIndex = 0;
		  var expectedMove = [{setTurn : {turnIndex : 1}},
		        			  {set : {key : 'board', value : [['0','','','','','','','','','','','','','','','','','','',''],
		        			          	                   ['','1','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','1','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
		        			  {set : {key : 'playerStatus', value : [true, true, true, true]}},
		        			  {set : {key : 'freeShapes', value : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		        			           	                        [true, false, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
		        			  {set : {key : 'delta', value : {shape : 0, placement : [[1,1],[2,1]]}}}];
		        	//   var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expectMoveOk(0,stateBeforeMove,expectedMove);
	  });
 

//fails 
 it ("an example of a legal placement of shape ID 7 by player 1", function() {
	 var board =  [['0','0','','','','','','','','','','','','','','','','','',''],
                   ['0','0','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','','']];
	 var placement = [[[0,0],[0,1]],[[1,0],[1,1]]];
	 var turnIndex = 0;
	 expect(_gameLogic.legalPlacement(board, placement, turnIndex)).toBe(true);
  });
  
 
//fails
 it ("check isMoveOk logic by making legal move by passing turn to player 2", function() {
		// example state = {board : [[...]...],
			// playerStatus : [true, true, true, true], freeShapes = [[true, true,
			// false...], [], [], []],
			// delta : {shape : 0, placement : [[2,2]]}
	 var stateBeforeMove = {
			  board : [['0','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','','']],
	          playerStatus : [true, true, true, true],
	          freeShapes : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
	         delta : {shape : 0, placement : [[0,0]]}};
		  var placement = [[0,0]];
		  var shape = 0;
		  var turnIndex = 0;
		  var expectedMove = [{setTurn : {turnIndex : 1}},
		        			  {set : {key : 'board', value : [['0','1','','','','','','','','','','','','','','','','','',''],
		        			          	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
		        			  {set : {key : 'playerStatus', value : [true, true, true, true]}},
		        			  {set : {key : 'freeShapes', value : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		        			           	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
		        			  {set : {key : 'delta', value : {shape : 0, placement : [[0,1]]}}}];
		        	//   var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expectMoveOk(0,stateBeforeMove,expectedMove);
	  });


//fails
it ("check isMoveOk logic by making legal move by passing turn to player 3", function() {
		// example state = {board : [[...]...],
			// playerStatus : [true, true, true, true], freeShapes = [[true, true,
			// false...], [], [], []],
			// delta : {shape : 0, placement : [[2,2]]}
	 var stateBeforeMove = {
			  board : [['0','1','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','','']],
	          playerStatus : [true, true, true, true],
	          freeShapes : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
	         delta : {shape : 0, placement : [[0,1]]}};
		
		  var expectedMove = [{setTurn : {turnIndex : 1}},
		        			  {set : {key : 'board', value : [['0','1','2','','','','','','','','','','','','','','','','',''],
		        			          	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
		        			  {set : {key : 'playerStatus', value : [true, true, true, true]}},
		        			  {set : {key : 'freeShapes', value : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		        			           	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
		        			  {set : {key : 'delta', value : {shape : 0, placement : [[0,2]]}}}];
		        	//   var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expectMoveOk(0,stateBeforeMove,expectedMove);
	  });
 it ("check isMoveOk logic by making legal move of placing first shape", function() {
		// example state = {board : [[...]...],
			// playerStatus : [true, true, true, true], freeShapes = [[true, true,
			// false...], [], [], []],
			// delta : {shape : 0, placement : [[2,2]]}
	 var stateBeforeMove = {
			  board : [['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','','']],
	          playerStatus : [true, true, true, true],
	          freeShapes : [[true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
	          delta : {}};
		  var placement = [[0,0]];
		  var shape = 0;
		  var turnIndex = 0;
		  var expectedMove = [{setTurn : {turnIndex : 1}},
		        			  {set : {key : 'board', value : [['0','','','','','','','','','','','','','','','','','','',''],
		        			          	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
		        			  {set : {key : 'playerStatus', value : [true, true, true, true]}},
		        			  {set : {key : 'freeShapes', value : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		        			           	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
		        			  {set : {key : 'delta', value : {shape : 0, placement : [[0,0]]}}}];
		        	//   var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expectMoveOk(0,stateBeforeMove,expectedMove);
	  });

 it ("check isMoveOk logic by making illegal move of setting turn to self", function() {
		// example state = {board : [[...]...],
			// playerStatus : [true, true, true, true], freeShapes = [[true, true,
			// false...], [], [], []],
			// delta : {shape : 0, placement : [[2,2]]}
	 var stateBeforeMove = {
			  board : [['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','','']],
	          playerStatus : [true, true, true, true],
	          freeShapes : [[true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
	          delta : {}};
		  var placement = [[0,0]];
		  var shape = 0;
		  var turnIndex = 0;
		  var expectedMove = [{setTurn : {turnIndex : 0}},
		        			  {set : {key : 'board', value : [['0','','','','','','','','','','','','','','','','','','',''],
		        			          	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
		        			  {set : {key : 'playerStatus', value : [true, true, true, true]}},
		        			  {set : {key : 'freeShapes', value : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		        			           	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
		        			  {set : {key : 'delta', value : {shape : 0, placement : [[0,0]]}}}];
		        	//   var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expectIllegalMove(0,stateBeforeMove,expectedMove);
	  });

 it ("check isMoveOk logic by making illegal move of placing shape in non-empty position", function() {
		// example state = {board : [[...]...],
			// playerStatus : [true, true, true, true], freeShapes = [[true, true,
			// false...], [], [], []],
			// delta : {shape : 0, placement : [[2,2]]}
	 var stateBeforeMove = {
			  board : [['0','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','','']],
	          playerStatus : [true, true, true, true],
	          freeShapes : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
	                        delta : {shape : 0, placement : [[0,0]]}};
		  var placement = [[0,0]];
		  var shape = 0;
		  var turnIndex = 0;
		  var expectedMove = [{setTurn : {turnIndex : 1}},
		        			  {set : {key : 'board', value : [['1','','','','','','','','','','','','','','','','','','',''],
		        			          	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
		        			  {set : {key : 'playerStatus', value : [true, true, true, true]}},
		        			  {set : {key : 'freeShapes', value : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		        			           	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
		        			  {set : {key : 'delta', value : {shape : 0, placement : [[0,0]]}}}];
		        	//   var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expectIllegalMove(0,stateBeforeMove,expectedMove);
	  });

 it ("check isMoveOk logic by making legal move but not providing correct freeshape status", function() {
		// example state = {board : [[...]...],
			// playerStatus : [true, true, true, true], freeShapes = [[true, true,
			// false...], [], [], []],
			// delta : {shape : 0, placement : [[2,2]]}
	 var stateBeforeMove = {
			  board : [['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','','']],
	          playerStatus : [true, true, true, true],
	          freeShapes : [[true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
	          delta : {}};
		  var placement = [[0,0]];
		  var shape = 0;
		  var turnIndex = 0;
		  var expectedMove = [{setTurn : {turnIndex : 1}},
		        			  {set : {key : 'board', value : [['0','','','','','','','','','','','','','','','','','','',''],
		        			          	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
		        			  {set : {key : 'playerStatus', value : [true, true, true, true]}},
		        			  {set : {key : 'freeShapes', value : [[true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		        			           	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
		        			  {set : {key : 'delta', value : {shape : 0, placement : [[0,1]]}}}];
		        	//   var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expectIllegalMove(0,stateBeforeMove,expectedMove);
	  });

 it ("check isMoveOk logic by making illegal move of edge to edge connection of same color", function() {
		// example state = {board : [[...]...],
			// playerStatus : [true, true, true, true], freeShapes = [[true, true,
			// false...], [], [], []],
			// delta : {shape : 0, placement : [[2,2]]}
	 var stateBeforeMove = {
			  board : [['0','1','2','3','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','','']],
	          playerStatus : [true, true, true, true],
	          freeShapes : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
	          delta : {shape : 0, placement : [[0,3]]}};
		  var placement = [[0,0]];
		  var shape = 0;
		  var turnIndex = 0;
		  var expectedMove = [{setTurn : {turnIndex : 1}},
		        			  {set : {key : 'board', value : [['0','1','2','3','','','','','','','','','','','','','','','',''],
		        			          	                   ['0','0','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['0','0','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
		        			  {set : {key : 'playerStatus', value : [true, true, true, true]}},
		        			  {set : {key : 'freeShapes', value : [[false, true, true, false, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		        			           	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
		        			  {set : {key : 'delta', value : {shape : 0, placement : [[1,0],[1,1],[2,0],[2,1]]}}}];
		        	//   var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expectIllegalMove(3,stateBeforeMove,expectedMove);
	  });


 
 it ("an example of a illegal placement at 0,2 since the position is already occupied", function() {
	 var board_beforeMove =  [['0','','1','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','',''],
                   ['','','','','','','','','','','','','','','','','','','','']];
	 var placement = [[0,2]];
	 var turnIndex = 1;
	 expect(_gameLogic.legalPlacement(board_beforeMove, placement, turnIndex)).toBe(false);
  });
 it ("check isMoveOk logic by making illegal move by placing piece of same color without any connection to a piece of same color", function() {
		// example state = {board : [[...]...],
			// playerStatus : [true, true, true, true], freeShapes = [[true, true,
			// false...], [], [], []],
			// delta : {shape : 0, placement : [[2,2]]}
	 var stateBeforeMove = {
			  board : [['0','1','2','3','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','','']],
	          playerStatus : [true, true, true, true],
	          freeShapes : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
	          delta : {shape : 0, placement : [[0,3]]}};
		  var placement = [[0,0]];
		  var shape = 0;
		  var turnIndex = 0;
		  var expectedMove = [{setTurn : {turnIndex : 1}},
		        			  {set : {key : 'board', value : [['0','1','2','3','','','','','','','','','','','','','','','',''],
		        			          	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['0','0','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['0','0','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
		        			  {set : {key : 'playerStatus', value : [true, true, true, true]}},
		        			  {set : {key : 'freeShapes', value : [[false, true, true, false, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		        			           	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
		        			  {set : {key : 'delta', value : {shape : 0, placement : [[2,0],[2,1],[3,0],[3,1]]}}}];
		        	//   var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expectIllegalMove(3,stateBeforeMove,expectedMove);
	  });
 
 
 it ("check isMoveOk logic by making illegal move of placing same shape twice", function() {
		// example state = {board : [[...]...],
			// playerStatus : [true, true, true, true], freeShapes = [[true, true,
			// false...], [], [], []],
			// delta : {shape : 0, placement : [[2,2]]}
	 var stateBeforeMove = {
			  board : [['0','1','2','3','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','',''],
	                   ['','','','','','','','','','','','','','','','','','','','']],
	          playerStatus : [true, true, true, true],
	          freeShapes : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
	          delta : {shape : 0, placement : [[0,3]]}};
		  var placement = [[0,0]];
		  var shape = 0;
		  var turnIndex = 0;
		  var expectedMove = [{setTurn : {turnIndex : 1}},
		        			  {set : {key : 'board', value : [['0','1','2','3','','','','','','','','','','','','','','','',''],
		        			          	                   ['','0','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','',''],
		        			        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
		        			  {set : {key : 'playerStatus', value : [true, true, true, true]}},
		        			  {set : {key : 'freeShapes', value : [[false, true, true, false, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		        			           	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		        			        	                        [false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
		        			  {set : {key : 'delta', value : {shape : 0, placement : [[2,0],[2,1],[3,0],[3,1]]}}}];
		        	//   var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expectIllegalMove(3,stateBeforeMove,expectedMove);
	  });
 it ("illegal move of passing turn to third player and skipping second player", function() {
				  var stateBeforeMove = {
				  board : [['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','','']],
		          playerStatus : [true, true, true, true],
		          freeShapes : [[true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
		          delta : {}};
		  var placement = [[0,0]];
		  var shape = 0;
		  var turnIndex = 0;
		  var expectedMove = [{setTurn : {turnIndex : 2}},
				  {set : {key : 'board', value : [['0','','','','','','','','','','','','','','','','','','',''],
				          	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','',''],
				        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
				  {set : {key : 'playerStatus', value : [true, true, true, true]}},
				  {set : {key : 'freeShapes', value : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
				           	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
				        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
				        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
				  {set : {key : 'delta', value : {shape : 0, placement : [[0,0]]}}}];
		  var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
		  expect(angular.equals(expectedMove, generatedMove)).toBe(false);
	  });
 /*

 it ("illegal move of passing turn to third player and skipping second player", function() {
	  var stateBeforeMove = {
	  board : [['0','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','','']],
     playerStatus : [true, true, true, true],
     freeShapes : [[true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
                   [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                   [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                   [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
     delta : {}};
var placement = [[0,0]];
var shape = 0;
var turnIndex = 0;
var expectedMove = [{setTurn : {turnIndex : 2}},
	  {set : {key : 'board', value : [['0','','','','','','','','','','','','','','','','','','',''],
	          	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','',''],
	        	                   ['','','','','','','','','','','','','','','','','','','','']]}},
	  {set : {key : 'playerStatus', value : [true, true, true, true]}},
	  {set : {key : 'freeShapes', value : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
	           	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
	        	                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
	  {set : {key : 'delta', value : {shape : 0, placement : [[0,0]]}}}];

expect(angular.equals(expectedMove, generatedMove)).toBe(false);
});
*/
 //passes
 it ("illegal move of placing a shape outside the board", function() {
	  var stateBeforeMove = {
	  board : [['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','',''],
              ['','','','','','','','','','','','','','','','','','','','']],
     playerStatus : [true, true, true, true],
     freeShapes : [[true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
                   [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                   [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                   [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
     delta : {}};
var placement = [[0,40]];
var shape = 0;
var turnIndex = 0;

expect(function(){_gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);}).toThrow(new Error("illegal placement of a shape!"));
});

 //passes
 it ("create a move with illegal placement", function() {

		  var stateBeforeMove = {
				  board : [['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','',''],
		                   ['','','','','','','','','','','','','','','','','','','','']],
		          playerStatus : [true, true, true, true],
		          freeShapes : [[true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true], 
		                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
		                        [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
		          delta : {}};
		  var placement = [[0,1]];
		  var shape = 0;
		  var turnIndex = 0;
		 	  
		 	 expect(function(){_gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);}).toThrow(new Error("illegal placement of a shape!"));
	  });
  });