//Main Game Variables
var board = new Array();
var score = 0;
var hasConflict = new Array();

//Mobile Related Game Variables
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

//Main Game Logic
$(document).ready(function(){
	prepareForMobile();
	newgame();
});

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://left
			event.preventDefault();
			if (moveLeft()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		case 38://up
			event.preventDefault();
			if (moveUp()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		case 39://right
			event.preventDefault();
			if (moveRight()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		case 40://down
			event.preventDefault();
			if (moveDown()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		default://other keys
			break;
	}
});


//Mobile Touch Game Logic
document.addEventListener("touchstart", function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener("touchend", function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	deltax = endx - startx;
	deltay = endy - starty;

	if ((Math.abs(deltax) < 0.3 * documentWidth) && (Math.abs(deltay) < 0.3 * documentWidth)){
		return;
	}

	if (Math.abs(deltax) >= Math.abs(deltay)){
		if (deltax > 0){
			//Right
			if (moveRight()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		} else {
			//Left
			if (moveLeft()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		}
	} else {
		if (deltay > 0){
			//Down
			if (moveDown()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		} else {
			//Up
			if (moveUp()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		}
	}
});

document.addEventListener("touchmove", function(event){
	event.preventDefault();
});

//Helper Functions
function prepareForMobile(){
	if (documentWidth > 500){
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideWidth = 100;
	}

	$("#grid-container").css("width", gridContainerWidth);
	$("#grid-container").css("height", gridContainerWidth);
	$("#grid-container").css("border-radius", 0.02 * gridContainerWidth);

	$(".grid-cell").css("width", cellSideWidth);
	$(".grid-cell").css("height", cellSideWidth);
	$(".grid-cell").css("border-radius", 0.02 * gridContainerWidth);
	$(".grid-cell").css("background-color", "rgb(205, 193, 180)");
}

function newgame(){
	//Initialize grid;
	init();
}

function init(){
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css("top", getPosTop(i, j));
			gridCell.css("left", getPosLeft(i, j));
		}
	}

	for (var i = 0; i < 4; i++){
		board[i] = new Array();
		hasConflict[i] = new Array();
		for (var j = 0; j < 4; j++){
			board[i][j] = 0;
			hasConflict[i][j] = false;
		}
	}

	updateBoardView();
	generateOneNumber();	
	generateOneNumber();
}

function updateBoardView(){
	$(".number-cell").remove();
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $("#number-cell-" + i + "-" + j);
			if (board[i][j] == 0){
				theNumberCell.css("width", "0px");
				theNumberCell.css("height", "0px");
				theNumberCell.css("top", getPosTop(i, j) + cellSideWidth/2);
				theNumberCell.css("left", getPosLeft(i, j) + cellSideWidth/2);
				theNumberCell.css("border-radius", 0.02 * gridContainerWidth);

			} else {
				theNumberCell.css("width", cellSideWidth);
				theNumberCell.css("height", cellSideWidth);
				theNumberCell.css("top", getPosTop(i, j));
				theNumberCell.css("left", getPosLeft(i, j));
				theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
				theNumberCell.text(board[i][j]);
				theNumberCell.css("color", getNumberColor(board[i][j]));
				theNumberCell.css("border-radius", 0.02 * gridContainerWidth);
			}
			hasConflict[i][j] = false;
		}
	}
	$(".number-cell").css("line-height", cellSideWidth+"px");
	$(".number-cell").css("font-size", 0.6*cellSideWidth+"px");
}

function generateOneNumber(){
	if (nospace(board)){
		return false;
	}
	//randomize a position
	var times = 0;
	while (times < 50) {
		var randx = parseInt(Math.floor(Math.random() * 4));
		var randy = parseInt(Math.floor(Math.random() * 4));
		if (board[randx][randy] == 0){
			break;
		}
		times++;
	}

	if (times == 50){
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				if (board[i][j] == 0){
					randx = i;
					randy = j;
				}
			}
		}
	}
	//randomize a number and display it
	var randInitial = Math.random();
	if (randInitial > 0.5){
		randNumber = 2;
	} else {
		randNumber = 4;
	}

	board[randx][randy] = randNumber;

	showNumberWithAnimation(randx, randy, randNumber);
	return true;
}

