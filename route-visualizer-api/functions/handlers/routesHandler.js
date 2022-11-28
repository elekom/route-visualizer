const { admin, db } = require("../utils/admin");

/**
 * Stored in DB collection '/users/{uid}/routes'
 * Document ID is route title ex. '高円寺 から 金沢'
 * Value is JSON of route
 * @param {*} req 
 * @param {*} res 
 */
 exports.saveRoute = async (req, res) => {
  try {
    db.doc(`users/${req.uid}/routes/${req.body.routeTitle}`)
      .set({ routeSegments: req.body.routeSegments, routeUrl: req.body.routeUrl });
    return res.status(204);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
}

exports.getSavedRoutes = async (req, res) => {
  console.log(req.uid);
  const ref = db.collection(`users/${req.uid}/routes`);

  try {
    ref.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return res.status(201).json(data);
    })
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message });
  }
}