import crypto from 'crypto'

const keyFromEnv = () => {
  const secret = process.env.PHONE_SECRET || ''
  return crypto.createHash('sha256').update(secret).digest()
}

export const encryptText = (plain) => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', keyFromEnv(), iv)
  let enc = cipher.update(String(plain), 'utf8', 'hex')
  enc += cipher.final('hex')
  return iv.toString('hex') + '.' + enc
}

export const decryptText = (enc) => {
  const [ivHex, dataHex] = String(enc).split('.')
  const iv = Buffer.from(ivHex, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyFromEnv(), iv)
  let dec = decipher.update(dataHex, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}
