tiles = {}
highlightedtiles = []
source = null
promoting = null
turn = 1
currentcolor = ""
state = 1
//for state: 1 means game hasn't started. 2 means waiting for turn player to pick the piece to move.
//3 means waiting for player to pick where it should move to. 4 means game has ended.
//5 means waiting for pawn promotion choice

document.addEventListener("DOMContentLoaded", function() { 
	setUpTiles()
	initBoard()
});

function $(id) //JQuery inspired, this is here for code readability.
{
	return document.getElementById(id)
}

function Tile(row, col) //OOP class for managing an individual tile, including the piece that is on it.
{
	this.row = row
	this.col = col
	this.color = "lightbrown"
	if ((row + col) % 2 == 0)
		this.color = "darkbrown"
	this.piecekind = ""
	this.piececolor = ""
	this.highlighted = false
	this.sourcemark = false
	this.id = "row" + row + "col" + col

	this.clear = function() //Marks the tile as unoccupied.
	{
		this.piecekind = ""
		this.piececolor = ""
		$(this.id).classList.remove(this.color)
		$(this.id).src = "images/" + this.color + ".png"
	}

	this.clear()

	this.placePiece = function(color, kind) //Places a piece on the tile.
	{
		this.piececolor = color
		this.piecekind = kind
		$(this.id).classList.add(this.color)
		$(this.id).src = "images/" + color + kind + ".png"
	}

	this.highlight = function() //Highlights the tile as a possible destination.
	{
		if (!this.highlighted)
		{
			this.highlighted = true
			if (!this.piecekind)
				$(this.id).src =  "images/orangeblank.png"
			else
				$(this.id).classList.add("orange")
		}
		else
		{
			this.highlighted = false
			if (!this.piecekind)
				$(this.id).src =  "images/" + this.color + ".png"
			else
				$(this.id).classList.remove("orange")
		}
	}

	this.sourcelight = function() //Marks tile as the one the user can now move the piece. Also used to mark the tile of a pawn about to be promoted.
	{
		if (!this.sourcemark)
		{
			this.sourcemark = true
			$(this.id).classList.add("blue")
		}
		else
		{
			this.sourcemark = false
			$(this.id).classList.remove("blue")
		}
	}
}

function setUpTiles() //creates the tiles and their corresponding html elements
{
	createPawnPromotion(0)
	for (i = 1; i < 9; i++)
	{
		$("board").innerHTML += "<tr id='row" + i + "'/>"
		for (j = 1; j < 9; j++)
		{
			$("row"+i).innerHTML += "<td> <img class='tile' onclick='clickTile(this.id)' id='row" + i + "col" + j + "'/></td>"
			tiles[i.toString() + j.toString()] = new Tile(i, j)
		}
	}
	createPawnPromotion(9)
	$("row9").style.display = "none"
	$("row0").style.display = "none"
}

function createPawnPromotion(ind) //creates the pawn promotion tiles
{
	color = "white"
	if (ind == 9)
		color = "black"
	promotes = ["queen", "bishop", "rook", "knight"]

	$("board").innerHTML += "<tr id='row" + ind + "'/>"
	for (i = 0; i < 4; i++)
	{
		index = promotes[i]
		$("row" + ind).innerHTML += "<td align='center' colspan='2'> <img onclick='runPawnPromotion(this.id)' class='promotetile' id='" + index + "'" +
		" src='images/" + color + index + ".png'/></td>"
	}
}

function runPawnPromotion(id)
{
	row = 0
	if (promoting.row == 8)
		row = 9
	state = 2
	promoting.placePiece(promoting.piececolor, id)
	$("row"+row).style.display = "none"
	promoting.sourcelight()
	promoting = null
}

function action() //The Start/Restart Game button
{
	if (state == 1)
	{
		$("actionbutton").textContent = "Restart Game"
		initGame()
	}
	else
	{
		if (confirm("Are you sure you'd like to restart the game?"))
		{
			if (state == 5)
			{
				$("row9").style.display = "none"
				$("row0").style.display = "none"
				promoting.sourcelight()
				promoting = null
			}
			initBoard()
			initGame()
		}
	}
}

function unhighlight() //Unhighlights all tiles.
{
	for (i = 0; i < highlightedtiles.length; i++)
		self.tiles[highlightedtiles[i]].highlight()
	highlightedtiles = []
}

