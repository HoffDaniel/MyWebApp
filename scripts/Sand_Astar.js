/*==========================================  ==========================================*/
/*==========================================  Astar Algorithm script ==========================================*/
/*==========================================  ==========================================*/

//check out wikipedia (I know...) pseudo code which is decent actually:
//- https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode

//Get grid element
//Get grid size
//Create grid
//Events
const Astar_grid = document.getElementById("Astar_grid");
let grid = [];
const grid_Style = getComputedStyle(Astar_grid);
let grid_Size = parseInt(grid_Style.getPropertyValue('--grid_Size'));
let rand_Value = parseFloat(grid_Style.getPropertyValue('--rand_Value'));
let openSet = [];
let closedSet = [];
let costFromStart = {}; //gScore
let costToGoal = {} //hScore 
let node_Start = document.getElementById("start");
let node_Goal = document.getElementById("goal");
let node_Current = node_Start;
let mouse_down = false;
let coursor_state = "obstacle";
let h_state = "Euclidean";///////////////
//handle mouse
document.body.onmousedown = () => { 
    mouse_down = true; 
}
document.body.onmouseup = () => {
    mouse_down = false;
}

function maxNum(){
    let maxNum = grid_Size - 1;
    return maxNum;
}

function minNum(){
    let minNum = grid_Size - grid_Size;
    return minNum;
}
//Make grid 
make_Grid();

//Make slider to control random obstacles value (0-1)
let random_Slider = document.querySelector('#slider_Random #slider_Input');
let random_Value_Display = document.querySelector('#slider_Random #slider_Value');
random_Slider.value =  rand_Value;
random_Value_Display.textContent  =  "Random Obstacles: " + rand_Value;

random_Slider.oninput = function(){
    rand_Value = this.value;
    random_Value_Display.textContent  =  "Random Ostacles: " + rand_Value;
}


//Make slider to control grid size
let grid_Slider = document.querySelector('#slider_Grid #slider_Input');
let grid_Size_Display = document.querySelector('#slider_Grid #slider_Value');
grid_Slider.value =  grid_Size;
grid_Size_Display.textContent  =  "Grid Size: " + grid_Size + " x " + grid_Size;

grid_Slider.oninput = function() {
  grid_Size = this.value;
  grid_Size_Display.textContent = "Grid Size: " + grid_Size + " x " + grid_Size;
  document.documentElement.style.setProperty('--grid_Size', grid_Size);
  
  update_Grid(grid_Size);
}

function make_Grid(){
    openSet = [];
    closedSet = [];
    costFromStart = {}; //gScore
    costToGoal = {} //hScore 
    node_Start = document.getElementById("start");
    node_Goal = document.getElementById("goal");
    node_Current = node_Start;
    mouse_down = false;
    for(let row = 0; row < grid_Size; row++){
        const currentRow = []
        for(let col = 0; col < grid_Size; col++){
            const Astar_cell = document.createElement("div");
            Astar_cell.classList.add("Astar_cell");        
            if (row == 0 && col == 0) {Astar_cell.setAttribute("id","start");}
            if (row == (grid_Size - 1) && col == (grid_Size - 1)) {Astar_cell.setAttribute("id","goal");}
            
            //Data for A*
            //Keys: row and collumn 
            //h_ / g_ / f_Score 
            Astar_cell.dataset.row = row;
            Astar_cell.dataset.col = col;
            Astar_cell.dataset.hScore = 0;
            Astar_cell.dataset.gScore = 0;
            Astar_cell.dataset.fScore = 0;
            Astar_cell.dataset.parent = [0 , 0];
    
            //just making sure to handle when "neighbours" are outside bounds //out of bound handeling
            
    
            Astar_cell.dataset.neighbours = [
                [row-1 , col-1], [row-1 , col], [row+1 , col+1],
                    [row, col-1],    /*[current_node */ [row, col+1],
                    [row+1, col-1], [row+1, col], [row+1, col+1]
            ];
    
            Astar_cell.addEventListener("mouseover", cellClick);
            Astar_cell.addEventListener("click", cellClick);
            
            Astar_grid.appendChild(Astar_cell);
            currentRow.push(Astar_cell);
        }
        grid.push(currentRow);
    }
}

