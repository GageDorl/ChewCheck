const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const keyword = urlParams.get('keyword');
const searchArea = document.querySelector('#searchResults');

async function apiCall(keyword) {
    try {
        const res = await fetch(`https://chewcheck.tech/api/data?query=${keyword}`);
        const data = await res.json();
        const foodItems = await data.foods.food;
        onLoad(foodItems)
        
    } catch(error) {
        console.error("Error fetching food data:", error);
    }
}

const onLoad = data => {
    const loading = document.querySelector('.loading');
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
}

apiCall(keyword);