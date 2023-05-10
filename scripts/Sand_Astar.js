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
const grid = [];
const grid_Style = getComputedStyle(Astar_grid);
const grid_Size = parseInt(grid_Style.getPropertyValue('--grid_Size').trim()); //trim for cleaner string -> not absolutly necessary
let openSet = [];
let closedSet = [];
let costFromStart = {}; //gScore
let costToGoal = {} //hScore 
let node_Start = document.getElementById("start");
let node_Goal = document.getElementById("goal");
let node_Current = node_Start;

//Make grid 
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
        const maxNum = grid_Size - 1; //max array value
        const minNum = 0 //min array value
        pre_row = Math.max(row - 1, minNum);
        pre_col = Math.max(col - 1, minNum);
        next_row = Math.min(row + 1, maxNum);
        next_col = Math.min(col + 1, maxNum);

        Astar_cell.dataset.neighbours = [
            [pre_row , pre_col],
            [pre_row , col],
            [pre_row , next_col],
            [row, pre_col],
            //[current_node]
            [row, next_col],
            [next_row, pre_col],
            [next_row, col],
            [next_row, next_col]
        ];

        Astar_cell.addEventListener("click", cellClick);
        //Astar_cell.addEventListener("mousedown", cellClick);
        
        Astar_grid.appendChild(Astar_cell);
        currentRow.push(Astar_cell);
    }
    grid.push(currentRow);
}

function cellClick(event){
    const cell = event.target;
    cell.classList.toggle("obstacle");
}

function showInfo(text){
    const info = document.getElementById("info");
    info.style.display = "block";
    info.style.opacity = "1";
    info.innerText = "Info: \n" + text;
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
document.getElementById("button_Start").addEventListener("click", async() =>
    {   
        showInfo("Start");
        //A*
        //Get the starting-, current-, and goal-nodes -> in case start and goal have been changed
        node_Start = document.getElementById("start");
        node_Current = node_Start;
        if(node_Start===null){return;}//error message: for some reason there is no start etc...
        openSet.push(node_Start);
        node_Goal = document.getElementById("goal");
        if(node_Goal===null){return;}//error message: for some reason there is no goal etc...        
        node_Obstacles = document.getElementsByClassName("obstacle");//can be null
        

        while(openSet.length > 0){
            //Draw node current
            node_Current.classList.toggle("current");
            //current is lowest f Score in openSet
            node_Current = get_min_fScore(openSet); 
            //Draw node current
            node_Current.classList.toggle("current");
            

            
            //Is current == goal? 
            if(reachedGoal()){
                console.log("Done");
                return build_Path();
            }
            
            let removedElement = openSet.splice(openSet.indexOf(node_Current),1); //at openSet's index for "node_current" remove "1" item
            removedElement[0].classList.toggle("visited");
            removedElement[0].classList.toggle("open");
            closedSet.push(removedElement[0]);

            const neigh_array = get_Neighbours(node_Current);
            neigh_array.forEach((neighbour) =>{
                //neighbour[0] == row || y
                //neighbour[1] == column || x
                const neigh = grid[neighbour[0]][neighbour[1]];
                const tmp_gScore = get_gScore(node_Current,node_Start) + get_gScore(neigh,node_Current);

                //is it closed set?
                if(closedSet.indexOf(neigh) != -1) return //go next neigh because of our out of bound handling we want to avoid putting the current node through it again(havent tested if it would make a difference)
                //is it an obstacle?
                if(neigh.classList.contains("obstacle")) return   
                //is in openset?
                if(openSet.indexOf(neigh) != -1){ 
                    if(tmp_gScore > neigh.dataset.gScore)return
                }
                else{//is not in openSet
                    neigh.classList.toggle("open");
                    openSet.push(neigh);
                }
                neigh.dataset.gScore = tmp_gScore;
                neigh.dataset.parent = [node_Current.dataset.row, node_Current.dataset.col];
                neigh.dataset.fScore = neigh.dataset.gScore + get_hScore(neigh, node_Goal);
                
                
            });
            //console.log("open - closed - sets:");
            //console.log(openSet);
            //console.log(closedSet);
            //3 * 7 + 3 * 7 
            await sleep(42);
        }
        showInfo("No path found!");
        
       
    }
)

document.getElementById("button_Random").addEventListener("click", () => {    
       
        //triggere reset button
        let button_Reset = document.getElementById("button_Reset");
        button_Reset.click();

        showInfo("Randomising obstacles... ");
        //make random obstcles
        let cells = document.getElementsByClassName("Astar_cell");     
        for(let cell of cells){
            if(cell.id === "start" || cell.id === "goal") continue
            //if(cell.classList.contains("obstacle")) continue

            let rand = Math.random();
            if(rand < 0.42){
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

//Reset 

/*==========================================  ==========================================*/
/*========================================== Functions: Astar ==========================================*/
/*==========================================  ==========================================*/
//Get the lowest fScore in openSet
function get_min_fScore(){
    let best_F = Number.MAX_SAFE_INTEGER;
    let best_Key = 0;
    openSet.forEach((set,key) => {
        let tmp_f = set.dataset.fScore;
        if(tmp_f<best_F)
        {
            best_F = tmp_f;
            best_Key = key;
        }
    })
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
    console.log("chek: " + check);
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

    return Math.sqrt(hCol + hRow);    
}

//G Score -> cost from start
function get_gScore(current, start){
    let gCol = Math.pow(start.dataset.col - current.dataset.col, 2);
    let gRow = Math.pow(start.dataset.row - current.dataset.row, 2);

    return Math.sqrt(gCol + gRow);    
}

//F Score -> sum of H and G //these get function could be different
function get_fScore(hScore, gScore){
    return hScore + gScore;    
}

function get_fScore(start, current, goal){
    let fScore = get_hScore(current,goal) + get_gScore(current,start);
    return fScore;    
}

function get_Neighbours(cell){
    const regex = /\d+/g; //Regex match one or more digits
    const numbers = cell.dataset.neighbours.match(regex).map(Number);
    const neigh_array = [];//there should be 8 neighbours (16 -> 8 row +  8 col)
    for(let i = 0; i < 8; i++){
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



