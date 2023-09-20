// DOM elements

var input = document.getElementById('search-input');
var meal_box = document.getElementById('Meals-container');
const toggleButton = document.getElementById("toggle-sidebar");
const sidebar = document.getElementById("sidebar");
const flexBox = document.getElementById('flex-box');
const searchbar = document.getElementById('search-bar');

// It returns truncated string greater then 50 letters

function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

document.addEventListener('load', ()=>{
    updateTask();
})

/**
 * Check and initialize the local storage items for favorite list and last input
 */


const storedData = "favouritesList";
if (localStorage.getItem(storedData) == null) {
   localStorage.setItem(storedData, JSON.stringify([]));
}


/**
 * Update the task counter with the current number of items in the favorite list.
*/
function updateTask() {
    const favCounter = document.getElementById('total-counter');
    const db = JSON.parse(localStorage.getItem(storedData));
    if (favCounter.innerText != null) {
        favCounter.innerText = db.length;
    }

}

/**
 * Check if an ID is in a list of favorites
 *
 * @param list The list of favorites
 * @param id The ID to check
 * @return true if the ID is in the list, false otherwise
 */

function isFav(list, id) {
    let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res = true;
        }
    }
    return res;
}

/**
 * Function to toggle the sidebar and display the list of favorite meals.
 * When the toggle button is clicked, the sidebar is shown or hidden and the list of favorite meals is displayed.
 * The flexBox class is also toggled to adjust the layout of the page.
 * 
*/
toggleButton.addEventListener("click", function () {
    showFavMealList();
    sidebar.classList.toggle("show");
    flexBox.classList.toggle('shrink');
});

/**
 * 
 * This function adds an event listener to the toggle button that when clicked, it calls the showFavMealList function and adds or removes the "show" class to the sidebar element and "shrink" class to the flexBox element, respectively.
 * @event toggleButton - The button element that when clicked, triggers the event listener.
 * @function showFavMealList - The function that is called when the toggle button is clicked. It populates the fav element with the list of favorite meals.
 * @element sidebar - The sidebar element that has the "show" class added or removed.
 * @element flexBox - The flexbox element that has the "shrink" class added or removed.
*/

flexBox.onscroll = function () {

    if (flexBox.scrollTop > searchbar.offsetTop) {
        searchbar.classList.add("fixed");

    } else {
        searchbar.classList.remove("fixed");
    }
};

/**
 * addRemoveToFavList - function to add or remove a meal from the favorite list
 * 
 * @param {string} id - The id of the meal to be added or removed
 *
 * This function first retrieves the data from local storage and then it checks if the provided meal id already exist in the favorite list.
 * If it exists, it removes it from the list, otherwise it adds it to the list. It then updates the local storage and updates the UI.
 */

function addRemoveToFavList(id) {
    const detailsPageLikeBtn = document.getElementById('like-button');
    let db = JSON.parse(localStorage.getItem(storedData));
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
        if (id == db[i]) {
            ifExist = true;

        }

    } if (ifExist) {
        db.splice(db.indexOf(id), 1);

    } else {
        db.push(id);

    }

    localStorage.setItem(storedData, JSON.stringify(db));
    
    searchHandler();
    showFavMealList();
    updateTask();
}

/**

This function is used to show all the meals which are added to the favourite list.

@function

@async

@returns {string} html - This returns html which is used to show the favourite meals.

@throws {Error} If there is no favourite meal then it will show "Nothing Added Yet....."

@example

showFavMealList()
*/
async function showFavMealList() {
    let favList = JSON.parse(localStorage.getItem(storedData));
    // let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    console.log(favList)
    if (favList.length == 0) {
        html = `<div class="fav-item nothing"> <h1> 
        Nothing Added Yet.....</h1> </div>`
    } else {
        for (let i = 0; i < favList.length; i++) {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + favList[i])
            //console.log(response)
            const data =  await response.json();
            // const favMealList = await fetchMealsFromApi(url, favList[i]);
            if (data.meals[0]) {
                let meal = data.meals[0];
                html += `
                <div class="fav-item">

              
                <div class="fav-item-photo">
                    <img src="${meal.strMealThumb}" alt="">
                </div>
                <div class="fav-item-details">
                    <div class="fav-item-name">
                        <strong>Name: </strong>
                        <span class="fav-item-text">
                           ${meal.strMeal}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="addRemoveToFavList(${meal.idMeal})">
                        Remove
                    </div>

                </div>

            </div>               
                `
            }
        }
    }
    document.getElementById('fav').innerHTML = html;
}

/* This function just takes the input extracted from API through event function searchHandler() and renders into the UI */ 



