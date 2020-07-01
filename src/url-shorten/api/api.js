import axios from "axios";

const PAGE_SIZE = 3;

export const searchUrlShortens = async (search, order_by, offset = 1) => {
  const sort_fields = order_by.join(",");
  const queryString = `?q=${search}&order-by=${sort_fields}&page=${offset}&page-size=${PAGE_SIZE}`;
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/list${queryString}`
    );
    return response;
  } catch (error) {
    return handleErrorMessage(error);
  }
};

export const createUrlShorten = async payload => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/create`,
      {
        ...payload
      }
    );
    return response;
  } catch (error) {
    return handleErrorMessage(error);
  }
};

export const deleteUrlShorten = async (id, is_deleted) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/toggle-delete`,
      {
        id: id,
        is_deleted: is_deleted
      }
    );
    return response;
  } catch (error) {
    return handleErrorMessage(error);
  }
};

const handleErrorMessage = error => {
  return {
    error: error.response?.data?.error
      ? error.response.data.error[0]
      : error.response?.data?.message
      ? error.response.data.message
      : error.message
  };
};
