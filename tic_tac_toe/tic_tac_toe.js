const p1_color_input = document.getElementById("p1_color_input");
const p2_color_input = document.getElementById("p2_color_input");

let p1_color;
let p2_color;

function Hex_To_Rgb(color) {
    color = color.replace('#', '');

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    return `rgb(${r}, ${g}, ${b})`;
}



const board = document.getElementById("board");
const win_popup = document.getElementById("win_popup");

let board_array;
let last_tile;
let player;

function Initialize_Game() {
    p1_color = Hex_To_Rgb(p1_color_input.value);
    p2_color = Hex_To_Rgb(p2_color_input.value);

    board.innerHTML = "";
    win_popup.style.display = "none";
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

    const winner = (color == p1_color) ? "Player 1" : "Player 2";   

    win_popup.innerHTML = `
        <h3> ${winner} won!</h3>
        <div class="row_container">
            <button id="restart">Restart</button>
            <button id="close">Close</button>
        </div>
    `;

    document.getElementById("restart").addEventListener("click", Initialize_Game);
    document.getElementById("close").addEventListener("click", () => win_popup.style.display = "none");
}