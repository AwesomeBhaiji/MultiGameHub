const header = document.getElementsByTagName("header")[0];
const side_section = document.getElementById("side_section");

const row_container = document.createElement("div"); row_container.className = "row_container";
const games_dropdown = document.createElement("div"); games_dropdown.className = "dropdown_container"; games_dropdown.id = "games_dropdown";
const dropdown_button = document.createElement("button"); dropdown_button.className = "dropdown_button"; dropdown_button.dataset.open = "false";
const options_container = document.createElement("div"); options_container.className = "options_container";
const sidebar_toggle = document.createElement("button"); sidebar_toggle.innerText = "Toggle Sidebar";

row_container.appendChild(games_dropdown); 
if (side_section) row_container.appendChild(sidebar_toggle);
games_dropdown.appendChild(dropdown_button); games_dropdown.appendChild(options_container);
header.appendChild(row_container);

const games = ["click_speed", "connect_4", "mr_white", "reaction_test", "tank_game", "tic_tac_toe", "type_test", "wordle"];

dropdown_button.addEventListener("click", () => {
    dropdown_button.dataset.open = (dropdown_button.dataset.open == "false") ? "true" : "false";

    options_container.childNodes.forEach((option_element) => {
        if (dropdown_button.dataset.open == "true") option_element.classList.add("shown");
        else option_element.classList.remove("shown");
    });
});

games.forEach((game, index) => {
    const current_game = window.location.href.split("/").at(-1).split(".")[0];
    const option_element = document.createElement("button"); option_element.className = "option_element";
    option_element.innerText = `${game.split("_").join(" ")}`;
    option_element.style.setProperty("--i", `${index+1}`);
    option_element.addEventListener("click", () => window.location.href = `/${game}/${game}.html`);
    
    if (current_game == game) {
        option_element.classList.add("selected");
        dropdown_button.innerText = current_game.split("_").join(" ");
    }

    if (!dropdown_button.innerText) dropdown_button.innerText = "Games";

    options_container.appendChild(option_element);
});

sidebar_toggle.addEventListener("click", () => {
    side_section.style.display = (side_section.style.display == "none") ? "flex" : "none";
});