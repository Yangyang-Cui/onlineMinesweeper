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
		this.mMsg.getXform().setPosition(x, y+1);

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
	console.log(this.defaultStart);
}
