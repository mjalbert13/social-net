const express = require('express');
const connectDB =require("./config/db")

const app = express();

//connect database
connectDB();

app.get('/',(req,res) => res.send('API Runnig'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>console.log(`Server started on p0rt: ${PORT}`))