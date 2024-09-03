const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const redisClient = require('./redis')
function createRandom() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const characterLength = characters.length
    for (let i = 0; i < 8; i++) {
        const number = Math.floor(Math.random() * characterLength);
        result += characters.charAt(number);

    }
    return result;
}
// console.log(createRandom())
// createRandom()
async function createTable(url) {
    try {
        const shortURL = createRandom();
        console.log(shortURL)
        const result = await prisma.uRLservice.create({
            data: {
                url: url,
                shortUrl: shortURL,
            }
        })
        // console.log(result)
        await redisClient.set(shortURL, url);
        // console.log(await redisClient.get(shortURL));

        return result;
    } catch (error) {
        console.error(error)
    }

}

async function increaseAccessCount(shorturl) {
    try {
        const result = await prisma.uRLservice.update({
            where: {
                shortUrl: shorturl
            },
            data: {
                accessCount: { increment: 1 }
            }
        })
    } catch (error) {

    }
}

async function fetchURL(shorturl) {
    try {
        const result = await redisClient.get(shorturl);
        // console.log(result);
        if (result) {
            await increaseAccessCount(shorturl);
        }
        return result;
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    createTable,
    fetchURL
}