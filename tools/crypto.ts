import { randomBytes, createHash, createHmac } from 'crypto'

const PASSWORD_SALT_LENGTH = 16

function generateRandomBytes(size: number) {
    return new Promise<Buffer>((resolve, reject) => {
        randomBytes(size, (err, buf) => {
            if (err) {
                return reject(err);
            }
            resolve(buf)
        })
    })
}

function sha256(text: string | Buffer) {
    const hash = createHash("sha256")
    hash.update(text)
    return hash.digest();
}

async function hashPassword(password: string, optionalKey?: Buffer) {
    const key = optionalKey || await generateRandomBytes(PASSWORD_SALT_LENGTH)
    const passwordSha = sha256(password);
    const hmac = createHmac("sha256", key);
    hmac.update(passwordSha)
    const passwordHash = hmac.digest();
    return Buffer.concat([key, passwordHash]).toString('hex')
}

async function verifyStoredPassword(receivedPassword: string, storedPassword: string) {
    const storedPasswordBuffer = Buffer.from(storedPassword, "hex");
    const key = Buffer.alloc(PASSWORD_SALT_LENGTH);
    for (let i = 0; i < PASSWORD_SALT_LENGTH; i++) {
        key[i] = storedPasswordBuffer[i]
    }
    const receivedHash = await hashPassword(receivedPassword, key);
    return receivedHash === storedPassword
}

export {
    generateRandomBytes, sha256, hashPassword, verifyStoredPassword
}