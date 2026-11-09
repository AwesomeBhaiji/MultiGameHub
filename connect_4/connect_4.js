const board = document.getElementById("board");

let p1_color = "rgb(0, 82, 171)";
let p2_color = "rgb(82, 0, 171)";

let board_array;
let last_tile;
let player;

function Initialize_Game() {
    board.innerHTML = "";
    board.style.pointerEvents = "all";

    board_array = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []};
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

    win_popup.innerHTML = `
        <h3> ${color} won!</h3>
        <button id="close_popup">Close</button>
    `;

    document.getElementById("close_popup").addEventListener("click", () => win_popup.style.display = "none");
}