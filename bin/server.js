import server from '../server/main';
import http from 'http';
import ip from 'ip';

const localip = ip.address();
const port = 9000;
const host = ip.address();

http.createServer(server.callback()).listen(port);
console.log(`Server is now running at http://${host}:${port}.`);
console.log(`Server accessible via localhost:${port} if you are using the project defaults.`);