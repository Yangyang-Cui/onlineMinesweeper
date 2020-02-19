/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, DyePack, Hero, Minion, Brain,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict"; // Operate in Strict mode such that variables must be declared before used!

function MyGame(boardSize, mineCount) {
	this.clickSound = "assets/sounds/click.mp3";
	this.failSound = "assets/sounds/fail.mp3"
	this.successSound = "assets/sounds/success.wav"
	
	this.kBgd = "assets/bgd.png";
	this.mBgd = null;
	this.mBgdSet = null;

	this.kMineUnopened = "assets/mine_unopened.png";
	this.mMineUnopened = null;
	this.mMineUnopenedSet = null;

	this.kMineRed = "assets/mine_red.png";
	this.mMineRed = null;
	this.kMineGray = "assets/mine_gray.jpg";
	this.mMineGray = null;
	this.mMineGraySet = null;

	this.kFlag = "assets/flag.png";
	this.mFlag = null;
	this.mFlagSet = null;

	this.powerBoardSize = null;

	this.mCamera = null;

	this.mMsg = null;
	this.mMsgSet = null;

	this.mFlagState = false;

	this.mCheckPoint = null;
	this.mCheckPointSet = null;

	this.mCheckPointStar = null;
	this.mCheckPointStarSet = null;

	this.gameOver = false;

	this.board = null;
	this.id = null;
	this.idX = null;
	this.idY = null;
	this.number = null;
	this.numberMsg = null;

	this.checkIsVictory = false;
	this.cell = null;

	this.cameraViewport = [0, 0, 640, 640];

	this.defaultStart = 0;
	this._setGame(boardSize, mineCount);


	document.getElementById('easy-game-button').onclick = function () {
		gEngine.GameLoop.stop();
		// location.reload();
		var myGame = new MyGame(10, 10);
		gEngine.Core.initializeEngineCore('GLCanvas', myGame);
		document.getElementById('messageBox').textContent = '简单：10*10格子， 10个雷';
		document.getElementById('messageBox').style.color = 'white';
		document.getElementById('messageBox').style.background = 'gray';
	};

	document.getElementById('normal-game-button').onclick = function () {
		gEngine.GameLoop.stop();
		// location.reload();
		var myGame = new MyGame(13, 20);
		gEngine.Core.initializeEngineCore('GLCanvas', myGame);
		document.getElementById('messageBox').textContent = '普通：13*13格子，20个雷';
		document.getElementById('messageBox').style.color = 'white';
		document.getElementById('messageBox').style.background = 'gray';
	};

	document.getElementById('hard-game-button').onclick = function () {
		gEngine.GameLoop.stop();
		// location.reload();
		var myGame = new MyGame(15, 30);
		gEngine.Core.initializeEngineCore('GLCanvas', myGame);;
		document.getElementById('messageBox').textContent = '困难：15*15格子，30个雷';
		document.getElementById('messageBox').style.color = 'white';
		document.getElementById('messageBox').style.background = 'gray';
	};
}

gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
	// load sound effect
	gEngine.AudioClips.loadAudio(this.clickSound);
	gEngine.AudioClips.loadAudio(this.failSound);
	gEngine.AudioClips.loadAudio(this.successSound);
	// load image
	gEngine.Textures.loadTexture(this.kBgd);
	gEngine.Textures.loadTexture(this.kMineUnopened);
	gEngine.Textures.loadTexture(this.kMineRed);
	gEngine.Textures.loadTexture(this.kMineGray);
	gEngine.Textures.loadTexture(this.kFlag);
};

MyGame.prototype.unloadScene = function () {
	// load sound effect
	gEngine.AudioClips.unloadAudio(this.clickSound);
	gEngine.AudioClips.unloadAudio(this.failSound);
	gEngine.AudioClips.unloadAudio(this.successSound);
	// load image
	gEngine.Textures.unloadTexture(this.kBgd);
	gEngine.Textures.unloadTexture(this.kMineUnopened);
	gEngine.Textures.unloadTexture(this.kMineRed);
	gEngine.Textures.unloadTexture(this.kMineGray);
	gEngine.Textures.unloadTexture(this.kFlag);
	// console.log("unload");
};

