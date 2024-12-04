const see_all_players_section = document.getElementById("all-players-section")
const filtered_players_section = document.getElementById("players-filtered");

const FormAll=document.getElementById('formulaireAll')
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
// on va lais utilisé aprés 
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



//pour l'affichage des joueurs et le masquage des joueure lors du cli

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
//event liste pouer boton ajjouter player
add_player_button.addEventListener("click",()=>{
    add_player_form.classList.remove("hidden");
})


//event liste pouer boton fermer formulaire
close_form_button.addEventListener("click",()=>{
    add_player_form.style.display="none";
})

//écran qui apparaît derrière le formulaire
form_layover.addEventListener("click",()=>{
    add_player_form.classList.add("hidden")
})
// l'événement de clic pourrait également se propager et être capté par le fond deriere le formulaire. 
form.addEventListener("click",e => e.stopPropagation())

//mettre à jour labels des statistiques des joueurs en fonction de leur position (GK) ou non.

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

//chaque fois que l'utilisateur modifie la valeur de cet élément, la fonction updateLabel sera exécutée.
position_input.addEventListener("change",updateLabel)



//écoute l'événement submit sur le formulaire et effectue des actions lorsque l'utilisateur soumet ce formulaire
form.addEventListener("submit", e => {
    e.preventDefault();// stop reload paaaage
    // console.log('teeeeeeeeeeeeeeeeeeest');


// recuperation donnees ecrit
    const name_input = document.getElementById("name").value.trim();
    const nationality_input = document.getElementById("nationality").value.trim();
    const club_input = document.getElementById("club").value.trim();

    //validation des input  des caractères invalide
    const has_Numbers_Or_Special_Chars = /[^A-Za-z\s]/;
    const name_test = has_Numbers_Or_Special_Chars.test(name_input);
    const club_test = has_Numbers_Or_Special_Chars.test(club_input);
    const nationality_test = has_Numbers_Or_Special_Chars.test(nationality_input);
//Vérification si la nationalité contient un seul mot 
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

//Création d'un objet new player

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
//Mise à jour  du joueur
//edit index un indice dans le tableau dataArray qui représente l'emplacement du joueur à modifier
    if (editIndex !== null) {// si nest pas nul 
        dataArray[editIndex] = new_player_card; //objet du newplayer
        editIndex = null;//apres modif reset le index
        save_button_form.innerText = "Save Player";//changer le texte de bouton
    } else {
        dataArray.push(new_player_card);
    }
    displayPlayers();//Affichage des joueurs
    form.reset();//éinitialisation du formulaiire
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
//relative cad paraport au doc non pas le parent
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
        //je clique sur carte sur terrain
        div.addEventListener("click",()=>{
            DisplayCardCentered(element,index);
        })
        see_all_players.appendChild(div)
    });

}
//visualiser lelement avec un overlay com bagrond
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
//btn suprimer
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
//edit
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



//filtrerles joueurd dependant du clik du position

function getPlayersByPosition(position) {
    return dataArray.filter(player => player.position === position);
}
//emplit dynamiquement une section d'affichage de joueurs en fonction de leur position

