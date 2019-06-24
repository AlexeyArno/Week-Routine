import { ITCPServer, IRequestInfo } from "./interfaces";
import { IMessage } from "./messages";
import {  TCPConn, ISettingForTCP } from "./tcpconn";
import { TCPFactory } from "./tcpfactory";
import { net, ISocket } from "./net";

//
//        TCP Client                        TCP Server
//           |                                 |
//           |             Connect             |
//           |   ------------------------->    |
//           |                                 |
//           |    Encrypted Messsage Data      |
//           |   ------------------------->    |
//           |                                 |
//           |                                 |
//
//

const ondata = "data";
const onerror = "error";
const onclose = "close";

export class TCPServer implements ITCPServer {
  private name: string;
  private debug: boolean;
  private port: number;
  private servicesPort: number;
  private server: any | null;
  private connections: TCPConn[] = [];
  private recieve: (msg: IMessage) => void;
  private settings: () => ISettingForTCP;
  // private password: (nid: string) => Promise<string>;
  // private failedDecode: (NetworkID: string) => Promise<string>;
  // private successDecode: (syncID: string, pass: string) => Promise<void>;

  private tcpfactory: TCPFactory;

  constructor(
    debug: boolean,
    port: number,
    servicesPort: number,
    name: string,
    settings: () => ISettingForTCP,
    onRecive: (msg: IMessage) => void,
    // getPassord: (networkID: string) => Promise<string>,
    // failedDecode: (networkID: string) => Promise<string>,
    // successDecode: (syncID: string, pass: string) => Promise<void>,
  ) {
    this.debug = debug;
    this.port = port;
    this.servicesPort = servicesPort;
    this.name = name;
    this.settings = settings;
    this.recieve = onRecive;
    // this.password = getPassord;
    // this.failedDecode = failedDecode;
    // this.successDecode = successDecode;
    this.server = null;
    this.tcpfactory = new TCPFactory();

  }

  public async Start() {
    await new Promise(async (res) => {
      await this.tcpfactory.Init(
      {
        name: this.name,
        tcpdebug: this.debug,
        settings: this.settings,
        recive: this.recieve,
        // getPassword: this.password,
        closed: (id: number) => {/* */},
        // failedDecode: this.failedDecode,
        // successDecode: this.successDecode,
      });
      this.server = net.createServer(this.connHandler.bind(this));
      this.server!.on(onerror, (err: any) => {
        if (this.debug) {
          console.log(`${this.name}: TCP server error `, err);
        }
      });
      this.server!.listen(this.port, () => {
        if (this.debug) {
          console.log(`${this.name}: TCP server listening ${this.server!.address().address}:${this.port}`);
        }
        res();
      });
    });
  }

  public async PushDataTo(addr: string, m: string) {
    let c: TCPConn | null;
    c = this.getConnectionByAddr(addr);
    if (!c) {
      c = this.tcpfactory.Create(net.createSocket(), true);
      c.Connect(addr, this.servicesPort);
      this.connections.push((c as TCPConn));
    }
    if (this.debug) {
      console.log(`${this.name}: message sent to ${addr}:${this.servicesPort}`);
    }
    c!.Send(m);
  }

  public Close(c: () => void) {
    this.clearConnections();
    this.server!.close(c);
    if (this.debug) {
      console.log(`${this.name}: TCP closing ...`);
    }
  }

  private async connHandler(socket: ISocket) {
    if (this.debug) {
      console.log(`${this.name} - new connection `, socket.remotePort);
    }
    const conn: TCPConn = this.tcpfactory.Create(socket, false);
    this.connections.push(conn);
  }

  private popConnection(id: number) {
    this.connections = this.connections.filter((v) => {
      if (v.ID === id) {
        v.Close();
        return false;
      }
      return true;
    });
  }

  private getConnByNetworkID(networkID: string) {
    for (const c of this.connections) {
      if (c.networkID === networkID) {
        return c;
      }
    }
    return null;
  }

  private getConnectionByAddr(addr: string): TCPConn | null {
    for (const c of this.connections) {
      if (c.address === addr) {
        return c;
      }
    }
    return null;
  }

  private clearConnections() {
    this.connections = this.connections.filter((v) => {
      v.Close();
      return false;
    });
  }

}
