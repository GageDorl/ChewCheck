async function apiCall(keyword) {
    try {
        const res = await fetch(`/api/data?query=${keyword}`);
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