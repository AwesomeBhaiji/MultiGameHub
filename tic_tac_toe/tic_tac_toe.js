const board = document.getElementById("board");
const win_popup = document.getElementById("win_popup");

let p1_color = "rgb(0, 171, 255)";
let p2_color = "rgb(171, 0, 255)";

let board_array;
let last_tile;
let player;

function Initialize_Game() {
    board.innerHTML = "";
    board.style.pointerEvents = "all";

    board_array = [];
    for (let i=1; i<=9; i++) {
        const tile = document.createElement("div");
        tile.id = `${i}`; tile.className = "tile";
        
        board_array.push(tile);
        board.appendChild(tile);
    }

    last_tile = null;
    player = 0;
}

Initialize_Game();

document.addEventListener("click", (event) => {
    const clicked_target = event.target;
    if (clicked_target.className == "tile") {
        const player_color = (player % 2) ? p2_color : p1_color;
        clicked_target.style.backgroundColor = player_color;
        clicked_target.style.pointerEvents = "none";
        Check_Wins(player_color);
        player++;
    }
    
    else if (clicked_target.id == "restart") {
        Initialize_Game();
    }
});

const all_possible_wins = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9],
    [1, 4, 7], [2, 5, 8], [3, 6, 9],
    [1, 5, 9], [3, 5, 7]
]

function Check_Wins(color) {
    const colored_tiles = Array.from(board.childNodes).filter((tile) => tile.style.backgroundColor == color).map((tile) => parseInt(tile.id));
    console.log(colored_tiles);
    if (!colored_tiles || colored_tiles.length < 3) return;

    for (const win_condition of all_possible_wins) {
        let this_condition = false;

        for (const required_tile of win_condition) {
            if (!colored_tiles.includes(required_tile)) {
                this_condition = false
                break;
            } else this_condition = true;
        }

        if (this_condition) {
            Game_Won(color);
            break;
        }
    }
}

function Game_Won(color) {
    board.style.pointerEvents = "none";
    win_popup.style.display = "flex";

    win_popup.innerHTML = `
        <h3> ${color} won!</h3>
        <button id="close_popup">Close</button>
    `;

    document.getElementById("close_popup").addEventListener("click", () => win_popup.style.display = "none");
}