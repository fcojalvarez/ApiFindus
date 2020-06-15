let envs = {}
if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv");
    const result = dotenv.config();
    envs = result.parsed
}

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || envs.FIREBASE_API_KEY,
    authDomain: process.env.AUTH_DOMAIN || envs.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL || envs.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID || envs.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || envs.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || envs.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID || envs.FIREBASE_APP_ID
};

const mongoConfig = process.env.MONGO_DB_URL || envs.MONGO_DB_URL;
const jwtKey = process.env.JWT_PASSWORD || envs.JWT_PASSWORD
const configMailer = {
    user: process.env.USER_EMAIL || envs.USER_EMAIL,
    password: process.env.PASSWORD_EMAIL || envs.PASSWORD_EMAIL
}

const config = {
    firebaseConfig,
    mongoConfig,
    jwtKey,
    configMailer
}

exports.firebaseConfig = firebaseConfig
exports.mongoConfig = mongoConfig
exports.jwtKey = jwtKey
exports.configMailer = configMailer

module.exports = config;