function populatePlayersSection(targetPosition) {
    const players_container = filtered_players_section.querySelector(".players");
    
    players_container.innerHTML = "";
    
    const position_players = getPlayersByPosition(targetPosition);
    
    if (position_players.length === 0) {
        filtered_players_section.classList.add("hidden");
        return;
    }
    
    position_players.forEach(player => {
        const player_card = document.createElement("div");
        player_card.classList.add("relative", "text-light_orange-500", "text-[8px]", "cursor-pointer");
        
        player_card.innerHTML = `
            <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
            <img class="w-14 h-14 absolute left-7 top-4" src="${player.photo}" alt="">
            <div class="flag w-2 h-2 absolute left-5 top-11" style="background-image: url(${player.flag}); background-size: contain; background-repeat: no-repeat;"></div>
            <p class="position absolute left-[19px] font-bold top-3">${player.name} </p>
            <p class="position absolute left-[18px] font-bold  top-7">${player.position}</p>
            <p class="rating absolute left-5 top-[50px] font-bold ">${player.rating} </p>
            <p class="shooting absolute left-4 top-[78px]">${player.position == "GK" ? "DIV" : "SHO"} :<span>${player.position == "GK" ? player.diving : player.shooting} </span></p>
            <p class="pace absolute left-4 top-24">${player.position == "GK" ? "HAN :" : "PAC : "}<span>${player.position == "GK" ? player.handling : player.pace} </span></p>
            <p class="passing absolute left-4 top-[87px]">${player.position == "GK" ? "KIC : " : "PAS : "}<span>${player.position == "GK" ? player.kicking : player.passing} </span></p>
            <p class="dribbling absolute left-12 top-[78px]">${player.position == "GK" ? "REF :" : "DRI : "}<span>${player.position == "GK" ? player.reflexes : player.dribbling} </span></p>
            <p class="defending absolute left-12 top-24">${player.position == "GK" ? "SPD : " : "DEF : "}<span>${player.position == "GK" ? player.speed : player.defending} </span></p>
            <p class="physical absolute left-12 top-[87px]">${player.position == "GK" ? "POS : " : "PHY : "}<span>${player.position == "GK" ? player.positioning : player.physical} </span></p>
        `;
        
        player_card.addEventListener("click", () => {
            const placeholder_card = document.getElementById(`${targetPosition.toLowerCase()}-placeholder`);
            placeholder_card.innerHTML = `
                <div class="relative text-light_orange-500 cursor-pointer text-[8px] font-normal hover:scale-150 hidden 680:block">
                    <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
                    <img class="w-14 h-14 absolute left-7 top-4" src="${player.photo}" alt="">
                    <div class="flag w-2 h-2 absolute left-5 top-1/3" style="background-image: url(${player.flag}); background-size: contain; background-repeat: no-repeat;"></div>
                    <p class="position absolute left-[18px] font-bold top-7">${player.position}</p>
                    <p class="rating absolute left-5 top-[50px] font-bold">${player.rating}</p>
                    <p class="shooting absolute left-4 top-[78px]">${player.position == "GK" ? "DIV" : "SHO"} : <span>${player.position == "GK" ? player.diving : player.shooting}</span></p>
                    <p class="pace absolute left-4 top-24">${player.position == "GK" ? "HAN :" : "PAC : "}<span>${player.position == "GK" ? player.handling : player.pace}</span></p>
                    <p class="passing absolute left-4 top-[87px]">${player.position == "GK" ? "KIC : " : "PAS : "}<span>${player.position == "GK" ? player.kicking : player.passing}</span></p>
                    <p class="dribbling absolute left-12 top-[78px]">${player.position == "GK" ? "REF :" : "DRI : "}<span>${player.position == "GK" ? player.reflexes : player.dribbling}</span></p>
                    <p class="defending absolute left-12 top-24">${player.position == "GK" ? "SPD : " : "DEF : "}<span>${player.position == "GK" ? player.speed : player.defending}</span></p>
                    <p class="physical absolute left-12 top-[87px]">${player.position == "GK" ? "POS : " : "PHY : "}<span>${player.position == "GK" ? player.positioning : player.physical}</span></p>
                </div>
            `;
            
            placeholder_card.classList.remove("hidden");
            placeholder_card.classList.add("flex");
            
            
            
            filtered_players_section.classList.add("hidden");
            isFilteredPlayerSectionOpen = false
            updateOpenCloseSection()
            
        });
        
        players_container.appendChild(player_card);
    });
    
    filtered_players_section.classList.remove("hidden");
    isFilteredPlayerSectionOpen = true
    updateOpenCloseSection()
}
//fnct vider
function emptyCardButton() {

    clear_player_card.addEventListener('click', () => {
        if (!currentPosition) return; 

    const placeholder_card = document.getElementById(`${currentPosition.toLowerCase()}-placeholder`);
    
    placeholder_card.innerHTML = `
        <div class="relative items-center justify-center font-bold text-light_orange-500 hover:scale-150 hidden 680:flex">
            <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
            <div class="absolute flex items-center justify-center inset-0 cursor-pointer">
                <span class="flex items-center justify-center">
                    <svg class="w-9 h-8" viewBox="0 0 36 42" fill="none">
                        <path d="M18.6275 41.711L18.3137 41.0298C18.1146 41.1215 17.8854 41.1215 17.6863 41.0298L17.3726 41.711L17.6863 41.0298L1.18627 33.4311C0.920355 33.3087 0.75 33.0427 0.75 32.7499V8.7248C0.75 8.42506 0.928458 8.15411 1.20383 8.03575L17.7038 0.943648C17.8929 0.862375 18.1071 0.862375 18.2962 0.943648L34.7962 8.03575C35.0715 8.15411 35.25 8.42506 35.25 8.7248V32.7499C35.25 33.0427 35.0796 33.3087 34.8137 33.4311L18.3137 41.0298L18.6275 41.711Z" 
                            stroke="currentColor" stroke-width="1.5"></path>
                    </svg>
                </span>
                <div class="absolute text-xl font-bold text-center">+</div>
            </div>
        </div>
    `;
    placeholder_card.classList.remove("flex");
    placeholder_card.classList.add("hidden");

    currentPosition = null;
    // Reset filtering section
    filtered_players_section.classList.add('hidden');
    isFilteredPlayerSectionOpen = false;
    updateOpenCloseSection(); 
    });

    clear_all_cards_button.addEventListener('click', () => {
        // Find all placeholder cards
        //Mise à jour du contenu des cartes de remplacement :
        const placeholderCards = document.querySelectorAll('[id$="-placeholder"]');
        
        placeholderCards.forEach(placeholder_card => {
            placeholder_card.innerHTML = `
                <img src="assets/images/Player/Player_card.png" alt="Player Card" class="w-[90px] h-auto">
                <div class="absolute flex items-center justify-center inset-0 cursor-pointer">
                    <span class="flex items-center justify-center">
                        <svg class="w-9 h-8" viewBox="0 0 36 42" fill="none" >
                            <path d="M18.6275 41.711L18.3137 41.0298C18.1146 41.1215 17.8854 41.1215 17.6863 41.0298L17.3726 41.711L17.6863 41.0298L1.18627 33.4311C0.920355 33.3087 0.75 33.0427 0.75 32.7499V8.7248C0.75 8.42506 0.928458 8.15411 1.20383 8.03575L17.7038 0.943648C17.8929 0.862375 18.1071 0.862375 18.2962 0.943648L34.7962 8.03575C35.0715 8.15411 35.25 8.42506 35.25 8.7248V32.7499C35.25 33.0427 35.0796 33.3087 34.8137 33.4311L18.3137 41.0298L18.6275 41.711Z" 
                                stroke="currentColor" stroke-width="1.5"></path>
                        </svg>
                    </span>
                    <div class="absolute text-xl font-bold text-center">+</div>
                </div>
            `;
            placeholder_card.classList.remove('flex');
            placeholder_card.classList.add('hidden');
            
            // Extract position from the ID --placeholder prsq moi jai nommé les id comme ca
            const position = placeholder_card.id.replace('-placeholder', '').toUpperCase();
            const textLabel = document.querySelector(`.${position}-TEXT`);
            if (textLabel) textLabel.classList.remove('hidden');
        });

        // Reset filtering section
        filtered_players_section.classList.add('hidden');
        isFilteredPlayerSectionOpen = false;
        updateOpenCloseSection();
    });
}

