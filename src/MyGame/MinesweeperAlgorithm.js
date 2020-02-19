"use strict"; // Operate in Strict mode such that variables must be declared before used!

var getRandomInteger = function (min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

var handleClick = function (id) {
	if (!gameOver) {
		if (ctrlIsPressed) {
			handleCtrlClick(id);
		} else {
			var cell = board[id];
			var $cell = $('#' + id);
			if (!cell.opened) {
				if (!cell.flagged) {
					if (cell.mined) {
						loss();
						$cell.html(MINE).css('color', 'red');
					} else {
						cell.opened = true;
						if (cell.neighborMineCount > 0) {
							var color = getNumberColor(cell.neighborMineCount);
							$cell.html(cell.neighborMineCount).css('color', color);
						} else {
							$cell.html("")
								.css('background-image', 'radial-gradient(#e6e6e6,#c9c7c7)');
							var neighbors = getNeighbors(id);
							for (var i = 0; i < neighbors.length; i++) {
								var neighbor = neighbors[i];
								if (typeof board[neighbor] !== 'undefined' &&
									!board[neighbor].flagged && !board[neighbor].opened) {
									handleClick(neighbor);
								}
							}
						}
					}
				}
			}
		}
	}
}

function Cell(row, column, opened, flagged, mined, neighborMineCount) {
	return {
		id: row + "" + column,
		row: row,
		column: column,
		opened: opened,
		flagged: flagged,
		mined: mined,
		neighborMineCount: neighborMineCount
	}
}

function Board(boardSize, mineCount) {
	var board = {};
	for (var row = 0; row < boardSize; row++) {
		for (var column = 0; column < boardSize; column++) {
			board[row + "" + column] = Cell(row, column, false, false, false, 0);
		}
	}
	board = randomlyAssignMines(board, mineCount);
	board = calculateNeighborMineCounts(board, boardSize);
	return board;
}

var randomlyAssignMines = function (board, mineCount) {
	var mineCoordinates = [];
	for (var i = 0; i < mineCount; i++) {
		var randomRowCoordinate = getRandomInteger(0, boardSize);
		var randomColumnCoordinate = getRandomInteger(0, boardSize);
		var cell = randomRowCoordinate + "" + randomColumnCoordinate;
		while (mineCoordinates.includes(cell)) {
			randomRowCoordinate = getRandomInteger(0, boardSize);
			randomColumnCoordinate = getRandomInteger(0, boardSize);
			cell = randomRowCoordinate + "" + randomColumnCoordinate;
		}
		mineCoordinates.push(cell);
		board[cell].mined = true;
	}
	return board;
}

var calculateNeighborMineCounts = function (board, boardSize) {
	var cell;
	var neighborMineCount = 0;
	for (var row = 0; row < boardSize; row++) {
		for (var column = 0; column < boardSize; column++) {
			var id = row + "" + column;
			cell = board[id];
			if (!cell.mined) {
				var neighbors = getNeighbors(id);
				neighborMineCount = 0;
				for (var i = 0; i < neighbors.length; i++) {
					neighborMineCount += isMined(board, neighbors[i]);
				}
				cell.neighborMineCount = neighborMineCount;
			}
		}
	}
	return board;
}

var getNeighbors = function (id) {
	var row = parseInt(id[0]);

	var column = parseInt(id[1]);

	var neighbors = [];
	neighbors.push((row - 1) + "" + (column - 1));
	neighbors.push((row - 1) + "" + column);
	neighbors.push((row - 1) + "" + (column + 1));
	neighbors.push(row + "" + (column - 1));
	neighbors.push(row + "" + (column + 1));
	neighbors.push((row + 1) + "" + (column - 1));
	neighbors.push((row + 1) + "" + column);
	neighbors.push((row + 1) + "" + (column + 1));

	for (var i = 0; i < neighbors.length; i++) {
		if (neighbors[i].length > 2) {
			neighbors.splice(i, 1);
			i--;
		}
	}

	return neighbors
}

var isMined = function (board, id) {
	var cell = board[id];
	var mined = 0;
	if (typeof cell !== 'undefined') {
		mined = cell.mined ? 1 : 0;
	}
	return mined;
}
