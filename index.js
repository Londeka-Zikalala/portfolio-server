import express from 'express';
import db from './db.js';
import contactMe from './SERVICE/contact-me.js';
import contactMeAPI from './API/contact-me-server.js';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
app.use(cors());
app.use(bodyParser.json());

const contactMeDb = contactMe(db);
const contactMeApi = contactMeAPI(contactMeDb);


//API ROUTE HANDLERS

app.post('/contact', contactMeApi.postMessage);




const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});