MyGame.prototype.initialize = function () {
	// Step A: set up the cameras
	this.mCamera = new Camera(
		vec2.fromValues(this.cameraPosition[0], this.cameraPosition[1]), // position of the camera
		this.cameraWidth, // width of camera
		this.cameraViewport // viewport (orgX, orgY, width, height)
	);
	this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

	this.mBgdSet = [];

	// this.mMsg = new FontRenderable("Status Message");
	// this.mMsg.setColor([0, 0, 0, 1]);
	// this.mMsg.getXform().setPosition(20, 40);
	// this.mMsg.setTextHeight(5);

	this.mBgdSet = [];
	this.mMineUnopenedSet = [];
	this.mMineGraySet = [];
	this.mFlagSet = [];
	this.mCheckPointSet = []
	this.mCheckPointStarSet = []
	this.mMsgSet = [];

	this.powerBoardSize = this.boardSize * this.boardSize;
	this._Board(this.powerBoardSize, this.mineCount);
	this._number();
	// console.log(this.board);
	// console.log(this.mMsgSet);

};


MyGame.prototype.drawCamera = function (camera) {
	camera.setupViewProjection();
	// Bgd
	for (let i = 0; i < this.mBgdSet.length; i++) {
		this.mBgdSet[i].draw(camera);
	}
	// Mine neighbor number
	for (let i = 0; i < this.mMsgSet.length; i++) {
		this.mMsgSet[i].draw(camera);
	}
	// Mine
	for (let i = 0; i < this.mMineGraySet.length; i++) {
		this.mMineGraySet[i].draw(camera);

	}
	// Mine_unopened
	for (let i = 0; i < this.mMineUnopenedSet.length; i++) {
		if (this.mMineUnopenedSet[i].mVisible) {
			this.mMineUnopenedSet[i].draw(camera);
		}
	}
	// Flag
	for (let i = 0; i < this.mFlagSet.length; i++) {
		if (this.mFlagSet[i].mVisible) {
			this.mFlagSet[i].draw(camera);
		}
	}
	// Red_mine
	if (this.mMineRed !== null) {
		this.mMineRed.draw(camera);
	}
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
	// Step A: clear the canvas
	gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

	// Step  B: Draw with all three cameras
	this.drawCamera(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
	this.mCamera.update(); // for smoother camera movements
	// *** didn't work

	// Pan camera to object
	if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {

	}

	if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {

	}

	// testing the mouse input
	if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {

	}

	if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
		gEngine.AudioClips.playACue(this.clickSound);
		this._getClickedID();
		this._handleLeftClick(this.id);
		let isVictory = true
		var cells = Object.keys(this.board);
		for (var i = 0; i < cells.length; i++) {
			if (!this.board[cells[i]].mined) {
				if (!this.board[cells[i]].opened) {
					isVictory = false;
					break;
				}
			}
		}

		if (isVictory) {
		gEngine.AudioClips.playACue(this.successSound);
			this.checkIsVictory = true;
			this.gameOver = true;
			document.getElementById('messageBox').textContent = '你赢了';
			document.getElementById('messageBox').style.color = 'white';
			document.getElementById('messageBox').style.background = 'green';
			this.mMineUnopenedSet = [];
			this.mFlagSet = [];
		}
	}

	if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Right)) {
		gEngine.AudioClips.playACue(this.clickSound);
		this._getClickedID();
		this._handleRightClick(this.id);
	}
};

// **** Minesweeper Algorithm *****
function Cell(x, y, opened, flagged, mined, neighborMineCount, mineUnopenedImage, mineImage, flagImage) {
	return {
		id: x + '*' + y,
		x: x,
		y: y,
		opened: opened,
		flagged: flagged,
		mined: mined,
		neighborMineCount: neighborMineCount,
		mineUnopenedImage: mineUnopenedImage,
		mineImage: mineImage,
		flagImage: flagImage
	};
}

MyGame.prototype._Board = function (boardSize, mineCount) {
	this.board = {};
	for (let x = this.startPoint; x < boardSize; x += this.cellSize) {
		for (let y = this.startPoint; y < boardSize; y += this.cellSize) {
			this.mMineUnopened = new TextureObject(this.kMineUnopened, x, y, this.cellSize, this.cellSize);
			this.mMineGray = null;
			this.mFlag = new TextureObject(this.kFlag, x, y, this.cellSize, this.cellSize);
			this.mFlag.setVisibility(false);
			this.board[x + '*' + y] = Cell(x, y, false, false, false, 0, this.mMineUnopened, this.mMineGray, this.mFlag);

			this.mMineUnopenedSet.push(this.board[x + '*' + y].mineUnopenedImage);
			this.mFlagSet.push(this.board[x + '*' + y].flagImage);

			this.mBgd = new TextureObject(this.kBgd, x, y, this.cellSize, this.cellSize);
			this.mBgdSet.push(this.mBgd);

			this.mCheckPoint = [x, y];
			this.mCheckPointSet.push(this.mCheckPoint);
			this.mCheckPointStar = x + "*" + y;
			this.mCheckPointStarSet.push(this.mCheckPointStar);
		}
	}

	this.board = this._randomlyAssignMines(mineCount);
	this.board = this._calculateNeighborMineCounts(boardSize);

	return this.board;
};

