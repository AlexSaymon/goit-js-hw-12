import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export function noImagesMessage() {
  iziToast.show({
    message:
      'Sorry, there are no images matching your search query. Please try again!',
    class: 'toast-style',
    messageColor: 'white',
    titleColor: 'white',
    iconColor: 'white',
  });
}

export function noApiResponse() {
  iziToast.info({
    title: 'Info',
    message: 'No images found.',
    class: 'toast-style',
    messageColor: 'white',
    titleColor: 'white',
    iconColor: 'white',
  });
}

export function createImageCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
  <div class ="image-container">
    <a href="${largeImageURL}" class = "image-link">

    <li class="image-item">
      <img src="${webformatURL}" alt="${tags}" />
    </li>
    <div class ="">
      <li class="image-item-info">
        <p><span class = "comment-head">Likes</span> ${likes}</p>
        <p><span class = "comment-head">Views</span> ${views}</p>
        <p><span class = "comment-head">Comments</span> ${comments}</p>
        <p><span class = "comment-head">Downloads</span> ${downloads}</p>
      </li>
    </div>
    </a>
  </div>
  `;
}

export function fetchAndRenderImages() {
  elements.loading.style.display = 'block';
}

export function showEndOfResultsNotification() {
  iziToast.info({
    title: 'Info',
    message: "We're sorry, but you've reached the end of search results.",
  });
}