function initGame() //Starts/restarts the game.
{
	turn = 1
	state = 2
	currentcolor = "white"
	$("gamestatus").textContent = "Current Turn: White"
	$("turncount").textContent = "Turn Count: 1"
}

function initBoard() //Creates/resets the board pieces.
{
	//empty spots in rows 3 to 6
	for (i = 3; i < 7; i++)
		for (j = 1; j < 9; j++)
			tiles[i.toString() + j.toString()].clear()

	for (i = 1; i < 9; i++) //pawns
	{
		tiles["2" + i.toString()].placePiece("black", "pawn")
		tiles["7" + i.toString()].placePiece("white", "pawn")
	}

	for (i = 2; i < 8; i+=5) //knights
	{
		tiles["1" + i.toString()].placePiece("black", "knight")
		tiles["8" + i.toString()].placePiece("white", "knight")
	}

	for (i = 1; i < 9; i+=7) //rooks
	{
		tiles["1" + i.toString()].placePiece("black", "rook")
		tiles["8" + i.toString()].placePiece("white", "rook")
	}

	for (i = 3; i < 7; i+=3) //bishops
	{
		tiles["1" + i.toString()].placePiece("black", "bishop")
		tiles["8" + i.toString()].placePiece("white", "bishop")
	}

	//kings and queens
	tiles["14"].placePiece("black", "king")
	tiles["15"].placePiece("black", "queen")
	tiles["84"].placePiece("white", "king")
	tiles["85"].placePiece("white", "queen")
}

function clickTile(p) //What happens when a tile is clicked.
{
	p = tiles[p.charAt(3) + p.charAt(7)]
	if (state == 2 && p.piececolor == currentcolor) //When turn player picks a piece to move
	{
		destinations = accessible(p)
		for (i = 0; i < destinations.length; i++)
		{
			tiles[destinations[i]].highlight()
			highlightedtiles.push(destinations[i])
		}
		if (highlightedtiles.length > 0)
		{
			p.sourcelight()
			state = 3
			source = p
		}
	}

	else if (state == 3 && p.piececolor == currentcolor) //When turn player opts to move a different piece
	{
		unhighlight()
		source.sourcelight()
		destinations = accessible(p)
		for (i=0; i < destinations.length; i++)
		{
			tiles[destinations[i]].highlight()
			highlightedtiles.push(destinations[i])
		}
		if (highlightedtiles.length > 0)
		{
			source = p
			source.sourcelight()
		}
		else
			state = 2
	}

	else if (state == 3 && p.highlighted) //When turn player has picked the destination tile
	{
		victory = false
		if (p.piecekind == "king")
			victory = true
		source.sourcelight()
		p.placePiece(source.piececolor, source.piecekind)
		source.clear()
		source = null
		state = 2
		unhighlight()
		turn++
		$("turncount").textContent = "Turn Count: " + turn

		if (currentcolor == "white")
		{
			currentcolor = "black"
			$("gamestatus").textContent = "Current Turn: Black"
		}

		else
		{
			currentcolor = "white"
			$("gamestatus").textContent = "Current Turn: White"
		}

		if (!victory && p.piecekind == "pawn" && (p.row == 8 || p.row == 1)) //promote pawn
		{
			promotePawn(p)
		}

		if (victory)
		{
			state = 4
			winner = "Winner: White"
			if (p.piececolor == "black")
				winner = "Winner: Black"
			$("gamestatus").textContent = winner

			//Without this timer the alert prompt comes before the css changes... don't ask me :(
			setTimeout(function () { 
			alert("Congratulations! The player controlling the " + p.piececolor + " pieces has won the game.") }, 1)
		}
	}

}

function promotePawn(p)
{	
	row = 0
	if (p.row == 8)
		row = 9		
	p.sourcelight()
	state = 5
	actionbutton
	$("row" + row).style.display = "table-row"
	promoting = p
}

//Given a row and column index, determine the status of this tile (if it exists or is accessible).
//If it doesn't exist, or if it is occupied by a piece of the same color, return 1.
//If it is unoccupied, return 2.
//If it is occupied by a piece of the opposing color, return 3.
function goodTile(r, c) 
{
	if (r > 8 || r < 1 || c > 8 || c < 1)
		return 1
	tile = tiles[r.toString() + c.toString()]
	if (tile.piececolor == currentcolor)
		return 1
	if (!tile.piececolor)
		return 2
	return 3
}

