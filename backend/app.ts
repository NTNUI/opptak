import express, { application, Router } from 'express';
import connectDB from './config/db';
import cors from 'cors';


// routes
import testRoute from './routes/api/test'

const app = express();
connectDB();

// Use cors
app.use(cors({ origin: 'http://localhost:3000' }));
// Connect Database
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/test', testRoute);

const port = 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));

