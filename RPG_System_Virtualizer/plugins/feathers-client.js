import io from 'socket.io-client'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'

const socket = io(process.env.SOCKET, { transports: ['websocket'] })
const client = feathers()

client.configure(socketio(socket))

export default client