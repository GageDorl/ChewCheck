import { setFooter } from "./footer.mjs";
import { showConfirmation, closeModal, displayErrorMessage } from "./modals.mjs";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const keyword = urlParams.get('keyword');
const searchArea = document.querySelector('#searchResults');
const loading = document.querySelector('.loading');
keyword ? document.querySelector('#searchInput').value = keyword:'';

async function apiCall(keyword) {
    try {
        const res = await fetch(`https://chewcheck.tech/api/data?query=${keyword}`);
        const data = await res.json();
        const foodItems = await data.foods.food;
        if(keyword){
            console.log(keyword)
            onLoad(foodItems)
        }
        else {
            loading.style.display = 'none';
            searchArea.classList.add('show');
            searchArea.innerHTML = `<h2>Please search for a product</h2>`;
        }
        
    } catch(error) {
        console.error("Error fetching food data:", error);
    }
}

export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
  
export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

const onLoad = data => {
    loading.style.display = 'none';
    data.map(food => {
        console.log(food);
        const foodItem = document.createElement('div');
        foodItem.classList.add('foodItem');
        foodItem.setAttribute('id', food.food_id);
        const servingSize = food.food_description.split(' - ')[0];
        const foodMacros = food.food_description.split(' - ')[1].split(' | ');
        foodItem.innerHTML = `
            <div class="foodTitle">
            <h3 class="foodName">Name: ${food.food_name}</h3>
            <h3 class="foodBrand">Brand: ${food.brand_name?food.brand_name:'Generic'}</h3>
            </div>
            `;
        const macros = document.createElement('div');
        macros.classList.add('macros');
        macros.innerHTML = (`<p class="servingSize">${servingSize}</p>`);
        foodMacros.map(macro => {
            const macroItem = document.createElement('p');
            macroItem.innerHTML = macro;
            macroItem.classList.add('macroItem');
            macros.appendChild(macroItem);
        });
        foodItem.appendChild(macros);
        const addButton = document.createElement('button');
        addButton.innerHTML = 'Add to Log';
        addButton.classList.add('addButton');
        foodItem.appendChild(addButton);
        searchArea.appendChild(foodItem);
    })
    searchArea.classList.add('show');
    document.querySelectorAll('.foodItem').forEach(item => {
        setTimeout(() => {
            item.classList.add('show');
        }, 100);
    });

    const addFoodModal = document.querySelector('#addFoodModal');
    const addButtons = document.querySelectorAll('.addButton');
    const closeModalButton = document.querySelector('.close-button');

    
    function displayModal(event) {
        addFoodModal.classList.add('open');
        addFoodModal.setAttribute('aria-hidden', 'false');

        setDefaultDate(document.querySelector("#input-date"));
        setDefaultTime(document.querySelector("#time"));

        const foodSection = event.target.parentNode;
        const foodName = foodSection.querySelector('.foodName').innerHTML;
        const foodBrand = foodSection.querySelector('.foodBrand').innerHTML;
        const foodInfo = foodSection.querySelector('.macros').innerHTML;

        document.querySelector('#modal-food-name').innerHTML = `${foodName}`
        document.querySelector('#modal-food-brand').innerHTML = `${foodBrand}`
        document.querySelector('#modal-food-info').innerHTML = `${foodInfo}`

    }

    
    
    addButtons.forEach(button => {
    button.addEventListener('click', displayModal);
    });

    closeModalButton.addEventListener('click', () => closeModal(addFoodModal));

    window.addEventListener('click', (event) => {
        if (event.target === addFoodModal) {
            closeModal();
        }
    })

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    })

    function addFoodEntry(event) {
        event.preventDefault();

        const foodSection = event.target.parentNode;
        const serving = foodSection.querySelector('#servings').value;
        const date = foodSection.querySelector('#input-date').value;
        const time = foodSection.querySelector('#time').value;
        const foodName = foodSection.querySelector('#modal-food-name').textContent;
        const foodBrand = foodSection.querySelector('#modal-food-brand').textContent;
        const foodInfo = foodSection.querySelectorAll('.macroItem');

        let allMacros = '';

        foodInfo.forEach(macro => allMacros += macro.textContent);

        const macros = getMacros(allMacros);

        let data = getLocalStorage(date);

        if (data == null) {
            console.log('entries was null');
            data = {foodEntries: [], weight: null};
        }

        const entry = {
            "time": time,
            "foodName": foodName.split(": ")[1],
            "foodBrand": foodBrand.split(": ")[1],
            "servings": serving,
            "macros": macros
        }

        console.log(data);

        if (serving <= 0) {   
            displayErrorMessage(document.querySelector("#addFoodErrorMessage"), "Please input a positive number of servings.");
        }

        else {
        
        closeModal(addFoodModal);

        data.foodEntries.push(entry);

        setLocalStorage(date, data);
        document.querySelector("#addFoodErrorMessage").classList.remove("display");
        showConfirmation();
    }
}

    function getMacros(foodInfo) {
        const calories = parseFloat(foodInfo.match(/Calories:\s([\d.]+)kcal/)?.[1] || 0);
        const fat = parseFloat(foodInfo.match(/Fat:\s([\d.]+)g/)?.[1] || 0);
        const carbs = parseFloat(foodInfo.match(/Carbs:\s([\d.]+)g/)?.[1] || 0);
        const protein = parseFloat(foodInfo.match(/Protein:\s([\d.]+)g/)?.[1] || 0);

        const macros = {
            "calories": calories,
            "fat": fat,
            "carbs": carbs,
            "protein": protein
            }
        return macros
    
    }

    const addFoodForm = document.querySelector('#food-form');
    addFoodForm.addEventListener('submit', addFoodEntry);
}

function displayAddFood() {
    document.querySelector("#add-weight-page").classList.add("hide");
    document.querySelector("#add-food-page").classList.remove("hide");
}

function displayAddWeight() {
    document.querySelector("#add-food-page").classList.add("hide");
    document.querySelector("#add-weight-page").classList.remove("hide");
}

document.querySelector("#nav-food-button").addEventListener("click", displayAddFood);

document.querySelector("#nav-weight-button").addEventListener("click", displayAddWeight);

document.querySelector('#searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    location.href = `add?keyword=${document.querySelector('#searchInput').value}`;
    keyword = document.querySelector('#searchInput').value;
    apiCall(keyword);
});

function addWeight(event) {
    event.preventDefault();
    const weightDate = document.querySelector("#weightDate").value;
    const weightInput = document.querySelector("#weightInput").value;

    if (weightInput <= 0) {
        displayErrorMessage(document.querySelector(".errorMessage"), "Please input a positive weight value.");
    }

    else {

    document.querySelector(".errorMessage").classList.remove("display");
    let data = getLocalStorage(weightDate);

    if (data == null) {
        data = {foodEntries: [], weight: null};
    }

    console.log(data)
    data.weight = weightInput;
    console.log(data);
    console.log(data.macros);

    setLocalStorage(weightDate, data);
    showConfirmation();
    }
}

document.querySelector("#addWeightForm").addEventListener("submit", addWeight);

function setDefaultDate(inputId) {
    const today = new Date();
    const difference = today.getTimezoneOffset();
    const adjustedDate = new Date(today.getTime() - difference * 60000).toISOString().split("T")[0];
    inputId.value = adjustedDate;
}

function setDefaultTime(inputId) {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, "0");
    const minutes= String(currentTime.getMinutes()).padStart(2, "0");
    inputId.value = `${hours}:${minutes}`;
}

apiCall(keyword);
setFooter();
setDefaultDate(document.querySelector("#weightDate"));