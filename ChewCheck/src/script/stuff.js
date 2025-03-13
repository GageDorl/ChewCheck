async function apiCall() {
    const res = await fetch('http://localhost:5000/api/data');
    const data = await res.json();
    console.log(data.message);
}

apiCall();