/*
    Class Initialization
*/

class Plant{
    // fruit state = seed -> bushed -> blossom -> green-fruit -> red-fruit/harvestable -> dropped
    // water reserve = stores a max of 3 units anything, above 3 unit of water will damage the plant
    // plant state = green(health) -> yellow -> brown -> black(died)
    // each non-rain day will consume one water reserve.
    constructor(row, col, plant_type = plantType.Apple) {
        //assuming there is only one fruit type to make it easier
        this.plant_type = plant_type;
        this.plant_state = plantState.Flowering;
        this.plant_color = green_plant_color;
        this.fertilized = false;
        this.water_reserve = 1;
        this.blight = false;
        this.protected_from_cold = false;
        this.cold_issues = false;
        this.row = row;
        this.col = col;
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
    constructor(row, col, carried_supply, grid){
        this.row = row;
        this.col = col;
        this.carried_supply = carried_supply;
        this.grid = grid;

        // pathfinding variables
        this.goal_row = row;
        this.goal_col = col;
        this.open_list = [grid.contents[this.row][this.col]]; // a list of cells
        this.closed_list = []; // a list of cells
    }

    set_pathfinding_target(row, col) {
        this.goal_row = row;
        this.goal_col = col;
        this.open_list = [grid.contents[this.row][this.col]];
        this.closed_list = []; // a list of cells
    }

    pathfinding_move_one() {
        BestFSOneIteration(this.open_list, this.closed_list, this.grid, this.goal_row, this.goal_col);
        this.col = open_list[open_list.length - 1].col;
        this.row = open_list[open_list.length - 1].row;
    }
}

// Used to add into the Grid
class Cell{
    constructor(traversable, tileType, row, col, plantable) {
        this.traversable = traversable;
        this.plantable = plantable;
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
                    this.contents[row][col] = new Cell(true, cellType.Grass, row, col, true);
                } 
                // Tile is a barn
                else if(path[row][col] == 1)
                {
                    barn = new Barn(row, col);
                    this.contents[row][col] = new Cell(true, cellType.Barn, row, col, false);
                }
                // Tile is a river
                else if(path[row][col] == 2) 
                { 
                    this.contents[row][col] = new Cell(false, cellType.River, row, col, false);
                }
                // Tile is a bridge
                else if(path[row][col] == 3)
                {
                    this.contents[row][col] = new Cell(true, cellType.Bridge, row, col, false);
                }
                // Tile is a mine
                else if(path[row][col] == 4)
                {
                    this.contents[row][col] = new Cell(false, cellType.Mine, row, col, false);
                }
                // Tile where the farmzoid will initially start.
                else if(path[row][col] == 5)
                {
                    this.contents[row][col] = new Cell(true, cellType.Grass, row, col, true);
                    farmzoids.push(new Farmzoid(row, col, carriedSupply.SEED, this));
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

const plantType = {
    Corn: "corn",
    Apple: "apple",
    Berry: "berry"
}

const plantState = {
    Flowering: 1,
    Green: 2,
    Red: 3,
    NONE: 0
}

const carriedSupply = {
    SEED: "seed",
    FERTILIZER: "fertilizer",
    SMUDGEPOTS: "smudge_pots",
    SOAP: "soap",
    WATER: "water",
    HARVEST: "harvest"
}

// Dimmensions
let num_rows = 40;
let num_cols = 40;
let cell_size = 20;

var barn;
var plants = [];
var max_plants = 100; // determine how many plants that can be placed onto the farm for maintainability
var farmzoids = [];
var move_counter = 0;
var day_counter = 0;
var windy = false;
var wind_direction = ''; // N, S, E, or W
var rainy = false
var cloudy = false;
var cold_snap = 0; // days remaning in cold snap, 0 for no current cold snap

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
    [0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let grid = new Grid(num_rows, num_cols, path);

// Sets up the parameters and logic
function setup() {
    createCanvas(num_cols*cell_size, num_rows*cell_size);
    frameRate(3);
    // Colors
    outline_color = color(255, 255, 255); // white
    mine_area_color = color(0, 0, 0); // black
    grass_color = color(19, 133, 16); // green
    river_color = color(0, 0, 255); //blue
    bridge_color = color(136, 140, 141); // stone gray
    barn_color = color(101, 67, 33); // dark brown
    //error_color = color(255, 0, 0);
    farmzoid_color = color(255, 255, 255); // white
    flowering_color = color(219, 232, 59);
    green_plant_color = color(32, 183, 31);
    red_plant_color = color (255, 0, 0);
    none_plant_color = color(0, 0, 0);

    // colors for new day plants
    //green_plant_color = color(32, 183, 31);
    yellow_plant_color = color(241, 245, 39);
    brown_plant_color = color(97, 69, 25);
    dead_plant_color = color(43, 42, 39);

    RunFMS();
}

function draw() { 
    background(0);
    /* Draw the Grid: River, Grass, Bridge, Barn, Mine */
    DrawGrid();
    DrawPlants();
    /* Ideally, Nature, FSM, then zoids run */
    CheckIfNewDay();

    /* Draw farm zoids */
    ActionFarmzoid();
    MoveFarmzoids();
    DrawFarmzoids();
    move_counter += 1;
} 

function CheckIfNewDay()
{
    if(move_counter >= 40)
    {
        dayCount.innerText = "Day " + day_counter
        isNewDay = true;
        day_counter += 1;
        move_counter = 0;
        checkForDyingPlants();
        ChangeWeather();
        RunFMS();
        print('farmzoid 1 is carrying: ' + farmzoids[0].carried_supply);
        print('farmzoid 2 is carrying: ' + farmzoids[1].carried_supply);
        print('farmzoid 3 is carrying: ' + farmzoids[2].carried_supply);
        print('farmzoid 4 is carrying: ' + farmzoids[3].carried_supply);
    }
}

/* Place to randomize weather conditions */
function ChangeWeather()
{
    // used to show weather in html, adds all weather conditions for that day
    var weatherAnnouncement = '';
    var yesterday_cloudy = cloudy;
    var yesterday_rainy = rainy;

    // Check weather
    if(Math.random() < 0.1) {
        // Cloudy day
        console.log('Cloudy day');
        weatherAnnouncement += "Cloudy "
        cloudy = true;
        rainy = false;
        if(Math.random() < 0.5) {
            // Rainy day
            console.log('Rainy day');
            weatherAnnouncement += "Rainy "
            rainy = true;
            for(plant of plants) {
                // Increase water
                plant.water_reserve = plant.water_reserve + 1;
            }
        } else {
            for(plant of plants) {
                // No rain, decrease water
                plant.water_reserve = plant.water_reserve - 1;
            }
        }
    } else {
        cloudy = false;
        rainy = false;
    }

    // Cold snap effects
    if(cold_snap > 0) {
        for(plant of plants) {
            if(!plant.protected_from_cold) {
                plant.cold_issues = true;
            }
        }

        cold_snap = cold_snap - 1;
    } else {
        for(plant of plants) {
            plant.cold_issues = false;
        }
    }

    // Cold snap initiation
    if(yesterday_cloudy || yesterday_rainy) {
        if(Math.random() < 0.5) {
            // Cold snap
            console.log('Cold snap start');
            weatherAnnouncement += "Cold snap start "
            cold_snap = 2;
        }
    }

    // Blight
    for(plant of plants) {
        if(Math.random < 0.02) {
            // Plant is blighted
            plant.blight = true;
        }
    }

    // Wind
    if(Math.random() < 0.3) {
        // Windy day
        windy = true;
        var wind_direction = Math.random();
        if(wind_direction < 0.25) {
            // North
            console.log('Windy day, N');
            weatherAnnouncement += "Windy (N) "
            wind_direction = 'N';
        } else if(wind_direction < 0.5) {
            // South
            console.log('Windy day, S');
            weatherAnnouncement += "Windy (S) "
            wind_direction = 'S';
        } else if(wind_direction < 0.75) {
            // East
            console.log('Windy day, E');
            weatherAnnouncement += "Windy (E) "
            wind_direction = 'E';
        } else {
            // West
            console.log('Windy day, W');
            weatherAnnouncement += "Windy (W) "
            wind_direction = 'W';
        }
    } else {
        windy = false;
        wind_direction = '';
    }

    // shows 'clear' if other weather conditions don't come up
    if (weatherAnnouncement == ''){
        weatherAnnouncement = "Clear"
    }

    currWeather.innerText = "Current Weather Conditions: " + weatherAnnouncement
}

/* This will check what state the weather it is in. FMS can learn
what plant needs by running a decision tree, to classify the plant's current needs. The classification
should then be used to run a rule to determine what tasks need to be done for that plant */
function RunFMS()
{
    /* Calculate what needs to be done */
    var blighted_plants = [];
    var harvestable_plants = [];
    var fertilized_plants = [];

    for(plant in plants)
    {
        if(plant.blight)
        {
            blighted_plants.push(plant);
        }
        if(plant.plant_state == plantState.Red)
        {
            harvestable_plants.push(plant);
        }
        if(plant.fertilized)
        {
            fertilized_plants.push(plant);
        }
    }

    /* Determine Weather Condition */
    if(!rainy && !cloudy && !windy) /* Sunny weather condition */
    {
        /* Determine if plants are both blighted and harvestable */
        if(blighted_plants.length > 0 && harvestable_plants.length > 0){
            print('farmzoid: 427');
            farmzoids[0].carried_supply = carriedSupply.SOAP;
            farmzoids[1].carried_supply = carriedSupply.HARVEST;
            farmzoids[2].carried_supply = carriedSupply.WATER;
            farmzoids[3].carried_supply = carriedSupply.WATER;
        }
        /* Determine if the plants are only blighted */
        else if(blighted_plants.length > 0)
        {
            print('farmzoid: 436');
            farmzoids[0].carried_supply = carriedSupply.SOAP;
            farmzoids[1].carried_supply = carriedSupply.SOAP;
            farmzoids[2].carried_supply = carriedSupply.WATER;
            farmzoids[3].carried_supply = carriedSupply.WATER;
        }
        /* Determine if the plants are only harvestable */
        else if(harvestable_plants.length > 0)
        {
            print('farmzoid: 445');
            farmzoids[0].carried_supply = carriedSupply.HARVEST;
            farmzoids[1].carried_supply = carriedSupply.HARVEST;
            farmzoids[2].carried_supply = carriedSupply.WATER;
            farmzoids[3].carried_supply = carriedSupply.WATER;
        }
        else
        {
            if(plants.length < max_plants) // if it is not maxed plants, we plant more seeds
            {
                print('farmzoid: 455');
                farmzoids[0].carried_supply = carriedSupply.SEED;
                farmzoids[1].carried_supply = carriedSupply.SEED;
                farmzoids[2].carried_supply = carriedSupply.SEED;
                farmzoids[3].carried_supply = carriedSupply.SEED;
            }
            else if(fertilized_plants.length > 35) // if almost max fertilizer, just water plants
            {
                print('farmzoid: 461');
                farmzoids[0].carried_supply = carriedSupply.WATER;
                farmzoids[1].carried_supply = carriedSupply.WATER;
                farmzoids[2].carried_supply = carriedSupply.WATER;
                farmzoids[3].carried_supply = carriedSupply.WATER;
            }
            else
            {
                print('farmzoid: 469');
                farmzoids[0].carried_supply = carriedSupply.FERTILIZER;
                farmzoids[1].carried_supply = carriedSupply.FERTILIZER;
                farmzoids[2].carried_supply = carriedSupply.WATER;
                farmzoids[3].carried_supply = carriedSupply.WATER;
            }
        }
    }
    else if (!windy)
    {
        if (rainy) /* Rainy weather, we exclude watering plants */
        {
            /* Determine if plants are both blighted and harvestable */
            if(blighted_plants.length > 0 && harvestable_plants.length > 0){
                print('farmzoid: 483');
                farmzoids[0].carried_supply = carriedSupply.SOAP;
                farmzoids[1].carried_supply = carriedSupply.HARVEST;
                farmzoids[2].carried_supply = carriedSupply.SOAP;
                farmzoids[3].carried_supply = carriedSupply.HARVEST;
            }
            /* Determine if the plants are only blighted */
            else if(blighted_plants.length > 0)
            {
                print('farmzoid: 492');
                farmzoids[0].carried_supply = carriedSupply.SOAP;
                farmzoids[1].carried_supply = carriedSupply.SOAP;
                farmzoids[2].carried_supply = carriedSupply.SOAP;
                farmzoids[3].carried_supply = carreidSupply.SOAP;
            }
            /* Determine if the plants are only harvestable */
            else if(harvestable_plants.length > 0)
            {
                print('farmzoid: 501');
                farmzoids[0].carried_supply = carriedSupply.HARVEST;
                farmzoids[1].carried_supply = carriedSupply.HARVEST;
                farmzoids[2].carried_supply = carriedSupply.HARVEST;
                farmzoids[3].carried_supply = carreidSupply.FERTILIZER;
            }
            else
            {
                if(plants.length != max_plants) // if it is not maxed plants, we plant more seeds
                {
                    print('farmzoid: 511');
                    farmzoids[0].carried_supply = carriedSupply.SEED;
                    farmzoids[1].carried_supply = carriedSupply.SEED;
                    farmzoids[2].carried_supply = carriedSupply.FERTILIZER;
                    farmzoids[3].carried_supply = carriedSupply.FERTILIZER;
                }
                else
                {
                    farmzoids[0].carried_supply = carriedSupply.FERTILIZER;
                    farmzoids[1].carried_supply = carriedSupply.FERTILIZER;
                    farmzoids[2].carried_supply = carriedSupply.FERTILIZER;
                    farmzoids[3].carried_supply = carriedSupply.FERTILIZER;
                }
                print('farmzoid: 515');

            }
        }
        else if (cloudy) /* Cloudy weather condition*/
        {
            /* Determine if plants are both blighted and harvestable */
            if(blighted_plants.length > 0 && harvestable_plants.length > 0){
                print('farmzoid: 526');
                farmzoids[0].carried_supply = carriedSupply.SOAP;
                farmzoids[1].carried_supply = carriedSupply.HARVEST;
                farmzoids[2].carried_supply = carriedSupply.WATER;
                farmzoids[3].carried_supply = carriedSupply.WATER;
            }
            /* Determine if the plants are only blighted */
            else if(blighted_plants.length > 0)
            {
                print('farmzoid: 535');
                farmzoids[0].carried_supply = carriedSupply.SOAP;
                farmzoids[1].carried_supply = carriedSupply.SOAP;
                farmzoids[2].carried_supply = carriedSupply.WATER;
                farmzoids[3].carried_supply = carreidSupply.WATER;
            }
            /* Determine if the plants are only harvestable */
            else if(harvestable_plants.length > 0)
            {
                print('farmzoid: 544');
                farmzoids[0].carried_supply = carriedSupply.HARVEST;
                farmzoids[1].carried_supply = carriedSupply.HARVEST;
                farmzoids[2].carried_supply = carriedSupply.WATER;
                farmzoids[3].carried_supply = carreidSupply.WATER;
            }
            else
            {
                if(plants.length < max_plants) // if it is not maxed plants, we plant more seeds
                {
                    print('farmzoid: 554');
                    farmzoids[0].carried_supply = carriedSupply.SEED;
                    farmzoids[1].carried_supply = carriedSupply.SEED;
                    farmzoids[2].carried_supply = carriedSupply.WATER;
                    farmzoids[3].carried_supply = carriedSupply.WATER;
                }
                else if(fertilized_plants.length > 35) // if almost max fertilizer, just water plants
                {
                    print('farmzoid: 560');
                    farmzoids[0].carried_supply = carriedSupply.WATER;
                    farmzoids[1].carried_supply = carriedSupply.WATER;
                    farmzoids[2].carried_supply = carriedSupply.WATER;
                    farmzoids[3].carried_supply = carriedSupply.WATER;
                }
                else
                {
                    print('farmzoid: 568');
                    farmzoids[0].carried_supply = carriedSupply.FERTILIZER;
                    farmzoids[1].carried_supply = carriedSupply.FERTILIZER;
                    farmzoids[2].carried_supply = carriedSupply.WATER;
                    farmzoids[3].carried_supply = carriedSupply.WATER;
                }
            }
        }
    }
    else {
        /* Rainy/Cloudy with Wind Direction weather condition*/
        // All bots should try to put pots on plants
        if((rainy || cloudy) && windy)
        {
            print('farmzoid: 582');
            farmzoids[0].carried_supply = carriedSupply.SMUDGEPOTS;
            farmzoids[1].carried_supply = carriedSupply.SMUDGEPOTS;
            farmzoids[2].carried_supply = carriedSupply.SMUDGEPOTS;
            farmzoids[3].carried_supply = carriedSupply.SMUDGEPOTS;
        }
        else{
            print("Error: No weather condition was applied");
        }
    }

}

function checkForDyingPlants(){
    for(i = 0; i < plants.length; i++){
        if (plants[i].plant_color == green_plant_color){
            if (plants[i].water_reserve == 0){
                plants[i].plant_color = yellow_plant_color;
            }
        }
        else if (plants[i].plant_color == yellow_plant_color){
            if (plants[i].water_reserve == 0){
                plants[i].plant_color = brown_plant_color;
            }
            else if (plants[i].water_reserve >= 2){
                plants[i].plant_color = green_plant_color;
                plants[i].water_reserve = plants[i].water_reserve - 2;
            }
        }
        else if (plants[i].plant_color == brown_plant_color){
            if (plants[i].water_reserve == 0){
                plants[i].plant_color = dead_plant_color;
            }
            else if (plants[i].water_reserve >= 2){
                plants[i].plant_color = yellow_plant_color;
                plants[i].water_reserve = plants[i].water_reserve - 2;
            }
        }
        else if (plants[i].plant_color == dead_plant_color){
            // dead
        }
        else if (plants[i].water_reserve > 3){
            // straw
        }
        
    }
}

/* 
This function attempts to find an avaiable spot to plant a seed.
Plant Seed disable the current cell from being tranversable and disable the 8 cells around it to be unplantable */
function PlantSeed(row, col)
{
    random_num = random(1, 9);
    random_num = floor(random_num);
    print(random_num);
    // Check farmzoids surroundings
    bPlantSeed = false;
    try{
        print("trying to find plantable spot");
        if(random_num == 1 && grid.contents[row-1][col-1].plantable) //top left
        {
            row = row-1;
            col = col-1;
            bPlantSeed = true;
        }
        else if(random_num == 2 && grid.contents[row-1][col].plantable) //top
        {
            row = row-1;
            bPlantSeed = true;
        }
        else if(random_num == 3 && grid.contents[row-1][col+1].plantable) // top right
        {
            row = row-1;
            col = col+1;
            bPlantSeed = true;
        }
        else if(random_num == 4 && grid.contents[row][col-1].plantable) // left
        {
            col = col-1;
            bPlantSeed = true;
        }
        else if(random_num == 5 && grid.contents[row][col+1].plantable) //right
        {
            col = col+1;
            bPlantSeed = true;
        }
        else if(random_num == 6 && grid.contents[row+1][col-1].plantable) //bottom left
        {
            row = row+1;
            col = col-1;
            bPlantSeed = true;
        }
        else if(random_num == 7 && grid.contents[row+1][col].plantable) //bottom
        {
            row = row+1;
            bPlantSeed = true;
        }
        else if(random_num == 8 && grid.contents[row+1][col+1].plantable) // bottom right
        {
            row = row+1;
            col = col+1;
            bPlantSeed = true;
        }
        else{
            print("failed to plant")
        }
    }catch(err){
        print("error finding plot");
    }

    if(bPlantSeed)
    {
        print("planting seed at row: " + row + " column: " + col);
        plants.push(new Plant(row, col));
        /* disable the plot as not traversable */
        grid.contents[row][col].traversable = false;
        /* disable the surrounded cells as unplantable */
        try{
            grid.contents[row - 1][col - 1].plantable = false; // top left disabled
        }catch(err){}
        try{
            grid.contents[row - 1][col + 1].plantable = false; // top right disable
        }catch(err){}
        try{
            grid.contents[row - 1][col].plantable = false; // top
        }catch(err){}
        try{
            grid.contents[row][col - 1].plantable = false; // left disabled
        }catch(err){}
        try{
            grid.contents[row][col].plantable = false; //middle disabled
        }catch(err){}
        try{
            grid.contents[row][col + 1].plantable = false; //right disabled
        }catch(err){}
        try{
            grid.contents[row + 1][col - 1].plantable = false; //bottom left disabled
        }catch(err){}
        try{
            grid.contents[row + 1][col].plantable = false; //bottom disabled
        }catch(err){}
        try{
            grid.contents[row + 1][col + 1].plantable = false; //bottom right disabled
        }catch(err){}
    }

}

function waterPlant(row, col){
    for(i = 0; i < plants.length; i++){
        if (plants[i].row == row && plants[i].col == col){
            console.log("watering plant at row: " + row + " column: " + col);
            if (plants[i].water_reserve == 0){
                plants[i].water_reserve = 2;
            }
            else if (plants[i].water_reserve >= 1 && plants[i].water_reserve <= 2){
                plants[i].water_reserve++;
            }
        }
    }
}

function WaterPlantsAroundFarmzoid(row, col)
{
    for(i = 0; i < plants.length; i++){
        if(plants[i].water_reserve > 2)
        {
            continue;
        }
        if (plants[i].row == row-1 && plants[i].col == col-1){
            plants[i].water_reserve++;
        }
        if (plants[i].row == row-1 && plants[i].col == col){
            plants[i].water_reserve++;
        }
        if (plants[i].row == row-1 && plants[i].col == col+1){
            plants[i].water_reserve++;
        }
        if (plants[i].row == row && plants[i].col == col-1){
            plants[i].water_reserve++;
        }
        if (plants[i].row == row && plants[i].col == col+1){
            plants[i].water_reserve++;
        }
        if (plants[i].row == row+1 && plants[i].col == col-1){
            plants[i].water_reserve++;
        }
        if (plants[i].row == row+1 && plants[i].col == col){
            plants[i].water_reserve++;
        }
        if (plants[i].row == row+1 && plants[i].col == col+1){
            plants[i].water_reserve++;
        }
    }
}

function FertilizePlantsAroundFarmzoid(row, col)
{
    for(i = 0; i < plants.length; i++){
        if(plants[i].fertilized)
        {
            continue;
        }
        if (plants[i].row == row-1 && plants[i].col == col-1){
            plants[i].fertilized = true;
        }
        if (plants[i].row == row-1 && plants[i].col == col){
            plants[i].fertilized = true;
        }
        if (plants[i].row == row-1 && plants[i].col == col+1){
            plants[i].fertilized = true;
        }
        if (plants[i].row == row && plants[i].col == col-1){
            plants[i].fertilized = true;
        }
        if (plants[i].row == row && plants[i].col == col+1){
            plants[i].fertilized = true;
        }
        if (plants[i].row == row+1 && plants[i].col == col-1){
            plants[i].fertilized = true;
        }
        if (plants[i].row == row+1 && plants[i].col == col){
            plants[i].fertilized = true;
        }
        if (plants[i].row == row+1 && plants[i].col == col+1){
            plants[i].fertilized = true;
        }
    }
}

function SmudgepotPlantsAroundFarmzoids(row, col)
{
    // Should add smudge 3 smudge pots around the plants depending on the wind direct and set protected_from_cold to true;
}

function SoapPlantsAroundFarmzoids(row, col)
{
    // Should remove blight on plants
    for(i = 0; i < plants.length; i++){
        if(!plants[i].blight)
        {
            continue;
        }
        if (plants[i].row == row-1 && plants[i].col == col-1){
            plants[i].blight = false;
        }
        if (plants[i].row == row-1 && plants[i].col == col){
            plants[i].blight = false;
        }
        if (plants[i].row == row-1 && plants[i].col == col+1){
            plants[i].blight = false;
        }
        if (plants[i].row == row && plants[i].col == col-1){
            plants[i].blight = false;
        }
        if (plants[i].row == row && plants[i].col == col+1){
            plants[i].blight = false;
        }
        if (plants[i].row == row+1 && plants[i].col == col-1){
            plants[i].blight = false;
        }
        if (plants[i].row == row+1 && plants[i].col == col){
            plants[i].blight = false;
        }
        if (plants[i].row == row+1 && plants[i].col == col+1){
            plants[i].blight = false;
        }
    }
}

function HarvestPlantsAroundFarmzoids(row, col)
{
    for(i = 0; i < plants.length; i++){
        if(plants[i].plant_state != plantState.Red)
        {
            continue;
        }
        else if(plants[i].plant_state == plantState.Red)
        {
            if (plants[i].row == row-1 && plants[i].col == col-1){
                if(plants[i].plant_type == plantType.Apple){
                    barn.apple_amount++;
                }
                else if(plants[i].plant_type == plantType.Corn){
                    barn.corn_amount++;
                }
                else if(plants[i].plant_type == plantType.Berry){
                    barn.berry_amount++;
                }

                plants.splice(i, 1);
            }
            if (plants[i].row == row-1 && plants[i].col == col){
                  if(plants[i].plant_type == plantType.Apple){
                    barn.apple_amount++;
                }
                else if(plants[i].plant_type == plantType.Corn){
                    barn.corn_amount++;
                }
                else if(plants[i].plant_type == plantType.Berry){
                    barn.berry_amount++;
                }

                plants.splice(i, 1);
            }
            if (plants[i].row == row-1 && plants[i].col == col+1){
                if(plants[i].plant_type == plantType.Apple){
                    barn.apple_amount++;
                }
                else if(plants[i].plant_type == plantType.Corn){
                    barn.corn_amount++;
                }
                else if(plants[i].plant_type == plantType.Berry){
                    barn.berry_amount++;
                }

                plants.splice(i, 1);
            }
            if (plants[i].row == row && plants[i].col == col-1){
                if(plants[i].plant_type == plantType.Apple){
                    barn.apple_amount++;
                }
                else if(plants[i].plant_type == plantType.Corn){
                    barn.corn_amount++;
                }
                else if(plants[i].plant_type == plantType.Berry){
                    barn.berry_amount++;
                }

                plants.splice(i, 1);
            }
            if (plants[i].row == row && plants[i].col == col+1){
                if(plants[i].plant_type == plantType.Apple){
                    barn.apple_amount++;
                }
                else if(plants[i].plant_type == plantType.Corn){
                    barn.corn_amount++;
                }
                else if(plants[i].plant_type == plantType.Berry){
                    barn.berry_amount++;
                }

                plants.splice(i, 1);
            }
            if (plants[i].row == row+1 && plants[i].col == col-1){
                if(plants[i].plant_type == plantType.Apple){
                    barn.apple_amount++;
                }
                else if(plants[i].plant_type == plantType.Corn){
                    barn.corn_amount++;
                }
                else if(plants[i].plant_type == plantType.Berry){
                    barn.berry_amount++;
                }

                plants.splice(i, 1);
            }
            if (plants[i].row == row+1 && plants[i].col == col){
                if(plants[i].plant_type == plantType.Apple){
                    barn.apple_amount++;
                }
                else if(plants[i].plant_type == plantType.Corn){
                    barn.corn_amount++;
                }
                else if(plants[i].plant_type == plantType.Berry){
                    barn.berry_amount++;
                }

                plants.splice(i, 1);
            }
            if (plants[i].row == row+1 && plants[i].col == col+1){
                if(plants[i].plant_type == plantType.Apple){
                    barn.apple_amount++;
                }
                else if(plants[i].plant_type == plantType.Corn){
                    barn.corn_amount++;
                }
                else if(plants[i].plant_type == plantType.Berry){
                    barn.berry_amount++;
                }

                plants.splice(i, 1);
            }
        }
        else 
        {
            print('ERROR: 889');
        }
    }
}

function RemoveAnyDeadPlantsAroundFarmzoid(row, col)
{
    for(i = 0; i < plants.length; i++){
        if(plants[i].plant_color != dead_plant_color)
        {
            continue;
        }
        if (plants[i].row == row-1 && plants[i].col == col-1){
            plants.splice(i, 1);
        }
        if (plants[i].row == row-1 && plants[i].col == col){
            plants.splice(i, 1);
        }
        if (plants[i].row == row-1 && plants[i].col == col+1){
            plants.splice(i, 1);
        }
        if (plants[i].row == row && plants[i].col == col-1){
            plants.splice(i, 1);
        }
        if (plants[i].row == row && plants[i].col == col+1){
            plants.splice(i, 1);
        }
        if (plants[i].row == row+1 && plants[i].col == col-1){
            plants.splice(i, 1);
        }
        if (plants[i].row == row+1 && plants[i].col == col){
            plants.splice(i, 1);
        }
        if (plants[i].row == row+1 && plants[i].col == col+1){
            plants.splice(i, 1);
        }
    }
}
/* Move Farmzoids will hold D-TREE logic */
// So far farmzoids moves randomly
function MoveFarmzoids()
{
    for(i = 0; i < farmzoids.length; i++)
    {
        row = farmzoids[i].row;
        col = farmzoids[i].col;
        // have the bot move randomly
        random_num = Math.random()
        // Check farmzoids surroundings
        try{
            if(random_num <= 0.1 && grid.contents[row-1][col-1].traversable && row > 0 && col > 0) //top left
            {
                farmzoids[i].row = row-1;
                farmzoids[i].col = col-1;
            }
            else if(random_num <= 0.2 && grid.contents[row-1][col].traversable && row > 0) //top
            {
                farmzoids[i].row = row-1;
            }
            else if(random_num <= 0.3 && grid.contents[row-1][col+1].traversable && row > 0 && col < 39) // top right
            {
                farmzoids[i].row = row-1;
                farmzoids[i].col = col+1;
            }
            else if(random_num <= 0.4 && grid.contents[row][col-1].traversable && col > 0) // left
            {
                farmzoids[i].col = col-1;
            }
            else if(random_num <= 0.5 && grid.contents[row][col+1].traversable && col < 39) //right
            {
                farmzoids[i].col = col+1;
            }
            else if(random_num <= 0.6 && grid.contents[row+1][col-1].traversable && col > 0 && row < 39) //bottom left
            {
                farmzoids[i].row = row+1;
                farmzoids[i].col = col-1;
            }
            else if(random_num <= 0.7 && grid.contents[row+1][col].traversable && row < 39) //bottom
            {
                farmzoids[i].row = row+1;
            }
            else if(random_num <= 0.8 && grid.contents[row+1][col+1].traversable && row < 39 && col < 39) // bottom right
            {
                farmzoids[i].row = row+1;
                farmzoids[i].col = col+1;
            }
        }catch(err){
            print("farmazoid tried to go out of bound of grid");
        }
    }
}

function ActionFarmzoid()
{
    for(i = 0; i < farmzoids.length; i++)
    {
        row = farmzoids[i].row;
        col = farmzoids[i].col;
        switch(farmzoids[i].carried_supply)
        {
            case carriedSupply.SEED:
                // Used to plant seeds on farm
                PlantSeed(row, col);
                break;
            case carriedSupply.WATER:
                // Used to water the plants
                WaterPlantsAroundFarmzoid(row, col);
                break;
            case carriedSupply.FERTILIZER:
                // Used to increase plant growth speed
                FertilizePlantsAroundFarmzoid(row, col);
                break;
            case carriedSupply.SMUDGEPOTS:
                // Used to protect plants from wind
                SmudgepotPlantsAroundFarmzoids(row, col);
                break;
            case carriedSupply.SOAP:
                // Used when plant is blighted
                SoapPlantsAroundFarmzoids(row, col);
                break;
            case carriedSupply.HARVEST:
                // Used to pick up plant
                HarvestPlantsAroundFarmzoids(row, col);
        }
        RemoveAnyDeadPlantsAroundFarmzoid(row, col);
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

/* Draw all existing plants */
function DrawPlants()
{
    for(i = 0; i < plants.length; i++)
    {
        col = plants[i].col;
        row = plants[i].row;

        fill(plants[i].plant_color);

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

/* Pathfinding code */
// This function carries out one iteration of bestFS
function BestFSOneIteration(open, closed, grid, goal_row, goal_col) {
    cell = open.pop();
    neighbors = GenerateCellNeighbors(cell, grid);

    for(neighbor of neighbors) {
        in_open = open_list.includes(neighbor);
        in_closed = closed_list.includes(neighbor);
        reached_by_shorter_path = neighbor.shortest_path.length < cell.shortest_path.length - 1;

        if(!in_open && !in_closed) {// cell is unvisited
            neighbor.heuristic = ManhattanHeuristic(neighbor, grid, goal_row, goal_col);
            neighbor.shortest_path = cell.shortest_path.slice();
            neighbor.shortest_path.push(neighbor);
            open.push(neighbor);
        } else if (in_open && reached_by_shorter_path) { // shortcut discovered
            open.shortest_path = neighbor.shortest_path.slice();
            open.shortest_path.push(open);
        } else if (in_closed && reached_by_shorter_path) { // an old cell can get us here faster
            closed.splice(closed.indexOf(neighbor, 1));
            open.push(neighbor);
        }
    }

    closed.push(cell);

    open.sort(function(a,b) {return b.heuristic - a.heuristic});
}

function GenerateCellNeighbors(cell, grid) {
    neighbors = [];
    
    // left
    if(cell.col != 0 && grid.contents[cell.row][cell.col-1].traversable) {
        neighbors.push(grid.contents[cell.row][cell.col-1]);
    }

    // right
    if(cell.col != grid.cols-1 && grid.contents[cell.row][cell.col+1].traversable) {
        neighbors.push(grid.contents[cell.row][cell.col+1]);
    }

    // up
    if(cell.row != 0 && grid.contents[cell.row-1][cell.col].traversable) {
        neighbors.push(grid.contents[cell.row-1][cell.col]);
    }

    // down
    if(cell.row != grid.rows-1 && grid.contents[cell.row+1][cell.col].traversable) {
        neighbors.push(grid.contents[cell.row+1][cell.col]);
    }

    return neighbors;
}

// A simple heuristic. Not the most optimal, but it works
function ManhattanHeuristic(cell, goal_row, goal_col) 
{
    row_difference = Math.abs(cell.row - goal_row);
    col_difference = Math.abs(cell.col - goal_col);

    return row_difference + col_difference;
}