MyGame.prototype._randomlyAssignMines = function (mineCount) {
	var mineCoordinates = [];

	for (var i = 0; i < mineCount; i++) {
		var index = getRandomInteger(0, this.mCheckPointSet.length);

		var randomXCoordinate = this.mCheckPointSet[index][0];
		var randomYCoordinate = this.mCheckPointSet[index][1];
		var cell = randomXCoordinate + '*' + randomYCoordinate;
		while (mineCoordinates.includes(cell)) {
			var index = getRandomInteger(0, this.mCheckPointSet.length);
			var randomXCoordinate = this.mCheckPointSet[index][0];
			var randomYCoordinate = this.mCheckPointSet[index][1];
			var cell = randomXCoordinate + '*' + randomYCoordinate;
		}
		mineCoordinates.push(cell);
		this.board[cell].mined = true;
		this.mMineGray = new TextureObject(this.kMineGray, randomXCoordinate, randomYCoordinate, this.cellSize, this.cellSize);
		this.mMineGraySet.push(this.mMineGray);
	}
	// console.log(mineCoordinates);
	return this.board;
};

function getRandomInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

MyGame.prototype._calculateNeighborMineCounts = function (boardSize) {
	var cell;
	var neighborMineCount = 0;
	for (let x = this.startPoint; x < boardSize; x += this.cellSize) {
		for (let y = this.startPoint; y < boardSize; y += this.cellSize) {
			var id = x + '*' + y;
			cell = this.board[id];
			if (!cell.mined) {
				var neighbors = this._getNeighbors(id);
				neighborMineCount = 0;
				for (var i = 0; i < neighbors.length; i++) {
					neighborMineCount += this._isMined(neighbors[i]);
				}
				cell.neighborMineCount = neighborMineCount;
			}
		}
	}

	return this.board;
};

function getXY(id) {
	var slicePoint = id.indexOf('*');
	var xString = id.slice(0, slicePoint);
	var yString = id.slice(slicePoint + 1);
	var x = parseInt(xString);
	var y = parseInt(yString);

	return [x, y];
}

MyGame.prototype._getNeighbors = function (id) {
	// let x = getXY(id)[0];
	// let y = getXY(id)[1];
	let cell = this.board[id];
	let x = cell.x;
	let y = cell.y;

	var neighbors = [];
	var trueNeighbors = []

	neighbors.push((x - this.cellSize) + "*" + (y - this.cellSize));
	neighbors.push((x - this.cellSize) + "*" + y);
	neighbors.push((x - this.cellSize) + "*" + (y + this.cellSize));
	neighbors.push(x + "*" + (y - this.cellSize));
	neighbors.push(x + "*" + (y + this.cellSize));
	neighbors.push((x + this.cellSize) + "*" + (y - this.cellSize));
	neighbors.push((x + this.cellSize) + "*" + y);
	neighbors.push((x + this.cellSize) + "*" + (y + this.cellSize));

	for (var i = 0; i < neighbors.length; i++) {
		if (this.mCheckPointStarSet.indexOf(neighbors[i]) >= 0) {
			trueNeighbors.push(neighbors[i]);
		}
	};

	return trueNeighbors;
}

MyGame.prototype._isMined = function (id) {
	var cell = this.board[id];
	var mined = 0;
	if (typeof cell !== 'undefined') {
		mined = cell.mined ? 1 : 0;
	}
	return mined;
}
// -------------End Minesweeper Algorithm

// **** Minesweeper Click
MyGame.prototype._getClickedID = function () {
	if (this.mCamera.isMouseInViewport()) {
		var x = this.mCamera.mouseWCX();
		var y = this.mCamera.mouseWCY();
		for (let i = 0; i < this.mBgdSet.length; i++) {
			if (this.mBgdSet[i].getBBox().containsPoint(x, y)) {
				this.idX = this.mBgdSet[i].getXform().getXPos();
				this.idY = this.mBgdSet[i].getXform().getYPos();
				this.id = this.idX + "*" + this.idY;
			}
		}
	}
}

