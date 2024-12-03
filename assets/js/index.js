const see_all_players_section = document.getElementById("all-players-section")
const filtered_players_section = document.getElementById("players-filtered");

const FormAll=document.getElementById('formumaireAll')
const see_all_players_button = document.getElementById("all-players")
const see_all_players = document.querySelector(".see-all-players")
const add_player_button = document.getElementById("add-player")
const add_player_form = document.getElementById("add-player-form")
const close_form_button = document.getElementById("close-form")
const form_layover = document.querySelector(".layover")
const form = document.getElementById("form")
const save_button_form = document.getElementById("save-player-button")
const clear_player_card = document.getElementById("empty-card")
const clear_all_cards_button = document.getElementById("clear-cards");



// Basic Information
const photo_input = document.getElementById("photo");
const position_input = document.getElementById("position");
const flag_input = document.getElementById("flag");
const logo_input = document.getElementById("logo");

// Ratings and Stats
const rating_input = document.getElementById("rating");
const pace_input = document.querySelector('label[for="pace"]');
const shooting_input =  document.querySelector('label[for="shooting"]');
const passing_input = document.querySelector('label[for="passing"]');
const dribbling_input = document.querySelector('label[for="dribbling"]');
const defending_input = document.querySelector('label[for="defending"]');
const physical_input = document.querySelector('label[for="physical"]');


let sum;

let dataArray = null
let editIndex = null
let currentPosition = null;
let isAllPlayersSectionOpen = false
let isFilteredPlayerSectionOpen = false
let new_player_card



//Récupération des données du json 
async function getData(){
    try {
        const response = await fetch("assets/Data/players.json")
        if(!response.ok){
        throw new Error(`Response status: ${response.status}`)
    }

    const data = await response.json()
    dataArray = data.players
    
}catch (error){
    console.error(error.message)
}
}



//pour l'affichage des joueurs

see_all_players_button.addEventListener("click",()=>{
    if(isAllPlayersSectionOpen == false){
        see_all_players_section.classList.remove("hidden")
        see_all_players_section.classList.add("flex")
        isAllPlayersSectionOpen = true
        displayPlayers()
    }else{
        see_all_players_section.classList.remove("flex")
        see_all_players_section.classList.add("hidden")
        isAllPlayersSectionOpen = false
    }
    updateOpenCloseSection()

})

add_player_button.addEventListener("click",()=>{
    add_player_form.classList.remove("hidden");
})
close_form_button.addEventListener("click",()=>{
    add_player_form.style.display="none";
})
form_layover.addEventListener("click",()=>{
    add_player_form.classList.add("hidden")
})

form.addEventListener("click",e => e.stopPropagation())



function updateLabel(){
    if(position_input.value == "GK"){
        pace_input.innerText = "Diving"
        shooting_input.innerText = "Handling"
        passing_input.innerText = "Kicking"
        dribbling_input.innerText = "Reflexes"
        defending_input.innerText = "Speed"
        physical_input.innerText = "Positioning"
    }else{
        pace_input.innerText = "Pace"
        shooting_input.innerText = "Shooting"
        passing_input.innerText = "Passing"
        dribbling_input.innerText = "Dribbling"
        defending_input.innerText = "Defending"
        physical_input.innerText = "Physical"
    }
}


