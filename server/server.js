import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/data', async (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

app.listen(5010, () => {
    console.log('Server is running on port 5010');
});