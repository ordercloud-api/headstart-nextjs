import crypto from 'crypto'

const headerName = 'x-oc-hash'

const withOcHashValidation = (handler) => (req, res) => {
  // validate webhook if environment variable set

  const hashkey = process.env.NEXT_OC_HASH_KEY
  if (!hashkey) {
    return res.status(500).send(`Missing environment variable for hashKey`)
  }
  const sent = Array.isArray(req.headers[headerName])
    ? req.headers[headerName][0]
    : req.headers[headerName]
  if (sent) {
    // not ideal to re-stringify the json body vs using the raw (https://github.com/vercel/next.js/discussions/13405)
    return new Promise<void>((resolve) => {
      let buf = ''
      req.setEncoding('utf8')
      req.on('data', (chunk) => {
        buf += chunk
      })
      req.on('end', () => {
        req.rawBody = buf
        req.body = JSON.parse(Buffer.from(req.rawBody).toString())
        const hash = crypto.createHmac('sha256', hashkey).update(req.rawBody).digest('base64')
        if (hash !== sent) {
          res.status(403).send(`Header '${headerName} is Not Valid`)
        } else {
          handler(req, res)
        }
        resolve()
      })
    })
  }
  return res.status(401).send(`Header '${headerName}' Required`)
}

export default withOcHashValidation
