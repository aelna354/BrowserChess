tiles = {}, highlightedtiles = [], source = null, state = 1, turn = 1, currentcolor = ""

$(document).ready(function (){
	setUpTiles()
	initBoard()
	$("#pawnpromote").hide()
	$(document).on("click", "#actionbutton", function(){action()})
	$(document).on("click", ".tile", function()
	{
		id = $(this).attr('id')
		clickTile(id.charAt(3) + id.charAt(7))
	})
});

function Tile(row, col)
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
	this.id = "#row"+row+"col"+col

	this.clear = function()
	{
		this.piecekind = ""
		this.piececolor = ""
		$(this.id).removeClass(this.color)
		$(this.id).attr("src", "images/"+this.color+".png")
	}

	this.clear()

	this.placePiece = function(color, kind)
	{
		this.piecekind = kind
		this.piececolor = color
		$(this.id).addClass(this.color)
		$(this.id).attr("src", "images/" + color + kind + ".png")
	}

	this.highlight = function()
	{
		if (!this.highlighted)
		{
			this.highlighted = true
			if (!this.piecekind)
				$(this.id).attr("src", "images/orangeblank.png")
			else
				$(this.id).addClass("orange")
		}
		else
		{
			this.highlighted = false
			if (!this.piecekind)
				$(this.id).attr("src", "images/" + this.color + ".png")
			else
				$(this.id).removeClass("orange")
		}
	}

	this.sourcelight = function()
	{
		if (!this.sourcemark)
		{
			this.sourcemark = true
			$(this.id).addClass("blue")
		}
		else
		{
			this.sourcemark = false
			$(this.id).removeClass("blue")
		}
	}
}

function setUpTiles()
{
	for (i = 1; i < 9; i++)
	{
		$("#board").append("<tr id='row"+i+"'/>")
		for (j = 1; j < 9; j++)
		{
			$("#row"+i).append("<td><img class='tile' id='row"+i+"col"+j+"'/></td>")
			tiles[i.toString() + j.toString()] = new Tile(i, j)
		}
	}
}

function action()
{
	if (state == 1)
	{
		$("#actionbutton").text("Restart Game")
		initGame()
	}
	else
	{
		if (confirm("Are you sure you'd like to restart the game?"))
		{
			unhighlight()
			initBoard()
			initGame()
		}
	}
}

function initGame()
{
	turn = 1
	$("#gamestatus").text("Current Turn: White")
	state = 2
	currentcolor = "white"
}

function initBoard()
{
	for (i = 3; i < 7; i++)
		for (j = 1; j < 9; j++)
			tiles[i.toString() + j.toString()].clear()
	for (i = 1; i < 9; i++)
	{
		tiles["2" + i.toString()].placePiece("black", "pawn")
		tiles["7" + i.toString()].placePiece("white", "pawn")
	}
	for (i=2; i<8; i+=5) //2 and 7
	{
		tiles["1" + i.toString()].placePiece("black", "knight")
		tiles["8" + i.toString()].placePiece("white", "knight")
	}
	for (i=1; i<9; i+=7) //1 and 8
	{
		tiles["1" + i.toString()].placePiece("black", "rook")
		tiles["8" + i.toString()].placePiece("white", "rook")
	}
	for (i=3; i<7; i+=3)
	{
		tiles["1" + i.toString()].placePiece("black", "bishop")
		tiles["8" + i.toString()].placePiece("white", "bishop")
	}
	tiles["14"].placePiece("black", "king")
	tiles["15"].placePiece("black", "queen")
	tiles["84"].placePiece("white", "king")
	tiles["85"].placePiece("white", "queen")
}

function unhighlight()
{
	for (i = 0; i < highlightedtiles.length; i++)
		self.tiles[highlightedtiles[i]].highlight()
	highlightedtiles = []
}

function clickTile(index)
{
	p = tiles[index]
	if (state == 2 && p.piececolor == currentcolor)
	{
		destinations = accessible(p)
		for (i=0; i < destinations.length; i++)
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
	else if (state == 3)
	{
		if (p.highlighted)
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
			$("#turncount").text("Turn Count: " + turn)
			if (currentcolor == "white")
			{
				currentcolor = "black"
				$("#gamestatus").text("Current Turn: Black")
			}
			else
			{
				currentcolor = "white"
				$("#gamestatus").text("Current Turn: White")
			}
			if (!victory && p.piecekind == "pawn" && (p.row == 8 || p.row == 1))
			{
				promotePawn()
			}
			if (victory)
			{
				setTimeout(function () { //Without this timer the alert prompt comes before the css changes
				state = 4
				$("#gamestatus").text("Winner: " + p.piececolor)
				alert("Congratulations! The player controlling the " + p.piececolor + "pieces has won the game.") }, 1)
			}
		}
		else if (p.piececolor == currentcolor)
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
	}
}

function promotePawn(p)
{
	p.sourcelight()
	state = 5
	$("#pawnpromote").show()
	$(".promotion").on("click", function()
	{
		p.placePiece(p.piececolor, $(this).text.toLowerCase())
		$("#pawnpromote").hide()
		p.sourcelight()
	})
}

function goodTile(r, c, piececolor)
{
	if (r > 8 || r < 1 || c > 8 || c < 1)
		return 1
	if (tiles[r.toString() + c.toString()].piececolor == currentcolor)
		return 1
	if (tiles[r.toString() + c.toString()].piececolor == "")
		return 2
	else
		return 3
}

//Calculates accessible tiles from a certain spot.
function accessible(p)
{
	r = p.row
	c = p.col
	color = p.piececolor

	targets = []
	if (p.piecekind == "king")
	{
		for (i = -1; i < 2; i++)
			for (j = -1; j < 2; j++)
				if (i !=0 || j!=0)
				{
					a = r + i
					b = r + j
					if (goodTile(a, b, color) != 1)
						targets.push(a.toString() + b.toString())
				}
		return targets
	}
	if (p.piecekind == "knight")
	{
		rowchange = [2, 2, -2, -2, 1, 1, -1, -1]
		colchange = [1, -1, 1, -1, 2, -2, 2, -2]
		for (i = 0; i < 8; i++)
		{
			a = r + rowchange[i]
			b = c + colchange[i]
			if (goodTile(a, b, color) != 1)
				targets.push(a.toString() + b.toString())
		}
		return targets
	}
	if (p.piecekind == "pawn")
	{
		for (i = 1; i < 9; i++)
			for (j = 1; j < 9; j++)
				targets.push(i.toString() + j.toString())
		return targets
		if (color == "black")
		{
			s = goodTile(r+1, c, color)
			if (s > 1)
				targets.push((r+1).toString() + c.toString())
			if (s == 2 && r == 2 && goodTile(r+2, c, color) > 1)
				targets.push((r+2).toString() + c.toString())
		}
		else
		{			
			s = goodTile(r-1, c, color)
			if (s > 1)
				targets.push((r-1).toString() + c.toString())
			if (s == 2 && r == 7 && goodTile(r-2, c) > 1)
				targets.push((r-2).toString() + c.toString())
		}
		return targets
	}
	if (p.piecekind == "rook" || p.piecekind == "queen")
	{
		dirs = [true, true, true, true]
		for (i = 1; i < 9; i++)
		{
			rowchange = [r-i, r+i, r, r]
			colchange = [c, c, c-i, c+i]
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
	if (p.piecekind == "queen" || p.piecekind == "bishop")
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