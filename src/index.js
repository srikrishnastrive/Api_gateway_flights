const express = require('express');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');


const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');


const app = express();

const limiter = rateLimit({
    windowMs : 2 * 60 * 1000, //2 minute window
    max : 3 //Limit each Ip to 3 Requests per window
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(limiter);
app.use(
    '/flightService',
    createProxyMiddleware({
      target: ServerConfig.FLIGHT_SERVICE,
      changeOrigin: true,
      pathRewrite: {'^/flightService': '/'}

    }),
  );
  app.use(
    '/bookingService',
    createProxyMiddleware({
      target: ServerConfig.BOOKING_SERVICE,
      changeOrigin: true,
      pathRewrite : {'^/bookingService' : '/'}
    }),
  );

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
   
});

/**
 * user
 *  |
 * localhost:3001 (API GATEWAY)  localhost:4000/api/v1/bookings-- for authentication 
 * localhost:3001/bookingsService/api/v1/bookings
 * localhost:3001/flightService/api/v1/bookings
 *  |
 * localhost:3000/api/v1/flights
 * 
 */
