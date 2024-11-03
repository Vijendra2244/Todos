const jwt = require("jsonwebtoken");
const dotnev = require("dotenv");
const { Black } = require("../modals/BlackList.modals");
dotnev.config();

const auth = async (req, res, next) => {
  const access_token = req.cookies["access_token"];
  const refresh_token = req.cookies["refresh_token"];

  try {
    const isBlacklistedToken = await Black.findOne({
      access_token,
    });
    if (isBlacklistedToken) {
      return res.status(400).send({
        status: "fail",
        msg: "token is  blacklisted ,please login again",
      });
    }
    jwt.verify(access_token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.message == "jwt expired") {
          jwt.verify(
            refresh_token,
            process.env.REFRESH_TOKEN_KEY,
            async (err, refreshDecoded) => {
              if (err) {
                return res.status(400).send({
                  status: "fail",
                  msg: "refresh token is invalid please login again",
                });
              } else {
                const access_token = jwt.sign(
                  {
                    userEmail: refreshDecoded.userMail,
                    id: refreshDecoded.id,
                  },
                  process.env.ACCESS_SECRET_KEY,
                );
                res.cookie("access_token", access_token);
                next();
              }
            }
          );
        }
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    res.status(401).send({
      status: "fail",
      msg: `you are not authorized to do this ${error.message}`,
    });
  }
};

module.exports = { auth };

// if (req.isAuthenticated()) {
//     return next();
//   }
