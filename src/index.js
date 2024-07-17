const express = require('express');
const rateLimit = require('express-rate-limit')


const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const { Auth } = require('./utils/common');

const app = express();

const limiter = rateLimit({
    windowMs : 2 * 60 * 1000, //2 minute window
    max : 3 //Limit each Ip to 3 Requests per window
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(limiter);

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
   
});
