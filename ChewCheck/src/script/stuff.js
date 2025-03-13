async function apiCall() {
    const res = await fetch('http://localhost:5010/api/data');
    const data = await res.json();
    console.log(data.message);
}

apiCall();