position_input.addEventListener("change",updateLabel)
form.addEventListener("submit", e => {
    e.preventDefault();// stop reload page
    // console.log('teeeeeeeeeeeeeeeeeeest');

    const name_input = document.getElementById("name").value.trim();
    const nationality_input = document.getElementById("nationality").value.trim();
    const club_input = document.getElementById("club").value.trim();

    // const flg = document.getElementById("flag").value;
    
    const has_Numbers_Or_Special_Chars = /[^A-Za-z\s]/;
    const name_test = has_Numbers_Or_Special_Chars.test(name_input);
    const club_test = has_Numbers_Or_Special_Chars.test(club_input);
    const nationality_test = has_Numbers_Or_Special_Chars.test(nationality_input);

    const has_only_one_word = /^\w+$/;
    const nationality_one_word_test = has_only_one_word.test(nationality_input);

    if (!nationality_one_word_test) {
        alert("Nationality should be one word");
        return;
    }

    if (name_test || club_test || nationality_test) {
        alert("name, club, or nationality should not contain numbers or special characters.");
        return;
    }

    let new_player_card;
    if (position_input.value === "GK") {
        new_player_card = {
            name: name_input,
            photo: photo_input.value,
            position: position_input.value,
            nationality: nationality_input,
            flag:flag_input.value,
            club: club_input.value,
            logo: logo_input.value,
            rating: rating_input.value,
            diving: document.getElementById("pace").value,
            handling: document.getElementById("shooting").value,
            kicking: document.getElementById("passing").value,
            reflexes: document.getElementById("dribbling").value,
            speed: document.getElementById("defending").value,
            positioning: document.getElementById("physical").value,
        };
    } else {
        new_player_card = {
            name: name_input,
            photo: photo_input.value,
            position: position_input.value,
            nationality: nationality_input,
            flag: flag_input.value,
            club: club_input.value,
            logo: logo_input.value,
            rating: rating_input.value,
            pace: document.getElementById("pace").value,
            shooting: document.getElementById("shooting").value,
            passing: document.getElementById("passing").value,
            dribbling: document.getElementById("dribbling").value,
            defending: document.getElementById("defending").value,
            physical: document.getElementById("physical").value,
        };

        console.log("playerrrrrr : ", new_player_card);
        
    }

    if (editIndex !== null) {
        dataArray[editIndex] = new_player_card;
        editIndex = null;
        save_button_form.innerText = "Save Player";
    } else {
        dataArray.push(new_player_card);
    }
    displayPlayers();
    form.reset();
    add_player_form.style.display = "none"; // Cacher après l'enregistrement
});

// Afficher le formulaire lorsqu'on clique sur "Add Player"
add_player_button.addEventListener("click", () => {
    add_player_form.style.display = "block";
    form.reset(); // Réinitialiser les champs pour un nouvel ajout
    editIndex = null; // S'assurer qu'on n'est pas en mode édition
    save_button_form.innerText = "Add Player"; // Ajuster le texte
});


function displayPlayers(){
    see_all_players.innerHTML = ""
    
    dataArray.forEach((element, index) => {
        const div = document.createElement("div")
        div.classList.add("relative", "text-light_orange-500", "text-[8px]", "cursor-pointer")

        div.innerHTML = `
            <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
            <img class="w-14 h-14 absolute left-7 top-4" src="${element.photo}" alt="">
            <img class="flag w-2 h-2 absolute left-5 top-1/3" src="${element.flag}" background-size: contain; background-repeat: no-repeat;"></img>
            <p class="position absolute left-[19px] font-bold top-3">${element.name} </p>
            <p class="position absolute left-[18px] font-bold  top-7">${element.position}</p>
            <p class="rating absolute left-5 top-[50px] font-bold ">${element.rating} </p>
            <p class="shooting absolute left-4 top-[78px]">${element.position == "GK" ? "DIV" : "SHO"} :<span>${element.position == "GK" ? element.diving : element.shooting} </span></p>
            <p class="pace absolute left-4 top-24">${element.position == "GK" ? "HAN :" : "PAC : "}<span>${element.position == "GK" ? element.handling : element.pace} </span></p>
            <p class="passing absolute left-4 top-[87px]">${element.position == "GK" ? "KIC : " : "PAS : "}<span>${element.position == "GK" ? element.kicking : element.passing} </span></p>
            <p class="dribbling absolute left-12 top-[78px]">${element.position == "GK" ? "REF :" : "DRI : "}<span>${element.position == "GK" ? element.reflexes : element.dribbling} </span></p>
            <p class="defending absolute left-12 top-24">${element.position == "GK" ? "SPD : " : "DEF : "}<span>${element.position == "GK" ? element.speed : element.defending} </span></p>
            <p class="physical absolute left-12 top-[87px]">${element.position == "GK" ? "POS : " : "PHY : "}<span>${element.position == "GK" ? element.positioning : element.physical} </span></p>
        `
        div.addEventListener("click",()=>{
            DisplayCardCentered(element,index);
        })
        see_all_players.appendChild(div)
    });

}

