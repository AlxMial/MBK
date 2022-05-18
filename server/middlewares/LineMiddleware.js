const {verify} = require("jsonwebtoken");

const validateLineToken = ( req, res , next) => {
    const accessToken = req.header("accessToken");
    if(!accessToken) {return res.json({error : "Line not logged in!"})}
    else { 
        try{
            const validToken = verify(accessToken,"LINEMBKPROJECT");
            req.user = validToken
            if(validToken){
                return next();
            }

        }catch (err){
            return res.json({error:err});
        }
    }
}

module.exports = {validateLineToken}