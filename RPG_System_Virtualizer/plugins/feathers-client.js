import feathers from '@feathersjs/feathers'
import fSocketio from '@feathersjs/socketio-client'
import fRest from '@feathersjs/rest-client'
import socketio from 'socket.io-client'
import axios from 'axios'
const restClient = fRest(process.env.REST)
const socket = socketio(process.env.SOCKET, { transports: ['websocket'] })
const client = feathers()

if (process.client) {
  client.configure(fSocketio(socket))
} else {
  client.configure(restClient.axios(axios))
}
export default client