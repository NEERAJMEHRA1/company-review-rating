
//NPM
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createRequire } from "module";
import swaggerUi from "swagger-ui-express";
const require = createRequire(import.meta.url);
const swaggerDoc = require("./swagger.json");
dotenv.config();
//Call function
import logger from "./logger.js";
import database from "./src/helper/config/db.js";
import reviewRoutes from "./src/api/reviews/index.js";
import companyRoutes from "./src/api/company/index.js";
import { notFound, errorHandler } from './src/helper/middleware/errorMiddleware.js';

const app = express();
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

//swagger set up
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));


//cors
const corsOption = {
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOption));

//main rout
app.use("/reviews", reviewRoutes);
app.use("/company", companyRoutes);

app.use("/assets", express.static("./assets"));


app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    console.log("Hello Neeraj");
    res.send("Hello this is started.")
})
//server connection
const server = http.createServer(app).listen(port, () => {
    console.log(`Server running at : http://localhost:${port}`);
});
database;