const positions = [
    "LST", "RST", "LWM", "LCM", "RCM", "RWM", "LWB", "LCB", "RCB", "RWB", "GK"
];

positions.forEach(position => {
    const placeholder_card = document.getElementById(`${position.toLowerCase()}-placeholder`);

    placeholder_card.addEventListener("click", () => {
        currentPosition = position;
        isAllPlayersSectionOpen = false;
        isFilteredPlayerSectionOpen = true;
        populatePlayersSection(position);
        updateOpenCloseSection();
    });
});



function updateOpenCloseSection() {
    if (isAllPlayersSectionOpen) {

        see_all_players_section.classList.remove("hidden");
        filtered_players_section.classList.add("hidden");
        isFilteredPlayerSectionOpen = false

    } else if (isFilteredPlayerSectionOpen) {

        filtered_players_section.classList.remove("hidden");
        see_all_players_section.classList.add("hidden");
       
        isAllPlayersSectionOpen = false

    } 
  
     else {

        see_all_players_section.classList.add("hidden");
        filtered_players_section.classList.add("hidden");
        
        isAllPlayersSectionOpen = false
        isFilteredPlayerSectionOpen = false
      

    }
}

document.addEventListener("DOMContentLoaded",()=>{
    getData()
    emptyCardButton()
    updateOpenCloseSection()
    
})



