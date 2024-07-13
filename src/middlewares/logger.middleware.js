// logger.js
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, json } = format;

// Create a Winston logger instance with JSON format
const logger = createLogger({
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Create a Morgan middleware to log request details in JSON format
const morganMiddleware = morgan((tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    content_length: tokens.res(req, res, 'content-length'),
    response_time: tokens['response-time'](req, res)
  });
}, {
  stream: {
    write: (message) => logger.info(JSON.parse(message))
  }
});

// Middleware to log request and response details
const logRequestResponse = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    logger.info({
      message: 'Response Body',
      body
    });
    originalSend.call(this, body);
  };

  logger.info({
    message: 'Request Data',
    method: req.method,
    url: req.url,
    // headers: req.headers,
    body: req.body
  });

  next();
};

export { logger, morganMiddleware, logRequestResponse };
