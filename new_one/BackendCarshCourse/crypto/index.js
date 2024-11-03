const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { performance } = require('perf_hooks');

// 1. Encrypt the string "Hello, Good Morning" and generate a random string using UUID
const encryptText = (text) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return { encrypted, key: key.toString('hex'), iv: iv.toString('hex') };
};

const generateUUID = () => {
    return uuidv4();
};

// 2. Read a large text file using streams and compare it with normal file system read
const readFileNormal = (filePath) => {
    const startTime = performance.now();
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;
        const endTime = performance.now();
        console.log('Normal Read Time:', (endTime - startTime) + 'ms');
    });
};

const readFileStream = (filePath) => {
    const startTime = performance.now();
    const readStream = fs.createReadStream(filePath, 'utf8');
    readStream.on('data', (chunk) => { /* Reading data chunk by chunk */ });
    readStream.on('end', () => {
        const endTime = performance.now();
        console.log('Stream Read Time:', (endTime - startTime) + 'ms');
    });
};

// 3. Print all the details of your system using the OS module
const printSystemInfo = () => {
    console.log('Operating System:', os.type());
    console.log('Platform:', os.platform());
    console.log('Architecture:', os.arch());
    console.log('CPU Info:', os.cpus());
    console.log('Total Memory:', os.totalmem() / (1024 * 1024 * 1024) + ' GB');
    console.log('Free Memory:', os.freemem() / (1024 * 1024 * 1024) + ' GB');
    console.log('Uptime:', os.uptime() + ' seconds');
};

// 4. Using Command Line Arguments to run specific functions
const args = process.argv.slice(2);
const filePath = path.join(__dirname, 'largeFile.txt'); // Adjust file path as necessary

if (args.includes('--crypto')) {
    const { encrypted, key, iv } = encryptText("Hello, Good Morning");
    console.log(`Encrypted Text: ${encrypted}`);
    console.log(`Key: ${key}`);
    console.log(`IV: ${iv}`);
}

if (args.includes('--uuid')) {
    console.log(`Random UUID: ${generateUUID()}`);
}

if (args.includes('--readFileNormal')) {
    readFileNormal(filePath);
}

if (args.includes('--readFileStream')) {
    readFileStream(filePath);
}

if (args.includes('--systemInfo')) {
    printSystemInfo();
}
