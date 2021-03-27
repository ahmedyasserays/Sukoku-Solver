let solver = document.querySelector(".solve button");
let reseter = document.querySelector(".reset button");
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

function get_cells(row){
    let values = get_values(row); 
    grid.push(values[0]);
    elements.push(values[1]);
}

function get_grid(){
    let rows = document.querySelectorAll(".row");
    rows.forEach(get_cells);
}

function reset_all(){
    get_grid();
    for(i=0;i<9;i++){
        for (j=0;j<9;j++){
        elements[i][j].querySelector('input').value = "";
        }
    }
}

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


function write(elements, grid){
    for(i=0;i<9;i++){
        for (j=0;j<9;j++){
            elements[i][j].querySelector('input').value = grid[i][j];
        }
    }
    
}

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
                    target_element.className = "failed";
                    target_element.value = 0;
                    if (y === elements[x].length-1){
                        elements[x+1][0].querySelector("input").className = "failed";
                        elements[x+1][0].querySelector("input").value = 0;
                    }else{
                        elements[x][y+1].querySelector("input").className = "failed";
                        elements[x][y+1].querySelector("input").value = 0;
                    }

                }
            }
            await timer(80);
        }return false;
    }else{
        return true;
    }
}

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

function solve(){
    grid = [];
    elements = [];
    get_grid();
    if (check_valid(grid)){ 
        find_solution();
    }else{
        alert('WARNING... this is NOT a valid grid!!');
    }
}

solver.addEventListener("click", solve);
reseter.addEventListener("click", reset_all);
