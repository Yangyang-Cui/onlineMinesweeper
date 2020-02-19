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
	$('#messageBox').text('Game Over').css({
		color: 'white',
		'background-color': 'red'
	});
}
