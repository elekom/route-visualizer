import axiosInstance from "../shared/axiosConfig";

export const getTags = async () => {
  try {
    const res = await axiosInstance.get('/tags');
    return res.data;
  } catch (e) {
    console.error(e);
  }
}

export const getTagLocations = async (tagId) => {
  try {
    console.log(`/tags/${tagId}/locations`);
    const res = await axiosInstance.get(`/tags/${tagId}/locations`);
    return res.data;
  } catch (e) {
    console.error(e);
  }
}

export const getLocationsForAllTags = async (tags) => {
  try {
    const res = await axiosInstance.post('/tags/locations', {tags: tags});
    return res.data;
  } catch (e) {
    console.error(e);
  }
}
