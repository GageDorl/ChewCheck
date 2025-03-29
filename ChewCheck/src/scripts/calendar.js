import { setFooter } from "./footer.mjs";

const setInitial = () => {
    const calendarInput = document.querySelector('#calendarMonthYear');
    calendarInput.value = new Date().toISOString().split('T')[0].slice(0,7);
}

setInitial();
setFooter();