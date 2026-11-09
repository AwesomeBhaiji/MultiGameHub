// SECTION SETTINGS
let player_count = 4;
let undercover_count = 1;
let mr_white_count = 0;

// ANCHOR Player Count
const player_count_text = document.getElementById("player_count_text");
const player_count_range = document.getElementById("player_count");
player_count_range.addEventListener("input", (event) => {
    player_count = event.target.value;
    player_count_text.innerText = `Player Count (${player_count}):`;
});

// ANCHOR Undercover Count
const undercover_count_text = document.getElementById("undercover_count_text");
const undercover_count_range = document.getElementById("undercover_count");
undercover_count_range.addEventListener("input", (event) => {
    undercover_count = event.target.value;
    undercover_count_text.innerText = `Undercover Count (${undercover_count}):`;
});

// ANCHOR Mr White Count
const mr_white_count_text = document.getElementById("mr_white_count_text");
const mr_white_count_range = document.getElementById("mr_white_count");
mr_white_count_range.addEventListener("input", (event) => {
    mr_white_count = event.target.value;
    mr_white_count_text.innerText = `Mr. White Count (${mr_white_count}):`;
});
// !SECTION

const word_bank = {
    "pets": "cat/dog/bunny/hamster/guinea pig",
    "birds": "parrot/eagle/falcon/sparrow/robin/crow/pigeon/hawk/owl",
    "farm animals": "cow/sheep/pig/chicken/horse/goat",
    "feline predators": "lion/tiger/panther/jaguar/leopard/puma",
    "canine predators": "fox/wolf/hyena/jackal/coyote",

    "motor vehicles": "car/wagon/van/motorcycle/moped/truck",
    "public transport": "taxi/bus/train/rickshaw",
    "non-motor vehicles": "unicycle/bicycle/tricycle/skateboard/scooter",

    "ball sports": "football/basketball/handball/volleyball/throwball",
    "throwing sports": "cricket/discus/shotput",
}

const player_cards_container = document.getElementById("player_cards_container");
const start_button = document.getElementById("start");

let players;
let voting_mode = false;
let evil_count = 0;

function Shuffle_Players() {
    for (let i=players.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i+1));

        [players[i], players[j]] = [players[j], players[i]];
    }
}

// SECTION Player Button Functions
const popup_text = document.getElementById("popup_text");

popup_text.addEventListener("click", () => popup_text.style.display = "none");

// ANCHOR Naming Function
const naming_input = document.getElementById("naming_input");

function Hide_Naming_Input() {
    const index = parseInt(naming_input.dataset.index);
    naming_input.style.display = "none";
    if (players[index].innerText != "") Review_Word(index);
}

naming_input.addEventListener("input", (event) => {
    const index = parseInt(naming_input.dataset.index);
    players[index].innerText = event.target.value;
});
naming_input.addEventListener("keydown", (event) => {if (event.key == "Enter") Hide_Naming_Input()});
naming_input.addEventListener("focusout", Hide_Naming_Input);

function Name_Player(index) {
    naming_input.placeholder = `Player ${index+1}'s Name: `;
    naming_input.value = players[index].innerText;
    naming_input.dataset.index = index;
    naming_input.style.display = "flex";
    naming_input.focus();
}

// ANCHOR Review Word Function
const review_word = document.getElementById("review_word");

review_word.addEventListener("mousedown", () => {
    review_word.style.display = "none";
    popup_text.style.display = "flex";
    const index = parseInt(review_word.dataset.index);
    const player_word = players[index].id.split(",")[1];
    popup_text.innerText = `Your word is: '${player_word}'`;
});
document.addEventListener("mouseup", () => {
    if (!popup_text.style.display) return;
    popup_text.style.display = "none";
})
review_word.addEventListener("focusout", () => review_word.style.display = "none");

function Review_Word(index) {
    review_word.innerText = `Hold to view your word, ${players[index].innerText}`;
    review_word.dataset.index = index;
    review_word.style.display = "flex";
    review_word.focus();
}

// ANCHOR Voting Function
const confirm_vote = document.getElementById("confirm_vote");
const voting_toggle = document.getElementById("voting_toggle");

voting_toggle.addEventListener("click", () => {
    voting_mode = !voting_mode;
    voting_toggle.innerText = (voting_mode) ? "Don't Vote" : "Vote Player";
});

confirm_vote.addEventListener("click", () => {
    confirm_vote.style.display = "none";
    popup_text.style.display = "flex";
    const index = parseInt(confirm_vote.dataset.index);
    const voted_player = players[index];
    
    if (voted_player.id.split(",")[0] == "undercover") {
        popup_text.innerText = "An undercover is out!";
        evil_count -= 1;
    }
    else if (voted_player.id.split(",")[0] == "mr white") {
        popup_text.innerText = "A mr. white is out!";
        evil_count -= 1;
    }
    else {
        popup_text.innerText = "A civilian is out!";
    }

    player_cards_container.removeChild(players.splice(index, 1)[0]);
    for (let i=index; i<=players.length-1; i++) {
        players[i].id = players[i].id.split(",").slice(0, 2).join(",") + `,${i+1}`;
    }

    // if (evil_count == 0 || players.length <= evil_count) {
    //     End_Game();
    //     return;
    // }
});

confirm_vote.addEventListener("focusout", () => confirm_vote.style.display = "none");

function Vote_Player(index) {
    confirm_vote.innerText = `Press me to vote out ${players[index].innerText}`;
    confirm_vote.dataset.index = index;
    confirm_vote.style.display = "flex";
    confirm_vote.focus();
}
// !SECTION

function End_Game() {
    if (evil_count == 0) {
        console.log()
    }
}

start_button.addEventListener("click", () => {
    start_button.innerText = "Restart";
    voting_toggle.style.display = "flex";
    if (voting_mode) voting_toggle.click();
    player_cards_container.innerHTML = "";
    players = [];

    const category = Object.keys(word_bank)[Math.floor(Math.random() * (Object.keys(word_bank).length - 1))];
    const word_set = [...word_bank[category].split("/")];
    const civilian_word = word_set.splice(Math.floor(Math.random() * (word_set.length-1)), 1)[0];
    const undercover_word = word_set.splice(Math.floor(Math.random() * (word_set.length-1)), 1)[0];

    let undercovers_given = 0;
    let mr_whites_given = 0;

    for (let i=1; i<=player_count; i++) {
        let id;
        if (undercover_count - undercovers_given != 0) {
            id = `undercover,${undercover_word}`;
            undercovers_given += 1;
        }
        else if (mr_white_count - mr_whites_given != 0) {
            id = `mr white,mr. white`;
            mr_whites_given += 1;
        }
        else id = `civilian,${civilian_word}`;
        
        const player_card = document.createElement("div");
        player_card.id = id; player_card.className = "player_card";

        players.push(player_card);
        Shuffle_Players();
    }

    evil_count = undercovers_given + mr_whites_given;

    players.forEach((player, index) => {
        player.id += `,${index+1}`;
        player_cards_container.appendChild(player);
        
        player.addEventListener("click", () => {
            const i = parseInt(player.id.split(",")[2]) - 1;

            if (player.innerText == "") Name_Player(i);
            else if (voting_mode) Vote_Player(i);
            else Review_Word(i);
        })
    });
});
