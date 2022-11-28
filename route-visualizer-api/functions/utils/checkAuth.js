const { admin } = require("../utils/admin");

exports.checkAuth = (req, res, next) => {
  if (req.headers.authorization) {
    let idToken = req.headers.authorization;

    admin.auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        req.uid = uid;
        next();
      })
      .catch((error) => {
        console.log('error', error);
        res.status(403).send('Unauthorized')
      });
  } else {
    res.status(403).send('Unauthorized')
  }
}
