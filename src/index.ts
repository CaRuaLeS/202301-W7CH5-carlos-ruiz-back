import http from 'http';
import { app } from './app.js';
import createDebug from 'debug';

const debug = createDebug('RS');

const PORT = process.env.PORT || 4500;

const server = http.createServer(app);

server.listen(PORT);

server.on('listening', () => {
  debug('Listening in http://localhost:' + PORT);
});
