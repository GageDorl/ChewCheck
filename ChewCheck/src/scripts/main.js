import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

async function apiCall(keyword) {
    try {
        const res = await fetch(`https://chewcheck.tech/api/data?query=${keyword}`);
        const data = await res.json();
        console.log(data);
    } catch(error) {
        console.error("Error fetching food data:", error);
    }
}

document.querySelector('#searchButton').addEventListener('click', ()=>{
    const keyword = document.querySelector('#searchInput').value;
    apiCall(keyword);
});

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

const graphSection = document.querySelector('#graphSection').getContext('2d');
new Chart(graphSection, {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y1: {
                position: 'right',
                title: {
                    display: true,
                    text: 'Calories'
                },
                grid: {
                    display: false
                }
            },
            y2: {
                position: 'right',
                title: {
                    display: true,
                    text: 'Weight (lbs)'
                },
                grid: {
                    display: false
                }
            },
            y3: {
                position: 'right',
                title: {
                    display: true,
                    text: 'Macros (g)'
                }
            }
        },
        plugins: {
            legend: {
                display: 'true'
            }
        }
    }
});
