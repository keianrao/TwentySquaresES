
const DOM = {
	root: document.getElementById("root"),
	tiles: [],
	dice: undefined,
	waitingWheat: undefined,
	waitingBarley: undefined,
	finishedWheat: undefined,
	finishedBarley: undefined
};

const FILENAMES = {
	background: "background.png",
	wheat: "wheat.png",
	barley: "barley.png",
	tiles: [ "plainTile.png", "rosetteTile.png" ],
	diceUp: "diceup.png",
	diceDown: "dicedown.png"
};

const SIZES = {
	tilew: 64, tileh: 64
};

let gameState = {
	whoseTurn: undefined,
	lastRolls: undefined,
	lastRoll: undefined,
	wheatFinished: undefined,
	barleyFinished: undefined,
	wheatWaiting: undefined,
	barleyWaiting: undefined
};

//  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //

function initialiseDOM() {
	let x = [
		0, 1, 2, 3, 6, 7,
		0, 1, 2, 3, 4, 5, 6, 7,
		0, 1, 2, 3, 6, 7
	];
	let y = [
		0, 0, 0, 0, 0, 0,
		1, 1, 1, 1, 1, 1, 1, 1,
		2, 2, 2, 2, 2, 2
	];
	let type = [
		1, 0, 0, 0, 1, 0,
		0, 0, 0, 1, 0, 0, 0, 0,
		1, 0, 0, 0, 1, 0
	];
	let wheatTrackIndex = [
		-1, -1, -1, -1, -1, -1,
		4, 5, 6, 7, 8, 9, 10, 11,
		3, 2, 1, 0, 13, 12
	];
	let barleyTrackIndex = [
		3, 2, 1, 0, 13, 12,
		4, 5, 6, 7, 8, 9, 10, 11,
		-1, -1, -1, -1, -1, -1
	];
	for (let o = 0; o < 20; ++o) {
		let tile = document.createElement("img");
		tile.className = "tile";
		tile.src = FILENAMES.tiles[type[o]];
		tile.style.left = (x[o] * SIZES.tilew) + "px";
		tile.style.top = (y[o] * SIZES.tileh) + "px";
		tile["gridX"] = x[o];
		tile["gridY"] = y[o];
		tile["rosette"] = type[o] == 1;
		tile["wheatTrackIndex"] = wheatTrackIndex[o];
		tile["barleyTrackIndex"] = barleyTrackIndex[o];
		tile.onclick = function() { handleClick(tile); }
		DOM.root.appendChild(tile);
		DOM.tiles.push(tile);
	}
}

function initialiseGame() {
	gameState.wheatWaiting = 6;
	gameState.barleyWaiting = 6;
	gameState.wheatFinished = 0;
	gameState.barleyFinished = 0;
	yieldTurn("wheat");
};

initialiseDOM();
initialiseGame();

//  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //

function yieldTurn(nextPlayer) {
	gameState.whoseTurn = nextPlayer;
	gameState.lastRolls = Math.floor(Math.random() * 16);
	gameState.lastRoll = 0;
	for (let n = gameState.lastRolls; n != 0; n >>= 1) gameState.lastRoll += n & 1;
	console.log(gameState);
}

function handleClick(tile) {
	console.log({
		gridX: tile.gridX,
		gridY: tile.gridY,
		rosette: tile.rosette,
		wheatTrackIndex: tile.wheatTrackIndex,
		barleyTrackIndex: tile.barleyTrackIndex
	});
}

