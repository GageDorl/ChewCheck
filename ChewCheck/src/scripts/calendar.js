import { setFooter } from "./footer.mjs";
import { showConfirmation, closeModal, displayErrorMessage } from "./modals.mjs";

const calendarInput = document.querySelector('#calendarMonthYear');
const prevMonth = document.querySelector('#prevMonthButton');
const nextMonth = document.querySelector('#nextMonthButton');


let logDate = Date.now();

const setInitial = () => {
    calendarInput.value = new Date().toISOString().split('T')[0].slice(0,7);
    console.log(calendarInput.value);
    setCalendar();
}

const setCalendar = () => {
    const numDays = (value) => {
        const date = new Date(value.slice(0,4), value.slice(5,7), 1);
        const month = date.getMonth();
        const year = date.getFullYear();
        return new Date(year, month, 0).getDate();
    }
    let monthLength = numDays(calendarInput.value);

    const calendarDays = document.querySelector('#calendarDays');

    for(let i = 1; i <= monthLength; i++){
        const day = document.createElement('details');
        day.classList.add('calendarDay');
        let date =  new Date(calendarInput.value.slice(0,4), calendarInput.value.slice(5,7)-1, i);
        
        const summary = document.createElement('summary');
        summary.classList.add('calendarSummary');
        summary.innerHTML = `
            <span class="icon"><i class="fa-solid fa-caret-down"></i></span>
            <span class="date">${date.toDateString()}</span>
            `
        
        if (localStorage.getItem(date.toISOString().split('T')[0]) != null) {
            day.classList.add('filledDay');
            if(JSON.parse(localStorage.getItem(date.toISOString().split('T')[0])).weight){
                const weight = JSON.parse(localStorage.getItem(date.toISOString().split('T')[0])).weight;
                summary.innerHTML += `
                    <span class="weight"> Weight: ${weight} lbs</span>
                `
            }
            let totalCals = 0;
            let totalProtein = 0;
            let totalCarbs = 0;
            let totalFat = 0;
            JSON.parse(localStorage.getItem(date.toISOString().split('T')[0])).foodEntries.forEach(entry => {
                const foodEntry = document.createElement('div');
                foodEntry.classList.add('foodEntry');
                foodEntry.innerHTML = `<span>${entry.foodName}</span> <span>${entry.servings}</span><span>${entry.macros.calories * entry.servings}</span><span>${entry.macros.protein * entry.servings}</span><span>${entry.macros.carbs * entry.servings}</span><span>${entry.macros.fat * entry.servings}</span>`;
        // <div><button aria-label="Show dropdown" class="dropDownButton">...</button>
        // <ul class="dropDownMenu hide">
        //     <li><button class="editButton">Edit</button></li>
        //     <li><button class="deleteButton">Delete</button></li>
        // </ul>
        // </div>
        ;
                day.appendChild(foodEntry);
                totalCals += Math.round(entry.macros.calories * entry.servings);
                totalProtein += Math.round(entry.macros.protein * entry.servings);
                totalCarbs += Math.round(entry.macros.carbs * entry.servings);
                totalFat += Math.round(entry.macros.fat * entry.servings);
            });
            const totalMacros = document.createElement('div');
            totalMacros.classList.add('totalMacros');
            totalMacros.innerHTML = `
                <span class="totalCalories">Cals: ${totalCals}</span>
                <span class="totalProtein">Prot: ${totalProtein} g</span>
                <span class="totalCarbs">Carbs: ${totalCarbs} g</span>
                <span class="totalFat">Fats: ${totalFat} g</span>
            `;
            summary.innerHTML+= totalMacros.outerHTML;

        } else {
            day.classList.add('emptyDay');
            const emptyContent = document.createElement('div');
            emptyContent.classList.add('emptyContent');
            emptyContent.innerText = `No food on ${date.toISOString().split('T')[0]}`;
            day.appendChild(emptyContent);
        }
        day.appendChild(summary);
        calendarDays.appendChild(day);
        // document.querySelectorAll(".dropDownButton").forEach(button => {button.addEventListener("click", toggleDropDown)});
    }
}
 
calendarInput.addEventListener('change', (e) => {
    const calendarDays = document.querySelector('#calendarDays');
    calendarDays.innerHTML = '';
    setCalendar();
});

