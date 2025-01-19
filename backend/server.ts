import express, { Application, Request, Response } from "express";

const app = express();
app.use(express.json());
const PORT = 5000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