function update_Grid(gridSize){
    grid = [];
    let Astar_grid =document.getElementById('Astar_grid');

    while(Astar_grid.firstChild){
        Astar_grid.removeChild(Astar_grid.firstChild);
    }
    Astar_grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    Astar_grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    
    make_Grid();
}
function cellSelectionClick(event, state){
    const cell = event.target;
    let previous_cell = document.getElementsByClassName("selected");
    previous_cell[0].classList.remove("selected"); //make sure its the first selected 
    cell.classList.add("selected");
    coursor_state = state;
}
function heuristicSelectionClick(event, state){
    const cell = event.target;
    let previous_cell = document.getElementsByClassName("selected");
    previous_cell[1].classList.remove("selected");
    cell.classList.add("selected");
    h_state = state;    
    setNeighbours();
}

function setNeighbours(){

    let cells = document.getElementsByClassName("Astar_cell"); 
    showInfo(h_state);
    console.log(h_state);
    switch (h_state) {        
        case "Euclidean": 
            console.log("E case entered");                
            for(let cell of cells){
                if(cell.closest('#Astar_menu')) continue
                let row = parseInt(cell.dataset.row);
                let col = parseInt(cell.dataset.col);                
                cell.dataset.neighbours = [
                    [row-1 , col-1], [row-1 , col], [row+1 , col+1],
                    [row, col-1],    /*[current_node */ [row, col+1],
                    [row+1, col-1], [row+1, col], [row+1, col+1]
                ];         
            }                   
            break;
        case "Manhattan":
            
            console.log("M case entered");     
            for(let cell of cells){
                if(cell.closest('#Astar_menu')) continue
                let row = parseInt(cell.dataset.row);
                let col = parseInt(cell.dataset.col);       
                cell.dataset.neighbours = [
                    /*[row-1 , col-1],*/ [row-1 , col], /*[row+1 , col+1],*/
                    [row, col-1],    /*[current_node */ [row, col+1],
                    /*[row+1, col-1],*/ [row+1, col] /*, [row+1, col+1]*/
                ];         
            }                   
            break;
        case "Diagonal":
            
            console.log("D case entered");  
            for(let cell of cells){
                if(cell.closest('#Astar_menu')) continue
                let row = parseInt(cell.dataset.row);
                let col = parseInt(cell.dataset.col);                
                cell.dataset.neighbours = [
                    [row-1 , col-1], [row-1 , col], [row+1 , col+1],
                    [row, col-1],    /*[current_node */ [row, col+1],
                    [row+1, col-1], [row+1, col], [row+1, col+1]
                ];         
            }                   
            break;      
        default:
            console.log("no case? wtf bra");
            break;
    }
}
function cellClick(event){
    const cell = event.target;
    if(event.type === "click"){
        let tmp = document.getElementById(coursor_state);
        switch (coursor_state) {
            case "start":                
                tmp.removeAttribute("id");
                cell.id = coursor_state;
                break;
            case "goal":
                tmp.removeAttribute("id");
                cell.id = coursor_state;
                break;
            case "obstacle":
                cell.classList.toggle("obstacle");               
                break;        
            default:
                break;
        }
        return;
    }     
    if(!mouse_down) return  
    //Only when mouse is held down and coursor is over a cell, then change cell              
    cell.classList.toggle("obstacle");
}
//Change mouse coursor ish
//document.body.style.cursor = 'url(\'/resources/images/MOO - Copy.png\'), auto';

