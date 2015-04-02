angular.module('myApp')
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
			return '#FF3399';
		} else if ($scope.state.board[row][col] === '1') {
			return  '#99FF33';
		} else if ($scope.state.board[row][col] === '2') {
			return '#33CCFF';
		} else if ($scope.state.board[row][col] === '3') {
			return '#FF9900';
		} else {
			return '#F0F0F0';
		}
	}
	function getTurnColor() {
		var color = ['#FF3399', '#99FF33', '#33CCFF', '#FF9900'];
		return color[$scope.turnIndex];
	}
    function setPlacementBackgroundColor(row, col, placement) {
        for (var i = 0; i < placement.length; i++) {
			var row = placement[i][0];
			var col = placement[i][1];
			setSquareBackgroundColor(row, col, getTurnColor());
        }
    }
	function clearDrag(dragType) {
		if (dragType === 'board') {
			// reset boardArea background color;
			setBoardBackgroundColor();
		}
		var draggingLines = document.getElementById(dragType+"DraggingLines");
		draggingLines.style.display = "none";
    }
	
	window.handleDragEvent = handleDragEvent;
	
	function getAreaSize (type) {
		var width = 0;
		var height = 0;
		if (type === 'board'){
			width = document.getElementById("boardAreaRow0").clientWidth;
			height = document.getElementById("boardAreaRow0").clientHeight * 20;
		}
		if (type === 'shape'){
			width = document.getElementById("shapeAreaRow0").clientWidth;
			height = document.getElementById("shapeAreaRow0").clientHeight * 12;
		}
		if (type === 'rotate'){
			width = document.getElementById("rotateAreaRow0").clientWidth;
			height = document.getElementById("rotateAreaRow0").clientHeight * 9;
		}		
		return {width: width,height: height};
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
		if (gameLogic.endOfMatch($scope.state.playerStatus)) {
			return;
		}
		clearDrag('board');
		clearDrag('shape');
		clearDrag('rotate');
		
		var gameArea = document.getElementById("gameArea");
		// compute horizontal and vertical offset relative to boardArea, shapeArea, and rotateArea
		var boardX = clientX - document.getElementById("gameArea").offsetLeft;
        var boardY = clientY - document.getElementById("gameArea").offsetTop;
		var shapeX = clientX - document.getElementById("gameArea").offsetLeft;
        var shapeY = clientY - document.getElementById("shapeAreaRow0").offsetTop;
		var rotateX = clientX - document.getElementById("gameArea").offsetLeft;
        var rotateY = clientY - document.getElementById("rotateAreaRow0").offsetTop;
		var dragType = '';
		// initialize dragType
		var boardSize = getAreaSize('board');
		var shapeSize = getAreaSize('shape');
		var rotateSize = getAreaSize('rotate');
		var x, y;
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
			return;
		}
		console.log("dragType is  "+dragType);
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
			
			setPlacementBackgroundColor(row, col, placement);
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
			return {rowsNum: 9, colsNum: 20};
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
		return {background: color};
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