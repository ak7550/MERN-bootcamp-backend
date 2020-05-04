require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser=require('cookie-parser');
const cors=require('cors');


//use middlewares from documentation
app.use(bodyParser.json());
app.use(cookieParser()); //helps to add or delt information into the cookie
app.use(cors());

//my routes
const authRoutes=require("./routes/auth");
const userRoutes=require("./routes/user");
app.use("/api",authRoutes);
app.use("/api",userRoutes);

//db connection 
// .env is a load utility npm module that loads environment variables
const port = process.env.PORT || 8000;
mongoose.connect(process.env.DATABASE, // tshirt is the name of the database in this case
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log(`DB is connected.`))
    .catch(err => console.log(err));

app.listen(port, () => console.log(`App is running at ${port}`));
// useCreateIndex: true
