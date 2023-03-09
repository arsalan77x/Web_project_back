const path = require('path');
const { readFile } = require('fs');
const { promisify } = require('util');
const { sign, verify } = require('jsonwebtoken');
const { InternalError, BadTokenError, TokenExpiredError } = require('../core/ErrorHandler');
const Logger = require('../core/Logger');
const { ConsoleTransportOptions } = require('winston/lib/winston/transports');



class JWT {
    static readPublicKey() {
        return promisify(readFile)(path.join(__dirname, '../../keys/public.pem'), 'utf8');
    }

    static readPrivateKey() {
        return promisify(readFile)(path.join(__dirname, '../../keys/private.pem'), 'utf8');
    }

    static async encode(payload) {
        const cert = await this.readPrivateKey();
        if (!cert) throw new InternalError('TokenGenerationFailure');
   
        return promisify(sign)({ ...payload }, cert, { algorithm: 'RS256' });
    }


    static async validate(token,req) {
        const cert = await this.readPublicKey();
        try {
  
            return (await promisify(verify)(token, cert));
        } catch (e) {
            // Logger.debug(e);
            if (e && e.name === 'TokenExpiredError') throw new TokenExpiredError('TokenIsExpired');
            
            throw new BadTokenError();
        }
    }


    static async decode(token,req) {
        const cert = await this.readPublicKey();
        try {

            return (await promisify(verify)(token, cert, { ignoreExpiration: true }));
        } catch (e) {
            Logger.debug(e);
            throw new BadTokenError();
        }
    }
}

class JwtPayload {

    constructor(issuer, audience, subject, param, validity) {
        this.iss = issuer;
        this.aud = audience;
        this.sub = subject;
        this.iat = Math.floor(Date.now() / 1000);
        this.exp = this.iat + validity * 24 * 60 * 60;
        this.prm = param;
    }
}

module.exports = { JWT, JwtPayload }
