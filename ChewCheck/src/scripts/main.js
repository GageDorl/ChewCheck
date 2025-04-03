import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { setFooter } from './footer.mjs';

let graphDate = Date.now();
let logDate = Date.now();
let myChart = null;

document.querySelector('#prevDayGraphButton').addEventListener('click', () => {
    graphDate = (graphDate-1000*60*60*24);
    setGraph();
}); 
document.querySelector('#nextDayGraphButton').addEventListener('click', () => {
    graphDate = (graphDate+1000*60*60*24);
    setGraph();
});
document.querySelector('#prevDayLogButton').addEventListener('click', () => {
    logDate = logDate-1000*60*60*24;
    setDailyLog();
});
document.querySelector('#nextDayLogButton').addEventListener('click', () => {
    logDate = (logDate+1000*60*60*24);
    setDailyLog();
});

const setGraph = () => {

    if(myChart){
        myChart.destroy();
    }

    const lastSevenDays = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(graphDate-1000*60*60*24*i);
        let day = date.toISOString().split('T')[0]
        lastSevenDays.push(day);
    }

    const weekData = [];
    for (let date in lastSevenDays) {
        let entries = null;
        if (localStorage.getItem(lastSevenDays[date]) != null) {
            entries = JSON.parse(localStorage.getItem(lastSevenDays[date])).foodEntries;
        }
        console.log(entries);
        if (entries == null) {
            continue;
        }
        let calorieCount = 0;
        let proteinCount = 0;
        let carbsCount = 0;
        let fatCount = 0;
        for (let entry of entries) {
            calorieCount+=entry.macros.calories*entry.servings;
            proteinCount+=entry.macros.protein*entry.servings;
            carbsCount+=entry.macros.carbs*entry.servings;
            fatCount+=entry.macros.fat*entry.servings;
        }
        weekData.push({date: lastSevenDays[date], calories: calorieCount, protein: proteinCount, carbs: carbsCount, fat: fatCount});
    }

    const calorieData = [];
    const proteinData = [];
    const carbsData = [];
    const fatData = [];
    const weightData = [];
    for (let day of weekData) {
        calorieData.push({x: day.date, y: day.calories});
        proteinData.push({x: day.date, y: day.protein});
        carbsData.push({x: day.date, y: day.carbs});
        fatData.push({x: day.date, y: day.fat});
    }

    const data = {
        labels: lastSevenDays,
        datasets: [
            {
                label: 'Calories',
                data: calorieData,
                borderColor: 'rgba(255, 99, 132, 1)',
                yAxisID: 'y1',
            },
            {
                label: 'Weight (lbs)',
                data: weightData,
                borderColor: 'rgba(54, 162, 235, 1)',
                yAxisID: 'y2'
            },
            {
                label: 'Protein (g)',
                data: proteinData,
                borderColor: 'rgba(75, 192, 192, 1)',
                yAxisID: 'y3',
            },
            {
                label: 'Carbs (g)',
                data: carbsData,
                borderColor: 'rgba(255, 206, 86, 1)',
                yAxisID: 'y3',
            },
            {
                label: 'Fat (g)',
                data: fatData,
                borderColor: 'rgba(153, 102, 255, 1)',
                yAxisID: 'y3',
            }
        ]
    };

    const graph = document.querySelector('#graph').getContext('2d');

    myChart = new Chart(graph, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            size: responsiveFontSize() // ✅ Dynamic font size
                        }
                    },
                    ticks: {
                        font: {
                            size: responsiveFontSize() // ✅ Adjust tick labels
                        }
                    }
                },
                y1: {
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Calories',
                        font: {
                            size: responsiveFontSize()
                        }
                    },
                    ticks: {
                        font: {
                            size: responsiveFontSize()
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y2: {
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Weight (lbs)',
                        font: {
                            size: responsiveFontSize()
                        }
                    },
                    ticks: {
                        font: {
                            size: responsiveFontSize()
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y3: {
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Macros (g)',
                        font: {
                            size: responsiveFontSize()
                        }
                    },
                    ticks: {
                        font: {
                            size: responsiveFontSize()
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: responsiveFontSize()
                        }
                    }
                }
            }
        }
    });
}

function responsiveFontSize() {
    const screenWidth = window.innerWidth;

    if (screenWidth > 1200) return 12;  // Large screens
    if (screenWidth > 800) return 11;   // Medium screens
    if (screenWidth > 600) return 10;   // Small screens
    return 8; // Mobile devices
}

const setDailyLog = () => {
    const date = new Date(logDate).toISOString().split('T')[0];
    const todaysDate = new Date(Date.now()).toISOString().split('T')[0];
    const caloriesSpan = document.querySelector('#calories');
    const proteinSpan = document.querySelector('#protein');
    const carbsSpan = document.querySelector('#carbs');
    const fatSpan = document.querySelector('#fat');
    const foodList = document.querySelector('#foodList');
    let entries = null;
    if (localStorage.getItem(date) != null) {
        entries = JSON.parse((localStorage.getItem(date))).foodEntries;
    }
    
    
    if(date != todaysDate) {
        document.querySelector('#macroTitle').textContent = 'Macros on '+date;
    } else {
        document.querySelector('#macroTitle').textContent = 'Today\'s Macros';
    }

    if (entries == null) {
        caloriesSpan.textContent = 0;
        proteinSpan.textContent = 0;
        carbsSpan.textContent = 0;
        fatSpan.textContent = 0;
        // console.log(date.toISOString, new Date(Date.now()).toISOString);
        foodList.innerHTML = `
        <li>
            No food added ${date == todaysDate?'Today':'on '+date}<br>
            <a href="add"><button>Add Food</button></a>
        </li>`;
        return;
    }
    let calorieCount = 0;
    let proteinCount = 0;
    let carbsCount = 0;
    let fatCount = 0;
    let foodListHTML = '<li id="columnHeaders" class="entry"><span>Food</span><span>Serv</span><span>Cals</span><span>Prot</span><span>Carb</span><span>Fat</span></li>';

    const sorted = entries.sort((a,b) => a.time.localeCompare(b.time));
    for (let entry of sorted) {
        calorieCount+=entry.macros.calories*entry.servings;
        proteinCount+=entry.macros.protein*entry.servings;
        carbsCount+=entry.macros.carbs*entry.servings;
        fatCount+=entry.macros.fat*entry.servings;
        foodListHTML += `<li  class="entry"><span>${entry.foodName}</span> <span>${entry.servings}</span><span>${entry.macros.calories * entry.servings}</span><span>${entry.macros.protein * entry.servings}</span><span>${entry.macros.carbs * entry.servings}</span><span>${entry.macros.fat * entry.servings}</span></li>`;
    }
    caloriesSpan.textContent = calorieCount;
    proteinSpan.textContent = proteinCount;
    carbsSpan.textContent = carbsCount;
    fatSpan.textContent = fatCount;
    foodList.innerHTML = foodListHTML;

}

setGraph();
setDailyLog();
setFooter();