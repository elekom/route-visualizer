const { admin, db } = require("../utils/admin");

exports.queryForLocation = async (locationName) => {
  const q = db.collection('geolocations').where(admin.firestore.FieldPath.documentId(), '==', locationName);
  return new Promise((resolve, reject) => {

    try {
      q.get().then((snapshot) => {
        var data;
        //console.log(snapshot);
        if (snapshot.size > 0) {
          //console.log('geolocation exists in db')
          data = snapshot.docs.map((doc) => ({
            locationName: doc.id,
            ...doc.data(),
          }))[0];
        } else {
          data = {
            locationName: locationName
          }
        }
        //console.log('queryForLocation data', data);
        resolve(data);
      });


    } catch (error) {
      reject(error)
    }
  });
};

/**
 * Stored in DB collection '/geolocations'
 * Document ID is location name (station name) ex. '東京駅'
 * Value is geolocation
 * @param {*} req 
 * @param {*} res 
 */
exports.addLocations = async (req, res) => {
  try {
    console.log('adding location', req.body.locationName);
    db.doc(`geolocations/${req.body.locationName}`).set({
      geocode: req.body.geocode,
      place_id: req.body.place_id
    });
    return res.status(204);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
}

exports.addMultipleLocations = async (req, res) => {
  try {
    req.body.locations.map((location) => {
      console.log('adding location', location.locationName);
      db.doc(`geolocations/${location.locationName}`).set({
        geocode: location.geocode,
        place_id: location.place_id
      });
    });
    return res.status(204);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
}