const { db } = require("../utils/admin");

exports.tags = async (req, res) => {
  const tagsRef = db.collection('tags');
  console.log('tags request', req.uid);
  try {
    tagsRef.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return res.status(201).json(data);
    })
  } catch (error) {
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};