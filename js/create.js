



// function create(creat_board){
//     find_random_solution(creat_board);
//     const start_answer = Object.assign([], creat_board);
//     let latest_question = Object.assign([], creat_board);
//     let temp_question, target_colm, target_row;
//     for (create_counter=0;create_counter<50;create_counter++){
//         target_row = getRndInteger(0, 8);
//         target_colm = getRndInteger(0, 8);
//         creat_board = Object.assign([], latest_question);
//         if (creat_board[target_row][target_colm] == 0 ){continue;}
//         creat_board[target_row][target_colm]= "";
//         console.log(creat_board);
//         temp_question = Object.assign([], creat_board);
//         find_random_solution(creat_board);
//         if (creat_board == start_answer){
//             latest_question = Object.assign([], temp_question);
//         }else{
//             console.log("this will break", creat_board, start_answer);
//             // break;
//         }
//     }
//     return latest_question;
//     // write(elements, latest_question);
// }

function create_puzzle(){
    get_grid();
    
    write(elements, create(grid));
}

