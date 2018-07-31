tiles = {}

$(document).ready(function (){
	setUpTiles()
	$(document).on("click", ".tile", function()
	{
		id = $(this).attr('id')
		tiles[(id.charAt(3), id.charAt(7))].change()
	})
	console.log(
	tiles[(3, 4)].id
	)
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
	console.log(this.id)

	this.clear = function()
	{
		this.piecekind = null
		this.piececolor = null
		$(this.id).attr("src", "images/"+this.color+".png")
	}

	this.clear()

	this.change = function()
	{
		console.log(this.id)
		//$(this.id).attr("src", "images/orangeblank.png")
		// c = "darkbrown"
		// if (this.color == "darkbrown")
		// 	c = "lightbrown"
		// c = "images/"+c+".png"
		// $(this.id).attr("src", c)
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
			tiles[(i, j)] = new Tile(i, j)
		}
	}
}