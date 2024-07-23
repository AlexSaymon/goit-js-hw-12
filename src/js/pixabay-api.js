import axios from 'axios';

const API_KEY = `44952732-afe4551e0894d66c0b6ee4476`;

export async function fetchImages(query, page = 1, per_page = 15) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response.status);
  }
}
