const express = require('express');
const connectDB =require("./config/db")

const app = express();

//connect database
connectDB();

// Define Middleware
app.use(express.json({ extended: false}))

app.get('/',(req,res) => res.send('API Runnig'))

//Define routes
app.use('/api/users', require('./routes/API/users'))
app.use('/api/posts', require('./routes/API/post'))
app.use('/api/auth', require('./routes/API/auth'))
app.use('/api/profile', require('./routes/API/profile'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>console.log(`Server started on p0rt: ${PORT}`))