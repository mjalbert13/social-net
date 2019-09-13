const express = require('express');
const app = express();

app.get('/',(req,res) => res.send('API Runnig'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>console.log(`Server started on p0rt: ${PORT}`))