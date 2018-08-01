tiles = {}, highlighted = [], source = null, state = 1, turn = 1

$(document).ready(function (){
	setUpTiles()
	initBoard()
	// $(document).on("click", ".tile", function()
	// {
	// 	id = $(this).attr('id')
	// 	tiles[id.charAt(3) + id.charAt(7)].change()
	// })
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
		$(this.id).removeClass(this.color)
		this.piecekind = ""
		this.piececolor = ""
		$(this.id).attr("src", "images/"+this.color+".png")
	}

	this.clear()

	this.placePiece = function(color, kind)
	{
		$(this.id).addClass(this.color)
		this.piecekind = kind
		this.piececolor = color
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