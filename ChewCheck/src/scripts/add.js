import { setFooter } from "./footer.mjs";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const keyword = urlParams.get('keyword');
const searchArea = document.querySelector('#searchResults');
const loading = document.querySelector('.loading');

async function apiCall(keyword) {
    try {
        const res = await fetch(`https://chewcheck.tech/api/data?query=${keyword}`);
        const data = await res.json();
        const foodItems = await data.foods.food;
        if(keyword){
            console.log(keyword)
            onLoad(foodItems)
            document.querySelector('#searchInput').value = keyword;
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

    // function modalTemplate(event) { // Add foodId as parameter??
    //     const foodSection = event.target.parentNode;
    //     const foodName = foodSection.querySelector('.foodName');
    //     const foodBrand = foodSection.querySelector('.foodBrand');
    //     const foodInfo = foodSection.querySelector('.macros');

    //     return `
    //     <div id='modal-food-info'>
    //     ${foodName}${foodBrand}${foodInfo}
    //     </div>
    //     `
    // }
    
    function displayModal(event) {
        addFoodModal.classList.add('open');
        addFoodModal.setAttribute('aria-hidden', 'false');

        const foodSection = event.target.parentNode;
        const foodName = foodSection.querySelector('.foodName').innerHTML;
        const foodBrand = foodSection.querySelector('.foodBrand').innerHTML;
        const foodInfo = foodSection.querySelector('.macros').innerHTML;

        document.querySelector('#modal-food-name').innerHTML = `${foodName}`
        document.querySelector('#modal-food-brand').innerHTML = `${foodBrand}`
        document.querySelector('#modal-food-info').innerHTML = `${foodInfo}`

        // const foodDiv = event.target.parentNode;
        // const foodId = foodDiv.id;
        // console.log(foodId);


    }

    function closeModal() {
        addFoodModal.classList.remove('open');
        addFoodModal.setAttribute('aria-hidden', 'true');
    }
    
    addButtons.forEach(button => {
    button.addEventListener('click', displayModal);
    });

    closeModalButton.addEventListener('click', closeModal);

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
        console.log('food entry form submission');
    }

    const addFoodForm = document.querySelector('#add-food-form');
    addFoodForm.addEventListener('submit', addFoodEntry);
}

document.querySelector('#searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    location.href = `add.html?keyword=${document.querySelector('#searchInput').value}`;
    keyword = document.querySelector('#searchInput').value;
    apiCall(keyword);
});

apiCall(keyword);
setFooter();