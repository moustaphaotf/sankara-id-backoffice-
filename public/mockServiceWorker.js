/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker.
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = '02f4ad4a2ca75f45aa49';
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse');
const activeClientIds = new Set();

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', async function (event) {
  const clientId = event.source.id;

  if (!clientId || !event.data) {
    return;
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  });

  switch (event.data.type) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(event.source, {
        type: 'KEEPALIVE_RESPONSE',
      });
      break;
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(event.source, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      });
      break;
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId);

      sendToClient(event.source, {
        type: 'MOCKING_ENABLED',
      });
      break;
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId);
      break;
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId);

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId;
      });

      // Unregister itself when there are no more clients
      if (remainingClients.length === 0) {
        self.registration.unregister();
      }

      break;
    }
  }
});

self.addEventListener('fetch', function (event) {
  const { request } = event;

  // Bypass server-sent events.
  if (request.headers.get('accept') === 'text/event-stream') {
    return;
  }

  // Bypass navigation requests.
  if (request.mode === 'navigate') {
    return;
  }

  // Opening the DevTools triggers the "only-if-cached" request
  // that cannot be handled by the worker. Bypass such requests.
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return;
  }

  // Bypass all requests when there are no active clients.
  // Prevents the self-unregistered worked from handling requests
  // after it's been deleted (still remains active until the next reload).
  if (activeClientIds.size === 0) {
    return;
  }

  // Generate unique request ID.
  const requestId = Math.random().toString(16).slice(2);

  event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      if (error.name === 'NetworkError') {
        console.warn(
          'Bypass a network request in "%s" because the request failed.',
          request.url,
        );

        return;
      }

      // Re-throw all other errors.
      throw error;
    }),
  );
});

async function handleRequest(event, requestId) {
  const client = await resolveMainClient(event);
  const response = await getResponse(event, client, requestId);

  // Send back the response clone for the "response:*" life-cycle events.
  // Ensure MSW is active and ready to handle the message, otherwise
  // this message will pend indefinitely.
  if (client && activeClientIds.has(client.id)) {
    (async function () {
      const responseClone = response.clone();

      sendToClient(client, {
        type: 'RESPONSE',
        payload: {
          requestId,
          type: responseClone.type,
          ok: responseClone.ok,
          status: responseClone.status,
          statusText: responseClone.statusText,
          body: responseClone.body === null ? null : await responseClone.text(),
          headers: Object.fromEntries(responseClone.headers.entries()),
        },
      });
    })();
  }

  return response;
}

// Resolve the main client for the given event.
// Client that issues a request doesn't necessarily equal the client
// that registered the worker. It's with the latter the worker should
// communicate with during the response resolving phase.
async function resolveMainClient(event) {
  const url = new URL(event.request.url);

  // If the request URL is an absolute URL from the same origin,
  // the request is coming from a same-origin window.
  // Otherwise, it's a cross-origin request.
  const isSameOrigin = self.location.origin === url.origin;

  if (isSameOrigin) {
    return self.clients.get(event.clientId);
  }

  // For the cross-origin requests, resolve the main client
  // using its frame ID (Chrome; Firefox does not provide it).
  const frameId = event.request.headers.get('sec-fetch-dest') === 'document' ? 'top-level' : null;

  const allClients = await self.clients.matchAll({
    type: 'window',
  });

  return allClients
    .filter((client) => {
      // Get the target origin from the client's URL.
      const clientUrl = new URL(client.url);

      // Return the client within the same origin that match the frame ID.
      return (
        clientUrl.origin === self.location.origin && client.frameType === frameId
      );
    })
    .at(0);
}

async function getResponse(event, client, requestId) {
  const { request } = event;
  const requestClone = request.clone();

  function passthrough() {
    // Clone the request because it might've been already used
    // (i.e. its body has been read and sent to the client).
    const headers = Object.fromEntries(requestClone.headers.entries());

    // Remove MSW-specific request headers so the bypassed requests
    // comply with the server's CORS preflight check.
    // Operate with the headers as an object because request "Headers"
    // are immutable.
    delete headers['x-msw-intention'];

    return fetch(requestClone, { headers });
  }

  // Bypass mocking when the client is not active.
  if (!client) {
    return passthrough();
  }

  // Bypass initial page load requests (i.e. static assets).
  // The absence of the immediate/parent client in the map of the active clients
  // means that MSW hasn't dispatched the "MOCK_ACTIVATE" event yet
  // and is not ready to handle requests.
  if (!activeClientIds.has(client.id)) {
    return passthrough();
  }

  // Bypass requests with the explicit bypass header.
  if (requestClone.headers.get('x-msw-intention') === 'bypass') {
    return passthrough();
  }

  // Notify the client about a request being intercepted.
  const requestBuffer = await requestClone.arrayBuffer();
  const clientMessage = await sendToClient(
    client,
    {
      type: 'REQUEST',
      payload: {
        id: requestId,
        url: requestClone.url,
        mode: requestClone.mode,
        method: requestClone.method,
        headers: Object.fromEntries(requestClone.headers.entries()),
        cache: requestClone.cache,
        credentials: requestClone.credentials,
        destination: requestClone.destination,
        integrity: requestClone.integrity,
        redirect: requestClone.redirect,
        referrer: requestClone.referrer,
        referrerPolicy: requestClone.referrerPolicy,
        body: requestBuffer,
        bodyUsed: requestClone.bodyUsed,
        keepalive: requestClone.keepalive,
      },
    },
    [requestBuffer],
  );

  switch (clientMessage.type) {
    case 'MOCK_RESPONSE': {
      return respondWithMock(clientMessage.data);
    }

    case 'MOCK_NOT_FOUND': {
      return passthrough();
    }
  }

  return passthrough();
}

function sendToClient(client, message, transferrables = []) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = function (event) {
      if (event.data && event.data.error) {
        return reject(event.data.error);
      }

      resolve(event.data);
    };

    client.postMessage(
      message,
      [channel.port2].concat(transferrables.filter(Boolean)),
    );
  });
}

function sleep(timeMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
}

async function respondWithMock(response) {
  await sleep(response.delay);
  return new Response(response.body, response.init);
}