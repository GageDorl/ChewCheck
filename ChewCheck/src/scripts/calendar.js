import { setFooter } from "./footer.mjs";

const calendarInput = document.querySelector('#calendarMonthYear');
const prevMonth = document.querySelector('#prevMonthButton');
const nextMonth = document.querySelector('#nextMonthButton');

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
                foodEntry.innerText = `${entry.foodName} - ${entry.servings} servings`;
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



setInitial();
setFooter();