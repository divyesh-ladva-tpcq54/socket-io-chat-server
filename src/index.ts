import 'reflect-metadata'
import http from 'http';
import { App } from "./App";
import { connectDB } from "./modules/database";
import { container } from 'tsyringe';
import { SocketServer } from './socket-server';

const httpServerPort = 3344;
const webSocketPort = 3434;

const httpServer = http.createServer(container.resolve(App).getInstance());
const socketServer = container.resolve(SocketServer).getInstance();

async function bootApp() {
  try {
    // connect to database
    await connectDB();
    
    // start socket server
    socketServer.listen(webSocketPort);

    // start the express server
    httpServer.listen(httpServerPort, () => {
      console.log(`http started at port ${httpServerPort}`);
      console.log(`web socket server started at port ${webSocketPort}`);
    });

  } catch (error: any) {
    console.log(error);
  }
}

bootApp();
