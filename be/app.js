global.config = require("./config.json");

const express = require ('express');
const app = express()
const authRouter = require('./routers/authRouter');
const cardRouter = require('./routers/cardRouter');
const cors = require('cors');
require('./dal/dal');


// 'app' adds middelwares in order of apperance
app.use(express.json());
app.use(cors());


// Ready for endpoint processing (past JSON and CORS middlewares)
app.use('/api/auth',authRouter);
app.use('/api/card',cardRouter);



app.listen(8080, () => {
    console.log(`listening to port 8080`);
})