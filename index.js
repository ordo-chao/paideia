import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from './Utils/db.js';
import path from 'path';
import pinoHttp from 'pino-http';
import './Models/index.js';
import { logger } from './Utils/logger.js';
const log = logger.child({});
dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

// Only use pino-pretty when running in a real terminal (local dev)
const pinoHttpOptions = {
  serializers: {
    req(req) {
      return { method: req.method, url: req.url };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
    err(err) {
      return { type: err.type, message: err.message };
    },
  },
  autoLogging: false,
};

if (process.stdout.isTTY) {
  pinoHttpOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      singleLine: true,
    },
  };
}

app.use(pinoHttp(pinoHttpOptions));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get("/", (req, res) => {
  res.status(200).json({});
});

import userRouter from './Routes/User.route.js';
import studentRouter from './Routes/Student.route.js';
import teacherRouter from './Routes/Teacher.route.js';
import parentRouter from './Routes/Parent.route.js';
import adminRouter from './Routes/Admin.route.js';
import passwordRoute from './Routes/Password.route.js'
import academicyearRouter from './Routes/Academic_Years.route.js'
import termsRouter from './Routes/Terms.route.js'
import classlevelsRouter from './Routes/Class_Levels.route.js'
import classstreamsRouter from './Routes/Class_Streams.route.js'
import subjectsRouter from './Routes/Subjects.route.js'


app.use('/user', userRouter);
app.use('/student', studentRouter);
app.use('/teacher', teacherRouter);
app.use('/parent', parentRouter);
app.use('/admin', adminRouter);
app.use('/password' , passwordRoute)
app.use('/academicyear', academicyearRouter)
app.use('/terms', termsRouter)
app.use('/classlevels', classlevelsRouter)
app.use('/classstreams', classstreamsRouter)
app.use('/subjects', subjectsRouter)



app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();

    log.info("Models synced...");
    log.info(`Server running on port ${PORT}`);
  } catch (error) {
    console.error(error);
    log.error("Database error:", error);
  }
});