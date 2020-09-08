const jwt = require('jsonwebtoken');

//==========================================
//Authentication token

let authenticToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token.'
                }
            });
        }

        req.user = decoded.user;

        next();

    })

}

//==========================================
//Authentication admin role

let authenticAdmin = (req, res, next) => {
    let user = req.user;

    if (user.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            message: 'The user is not a administrator.'
        })
    }
    next();
}

//==========================================
//Authentication token by url

let authenticTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token.'
                }
            });
        }

        req.user = decoded.user;

        next();

    })

}

module.exports = {
    authenticToken,
    authenticAdmin,
    authenticTokenImg
}