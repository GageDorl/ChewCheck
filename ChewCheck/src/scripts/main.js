import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { setFooter } from './footer.mjs';
import e from 'cors';

const data = {
    labels: [Date.now()-1000*60*60*24*6, Date.now()-1000*60*60*24*5, Date.now()-1000*60*60*24*4, Date.now()-1000*60*60*24*3, Date.now()-1000*60*60*24*2, Date.now()-1000*60*60*24*1, Date.now()],
    datasets: [
        {
            label: 'Calories',
            data: [
                {x: Date.now()-1000*60*60*24*6, y: 2000},
                {x: Date.now()-1000*60*60*24*5, y: 1800},
                {x: Date.now()-1000*60*60*24*4, y: 2200},
                {x: Date.now()-1000*60*60*24*3, y: 1900},
                {x: Date.now()-1000*60*60*24*2, y: 2100},
                {x: Date.now()-1000*60*60*24*1, y: 2300},
                {x: Date.now(), y: 2400}
            ],
            borderColor: 'rgba(255, 99, 132, 1)',
            yAxisID: 'y1',
        },
        {
            label: 'Weight (lbs)',
            data: [
                {x: Date.now()-1000*60*60*24*6, y: 150},
                {x: Date.now()-1000*60*60*24*5, y: 149},
                {x: Date.now()-1000*60*60*24*3, y: 150},
                {x: Date.now()-1000*60*60*24*1, y: 153},
                {x: Date.now(), y: 154}
            ],
            borderColor: 'rgba(54, 162, 235, 1)',
            yAxisID: 'y2'
        },
        {
            label: 'Protein (g)',
            data: [
                {x: Date.now()-1000*60*60*24*6, y: 150},
                {x: Date.now()-1000*60*60*24*5, y: 149},
                {x: Date.now()-1000*60*60*24*4, y: 150},
                {x: Date.now()-1000*60*60*24*3, y: 150},
                {x: Date.now()-1000*60*60*24*2, y: 153},
                {x: Date.now()-1000*60*60*24*1, y: 153},
                {x: Date.now(), y: 154}
            ],
            borderColor: 'rgba(75, 192, 192, 1)',
            yAxisID: 'y3',
        },
        {
            label: 'Carbs (g)',
            data: [
                {x: Date.now()-1000*60*60*24*6, y: 230},
                {x: Date.now()-1000*60*60*24*5, y: 226},
                {x: Date.now()-1000*60*60*24*4, y: 235},
                {x: Date.now()-1000*60*60*24*3, y: 210},
                {x: Date.now()-1000*60*60*24*2, y: 250},
                {x: Date.now()-1000*60*60*24*1, y: 230},
                {x: Date.now(), y: 240}
            ],
            borderColor: 'rgba(255, 206, 86, 1)',
            yAxisID: 'y3',
        },
        {
            label: 'Fat (g)',
            data: [
                {x: Date.now()-1000*60*60*24*6, y: 110},
                {x: Date.now()-1000*60*60*24*5, y: 120},
                {x: Date.now()-1000*60*60*24*4, y: 100},
                {x: Date.now()-1000*60*60*24*3, y: 110},
                {x: Date.now()-1000*60*60*24*2, y: 120},
                {x: Date.now()-1000*60*60*24*1, y: 100},
                {x: Date.now(), y: 104}
            ],
            borderColor: 'rgba(153, 102, 255, 1)',
            yAxisID: 'y3',
        }
    ]
};

const graph = document.querySelector('#graph').getContext('2d');

new Chart(graph, {
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

function responsiveFontSize() {
    const screenWidth = window.innerWidth;

    if (screenWidth > 1200) return 16;  // Large screens
    if (screenWidth > 800) return 14;   // Medium screens
    if (screenWidth > 600) return 12;   // Small screens
    return 8; // Mobile devices
}

const setTodaysLog = () => {
    const date = new Date(Date.now());
    const caloriesSpan = document.querySelector('#calories');
    const proteinSpan = document.querySelector('#protein');
    const carbsSpan = document.querySelector('#carbs');
    const fatSpan = document.querySelector('#fat');
    const foodList = document.querySelector('#foodList');
    const entries = JSON.parse(localStorage.getItem(date.toISOString().split('T')[0]));

    if (entries == null) {
        caloriesSpan.textContent = 0;
        proteinSpan.textContent = 0;
        carbsSpan.textContent = 0;
        fatSpan.textContent = 0;
        foodList.innerHTML = `
        <li>
            No food added today<br>
            <a href="add"><button>Add Food</button></a>
        </li>`;
        return;
    }
    let calorieCount = 0;
    let proteinCount = 0;
    let carbsCount = 0;
    let fatCount = 0;
    let foodListHTML = '<li id="columnHeaders"><span>Food</span><span>Serv</span><span>Cals</span><span>Prot</span><span>Carb</span><span>Fat</span></li>';
    console.log(entries);

    const sorted = entries.sort((a,b) => a.time.localeCompare(b.time));
    console.log(sorted);
    for (let entry of sorted) {
        calorieCount+=entry.macros.calories*entry.servings;
        proteinCount+=entry.macros.protein*entry.servings;
        carbsCount+=entry.macros.carbs*entry.servings;
        fatCount+=entry.macros.fat*entry.servings;
        foodListHTML += `<li><span>${entry.foodName}</span> <span>${entry.servings}</span><span>${entry.macros.calories * entry.servings}</span><span>${entry.macros.protein * entry.servings}</span><span>${entry.macros.carbs * entry.servings}</span><span>${entry.macros.fat * entry.servings}</span></li>`;
    }
    caloriesSpan.textContent = calorieCount;
    proteinSpan.textContent = proteinCount;
    carbsSpan.textContent = carbsCount;
    fatSpan.textContent = fatCount;
    foodList.innerHTML = foodListHTML;

}

setTodaysLog();
setFooter();