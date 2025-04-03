import { setFooter } from "./footer.mjs";

const calendarInput = document.querySelector('#calendarMonthYear');

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
        summary.innerText = date.toDateString();
        summary.classList.add('calendarSummary');
        day.appendChild(summary);
        if (localStorage.getItem(date.toISOString().split('T')[0]) != null) {
            day.classList.add('filledDay');
            JSON.parse(localStorage.getItem(date.toISOString().split('T')[0])).foodEntries.forEach(entry => {
                const foodEntry = document.createElement('div');
                foodEntry.classList.add('foodEntry');
                foodEntry.innerText = `${entry.foodName} - ${entry.servings} servings`;
                day.appendChild(foodEntry);
            }
            );
        } else {
            day.classList.add('emptyDay');
            const emptyContent = document.createElement('div');
            emptyContent.classList.add('emptyContent');
            emptyContent.innerText = `No food on ${date.toISOString().split('T')[0]}`;
            day.appendChild(emptyContent);
        }
        calendarDays.appendChild(day);
    }
}
 
calendarInput.addEventListener('change', (e) => {
    const calendarDays = document.querySelector('#calendarDays');
    calendarDays.innerHTML = '';
    setCalendar();
});

setInitial();
setFooter();