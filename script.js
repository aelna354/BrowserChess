tiles = {}

$(document).ready(function (){
	setUpTiles()
	$(document).on("click", ".tile", function()
	{
		id = $(this).attr('id')
		tiles[id.charAt(3) + id.charAt(7)].change()
	})
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
	this.id = "#row"+row+"col"+col

	this.clear = function()
	{
		this.piecekind = null
		this.piececolor = null
		$(this.id).attr("src", "images/"+this.color+".png")
	}

	this.clear()

	this.change = function()
	{
		$(this.id).attr("src", "images/blackpawn.png")
		$(this.id).addClass("darkbrown")
	}

	this.placePiece = function(kind, color)
	{
		this.piecekind = kind
		this.piececolor = color
	}
}

function setUpTiles()
{
	for (i = 1; i < 9; i++)
	{
		$("table").append("<tr id='row"+i+"'/>")
		for (j = 1; j < 9; j++)
		{
			$("#row"+i).append("<td><img class='tile' id='row"+i+"col"+j+"'/></td>")
			console.log((i, j))
			tiles[i.toString() + j.toString()] = new Tile(i, j)
		}
	}
}