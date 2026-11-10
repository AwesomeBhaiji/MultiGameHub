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

    board_array = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []};
    board.innerHTML += "<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p>";
    for (let y=6; y>=1; y--) {
        for (let x=1; x<=7; x++) {
            
            const tile = document.createElement("div");
            tile.id = `${x}, ${y}`; tile.className = "tile";
            
            board_array[x].push(tile);
            board.appendChild(tile);
        }
    }

    last_tile = null;
    player = 0;
}

Initialize_Game();

document.addEventListener("click", (event) => {
    const clicked_target = event.target;
    if (clicked_target.className == "tile") {
        const tile_position = clicked_target.id.split(", ");
        const fresh_tile = board_array[tile_position[0]].toReversed().find((tile) => !tile.style.backgroundColor);
        if (!fresh_tile) return;    
    
        const player_color = (player % 2) ? p2_color : p1_color;
        fresh_tile.style.backgroundColor = player_color;
        last_tile = fresh_tile;
        Check_Wins(player_color);
        player++;
    }

    else if (clicked_target.id == "restart") {
        Initialize_Game();
    }
});

document.addEventListener("keydown", (event) => {
    const column_number = parseInt(event.key);
    if (!column_number || board.style.pointerEvents == "none") return;
    if (column_number > 7 || column_number < 1) return;

    board.childNodes[column_number+6].click();
});

function Check_Wins(color) {
    const colored_tiles = Array.from(board.childNodes).filter((tile) => tile.style.backgroundColor == color);
    if (!colored_tiles || colored_tiles.length < 4) return;

    if (
        Check_Line_Win(colored_tiles, color, 1, 0) ||
        Check_Line_Win(colored_tiles, color, 0, 1) ||
        Check_Line_Win(colored_tiles, color, 1, 1) ||
        Check_Line_Win(colored_tiles, color, 1, -1)
    ) {
        Game_Won(color);
    }
}

function Check_Line_Win(colored_tiles, color, x_direction, y_direction) {
    return colored_tiles.some((tile) => {
        const [x, y] = tile.id.split(", ").map(Number);
        let connected = 1;

        for (const direction of [-1, 1]) {
            let current_x = x + x_direction * direction;
            let current_y = y + y_direction * direction;

            while (true) {
                const current_tile = Get_Tile_At(current_x, current_y);
                if (!current_tile || current_tile.style.backgroundColor != color) break;

                connected++;
                current_x += x_direction * direction;
                current_y += y_direction * direction;
            }
        }

        return connected >= 4;
    });
}

function Get_Tile_At(x, y) {
    if (x < 1 || x > 7 || y < 1 || y > 6) return null;
    return board_array[x][6 - y];
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