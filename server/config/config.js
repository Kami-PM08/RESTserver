//==========================================
//Port

process.env.PORT = process.env.PORT || 3000;

//==========================================
//Environment

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==========================================
//Data Base

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = 'mongodb+srv://Momonga:Qs3Me7IsesQWtMgw@cluster0.ornbw.mongodb.net/coffee';
}

process.env.URLDB = urlDB;