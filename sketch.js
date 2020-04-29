/*
    Class Initialization
*/

class Plant{
    // fruit state = seed -> bushed -> blossom -> green-fruit -> red-fruit/harvestable -> dropped
    // water reserve = stores a max of 3 units anything, above 3 unit of water will damage the plant
    // plant state = green(health) -> yellow -> brown -> black(died)
    // each non-rain day will consume one water reserve.
    constructor() {
        //assuming there is only one fruit type to make it easier
        this.plant_state = "green";
        this.fruit_state = "seed";
        this.water_reserve = 0;
    }

}

class Barn{
    // unlimited seed
    // unlimited fertilizer
    // unlimited smudge pots
    // unlimited soap
    constructor(row, col){
        this.water_amount = 0;
        //this.seed_amount = 0;
        //this.fertilizer_amount = 0;
        //this.smudge_pots = 0;
        //this.soap_amount = 0;
        this.apple_amount = 0;
        this.berry_amount = 0;
        this.corn_amount = 0;
        this.row = row;
        this.col = col;
    }
}

class Farmzoid{
    constructor(row, col, carried_supplied){
        this.row = row;
        this.col = col;
        this.carried_supplied = carried_supplied;
    }
}

// Used to add into the Grid
class Cell{
    constructor(traversable, tileType, row, col) {
        this.traversable = traversable;
        this.tileType = tileType;
        this.row = row;
        this.col = col;
    }
}

class Grid {
    constructor(rows, cols, path) {
        this.rows = rows;
        this.cols = cols;
        this.contents = []; // initialize the rows

        // Populate the Grid with walls and paths
        for(let row = 0; row < this.rows; row++) {
            this.contents[row] = []; // initialize the column 
            for(let col = 0; col < this.cols; col++) {
                // Tile is grass
                if(path[row][col] == 0) 
                {
                    this.contents[row][col] = new Cell(true, cellType.Grass, row, col);
                } 
                // Tile is a barn
                else if(path[row][col] == 1)
                {
                    barn = new Barn(row, col);
                    this.contents[row][col] = new Cell(true, cellType.Barn, row, col);
                }
                // Tile is a river
                else if(path[row][col] == 2) 
                { 
                    this.contents[row][col] = new Cell(false, cellType.River, row, col);
                }
                // Tile is a bridge
                else if(path[row][col] == 3)
                {
                    this.contents[row][col] = new Cell(true, cellType.Bridge, row, col);
                }
                // Tile is a mine
                else if(path[row][col] == 4)
                {
                    this.contents[row][col] = new Cell(false, cellType.Mine, row, col);
                }
                // Tile where the farmzoid will initially start.
                else if(path[row][col] == cellType.Farmzoid)
                {
                    this.contents[row][col] = new Cell(true, cellType.Grass, row, col);
                    farmzoids.push(new Farmzoid(row, col));
                }
            }
        }
    }
}

/*
    Variable Initialization
*/

const cellType = {
    Grass: 0,
    Barn: 1,
    River: 2,
    Bridge: 3,
    Mine: 4,
    Farmzoid: 5
};

// Dimmensions
let num_rows = 40;
let num_cols = 40;
let cell_size = 20;

var barn;
var plants = [];
var farmzoids = [];
var move_counter = 0;
var day_counter = 0;

// Grass = 0, Barn = 1, River = 2, Bridge = 3, Mine = 4, Farmzoid = 5
let path = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 5, 0, 5, 0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let grid = new Grid(num_rows, num_cols, path);


// Sets up the parameters and logic
function setup() {
    print("Set up is only called once");
    createCanvas(num_cols*cell_size, num_rows*cell_size);
    frameRate(3);
    // Colors
    outline_color = color(255, 255, 255); // white
    mine_area_color = color(0, 0, 0); // black
    grass_color = color(19, 133, 16); // green
    river_color = color(0, 0, 255); //blue
    bridge_color = color(136, 140, 141); // stone gray
    barn_color = color(101, 67, 33); // dark brown
    error_color = color(255, 0, 0);
    farmzoid_color = color(255, 255, 255); // white
}

function draw() { 
    background(0);
    // Draw the Grid: River, Grass, Bridge, Barn, Mine
    DrawGrid();
    CheckIfNewDay();
    // draw farmzoid
    MoveFarmzoids();
    DrawFarmzoids();

    move_counter += 1;

} 

function CheckIfNewDay()
{
    if(move_counter >= 40)
    {
        day_counter += 1;
        move_counter = 0;
        ChangeWeather();
    }
}

/* Place to randomize weather conditions */
function ChangeWeather()
{

}
/* Move Farmzoids will hold D-TREE logic */
function MoveFarmzoids()
{
    for(i = 0; i < farmzoids.length; i++)
    {
        // D-TREE logic can go here
        // Check farmzoids surroundings
        // Depending on what farmzoid is carrying it will find the plant that needs attention.
        farmzoids[i].col += 1;
    }
}

/* Draw all the Farmzoids on the Canvas */
function DrawFarmzoids()
{
    stroke(0);
    for(i = 0; i < farmzoids.length; i++){
        fill(farmzoid_color);
        col = farmzoids[i].col;
        row = farmzoids[i].row;
        circle(col*cell_size+(cell_size/2), (row*cell_size)+(cell_size/2), cell_size);
    }
}

/* Draw the Grass, River, Bridges, Mines, and Barn */
function DrawGrid()
{
    // Draw the grid
    stroke(outline_color); // set outlines to white
    for(row = 0; row < num_rows; row++) {
        for(col = 0; col < num_cols; col++) {
            current_cell = grid.contents[row][col];
            if(current_cell.tileType == cellType.Grass) {
                fill(grass_color);
                square(col*cell_size, row*cell_size, cell_size);
            }
            if(current_cell.tileType == cellType.Barn) {
                fill(barn_color);
                barn = new Barn();
                square(col*cell_size, row*cell_size, cell_size);
            }
            if(current_cell.tileType == cellType.River) {
                fill(river_color);
                square(col*cell_size, row*cell_size, cell_size);
            }
            if(current_cell.tileType == cellType.Bridge) {
                fill(bridge_color);
                square(col*cell_size, row*cell_size, cell_size);
            }
            if(current_cell.tileType == cellType.Mine) {
                fill(mine_area_color);
                square(col*cell_size, row*cell_size, cell_size);
            } 
        }
    }
}

/*
Move each farmzoids (x40)
if moved 40 times:
    increment the day
    change weather type
    depending on weather type update the plants status
    reset the move amount
*/