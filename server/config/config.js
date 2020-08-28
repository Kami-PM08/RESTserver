//==========================================
//Port

process.env.PORT = process.env.PORT || 3000;

//==========================================
//Environment

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==========================================
//Expiration token
//60seg, 60min, 24h, 30d

process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;


//==========================================
//Authentication seed

process.env.SEED = process.env.SEED || 'development-seed';


//==========================================
//Data Base

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = process.env.MONGODB_URL;
}

process.env.URLDB = urlDB;