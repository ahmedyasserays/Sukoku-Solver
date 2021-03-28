let solver = document.querySelector(".solve button");
let reseter = document.querySelector(".reset button");
let creator = document.querySelector(".create button");
let slider = document.getElementById("mySlider");
let solving_interval;
let grid = new Array();
let elements = new Array();

// make sure that every cell gets only one number
let cells = document.querySelectorAll(".cell");
for (cell of cells){
    cell.querySelector("input").addEventListener("input", 
        function(){
            if (this.value.length > this.maxLength){
                
                this.value = this.value.slice(0, this.maxLength);
            }
        }
        
    );
}

// get the cells and it's values
function get_values(row){
    let temp = row.querySelectorAll('.cell');
    let cells = new Array();
    let inputs = new Array();
    for (i=0; i<9;i++){
        let num_input = temp[i];
        cells[i] = num_input.querySelector("input").value;
        inputs[i] = num_input;
    }
    return [cells, inputs];
}

// arrange the cells and input and it's values
function get_cells(row){
    let values = get_values(row); 
    grid.push(values[0]);
    elements.push(values[1]);
}

// find the rows of the grid
function get_grid(){
    let rows = document.querySelectorAll(".row");
    rows.forEach(get_cells);
}

// deletes every thing 
function reset_all(){
    get_grid();
    for(i=0;i<9;i++){
        for (j=0;j<9;j++){
        elements[i][j].querySelector('input').value = "";
        elements[i][j].querySelector('input').className = "";
        }
    }
}

// find the first empty cell in the given grid
function get_empty(grid_to_empty){
    let i, j;
    for (i=0;i<9;i++){
        for (j=0;j<9;j++){
            if (grid_to_empty[i][j] == "" || grid_to_empty[i][j] == 0){
                return [i, j];
            }
        }
    }
    return false;
}

// check if a given value is possible in a given possision
function is_possible(x, y, n, grid){
    for (i=0;i<9;i++){
        if ((grid[i][y] == n && i != x) || (grid[x][i] == n && i != y)){
            return false;
        }
    }
    let x0 = (Math.floor(x / 3))*3;
    let y0 = (Math.floor(y / 3))*3;
    for (i=0;i<3;i++){
        for (j=0;j<3;j++){
            if (grid[x0+i][y0+j] == n && (x, y) != (x0+i, y0+j)){
            return false;
            }
        }
    }
    return true;
}

// writes the grid to the html elements
function write(elements, grid){
    for(i=0;i<9;i++){
        for (j=0;j<9;j++){
            elements[i][j].querySelector('input').value = grid[i][j];
        }
    }
    
}


// find the solution for a given grid
const timer = ms => new Promise(res => setTimeout(res, ms))

async function find_solution(){
    let empty = get_empty(grid);
    if (empty){
        let x = empty[0];
        let y = empty[1];
        let target_element = elements[x][y].querySelector("input");
        for (let n=1;n<10;n++){
            target_element.className = "loading";
            target_element.value = n;
            let is_number_possible = is_possible(x, y, n, grid);
            if (is_number_possible){
                target_element.className = "success";
                grid[x][y] = n;
                (grid);
                let can_find_solution = await find_solution();
                if (can_find_solution){
                    return true;
                }else{
                    grid[x][y] = 0;
                    target_element.className = "loading";
                    target_element.value = 0;
                }
            }
            await timer(solving_interval);
        }
        target_element.className = "failed";
        target_element.value = 0;
        return false;
    }else{
        return true;
    }
}

// check if a given grid is valid
function check_valid(board){
    for (row_counter=0;row_counter<9;row_counter++){
        for (colm_counter=0;colm_counter<9;colm_counter++){
            if (board[row_counter][colm_counter] === "" || board[row_counter][colm_counter] === 0){
                continue;
            }else{
                if (! is_possible(row_counter, colm_counter, board[row_counter][colm_counter], board)){
                    return false;
                }
            }
        }
    }return true; 
}

// sure that the elments are ready to be solved
async function solve(){
    let buttons = document.querySelectorAll("button");
    for (button of buttons){
        button.disabled = true;
    }
    console.log(buttons);
    grid = [];
    elements = [];
    get_grid();
    if (check_valid(grid)){ 
        await find_solution();
    }else{
        alert('WARNING... this is NOT a valid grid!!');
    }
    for (button of buttons){
        button.disabled = false;
    }

}

// <<<<<<<<<<<<<<<<<<< the start of the creation part >>>>>>>>>>>>>>>>>>>>>>>


// create new puzzle
function create_puzzle(){
    reset_all();
    grid = [];
    get_grid();
    find_random_solution();
    create();
    write(elements, grid);
}

function create(){
    let number_of_empty = getRndInteger(30, 50);
    let remove_counter = 0; 
    while (remove_counter < number_of_empty){
        target_row = getRndInteger(0, 9);
        target_colm = getRndInteger(0, 9);
        if (grid[target_row][target_colm] == ""){continue;}
        grid[target_row][target_colm] = "";
        remove_counter++;
    }
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function find_random_solution() {
    let empty = get_empty(grid);
    if (empty){
        let x = empty[0];
        let y = empty[1];
        let choices = [];
        for (n=1;n<10;n++){choices.push(n);}
        shuffle(choices);
        for (choice of choices){
            if (is_possible( x, y, choice, grid)){
                grid[x][y] = choice;
                if (find_random_solution(grid)){
                    return true;
                }else{
                    grid[x][y] = 0;
                }
            }
        }return false;
    }else{return true;}
}


solver.addEventListener("click", solve);
reseter.addEventListener("click", reset_all);
creator.addEventListener("click", create_puzzle);
slider.addEventListener("input", () => {
    solving_interval = 100-slider.value;
})
