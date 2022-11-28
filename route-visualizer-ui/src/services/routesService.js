import axiosInstance from "../shared/axiosConfig";

export const getRouteData = async (request) => {
  try {
    const res = await axiosInstance.post('/routes', request);
    return res.data;
  } catch (e) {
    console.error(e);
  }
}

export const saveRoute = async (request) => {
  try {
    const res = await axiosInstance.post('/routes/add', request);
    return res.data;
  } catch (e) {
    console.error(e);
  }
}

export const getSavedRoutes = async () => {
  try {
    const res = await axiosInstance.get('/routes/saved');
    return res.data;
  } catch (e) {
    console.error(e);
  }
}