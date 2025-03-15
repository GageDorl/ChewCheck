const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
require("dotenv").config();
const request = require('request-promise-native');

const app = express();
app.use(cors());
app.use(express.json());

const FAT_SECRET_BASE_URL = 'https://platform.fatsecret.com/rest/server.api';
const FAT_SECRET_CONSUMER_KEY = process.env.VITE_FAT_SECRET_CONSUMER_KEY;
const FAT_SECRET_CONSUMER_SECRET = process.env.VITE_FAT_SECRET_CONSUMER_SECRET;

if (!FAT_SECRET_CONSUMER_KEY || !FAT_SECRET_CONSUMER_SECRET) {
    console.log(process.env);
    console.error("❌ Missing API keys! Check Netlify environment variables.");
    console.log("secret key: ", FAT_SECRET_CONSUMER_KEY);
    console.log("secret secret: ", FAT_SECRET_CONSUMER_SECRET);
}

let token = null;
let tokenExpiry = null;
const getAuthToken = async () => {
    if (token && tokenExpiry && tokenExpiry > Date.now()) {
        console.log("Using cached token");
        return token;
    }
    console.log("Fetching new token");

    const options = {
        method: 'POST',
        url: 'https://oauth.fatsecret.com/connect/token',
        auth : {
            user : FAT_SECRET_CONSUMER_KEY,
            password : FAT_SECRET_CONSUMER_SECRET
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded'},
        form: {
            'grant_type': 'client_credentials',
            'scope' : 'basic'
        },
        json: true
    };

    try {
        const response = await request(options);
        token = response.access_token;
        tokenExpiry = Date.now() + (response.expires_in * 1000);
        console.log("Token fetched successfully");
        return token;
    } catch (error) {
        console.error("Error fetching token:", error.response?.data || error.message);
        throw error;
    }
}

app.get('/api/data', async (req, res) => {
    try{

        const authToken = await getAuthToken();
        const url = `${FAT_SECRET_BASE_URL}?method=foods.search&format=json&search_expression=${req.query.query}`;
        const headers = {
            "Authorization": `Bearer ${authToken}`

        }
        const response = await fetch(url, { headers: headers });
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error("Error fetching food data:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch food data" });
    }
});

module.exports.handler = serverless(app);

app.listen(9000, () => {
    console.log("Server listening on port 9000");
});