//Pop up info just a little extra to make pressing button in the menu feel more like they do something
function showInfo(text){
    //document.body.style.cursor = 'url(\'/resources/images/MOO.png\'), auto';
    console.log(document.body.style.cursor);
    const info = document.getElementById("info");
    info.style.display = "block";
    info.style.opacity = "1";
    info.innerText = text;

    // After 3 seconds, start fading out
    setTimeout(() => {
        info.style.opacity = '0'; // Set the opacity to 0 to fade it out

        // After the fade out transition is done (0.5s), hide the notification
        setTimeout(() => {
            info.style.display = 'none';
        }, 500);
    }, 2000);

}

//Start - Button - A* Algorithm
document.getElementById("button_Run").addEventListener("click", async() =>
    {   
        showInfo("Start");
        //A*
        //Get the starting-, current-, and goal-nodes -> in case start and goal have been changed
        node_Start = document.getElementById("start");
        if(node_Start===null){return;}//error message: for some reason there is no start etc...
        node_Current = node_Start;
        node_Current.classList.toggle("current");
        openSet.push(node_Start);
        node_Goal = document.getElementById("goal");
        if(node_Goal===null){return;}//error message: for some reason there is no goal etc...        
        node_Obstacles = document.getElementsByClassName("obstacle");//can be null
        

        while(openSet.length > 0){
            //openSet = document.getElementsByClassName("open");
            //closedSet = document.getElementsByClassName("visited");

            //Draw node current
            node_Current.classList.remove("current");
            //current is lowest f Score in openSet
            node_Current = get_min_fScore(); 
            //Draw node current
            node_Current.classList.add("current");
            

            
            //Is current == goal? 
            if(reachedGoal()){
                console.log("Done");
                return build_Path();
            }
            

            let removedElement = removeElement(openSet,node_Current); //at openSet's index for "node_current" remove "1" item
            removedElement.classList.add("visited");
            removedElement.classList.remove("open");
            console.log(removedElement[0]);
            closedSet.push(removedElement[0]);

            const neigh_array = get_Neighbours(node_Current);
            neigh_array.forEach((neighbour) =>{
                //neighbour[0] == row || y
                //neighbour[1] == column || x
                if (neighbour[0] < minNum() || 
                    neighbour [1] < minNum() ||
                    neighbour[0] > maxNum() || 
                    neighbour [1] > maxNum()) {
                        console.log("min max triggered")
                    return;
                }
                const neigh = grid[neighbour[0]][neighbour[1]];
                const tmp_gScore = get_gScore(node_Current,node_Start) + get_gScore(neigh,node_Current);

                //is it closed set?
                if(neigh.classList.contains("visited")){return;}
                //is it an obstacle?
                if(neigh.classList.contains("obstacle")) {return};   
                //is in openset?
                if(neigh.classList.contains("open")){
                    if(tmp_gScore >= neigh.dataset.gScore){return};
                }
                //else is nor in openSet nor in closedSet nor an obstacle
                neigh.classList.add("open");
                
                neigh.dataset.gScore = tmp_gScore.toFixed(2);
                neigh.dataset.hScore = get_hScore(neigh, node_Goal).toFixed(2);
                
                neigh.dataset.parent = [node_Current.dataset.row, node_Current.dataset.col];
                neigh.dataset.fScore = parseFloat(neigh.dataset.gScore) + parseFloat(neigh.dataset.hScore);
                //neigh.innerText = parseFloat(neigh.dataset.fScore).toFixed(2);
                openSet.push(neigh);
                
            });
            await sleep(0);
        }
        showInfo("No path found!");
        
       
    }
)



document.getElementById("slider_Random").addEventListener("click", () => {    
       
    //triggere reset button
    let button_Reset = document.getElementById("button_Reset");
    button_Reset.click();

    showInfo("Randomising obstacles... ");
    //make random obstcles
    let cells = document.getElementsByClassName("Astar_cell");     
    for(let cell of cells){
        //is it a menu item, is it the goal||start cell? -> ignore 
        if(cell.closest('#Astar_menu') || cell.id === "goal" || cell.id === "start" ) continue
        //if(cell.classList.contains("obstacle")) continue

        let rand = Math.random();
        if(rand < rand_Value){
            cell.classList.toggle("obstacle");
        }
    }
}
)