function renderMeal(meal){
    const list = JSON.parse(localStorage.getItem(storedData));
    const card = document.createElement('div');
    var id = meal.idMeal;
    card.setAttribute("id" , id);
    
    
    
    card.innerHTML = `
    <div class="card">
        <div class="card-top">
            <div class="dish-photo">
                <img src="${meal.strMealThumb}" alt="">
            </div>
            <div class="dish-name">
                ${meal.strMeal}
            </div>
            <div class="dish-details">
                ${truncate(meal.strInstructions,50)}
                <span data-id= ${meal.idMeal} class="button">Know More</span>
            </div>
        </div>
        <div class="card-bottom">
            <div class="like">
            <i class="fa-solid fa-heart ${isFav(list, meal.idMeal) ? 'active' : ''} " onclick="addRemoveToFavList(${meal.idMeal})"></i>
            </div>
            <div class="play">
                <a href="${meal.strYoutube}" target="_blank">
                    <i class="fa-brands fa-youtube"></i>
                </a>
            </div>
        </div>
    </div>`;

    meal_box.append(card);

}


/* This function takes input from mealPageLoader() via meal API and renders it in a new window */

function rendermealPage(meal,id){
    // Just for my reference tried creating a HTML Doc but failed to render it in new window so made it out to below alternative
    // console.log(meal,id);
    // let doc = document.implementation.createHTMLDocument("myMeal");
    // const card = doc.createElement('div');
    // console.log(card)
    // card.setAttribute("id" , id);
    
    
    // card.innerHTML = `
    // <img src= "${meal.strMealThumb}" class="meal-img" />
    // <p class="meal-name txt" >${meal.strMeal}</p>
    // <p class="txt">Category : ${meal.strCategory}</p>
    // <p class="txt">Instructions : ${meal.strInstructions}</p>`;

    // doc.body.append(card);
    // console.log(doc);
    

    var myWindow = window.open("", "newWindow");

    myWindow.document.body.innerHTML = `
    <div style="min-height: 720px;
    padding: 10px 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: hsl(235, 24%, 19%);
    color: white;
    border: 1x solid red;">
        <div >
            <img src="${meal.strMealThumb}" style="height: 250px;
            max-width: 250px;
            object-fit: cover;
            border-radius: 20px;" alt="">
        </div>
        <div style="margin-left: 30px;
        height: 90%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        overflow-y: hidden;">
            <div class="item-name">
                <strong>Name: </strong>
                <span style="font-family: Georgia, 'Times New Roman', Times, serif;
                font-style: italic;
                color: hsl(235, 23%, 79%);" >
                    ${meal.strMeal}
                </span>
            </div>
            <br>
            <div class="item-category">
                <strong>Category: </strong>
                <span style="font-family: Georgia, 'Times New Roman', Times, serif;
                font-style: italic;
                color: hsl(235, 23%, 79%);" >
                    ${meal.strCategory}
                </span>
            </div>
            <br>
            <div class="item-ingrident">
                <strong>Ingrident: </strong>
                <span style="font-family: Georgia, 'Times New Roman', Times, serif;
                font-style: italic;
                color: hsl(235, 23%, 79%);" >
                    ${meal.strIngredient1},${meal.strIngredient2},${meal.strIngredient3},${meal.strIngredient4},etc.
                </span>
            </div>
            <br>
            <div>
                <strong>Instructions: </strong>
                <span style="font-family: Georgia, 'Times New Roman', Times, serif;
                font-style: italic;
                color: hsl(235, 23%, 79%);
                text-overflow: ellipsis;" >
                    ${meal.strInstructions}
                </span>
            </div>
            <br>
            <div style="display: flex;
            min-height: 40px;
            align-items: center;">
                <strong>Video Link : </strong>
                <span style="font-family: Georgia, 'Times New Roman', Times, serif;
                font-style: italic;
                color: hsl(235, 23%, 79%);" >
                    <a href =${meal.strYoutube} style="text-decoration: none;
                    color: hsl(234, 39%, 85%);
                    padding-left: 10px;
                    font-size: 1.2rem;" target="_blank">Watch Here<a>
                </span>
            </div>
        </div>
    </div>`;
}


/* this async function fetches data from API for rendering meals in form of cards in the main page */


async function searchHandler(){
    var path = input.value;
    
    meal_box.innerHTML = "";

    console.log(path)
    try{
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + path)
        //console.log(response)
        const data =  await response.json();
        // console.log(data)
        
        var meals = data.meals;
        for (var i in meals){
            renderMeal(meals[i]);
        }
        
    }catch(error){
        console.log(error);
    }
}

/* this async function fetches data from API for rendering meal in to a new page */

async function mealPageLoader(e){
    const target = e.target;
    const id = target.dataset.id;
    console.log(id);

    try{
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id)
        //console.log(response)
        const data =  await response.json();
        // console.log(data)
        
        var meals = data.meals;
        for (var i in meals){
            rendermealPage(meals[i],id);
        }
        
    }catch(error){
        console.log(error);
    }
}

document.addEventListener('keyup' , searchHandler);
meal_box.addEventListener('click',mealPageLoader);

updateTask();

