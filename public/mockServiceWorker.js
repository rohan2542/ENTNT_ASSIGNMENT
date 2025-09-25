const PACKAGE_VERSION = '2.11.3'
const INTEGRITY_CHECKSUM = '4db4a41e972cec1b64cc569c66952d82'
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse')
const activeClientIds = new Set()

// Lifecycle: install → activate
addEventListener('install', () => self.skipWaiting())
addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

// Handle client messages
addEventListener('message', async (event) => {
  const clientId = Reflect.get(event.source || {}, 'id')
  if (!clientId || !self.clients) return

  const client = await self.clients.get(clientId)
  if (!client) return

  const allClients = await self.clients.matchAll({ type: 'window' })

  switch (event.data) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(client, { type: 'KEEPALIVE_RESPONSE' })
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(client, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: { packageVersion: PACKAGE_VERSION, checksum: INTEGRITY_CHECKSUM },
      })
      break
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)
      sendToClient(client, {
        type: 'MOCKING_ENABLED',
        payload: { client: { id: client.id, frameType: client.frameType } },
      })
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)
      const remainingClients = allClients.filter((c) => c.id !== clientId)
      if (remainingClients.length === 0) self.registration.unregister()
      break
    }
  }
})

// Intercept fetch requests for mocking
addEventListener('fetch', (event) => {
  const requestInterceptedAt = Date.now()

  // Skip navigation and special DevTools cache requests
  if (event.request.mode === 'navigate') return
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return

  // If no active clients, let the request pass through
  if (activeClientIds.size === 0) return

  const requestId = crypto.randomUUID()
  event.respondWith(handleRequest(event, requestId, requestInterceptedAt))
})

/**
 * Handle intercepted requests:
 * - Forward to client for potential mocking
 * - Return mocked response if provided, otherwise passthrough
 */
async function handleRequest(event, requestId, requestInterceptedAt) {
  const client = await resolveMainClient(event)
  const requestCloneForEvents = event.request.clone()
  const response = await getResponse(event, client, requestId, requestInterceptedAt)

  // Notify client about response lifecycle if mocking is active
  if (client && activeClientIds.has(client.id)) {
    const serializedRequest = await serializeRequest(requestCloneForEvents)
    const responseClone = response.clone()

    sendToClient(
      client,
      {
        type: 'RESPONSE',
        payload: {
          isMockedResponse: IS_MOCKED_RESPONSE in response,
          request: { id: requestId, ...serializedRequest },
          response: {
            type: responseClone.type,
            status: responseClone.status,
            statusText: responseClone.statusText,
            headers: Object.fromEntries(responseClone.headers.entries()),
            body: responseClone.body,
          },
        },
      },
      responseClone.body ? [serializedRequest.body, responseClone.body] : [],
    )
  }

  return response
}

/**
 * Determine which client should handle intercepted requests.
 * Prefers:
 *  1. The requesting client if active
 *  2. A top-level frame
 *  3. The first visible, active client
 */
async function resolveMainClient(event) {
  const client = await self.clients.get(event.clientId)
  if (activeClientIds.has(event.clientId)) return client
  if (client?.frameType === 'top-level') return client

  const allClients = await self.clients.matchAll({ type: 'window' })
  return allClients
    .filter((c) => c.visibilityState === 'visible')
    .find((c) => activeClientIds.has(c.id))
}

/**
 * Decide how to resolve a request:
 * - Send to client for mock handling
 * - Passthrough to network if no mock
 */
async function getResponse(event, client, requestId, requestInterceptedAt) {
  const requestClone = event.request.clone()

  function passthrough() {
    const headers = new Headers(requestClone.headers)
    const acceptHeader = headers.get('accept')
    if (acceptHeader) {
      const filtered = acceptHeader.split(',').map((v) => v.trim()).filter((v) => v !== 'msw/passthrough')
      if (filtered.length > 0) headers.set('accept', filtered.join(', '))
      else headers.delete('accept')
    }
    return fetch(requestClone, { headers })
  }

  if (!client || !activeClientIds.has(client.id)) return passthrough()

  const serializedRequest = await serializeRequest(event.request)
  const clientMessage = await sendToClient(
    client,
    {
      type: 'REQUEST',
      payload: { id: requestId, interceptedAt: requestInterceptedAt, ...serializedRequest },
    },
    [serializedRequest.body],
  )

  switch (clientMessage.type) {
    case 'MOCK_RESPONSE':
      return respondWithMock(clientMessage.data)
    case 'PASSTHROUGH':
    default:
      return passthrough()
  }
}

/**
 * Send a message to a client and await response
 */
function sendToClient(client, message, transferrables = []) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()
    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) return reject(event.data.error)
      resolve(event.data)
    }
    client.postMessage(message, [channel.port2, ...transferrables.filter(Boolean)])
  })
}

/**
 * Construct a mocked response object
 */
function respondWithMock(response) {
  if (response.status === 0) return Response.error()
  const mockedResponse = new Response(response.body, response)
  Reflect.defineProperty(mockedResponse, IS_MOCKED_RESPONSE, { value: true, enumerable: true })
  return mockedResponse
}

/**
 * Serialize a request into a structured object for client communication
 */
async function serializeRequest(request) {
  return {
    url: request.url,
    mode: request.mode,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    cache: request.cache,
    credentials: request.credentials,
    destination: request.destination,
    integrity: request.integrity,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    body: await request.arrayBuffer(),
    keepalive: request.keepalive,
  }
}
