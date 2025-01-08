import express, { Express, Request, Response } from "express";
const path = require('path');

const app: Express = express();

//folder for static resources
app.use(express.static(path.join(__dirname, 'src', 'view')));

app.get("/", (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, 'src', 'view' ,'index.html'));
});

app.listen(3000, () => {
  console.log(`[server]: Server is running at http://localhost:3000`);
});