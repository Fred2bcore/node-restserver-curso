const jwt = require('jsonwebtoken');

// ==================
// Verifica Token
// ==================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: '¡Token Invalido Vuelva a Intentarlo!'
                }
            });
        }
        req.user = decoded.user;
        next();
    });

};
// ==================
// Verifica AdminRole
// ==================
let verificaAdminRole = (req, res, next) => {
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: '¡El Usuario no es Administrador!'
            }
        });
    }
}
module.exports = {
    verificaToken,
    verificaAdminRole
}