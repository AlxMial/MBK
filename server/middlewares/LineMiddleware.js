const { verify } = require("jsonwebtoken");
const ValidateEncrypt = require("../services/crypto");
const Encrypt = new ValidateEncrypt();

const validateLineToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  let Unauthorized = {
    status: false,
    code: 401,
    error: "Unauthorized",
  };
  if (!accessToken) {
    return res.json(Unauthorized);
  } else {
    try {
      const reqtoken = verify(accessToken, "LINEMBKPROJECT");
      if (validToken(reqtoken, req)) {
        return next();
      } else {
        return res.json(Unauthorized);
      }
    } catch (err) {
      return res.json(Unauthorized);
    }
  }
};
const validToken = (reqtoken, req) => {
  let status = true;
  try {
    const { keyWord } = reqtoken;
    const token = Encrypt.DecodeKey(keyWord);
    const payload = JSON.parse(token);
    const keyWordArray = Encrypt.DecodeKey(payload.keyWord).split(",");
    const userAgentOrigin = Encrypt.DecodeKey(keyWordArray[0]);
    const hostOrigin = Encrypt.DecodeKey(keyWordArray[1]);
    if (
      req.headers["user-agent"] === userAgentOrigin &&
      req.headers["host"] === hostOrigin
    ) {
      req.user = { id: payload.id, uid: payload.uid };
    //   return next();
    } else {
      status = false;
    }
  } catch (e) {
    status = false;
  }
  return status;
};

module.exports = { validateLineToken };