function accessible(p) //Given a tile and the kind of piece that is on it, calculate all of the tiles that can be accessed from it.
{
	r = p.row
	c = p.col
	color = p.piececolor
	kind = p.piecekind

	targets = []
	if (kind == "king")
	{
		for (i = -1; i < 2; i++)
			for (j = -1; j < 2; j++)
				if (i !=0 || j!=0)
				{
					//i represents change in row, j represents change in column.
					//(0, 0) set aside, these are all of the adjacent pieces, which are the king's possible movements.
					a = r + i
					b = c + j
					if (goodTile(a, b, color) != 1)
						targets.push(a.toString() + b.toString())
				}
		return targets
	}

	if (kind == "knight")
	{
		rowchange = [2, 2, -2, -2, 1, 1, -1, -1]
		colchange = [1, -1, 1, -1, 2, -2, 2, -2]
		for (i = 0; i < 8; i++)
		{
			//The indices of row and colchange correspond to each other.
			//0 represents moving down 2 rows and right one column, 7 is up 1 rows and left 2 columns
			a = r + rowchange[i]
			b = c + colchange[i]
			if (goodTile(a, b, color) != 1)
				targets.push(a.toString() + b.toString())
		}
		return targets
	}

	if (kind == "pawn")
	{
		//change is the direction pawn moves (for black, it's 1 row downards which is +1 to row, white is 1 row up which is -1)
		//twospotsrow is the row to be on to be able to move two tiles, twospotsmove is which row that is
		change = 1
		twospotsrow = 2
		twospotsmove = 4 //the row 2 spaces ahead
		if (color == "white")
		{
			change = -1
			twospotsrow = 7
			twospotsmove = 5
		}
		s = goodTile(r + change, c, color)
		if (s > 1)
			targets.push((r+ change).toString() + c.toString())
		if (s == 2 && r == twospotsrow && goodTile(twospotsmove, c, color) != 1)
			targets.push(twospotsmove.toString() + c.toString())
		return targets
	}

	if (kind == "rook" || kind == "queen")
	{
		dirs = [true, true, true, true]
		for (i = 1; i < 9; i++)
		{
			//dirs, rowchange and colchange variables correspond to the directions; up, down, left and right.
			//The purpose of the dirs array is to mark where we find an obstruction that we can't jump over.
			//We can mark the dirs index corresponding to that direction as false, so we know not to count it in the future.
			rowchange = [r-i, r+i, r, r]
			colchange = [c, c, c-i, c+i]
			for (j = 0; j < 4; j++)
			{
				if (!dirs[j]) //if an obstruction was found earlier for this direction, automatically exit
					continue
				s = goodTile(rowchange[j], colchange[j], color)
				if (s == 1) //if a piece of the same color is there, ignore any more pieces in this direction
					dirs[j] = false
				else if (s == 2) //if the tile is unoccupied, add it
					targets.push(rowchange[j].toString() + colchange[j].toString())
				else //if a piece of the opposing color is there, add that piece, but don't add any more pieces in this direction (queen/rook don't jump over)
				{
					targets.push(rowchange[j].toString() + colchange[j].toString())
					dirs[j] = false
				}
			}
		}
	}

	if (kind == "queen" || kind == "bishop") //the idea here is the same as above. Only difference is that rowchange and colchange are modified to represent diagonal movements
	{
		dirs = [true, true, true, true]
		for (i = 1; i < 9; i++)
		{
			rowchange = [r-i, r-i, r+i, r+i]
			colchange = [c-i, c+i, c-i, c+i]
			for (j = 0; j < 4; j++)
			{
				if (!dirs[j])
					continue
				s = goodTile(rowchange[j], colchange[j], color)
				if (s == 1)
					dirs[j] = false
				else if (s == 2)
					targets.push(rowchange[j].toString() + colchange[j].toString())
				else
				{
					targets.push(rowchange[j].toString() + colchange[j].toString())
					dirs[j] = false
				}
			}
		}
	}
	return targets
}