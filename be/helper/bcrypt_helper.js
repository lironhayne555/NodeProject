const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const daysjs = require("dayjs");
const cookieOptions = {
    httpOnly:true,
    expires: daysjs().add(config.token.cookie.expiryPeriod, config.token.cookie.expiryType).toDate(),
};

async function hash(text) {
    if(!text) return null;

   return await bcrypt.hash(text,config.salts.hash);
}
function jwtSign(object) {
    return jwt.sign({ object }, config.salts.jwt, { expiresIn: config.token.expiry });
}

// a 'verify' JWT wrapper function which executes the 'jwt.verify' function
// If provides the 'token' and a 'callback' function which includes an 'err' object if an error was generated
// of nothing 'callFunction()' if no error was created
function jwtVerify(token, callFunction) {

    jwt.verify(token, config.salts.jwt, (err, payload) => {
        console.log(payload);
        // A. If 'err' exists: [1] Token expired
        if (err && err.message === "jwt expired") {
            callFunction({status: 403, message: "Your session has expired."});
            return;
        }

        // [2] All else
        if (err) {
            callFunction({status: 401, message: "You are not authorized to access this resource."});
            return;
        }

        // B. If all is well, 'callFunction' without an 'error' object
        callFunction();
    });
}
// a 'verify' JWT wrapper function which executes the 'jwt.verify' function
// If provides the 'token' and a 'callback' function which includes an 'err' object if an error was generated
// of nothing 'callFunction()' if no error was created

module.exports = {hash,
    jwtSign,
    jwtVerify,
    cookieOptions};
