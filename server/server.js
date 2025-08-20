import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/Webhooks.js';

//intitailize the express
const app = express();

//connect to database

await connectDB()

//use middleware
app.use(cors())

//routtes
app.get('/', (req,res)=> res.send('hello server is runing'))
app.post('/clerk', express.json(), clerkWebhooks);


//port define
const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=>{
    console.log(`app is running at ${PORT}`)

})