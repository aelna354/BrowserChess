$(document).ready(function (){
	setUpTiles()
});

function Tile(row, col)
{
	this.row = row
	this.col = col
	this.color = "lightbrown"
	if ((row + col) % 2 == 0)
		this.color = "darkbrown"
	this.piecekind = null
	this.piececolor = null
	this.highlighted = false
	this.sourcemark = false

	this.html = function()
	{
		target = "#row"+this.row+"col"+this.col
		$(target).attr("src", "images/"+this.color+".png")
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
		for (j = 1; j < 9; j++)
		{
			$("#row"+i).append("<td><img id='row"+i+"col"+j+"'/></td>")
			tiles[(i, j)] = new Tile(i, j)
			tiles[(i, j)].html()
		}
	}	
}