function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}
    //Move left
    for (var i = 0; i < 4; i++){
    	for (var j = 1; j < 4; j++){
    		if (board[i][j] != 0){
    			for (var k = 0; k < j; k++){
    				if ((board[i][k] == 0) && (noBlockHorizontal(i, k, j, board))){
    					//move
    					showMoveAnimation(i, j, i, k);
    					board[i][k] = board[i][j];
    					board[i][j] = 0;
    					continue;
    				}
    				else if ((board[i][k] == board[i][j]) && (noBlockHorizontal(i, k, j, board)) && (!hasConflict[i][k])){
    					//move
    					showMoveAnimation(i, j, i, k);
    					//add
    					board[i][k] += board[i][j];
    					board[i][j] = 0;
    					score += board[i][k];
    					updateScore(score);
    					hasConflict[i][k] = true;
    					continue;
    				}
    			}
    		}
    	}
    }
    setTimeout("updateBoardView()", 200);
    return true;

}

function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}
    //Move Right
    for (var i = 0; i < 4; i++){
    	for (var j = 0; j < 3; j++){
    		if (board[i][j] != 0){
    			for (var k = 3; k > j; k--){
    				if ((board[i][k] == 0) && (noBlockHorizontal(i, j, k, board))){
    					//move
    					showMoveAnimation(i, j, i, k);
    					board[i][k] = board[i][j];
    					board[i][j] = 0;
    					continue;
    				}
    				else if ((board[i][k] == board[i][j]) && (noBlockHorizontal(i, j, k, board)) && (!hasConflict[i][k])){
    					//move
    					showMoveAnimation(i, j, i, k);
    					//add
    					board[i][k] += board[i][j];
    					board[i][j] = 0;
    					score += board[i][k];
    					updateScore(score);
    					hasConflict[i][k] = true;
    					continue;
    				}
    			}
    		}
    	}
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp(){
	if(!canMoveUp(board)){
		return false;
	}
    //Move Up
    for (var i = 1; i < 4; i++){
    	for (var j = 0; j < 4; j++){
    		if (board[i][j] != 0){
    			for (var k = 0; k < i; k++){
    				if ((board[k][j] == 0) && (noBlockVertical(j, k, i, board))){
    					//move
    					showMoveAnimation(i, j, k, j);
    					board[k][j] = board[i][j];
    					board[i][j] = 0;
    					continue;
    				}
    				else if ((board[k][j] == board[i][j]) && (noBlockVertical(j, k, i, board)) && (!hasConflict[k][j])){
    					//move
    					showMoveAnimation(i, j, k, j);
    					//add
    					board[k][j] += board[i][j];
    					board[i][j] = 0;
    					score += board[k][j];
    					updateScore(score);
    					hasConflict[k][j] = true;
    					continue;
    				}
    			}
    		}
    	}
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown(){
	if(!canMoveDown(board)){
		return false;
	}
    //Move Up
    for (var i = 0; i < 3; i++){
    	for (var j = 0; j < 4; j++){
    		if (board[i][j] != 0){
    			for (var k = 3; k > i; k--){
    				if ((board[k][j] == 0) && (noBlockVertical(j, i, k, board))){
    					//move
    					showMoveAnimation(i, j, k, j);
    					board[k][j] = board[i][j];
    					board[i][j] = 0;
    					continue;
    				}
    				else if ((board[k][j] == board[i][j]) && (noBlockVertical(j, i, k, board)) && (!hasConflict[k][j])){
    					//move
    					showMoveAnimation(i, j, k, j);
    					//add
    					board[k][j] += board[i][j];
    					board[i][j] = 0;
    					score += board[k][j];
    					updateScore(score);
    					hasConflict[k][j] = true;
    					continue;
    				}
    			}
    		}
    	}
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function isGameOver(){
	if (nospace(board) && nomove(board)){
		gameOver();
	}
}

function gameOver(){
	alert("Game Over!");
}
