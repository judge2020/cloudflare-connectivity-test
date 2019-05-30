addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest (event) {
  let reqpath = new URL(event.request.url).pathname
  if (reqpath === '/') {
    reqpath = '/index.html'
  }
  const value = await STATIC_KV.get(reqpath)
  if (value === null) {
    return new Response('file not found', { status: 404 })
  }
  let filenamesplit = reqpath.split('.')
  let contenttype
  switch (filenamesplit[filenamesplit.length - 1]) {
    case 'html':
      contenttype = 'text/html;charset=utf-8'
      break
    case 'js':
      contenttype = 'text/javascript'
      break
    case 'css':
      contenttype = 'text/css'
      break
  }

  return new Response(atob(value), {
    headers: {
      'content-type': contenttype
    },
  })
}