MyGame.prototype._handleLeftClick = function (id) {
	if (!this.gameOver) {
		let cell = this.board[id];
		if (!cell.opened) {
			if (!cell.flagged) {
				if (cell.mined) {
					this._loss();
				} else {
					cell.opened = true;
					cell.mineUnopenedImage.setVisibility(false);
					// this._checkNeighborZero(cell, id);
					if (cell.neighborMineCount === 0) {
						var neighbors = this._getNeighbors(id);
						for (var i = 0; i < neighbors.length; i++) {
							var neighbor = neighbors[i];
							if (
								typeof this.board[neighbor] !== 'undefined' &&
								!this.board[neighbor].flagged &&
								!this.board[neighbor].opened
							) {
								this._handleLeftClick(neighbor);
							}
						}
					}
					// if (this.minesRemaining === 0) {
					// 	window.alert('you win');
					// }
				}
			}
		}
	}
}



MyGame.prototype._handleRightClick = function (id) {
	if (!this.gameOver) {
		let cell = this.board[id];
		if (!cell.opened) {
			// console.log(this.minesRemaining);
			if (!cell.flagged && this.minesRemaining > 0) {
				cell.flagged = true;
				cell.flagImage.setVisibility(true);
				this.minesRemaining--;
			} else if (cell.flagged) {
				cell.flagged = false;
				cell.flagImage.setVisibility(false);
				this.minesRemaining++;
			}
		}
	}
}


MyGame.prototype._loss = function () {
	this.gameOver = true;
	this.mMineRed = new TextureObject(this.kMineRed, this.board[this.id].x, this.board[this.id].y, this.cellSize, this.cellSize);
	this.mMineUnopenedSet = [];
	this.mFlagSet = [];
	this.mCamera.shake(-2, -2, 20, 50);
	gEngine.AudioClips.playACue(this.failSound);
	
	document.getElementById('messageBox').textContent = 'Game Over';
	document.getElementById('messageBox').style.color = 'white';
	document.getElementById('messageBox').style.background = 'red';
	// setTimeout(location.reload(), 3000);
}
// ------------------ End Minesweeper Click

// ****** Minesweeper number
MyGame.prototype._getNumberColor = function (numberMsg) {
	var color = 'black';
	if (numberMsg === '1') {
		this.mMsg.setColor([0.6, 0.3, 0.5, 1]);
	} else if (numberMsg === '2') {
		this.mMsg.setColor([0.2, 1.0, 0.2, 1]);
	} else if (numberMsg === '3') {
		this.mMsg.setColor([0.2, 0.2, 1.0, 1]);
	} else if (numberMsg === '4') {
		this.mMsg.setColor([1.0, 0.2, 0.2, 1]);
	} else if (numberMsg === '5') {
		this.mMsg.setColor([1.0, 0.2, 1.0, 1]);
	} else if (numberMsg === '6') {
		this.mMsg.setColor([0.5, 0.2, 0.5, 1]);
	} else {
		this.mMsg.setColor([1.0, 1.0, 0.2, 1]);
	}
	return color;
}

MyGame.prototype._number = function () {
	let x = null;
	let y = null;
	for (let i = 0; i < this.mCheckPointStarSet.length; i++) {
		this.number = this.board[this.mCheckPointStarSet[i]].neighborMineCount;
		if (this.number !== 0) {
			this.numberMsg = this.number.toString();
		} else {
			this.numberMsg = '';
		}
		// console.log(this.number);

		// this.numberMsg = '1';
		this.mMsg = new FontRenderable(this.numberMsg);
		this._getNumberColor(this.numberMsg);
		x = this.board[this.mCheckPointStarSet[i]].x;
		y = this.board[this.mCheckPointStarSet[i]].y;
		this.mMsg.getXform().setPosition(x, y + 1);

		this.mMsg.setTextHeight(7);
		this.mMsgSet.push(this.mMsg);
	}
}

MyGame.prototype._setGame = function (boardSize, mineCount) {
	this.defaultStart += 1;
	this.boardSize = boardSize;
	this.cellSize = this.boardSize;
	this.mineCount = mineCount;
	this.minesRemaining = this.mineCount;
	this.startPoint = this.boardSize / 2;
	this.cameraPosition = [this.boardSize * this.boardSize / 2, this.boardSize * this.boardSize / 2];
	this.cameraWidth = this.boardSize * this.boardSize;
	// console.log(this.defaultStart);
}
// ---------- End Minesweeper number
