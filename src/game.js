angular.module('myApp')
  .controller('Ctrl',
      ['$scope', '$log', '$timeout',
       'gameService', 'stateService', 'gameLogic', 'aiService', 'resizeGameAreaService',
		function ($scope, $log, $timeout,
			gameService, stateService, gameLogic, aiService, resizeGameAreaService) {

    'use strict';

    resizeGameAreaService.setWidthToHeight(1.6);
	
	//window.e2e_test_stateService = stateService; //to allow us to load any state in our e2e tests.
	
	// Before getting any updateUI, we initialize $scope variables (such as board)
    // and show an empty board to a viewer (so you can't perform moves).
    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
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
	
	
	/** get the color of a square on the rotate area
	$scope.getRotateAreaSquareColor = function(row, col) {
		if ($scope.getRotate(row, col) === -1) { // if this square is not a part of a rotated shape
			return { backgroundColor : 'white' };
		} else { // get the correct color for that rotated shape
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
				default:
					return { backgroundColor: 'white'};
					break;
          }
		}
	}
	*/
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
		if (rotate >= 0 && rotate < gameLogic.getTotalRotateCount($scope.shape)) {
			$scope.rotate = rotate; // if the player clicks on a legal rotation, store the rotation in $scope.rotate
		} else {
			$scope.rotate = 0; // else default rotation to 0;
		}
		
	}
	
	/** get the color of a square on the board by examining the board*/
	$scope.getSquareColor = function (row, col) {
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
		return {backgroundColor: color};
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
			console.log('create move success!');
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
      $log.info(["Clicked on shape:", row, col]);
      var shapeNum = getShape(row, col);
      $log.info(shapeNum);
      $scope.shape = shapeNum;
    };
	$scope.rotateClicked = function (row, col) {
		console.log($scope.shape);
		if ($scope.shape === -1) {
			return; // if the player haven't selected a shape, he/she cannot rotate a shape.
		}
		var rotate = row * 2 + col;
		if (rotate >= gameLogic.getTotalRotateCount($scope.shape)) {
			rotate = 0; // if the current shape does not have enough rotations, return the default rotation.
		}
		$scope.rotate = rotate;
		console.log($scope.rotate);
	}
	$scope.setCol= function(row, col) {
      if(getShape(row, col) >= 0 && shapeAvaiable(row, col, $scope.turnIndex)) {
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

    function shapeAvaiable(row, col) {
      var shapeNum = getShape(row, col);
      var freeShapes = $scope.state.freeShapes;
      //freeShapes[1][3] = false;
      //console.log(freeShapes);
      return freeShapes[$scope.turnIndex][shapeNum];
    }
  }]);