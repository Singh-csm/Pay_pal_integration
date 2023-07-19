const express = require('express');
const route = require("./routes/route")
const app = express();
const port = 3000;
app.use(express.json());
app.use("/", route)


app.listen(port, ()=>{
    console.log(`listening on ${port} Successfully!`)
})