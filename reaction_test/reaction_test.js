const attempts_input = document.getElementById("attempts_input");

attempts_input.addEventListener("input", () => {
    attempts = attempts_input.value;
});

const click_container = document.getElementById("click_container");
const result_popup = document.getElementById("result_popup");
const count_text = document.getElementById("count_text");
const time_text = document.getElementById("time_text");



let attempts;
let current_attempt;
let reaction_times;
let react_start_time;
let react_timeout;

let react_color = "rgb(23, 82, 23)";
let fail_color = "rgb(82, 23, 23)";

function Initialize_Game() {
    attempts = attempts_input.value;
    current_attempt = 0;
    reaction_times = [];
    react_start_time = null;
    react_timeout = null;

    click_container.innerText = `Click To Start\nAttempt: ${current_attempt}/${attempts}`;
    click_container.style.pointerEvents = "all";
    side_section.style.pointerEvents = "none";
    result_popup.style.display = "none";
}
Initialize_Game();

click_container.addEventListener("mousedown", () => {
    if (result_popup.style.display == "flex") return;

    if (click_container.innerText) {
        click_container.style.backgroundColor = "";

        react_timeout = setTimeout(() => {
            click_container.style.backgroundColor = react_color;
            react_start_time = performance.now();
        }, (((Math.random()+1) * 25) ** 2));
        
        click_container.innerText = "";
        return;
    };

    if (click_container.style.backgroundColor == react_color) {
        reaction_times.push(performance.now() - react_start_time);
        react_start_time = null;
        current_attempt += 1;
    } else {
        click_container.style.backgroundColor = fail_color;
    }
    
    if (current_attempt == attempts) {
        Result();
        return;
    };
    
    clearTimeout(react_timeout);
    click_container.innerText = `Click To Start\nAttempt: ${current_attempt}/${attempts}`;
});

function Result() {
    click_container.style.pointerEvents = "none";
    side_section.style.pointerEvents = "all";
    result_popup.style.display = "flex";

    const average_reaction_time = reaction_times.reduce((sum, reaction_time) => sum + reaction_time, 0) / reaction_times.length;

    result_popup.innerHTML = `
        <h4>Average Reaction Time: ${average_reaction_time}</h4>
        <h4>Reaction Times: ${reaction_times}</h4>
        <button id="close_popup">Close</button>
    `;

    setTimeout(() => {
        document.getElementById("close_popup").addEventListener("click", () => {
            Initialize_Game();
        });
    }, 500);
}