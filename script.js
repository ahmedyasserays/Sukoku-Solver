let button = document.querySelector(".solve");

let grid = [];
let elements = [];

function get_values(row){
    let temp = row.querySelectorAll('.cell');
    let cells = [];
    let inputs = [];
    for (i=0; i<9;i++){
        let num_input = temp[i];
        cells[i] = num_input.querySelector("input").value;
        inputs.push(num_input);
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

function reset_all(inpt){
    inpt.querySelector("input").value = "";
}

function get_empty(grid){
    for (i=0;i<9;i++){
        for (j=0;j<9;j++){
            if (grid[i][j] == "" || grid[i][j] == 0){
                return [i, j];
            }
        }
    }
    return false;
}

function is_possible(x, y, n, grid){
    for (let i=0;i<9;i++){
        if (grid[i][y] == n && i != x || grid[x][i] == n && i != y){
            return false;
        }
    }
    
    let x0 = (Math.floor(x / 3))*3;
    let y0 = (Math.floor(y / 3))*3;
    for (i=0;i<3;i++){
        for (j=0;j<3;j++){
            if (grid[x0+i][y0+j] == n && i != x && j != y){
                return false;
            }
        }
    }
    return true;
    // for (let i = 0; i < 9; i++) {
    //     let m = 3 * Math.floor(x / 3) + Math.floor(i / 3);
    //     let n = 3 * Math.floor(y / 3) + i % 3;
    //     if (grid[x][i] == ى || grid[i][y] == ى || grid[m][n] == ى) {
    //         return false;
    //     }
    // }
    // return true;
}

function write(elements, grid){
    for(i=0;i<9;i++){
        for (j=0;j<9;j++){
        elements[i][j].querySelector('input').value = grid[i][j];
        }
    }
    
}

function find_solution(){
    let empty = get_empty(grid)
    if (empty){
        let x = empty[0];
        let y = empty[1];
        for (let n=1;n<10;n++){
            if (is_possible(x, y, n, grid)){
                grid[x][y] = n;
                setTimeout(write(elements, grid), 10);
                if (find_solution()){
                    setTimeout(write(elements, grid), 10);
                    return true;
                }else{
                    grid[x][y] = 0;
                    setTimeout(write(elements, grid), 10);
                }
            }
        }return false;
    }else{
        return true;
    }
}

function solve(){
    grid = [];
    get_grid();
    find_solution();
    
}

button.addEventListener("click", solve);