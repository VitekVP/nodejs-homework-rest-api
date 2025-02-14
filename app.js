import express from "express";
import logger from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRoutes.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
	res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Server Error" } = err;
	res.status(status).json({ message });
});

export default app;
