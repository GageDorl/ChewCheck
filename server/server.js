import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import request from 'request';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const FAT_SECRET_BASE_URL = 'https://platform.fatsecret.com/rest/server.api';
const FAT_SECRET_CONSUMER_KEY = process.env.VITE_FAT_SECRET_CONSUMER_KEY;
const FAT_SECRET_CONSUMER_SECRET = process.env.VITE_FAT_SECRET_CONSUMER_SECRET;

const options = {
    method: 'POST',
    url: 'https://oauth.fatsecret.com/connect/token',
    method : 'POST',
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
let token = '';
request(options, function (error, response, body) {
    if (error) throw new Error(error);
    token =  body.access_token;
 }
);

app.get('/api/data', async (req, res) => {
    try{
        const url = `https://platform.fatsecret.com/rest/server.api?method=foods.search&format=json&search_expression=${req.query.query}`;
        const headers = {
            "Authorization": `Bearer ${token}`

        }
        const response = await fetch(url, { headers: headers });
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error("Error fetching food data:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch food data" });
    }
});

app.listen(5010, () => {
    console.log('Server is running on port 5010');
});