prevMonth.addEventListener('click', (e) => {
    calendarInput.value = new Date(calendarInput.value.slice(0,4), calendarInput.value.slice(5,7)-2).toISOString().split('T')[0].slice(0,7);
    const calendarDays = document.querySelector('#calendarDays');
    calendarDays.innerHTML = '';
    setCalendar();
})

nextMonth.addEventListener('click', (e) => {
    calendarInput.value = new Date(calendarInput.value.slice(0,4), calendarInput.value.slice(5,7)).toISOString().split('T')[0].slice(0,7);
    const calendarDays = document.querySelector('#calendarDays');
    calendarDays.innerHTML = '';
    setCalendar();
});

// function toggleDropDown(event) {
//     console.log("button working");
//     event.currentTarget.classList.toggle("active");
//     const dropDownMenu = event.currentTarget.nextElementSibling;
//     dropDownMenu.classList.toggle("hide");
// }

// document.addEventListener("click", (event) => {
//     if (event.target.classList.contains("editButton")) {
//         displayModal(event, "Edit Log");
//         document.querySelector("#food-form-button").classList.add("isEditing");
//     } 
//     else if (event.target.classList.contains("deleteButton")) {
//         displayModal(event, "Delete from Log");
//         document.querySelector("#food-form-button").classList.add("isDeleting");
//     }
// })

// function setLocalStorage(key, data) {
//     localStorage.setItem(key, JSON.stringify(data));
// }
  
// function getLocalStorage(key) {
//     return JSON.parse(localStorage.getItem(key));
// }

// function displayModal(event, buttonType) {
//     const foodModal = document.querySelector(".foodModal");
//     foodModal.classList.add('open');
//     foodModal.setAttribute('aria-hidden', 'false');

//     document.querySelector("#food-form-button").textContent = buttonType;

//     const closeModalButton = document.querySelector('.close-button');
//     closeModalButton.addEventListener('click', () => closeModal(foodModal));
//     window.addEventListener('click', (event) => {
//         if (event.target === foodModal) {
//             closeModal(foodModal);
//         }
//     })

//     const date = new Date(logDate).toISOString().split('T')[0];

//     const dataOnDay = getLocalStorage(date);

//     const foodEntry = event.target.closest("li.entry");
//     const foodName = foodEntry.querySelector("span:nth-of-type(1)").textContent;
//     const servings = foodEntry.querySelector("span:nth-of-type(2)").textContent;

//     const localStorageEntry = dataOnDay.foodEntries.find(entry => entry.foodName === foodName && entry.servings == servings);

//     document.querySelector("#input-date").value = date;

//     document.querySelector('#modal-food-name').innerHTML = `${foodName}`;
//     document.querySelector('#modal-food-brand').innerHTML = `${localStorageEntry.foodBrand}`;
//     document.querySelector("#servings").value = `${localStorageEntry.servings}`;
//     document.querySelector("#time").value = `${localStorageEntry.time}`;

//     document.querySelector("#food-form").addEventListener("submit", editEntry);

//     function editEntry(event) {
//         event.preventDefault();

//         if (document.querySelector("#food-form-button").classList.contains("isEditing")||document.querySelector("#food-form-button").classList.contains("isDeleting")) {
            
//             if (document.querySelector("#servings").value <= 0) {
//                 displayErrorMessage(document.querySelector(".errorMessage"), "Please input a positive number of servings.");
//             }

//             else {
//                 document.querySelector(".errorMessage").classList.remove("display");
//                 localStorageEntry.servings = document.querySelector("#servings").value;
//                 localStorageEntry.time = document.querySelector("#time").value;
//                 setLocalStorage(date, dataOnDay);
//                 closeModal(foodModal);
//             }
//         }

//         else if (document.querySelector("#food-form-button").classList.contains("isDeleting")) {
            
//             if (document.querySelector("#servings").value <= 0) {
//                 displayErrorMessage(document.querySelector(".errorMessage"), "Please input a positive number of servings.");
//             }
//             else {
//                 document.querySelector(".errorMessage").classList.remove("display");
//                 const deleteIndex = dataOnDay.foodEntries.indexOf(localStorageEntry);
//                 dataOnDay.foodEntries.splice(deleteIndex, 1);
//                 setLocalStorage(date, dataOnDay);
//                 closeModal(foodModal);
//             }
//         }

//         showConfirmation();
//     }
// }

setInitial();
setFooter();