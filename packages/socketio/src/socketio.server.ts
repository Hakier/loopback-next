// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  Constructor,
  Context,
  createBindingFromClass,
  BindingScope,
} from '@loopback/context';
import {HttpServer} from '@loopback/http-server';
import {Server, ServerOptions, Socket} from 'socket.io';
import {getSocketIOMetadata} from './decorators/socketio.decorator';
import {SocketIOControllerFactory} from './socketio-controller-factory';
import SocketIO = require('socket.io');
import {CoreBindings} from '@loopback/core';

const debug = require('debug')('loopback:socketio');

// tslint:disable:no-any
export type SockIOMiddleware = (
  socket: Socket,
  fn: (err?: any) => void,
) => void;

/**
 * A socketio server
 */
export class SocketIOServer extends Context {
  private io: Server;

  constructor(
    public readonly httpServer: HttpServer,
    private options: ServerOptions = {},
  ) {
    super();
    this.io = SocketIO(options);
  }

  /**
   * Register a sock.io middleware function
   * @param fn
   */
  use(fn: SockIOMiddleware) {
    return this.io.use(fn);
  }

  /**
   * Register a socketio controller
   * @param controllerClass
   * @param namespace
   */
  route(controllerClass: Constructor<object>, namespace?: string | RegExp) {
    this.controller(controllerClass);
    if (namespace == null) {
      const meta = getSocketIOMetadata(controllerClass);
      namespace = meta && meta.namespace;
    }

    const nsp = namespace ? this.io.of(namespace) : this.io;
    nsp.on('connection', async socket => {
      debug(
        'Websocket connected: id=%s namespace=%s',
        socket.id,
        socket.nsp.name,
      );
      // Create a request context
      const reqCtx = new SocketIORequestContext(socket, this);
      // Bind socketio
      reqCtx.bind('socketio.socket').to(socket);
      reqCtx.bind(CoreBindings.CONTROLLER_CLASS).to(controllerClass);
      reqCtx
        .bind(CoreBindings.CONTROLLER_CURRENT)
        .toClass(controllerClass)
        .inScope(BindingScope.SINGLETON);
      // Instantiate the controller instance
      await new SocketIOControllerFactory(reqCtx, controllerClass).create();
    });
    return nsp;
  }

  controller(controllerClass: Constructor<unknown>) {
    const binding = createBindingFromClass(controllerClass, {
      namespace: 'socketio.controllers',
      defaultScope: BindingScope.TRANSIENT,
    }).tag('socketio');
    this.add(binding);
    return binding;
  }

  /**
   * Start the socketio server
   */
  async start() {
    await this.httpServer.start();
    this.io.attach(this.httpServer.server, this.options);
  }

  /**
   * Stop the socketio server
   */
  async stop() {
    const closePromise = new Promise<void>((resolve, reject) => {
      this.io.close(() => {
        resolve();
      });
    });
    await closePromise;
    await this.httpServer.stop();
  }
}

export class SocketIORequestContext extends Context {
  constructor(public readonly socket: Socket, parent: Context) {
    super(parent);
  }
}
