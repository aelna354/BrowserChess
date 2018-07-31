$(document).ready(function (){
	setUpTiles()
});

function Tile(row, col)
{
	this.row = row
	this.col = col
	this.piecekind = null
	this.piececolor = null
	this.highlighted = false
	this.sourcemark = false
	this.color = "grey"
	if ((row + col) % 2 == 0)
		this.color = "white"

	this.html = function()
	{
		string = "<td><img src='images/"
		if (this.piecekind==null)
			string += this.color + "blank"
		else
			string += this.piececolor + this.piecekind
		string += ".png' class='tile "+this.color+"'></td>"
		return string
	}

	this.clear = function()
	{
		this.piecekind = null
		this.piececolor = null
		return this.html()
	}

	this.placePiece = function(kind, color)
	{
		this.piecekind = kind
		this.piececolor = color
		return this.html()
	}
}

function setUpTiles()
{
	tiles = {}
	for (i = 1; i < 9; i++)
	{
		$("table").append("<tr id='row"+i+"'></tr7>")
		for (j = 1; j < 9; j++)
		{
			tiles[(i, j)] = new Tile(i, j)
			b = tiles[(i, j)].html()
			console.log(b)
			$("#row"+i).append(b)
		}
	}	
}


