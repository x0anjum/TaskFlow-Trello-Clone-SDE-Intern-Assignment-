import "dotenv/config";
import express from "express";
import cors from "cors";

import boardsRouter from "./routes/boards";
import listsRouter from "./routes/lists";
import cardsRouter from "./routes/cards";
import checklistsRouter from "./routes/checklists";
import usersRouter from "./routes/users";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/boards", boardsRouter);
app.use("/lists", listsRouter);
app.use("/cards", cardsRouter);
app.use("/checklists", checklistsRouter);
app.use("/users", usersRouter);

const port = Number.parseInt(process.env.PORT ?? "4000", 10);

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
