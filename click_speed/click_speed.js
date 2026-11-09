const time_limit_input = document.getElementById("type_limit_input");

time_limit_input.addEventListener("input", () => {
    time_limit = time_limit_input.value;
});

const click_container = document.getElementById("click_container");
const result_popup = document.getElementById("result_popup");
const count_text = document.getElementById("count_text");
const time_text = document.getElementById("time_text");



let time_limit;
let current_time;
let click_count;
let running;

function Initialize_Game() {
    time_limit = time_limit_input.value;
    current_time = 0;
    click_count = 0;

    click_container.innerHTML = "";
    side_section.style.pointerEvents = "none";
    result_popup.style.display = "none";
    time_text.innerText = time_limit;
    count_text.innerText = click_count;
}

click_container.addEventListener("mousedown", (event) => {
    if (!running) {
        Initialize_Game();
        running = true;
        Loop();
    };

    if (result_popup.style.display == "flex") return;

    click_container.innerHTML += `<div class="click_point" style="top: ${event.offsetY}; left: ${event.offsetX};"></div>`;
    click_count += 1;
    count_text.innerText = click_count;
});

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

function Result() {
    side_section.style.pointerEvents = "all";
    result_popup.style.display = "flex";

    const cps = (click_count / time_limit).toFixed(2);

    result_popup.innerHTML = `
        <h3>clicks: ${click_count}</h3>
        <h3>click(s) per second: ${cps}</h3>
        <button id="close_popup">Close</button>
    `;

    setTimeout(() => {
        document.getElementById("close_popup").addEventListener("click", () => {
            result_popup.style.display = "none";
            running = false;
        });
    }, 500);
}