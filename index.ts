import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { artistRoutes } from "./src/routes/artistRoutes";
import { errorHandler } from "./src/middlewares/errorMiddleware";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/artist", artistRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    ()=>console.log(`Server running on port ${PORT}`)
);