function DisplayCardCentered(element, index) {
    const overlay = document.createElement("div");
    overlay.classList.add(
        "fixed", "inset-0", "bg-black", "bg-opacity-50", "z-50", 
        "flex", "items-center", "justify-center", "p-4"
    );

    const container = document.createElement("div");
    container.classList.add("flex", "items-center", "space-x-4");

    const enlarged_card_div = document.createElement("div");
    enlarged_card_div.classList.add(
        "relative", "text-light_orange-500", "text-[8px]", 
        "transform", "scale-150", "origin-center"
    );
    enlarged_card_div.innerHTML = `
        <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
        <img class="w-14 h-14 absolute left-7 top-4" src="${element.photo}" alt="">
        <img class="w-2 h-2 absolute left-5 top-1/3" src="${element.flag}">
        <p class="position absolute left-[19px] font-bold top-3">${element.name} </p>
        <p class="position absolute left-[18px] font-bold  top-7">${element.position}</p>
        <p class="rating absolute left-5 top-[50px] font-bold ">${element.rating} </p>
        <p class="shooting absolute left-4 top-[78px]">${element.position == "GK" ? "DIV" : "SHO"} :<span>${element.position == "GK" ? element.diving : element.shooting} </span></p>
        <p class="pace absolute left-4 top-24">${element.position == "GK" ? "HAN :" : "PAC : "}<span>${element.position == "GK" ? element.handling : element.pace} </span></p>
        <p class="passing absolute left-4 top-[87px]">${element.position == "GK" ? "KIC : " : "PAS : "}<span>${element.position == "GK" ? element.kicking : element.passing} </span></p>
        <p class="dribbling absolute left-12 top-[78px]">${element.position == "GK" ? "REF :" : "DRI : "}<span>${element.position == "GK" ? element.reflexes : element.dribbling} </span></p>
        <p class="defending absolute left-12 top-24">${element.position == "GK" ? "SPD : " : "DEF : "}<span>${element.position == "GK" ? element.speed : element.defending} </span></p>
        <p class="physical absolute left-12 top-[87px]">${element.position == "GK" ? "POS : " : "PHY : "}<span>${element.position == "GK" ? element.positioning : element.physical} </span></p>
    `;

    const buttons_div = document.createElement("div");
    buttons_div.classList.add("flex", "flex-col", "space-y-2");

    const edit_button = document.createElement("button");
    edit_button.textContent = "Edit";
    edit_button.classList.add("bg-yellow-500", "text-white", "px-4", "py-2", "rounded","hover:bg-yellow-600", "transition", "duration-300");
    edit_button.addEventListener("click", () => {
        add_player_form.style.display="block";
        document.body.removeChild(overlay);
        editIndex = index
        editPlayer(editIndex)
    });

    const delete_button = document.createElement("button");
    delete_button.textContent = "Delete";
    delete_button.classList.add("bg-red-500", "text-white", "px-4", "py-2", "rounded","hover:bg-red-600", "transition", "duration-300");
    
    delete_button.addEventListener("click",() => {
        dataArray.splice(index, 1);
        document.body.removeChild(overlay);
        displayPlayers()
    });

    buttons_div.appendChild(edit_button);
    buttons_div.appendChild(delete_button);

    container.appendChild(enlarged_card_div);
    container.appendChild(buttons_div);

    overlay.appendChild(container);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    document.body.appendChild(overlay);
}

function editPlayer(index) {
    const player = dataArray[index];
    
    document.getElementById("name").value = player.name;
    document.getElementById("nationality").value = player.nationality;
    document.getElementById("club").value = player.club;

    document.getElementById("position").value = player.position;
    updateLabel();
    document.getElementById("photo").value=player.photo;
    document.getElementById("flag").value=player.flag;
    document.getElementById("logo").value=player.logo;
    document.getElementById("rating").value = player.rating;

    if (player.position !== "GK") {
        document.getElementById("pace").value = player.pace;
        document.getElementById("shooting").value = player.shooting;
        document.getElementById("passing").value = player.passing;
        document.getElementById("dribbling").value = player.dribbling;
        document.getElementById("defending").value = player.defending;
        document.getElementById("physical").value = player.physical;
    } else {
        document.getElementById("pace").value = player.diving;
        document.getElementById("shooting").value = player.handling;
        document.getElementById("passing").value = player.kicking;
        document.getElementById("dribbling").value = player.reflexes;
        document.getElementById("defending").value = player.speed;
        document.getElementById("physical").value = player.positioning;
    }

    save_button_form.innerText = "Save Edits";
}








