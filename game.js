
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
		let tile = document.createElement("div");
		tile.className = "tile";
		tile.style.left = (x[o] * SIZES.tilew) + "px";
		tile.style.top = (y[o] * SIZES.tileh) + "px";
		tile["gridX"] = x[o];
		tile["gridY"] = y[o];
		tile["rosette"] = type[o] == 1;
		tile["wheatTrackIndex"] = wheatTrackIndex[o];
		tile["barleyTrackIndex"] = barleyTrackIndex[o];
		tile["owner"] = "none";
		tile.onclick = function() { handleClick(tile); }
		DOM.root.appendChild(tile);
		DOM.tiles.push(tile);

		tile.under = document.createElement("img");
		tile.under.src = FILENAMES.tiles[type[o]];
		tile.appendChild(tile.under);

		tile.over = document.createElement("img");
		tile.over.className = "piece";
		tile.appendChild(tile.over);
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
	gameState.lastRolls = 1 + Math.floor(Math.random() * 15);
	gameState.lastRoll = 0;
	for (let n = gameState.lastRolls; n != 0; n >>= 1) gameState.lastRoll += n & 1;
	console.log(gameState.whoseTurn + ", " + gameState.lastRoll);
}

function handleClick(tile) {
	let player = gameState.whoseTurn;
	let opponent = getOpponent(player);
	let lastRoll = gameState.lastRoll;
	let waiting = gameState[player + "Waiting"];
	let trackIndex = tile[player + "TrackIndex"]
	let rear = getTrackTile(player, trackIndex - lastRoll);

	let atPlacePosition = ((trackIndex + 1) === lastRoll);
	let atMovePosition = rear && (rear.owner === player);
	let atFinishPosition = (trackIndex === (14 - lastRoll));

	if (atFinishPosition && tile.owner == player) {
		tile.owner = "none";
		tile.over.removeAttribute("src");
		++gameState[tile.owner + "Finished"];
		yieldTurn(opponent);
		return;
	}

	if (atPlacePosition && waiting > 0) {
		tile.owner = player;
		tile.over.src = FILENAMES[tile.owner];
		--gameState[tile.owner + "Waiting"];
		yieldTurn(tile.rosette ? player : opponent);
		return;
	}

	if (atMovePosition) {
		let capture = (tile.owner != "none");
		rear.owner = "none";
		rear.over.removeAttribute("src");
		tile.owner = player;
		tile.over.src = FILENAMES[tile.owner];
		if (capture) ++gameState[opponent + "Waiting"];
		yieldTurn(tile.rosette ? player : opponent);
		return;
	}
}

function getTrackTile(player, trackIndex) {
	if (trackIndex < 0 || trackIndex > 13) return null;
	for (let tile of DOM.tiles) {
		if (player === "wheat" && tile.wheatTrackIndex == trackIndex) return tile;
		if (player === "barley" && tile.barleyTrackIndex == trackIndex) return tile;
	}
}

function getOpponent(player) {
	if (player == "wheat") return "barley";
	if (player == "barley") return "wheat";
}

