const absolute_keyboard = document.getElementById("absolute_keyboard");
absolute_keyboard.addEventListener("click", () => {
    if (keyboard.style.position == "absolute") {
        absolute_keyboard.innerText = "Sticky Keyboard";
        keyboard.style.position = "static";
        keyboard.style.transform = "translateX(0%)";
    } else {
        absolute_keyboard.innerText = "Non-Sticky Keyboard";
        keyboard.style.position = "absolute";
        keyboard.style.transform = "translateX(-50%)";
    }
});



import word_bank from "../word_bank.json" with {type: "json"};
const five_letter_words = word_bank.five_letter_words.split(", ");

const board = document.getElementById("board");
const virtual_input = document.getElementById("virtual_input");
const keyboard = document.getElementById("keyboard");
const result_popup = document.getElementById("result_popup");
const give_up = document.getElementById("give_up");

let right_spot_color = "hsl(150, 75%, 25%)";
let right_letter_color = "hsl(50, 75%, 25%)";
let wrong_letter_color = "hsl(0, 0%, 10%)";

let word_to_guess;
let current_word;
let current_letter;

const letters = "Q,W,E,R,T,Y,U,I,O,P,\n,A,S,D,F,G,H,J,K,L,\n,Backspace,Z,X,C,V,B,N,M,Enter,\n".split(",");

const letter_rows = letters.join(",").split("\n").length - 1;
keyboard.style.height = `${2*letter_rows}rem;`;

let keyboard_keys;
function Create_Keyboard() {
    keyboard.innerHTML = ""
    keyboard_keys = [];
    let keyboard_row = document.createElement("div"); keyboard_row.className = "keyboard_row";

    for (const index in letters) {
        if (letters[index] == "\n") {
            keyboard.appendChild(keyboard_row);
            keyboard_row = document.createElement("div"); keyboard_row.className = "keyboard_row";
            continue;
        }

        const keyboard_key = document.createElement("button"); keyboard_key.className = "keyboard_key";
        
        if (letters[index] == "Backspace") {
            keyboard_key.innerText = "⌫";
        } else if (letters[index] == "Enter") {
            keyboard_key.innerText = "↵";
        } else keyboard_key.innerText = letters[index];
        
        keyboard_key.addEventListener("click", () => {
            const key = letters[index];
            
            if (keyboard_key.classList.contains("clicked")) {
                keyboard_key.classList.remove("clicked");
            } else {
                setTimeout(() => {
                    keyboard_key.classList.remove("clicked");
                    keyboard_key.pressed_timeout = null;
                }, 100);
                keyboard_key.classList.add("clicked");
            }

            if (result_popup.style.display == "flex") return;
            
            if (key.length == 1 && /[a-zA-Z]/.test(key)) {;
                if (current_letter == 5) return;
                board.childNodes[current_word].childNodes[current_letter].innerText = key.toUpperCase();
                current_letter += 1;
            }
            else if (key == "Enter") {
                if (current_letter != 5) return;
                if (!five_letter_words.includes(board.childNodes[current_word].innerText.split("\n").join("").toLowerCase())) return;
                current_word += 1;
                current_letter = 0;
                Check_Word();
            }
            else if (key == "Backspace") {
                if (current_letter == 0) return;
                board.childNodes[current_word].childNodes[current_letter-1].innerText = "";
                current_letter -= 1        
            };
        });

        keyboard_row.appendChild(keyboard_key);
        keyboard_keys.push(keyboard_key);
    }
}

function Initialize_Game() {
    Create_Keyboard();

    word_to_guess = five_letter_words[Math.floor(Math.random() * (five_letter_words.length - 1))].toUpperCase();
    current_word = 0;
    current_letter = 0;

    let board_html = "";
    for (let y=0; y<6; y++) {
        board_html += `<div class="row_container" id="${y}">`;

        for (let x=0; x<5; x++) {
            board_html += `<div class="letter" id="${x}"></div>`;
        }

        board_html += "</div>"
    }

    board.innerHTML = board_html;
}
Initialize_Game();

function Check_Word() {
    const last_guess_elements = board.childNodes[current_word-1].childNodes;
    let last_guess_word = Array.from(last_guess_elements).map((letter) => letter.innerText).join("");

    let real_word = word_to_guess;

    last_guess_elements.forEach((letter_element) => {
        const guessed_letter = letter_element.innerText;
        const keyboard_element = keyboard_keys.find((keyboard_key) => keyboard_key.innerText == guessed_letter);

        letter_element.style.backgroundColor = wrong_letter_color;
        keyboard_element.style.backgroundColor = wrong_letter_color;
    });

    last_guess_elements.forEach((letter_element, index) => {
        const guessed_letter = letter_element.innerText;
        const real_letter = real_word[index];
        const keyboard_element = keyboard_keys.find((keyboard_key) => keyboard_key.innerText == guessed_letter);

        if (guessed_letter == real_letter) {
            letter_element.style.backgroundColor = right_spot_color;
            keyboard_element.style.backgroundColor = right_spot_color;
            
            real_word = real_word.slice(0,index) + "-" + real_word.slice(index+1);
            last_guess_word = last_guess_word.slice(0,index) + "-" + last_guess_word.slice(index+1);
        }
    });

    Array.from(last_guess_word).forEach((letter, index) => {
        if (letter == "-") return;

        const keyboard_element = keyboard_keys.find((keyboard_key) => keyboard_key.innerText == letter);
        
        if (real_word.includes(letter)) {    
            last_guess_elements[index].style.backgroundColor = right_letter_color;
            keyboard_element.style.backgroundColor = right_letter_color;

            let included_index = Array.from(real_word).findIndex((real_letter) => real_letter == letter);
            real_word = real_word.slice(0,included_index) + "-" + real_word.slice(included_index+1);
            last_guess_word = last_guess_word.slice(0,included_index) + "-" + last_guess_word.slice(included_index+1);
        }
    });

    if (last_guess_word == real_word) Game_Over("Won");
    else if (current_word == 6) Game_Over("Lost");
}

virtual_input.addEventListener("keydown", (event) => {
    const pressed_key = keyboard_keys.find((keyboard_key) => {
        let key = keyboard_key.innerText.toLowerCase();
        if (key == "⌫") key = "backspace";
        else if (key == "↵") key = "enter";
        return key == event.key.toLowerCase();
    });
    if (!pressed_key) return;

    pressed_key.click();
});

function Game_Over(result) {
    result_popup.style.display = "flex";

    result_popup.innerHTML = `
        <h3>You ${result}</h3>
        <p>You used ${current_word}/6</p>
        <p>The word was ${word_to_guess}</p>
        <button id="close_popup">New Word</button>
    `;

    document.getElementById("close_popup").addEventListener("click", () => {
        result_popup.style.display = "none";
        Initialize_Game();
    });
}

give_up.addEventListener("click", () => Game_Over("Lost"));