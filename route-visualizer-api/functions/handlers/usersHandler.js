const { admin, db } = require("../utils/admin");

exports.userTags = async (req, res) => {
  const ref = db.collection(`users/${req.uid}/tags`);

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
};

exports.tagLocations = async (req, res) => {
  const q = db.collection(`users/${req.uid}/locations`).where(admin.firestore.FieldPath.documentId(), 'in', req.body.tags);

  try {
    q.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        tagId: doc.id,
        ...doc.data(),
      }));
      return res.status(201).json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message });
  }
}
