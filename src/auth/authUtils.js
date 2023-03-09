const { AuthFailureError, InternalError } = require('../core/ErrorHandler');
const { JWT, JwtPayload } = require('./JWT');
const { Types } = require('mongoose');
const { tokenInfo } = require('../../config');


const getAccessToken = (authorization, req) => {
    if (!authorization)  throw new AuthFailureError('InvalidAuthorization');
    if (!authorization.startsWith('Bearer '))  throw new AuthFailureError('InvalidAuthorization');
    return authorization.split(' ')[1];
};

const validateTokenData = (payload, req) => {
    if (
        !payload ||
        !payload.iss ||
        !payload.sub ||
        !payload.aud ||
        !payload.prm ||
        payload.iss !== tokenInfo.issuer ||
        payload.aud !== tokenInfo.audience ||
        !Types.ObjectId.isValid(payload.sub)
    )
        throw new AuthFailureError('InvalidAccessToken');
    return true;
};

const createTokens = async (
    user,
    accessTokenKey,
    refreshTokenKey,
) => {
    const accessToken = await JWT.encode(
        new JwtPayload(
            tokenInfo.issuer,
            tokenInfo.audience,
            user._id.toString(),
            accessTokenKey,
            tokenInfo.accessTokenValidityDays,
        ),
    );

    if (!accessToken) throw new InternalError();

    const refreshToken = await JWT.encode(
        new JwtPayload(
            tokenInfo.issuer,
            tokenInfo.audience,
            user._id.toString(),
            refreshTokenKey,
            tokenInfo.refreshTokenValidityDays,
        ),
    );

    if (!refreshToken) throw new InternalError();

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};
module.exports = { getAccessToken, validateTokenData, createTokens }
