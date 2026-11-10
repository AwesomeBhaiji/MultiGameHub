import word_bank from "../word_bank.json" with {type: "json"};
const common_words = word_bank.common_words.split(", ");



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

const time_limit_input = document.getElementById("type_limit_input");
time_limit_input.addEventListener("input", () => {
    time_limit = time_limit_input.value;
    Generate_Word_List();
});

const right_color_input = document.getElementById("right_color_input");
const error_color_input = document.getElementById("error_color_input");

let right_color;
let error_color;

function Hex_To_Rgb(color) {
    color = color.replace('#', '');

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    return `rgb(${r}, ${g}, ${b})`;
}



const word_container = document.getElementById("word_container");
const input_container = document.getElementById("input_container");
const virtual_input = document.getElementById("virtual_input");
const keyboard = document.getElementById("keyboard");
const result_popup = document.getElementById("result_popup");
const time_text = document.getElementById("time_text");

let word_list;
let time_limit;
let current_time;
let word_index
let running;

const letters = "q,w,e,r,t,y,u,i,o,p,\n,a,s,d,f,g,h,j,k,l,\n,Backspace,z,x,c,v,b,n,m,\n, ,\n".split(",");

const letter_rows = letters.join(",").split("\n").length - 1;
keyboard.style.height = `min(calc(${2*letter_rows}rem + ${10*letter_rows+1}px));`

const keyboard_keys = [];
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
    } else if (letters[index] == " ") {
        keyboard_key.innerText = " ";
        keyboard_key.classList.add("long_key");
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

        if (!running && key.length == 1 && /[a-zA-Z]/.test(key)) {
            Initialize_Game();
            running = true;
            Loop();
        }

        if (result_popup.style.display == "flex") return;

        input_container.childNodes[word_index].style.color = "var(--text-normal)";

        if (key.length == 1 && /[a-zA-Z]/.test(key)) input_container.childNodes[word_index].innerText += `${key}`;
        if (key.length == 1 && key == " ") New_Word_Input();
        else if (key == "Backspace") Remove_Letter();
    });

    keyboard_row.appendChild(keyboard_key);
    keyboard_keys.push(keyboard_key);
}

function Generate_Word_List() {
    word_list = [];
    time_limit = time_limit_input.value;
    word_container.innerHTML = "";
    input_container.innerHTML = "";
    
    for (let i=0; i<500/(60/time_limit); i++) {
        const random_word = common_words[Math.floor(Math.random() * (common_words.length - 1))];
        word_list.push(random_word);
        word_container.innerHTML += `<span class="bg_text">${random_word} </span>`;
        input_container.innerHTML += `<span class="fg_text"></span>`;
    }
}
Generate_Word_List();

function Initialize_Game() {
    right_color = Hex_To_Rgb(right_color_input.value);
    error_color = Hex_To_Rgb(error_color_input.value);

    time_limit = time_limit_input.value;
    current_time = 0;
    word_index = 0;
    
    result_popup.style.display = "none";
    time_text.innerText = time_limit;
}

virtual_input.addEventListener("keydown", (event) => {
    event.preventDefault();

    const pressed_key = keyboard_keys.find((keyboard_key) => {
        let key = keyboard_key.innerText.toLowerCase();
        if (key == "⌫") key = "backspace";
        return (key || " ") == event.key.toLowerCase()});
    if (!pressed_key) return;


    pressed_key.click();
});

function Remove_Letter() {
    const current_word_element = word_container.childNodes[word_index-1];
    const latest_word_element = input_container.childNodes[word_index];
    const latest_word = latest_word_element.innerText.trim();

    if (latest_word.length == 0) {
        word_index = Math.max(0, word_index-1);
        current_word_element.innerText = `${current_word_element.innerText.trim()} `;

    } else {
        latest_word_element.innerText = latest_word_element.innerText.slice(0, -1);
    }
}

function New_Word_Input() {
    const current_word_element = word_container.childNodes[word_index];
    const current_word = current_word_element.innerText.trim();
    const latest_word_element = input_container.childNodes[word_index]
    const latest_word = latest_word_element.innerText.trim();
    
    if (current_word == latest_word) latest_word_element.style.color = right_color;
    else {
        if (latest_word.length > current_word.length) {
            current_word_element.innerText += " ".repeat(latest_word.length - current_word.length);
        } else {
            latest_word_element.innerText += " ".repeat(current_word.length - latest_word.length);
        }

        latest_word_element.style.color = error_color;
    };
    word_index += 1;
    input_container.childNodes[word_index].innerText = " ";
}

async function Loop() {
    time_text.innerText = time_limit - current_time;

    if (current_time == time_limit) {
        Result();
        return;
    }

    setTimeout(() => {
        current_time += 1;
        Loop();
    }, 1000);
}

function Get_Results() {
    New_Word_Input();
    const words = word_container.innerText.split(" ");
    const typed_words = input_container.innerText.split(" ");

    let total_words = 0;
    let valid_words = 0;
    let valid_letters = 0;

    for (let i=0; i<typed_words.length; i++) {
        if (typed_words[i] == "") continue;
        if (typed_words[i] == words[i]) {
            valid_words += 1;
            valid_letters += typed_words[i].length;
        };
        total_words += 1;
    }

    return {total_words, valid_words, valid_letters};
}

function Result() {
    const {total_words, valid_words, valid_letters} = Get_Results();
    const lps = (valid_letters / time_limit).toFixed(2);
    const wpm = valid_words * (60 / time_limit);
    const accuracy = (valid_words / total_words * 100).toFixed(2);

    side_section.style.pointerEvents = "all";
    result_popup.style.display = "flex";

    result_popup.innerHTML = `
        <h3>letter(s) per second: ${lps}</h3>
        <h3>word(s) per minute: ${wpm}</h3>
        <h3>accuracy: ${accuracy}%</h3>
        <button id="close_popup">Restart</button>
    `;

    setTimeout(() => {
        document.getElementById("close_popup").addEventListener("click", () => {
            result_popup.style.display = "none";
            Generate_Word_List();
            running = false;
        });
    }, 500);
}