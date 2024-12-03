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