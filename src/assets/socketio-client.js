import { io } from 'socket.io-client';
import cookie from 'js-cookie';
import { config } from '@/assets/utils/constants';
const baseURL = config.url.API_URL;

export let socket = io(baseURL, {
  withCredentials: true,
  query: {
    token: cookie.get('access_token')?.split(' ')?.[1],
  },
});

export function setSocket() {
  socket.disconnect();
  socket = io(baseURL, {
    withCredentials: true,
    query: {
      token: cookie.get('access_token')?.split(' ')?.[1],
    },
  });
}

export function sendMessage({ chat, from, text }) {
  socket.emit('sendMessage', {
    chat,
    from,
    text,
  });
}

export function readAllMessages({ chat, users }) {
  socket.emit('readMessages', {
    chat,
    users,
  });
}

export function readMessage(messageId) {
  socket.emit('readMessage', {
    messageId,
  });
}