document.getElementById("button_Reset").addEventListener("click", () => {
        showInfo("Reset All");
        //reload the page => quick reset
        //could make it more diverse
        //location.reload();
        let cells = document.getElementsByClassName("Astar_cell");     
        for(let cell of cells){
            //if(cell.classList.contains("obstacle")) continue
            if(cell.closest('#Astar_menu')) continue
            cell.className = 'Astar_cell';           
        }
        openSet = [];
        console.log(openSet);
        closedSet.length = 0;
        console.log(closedSet);
    }
)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function removeElement(set,element){
    let removedElement = openSet.splice(set.indexOf(element),1);
    return removedElement[0];
}
//Reset 

/*==========================================  ==========================================*/
/*========================================== Functions: Astar ==========================================*/
/*==========================================  ==========================================*/
//Get the lowest fScore in openSet
function get_min_fScore(){
    let best_F = Number.MAX_SAFE_INTEGER;
    let best_Key = 0;
    for (let i = 0; i < openSet.length; i++) {
        if(openSet[i].classList.contains("visited")){//making sure there is no visited nodes in the openset
            removeElement(openSet,openSet[i]);
            continue;
        }
        const tmp_f = parseFloat(openSet[i].dataset.fScore);
        if(tmp_f<best_F)
        {
            best_F = tmp_f;
            best_Key = i;
        }
    }
    return openSet[best_Key];

}

//Check if goal reached
function reachedGoal()
{
    let check = false;
    if(node_Current.dataset.row === node_Goal.dataset.row && node_Current.dataset.col === node_Goal.dataset.col ){
            check = true;
            showInfo("Path found!");
    }
    console.log("goal Reached?: " + check);
    return check;
}

//Build the Path found
//Async to slow the process down
async function build_Path(){   
    showInfo("Building Path...")
    let path = []
    while(node_Current != node_Start)
    {   
        
        node_Current = get_Parent(node_Current);
        node_Current.classList.toggle("path"); 
        path.push[node_Current];
        console.log(node_Current);
        await sleep(42);
    }
    return path;
}

//H Score -> Heuristics: Distance Formula || Manhatten (Taxicab geometry)|| etc...
function get_hScore(current, goal){
    let hCol = Math.pow(goal.dataset.col - current.dataset.col, 2); //i.e. X 
    let hRow = Math.pow(goal.dataset.row - current.dataset.row, 2); //i.e. Y
    let score = Math.sqrt(hCol + hRow);
    return score;     
}

//G Score -> cost from start
function get_gScore(current, start){
    let gCol = Math.pow(start.dataset.col - current.dataset.col, 2);
    let gRow = Math.pow(start.dataset.row - current.dataset.row, 2);
    let score = Math.sqrt(gCol + gRow);
    return score;    
}

//F Score -> sum of H and G //these get function could be different
function get_fScore(hScore, gScore){
    let score = hScore + gScore;
    return score;    
}

function get_fScore(start, current, goal){
    let fScore = get_hScore(current,goal) + get_gScore(current,start);
    return fScore;    
}

function get_Neighbours(cell){
    const regex = /\d+/g; //Regex match one or more digits
    const numbers = cell.dataset.neighbours.match(regex).map(Number);
    const size = numbers.length/2;
    const neigh_array = [];//there should be 8 neighbours (16 -> 8 row +  8 col)
    for(let i = 0; i < size; i++){
        neigh_array.push ([numbers[i*2], numbers[i*2 + 1]]);
    }
    return neigh_array;
}

function get_Parent(cell){
    const regex = /\d+/g; //Regex match one or more digits
    const numbers = cell.dataset.parent.match(regex).map(Number);
    const parent = grid[numbers[0]][numbers[1]];//there should be 8 neighbours (16 -> 8 row +  8 col)
    console.log("pareeeeeent: ");
    console.log(parent);
    return parent;

}



