import { createRequestHandler } from '@react-router/express';
import express from 'express';
import * as build from '../dist/server/index.js';

const app = express();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.use(createRequestHandler({ build }));

export default app;
