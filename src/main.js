import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/pixabay-api.js';
import {
  noApiResponse,
  noImagesMessage,
  showEndOfResultsNotification,
} from './js/render-functions.js';
import './css/header.css';
import { createImageCard } from './js/render-functions.js';

const elements = {
  submitBtn: document.querySelector(`.js-submit-btn`),
  form: document.querySelector(`form[data-form]`),
  input: document.querySelector(`input[data-input]`),
  gallery: document.querySelector(`.gallery`),
  loading: document.querySelector(`.loadingText`),
  loadMoreBtn: document.querySelector(`.js-loadmore-btn`),
};

const lightbox = new SimpleLightbox('.image-link', {
  captions: true,
  captionSelector: `img`,
  captionsData: `alt`,
  captionType: `attr`,
  captionPosition: `bottom`,
  captionDelay: 250,
});

let page = 1;
const perPage = 15;
let currentQuery = '';
let totalHits = 0;
let loadedImages = 0;

function emptyInputInfo(trimmedInput) {
  if (trimmedInput === '') {
    elements.submitBtn.disabled = true;
    noImagesMessage();
    return true;
  }
  elements.submitBtn.disabled = false;
  return false;
}

function processImages(res) {
  const images = res.hits;
  let imageMarkup = '';
  images.forEach(image => {
    imageMarkup += createImageCard(image);
  });
  elements.gallery.innerHTML = imageMarkup;
  lightbox.refresh();
  loadedImages += images.length;
  if (loadedImages >= totalHits) {
    elements.loadMoreBtn.style.display = 'none';
    showEndOfResultsNotification();
  } else {
    elements.loadMoreBtn.style.display = 'flex';
  }
  scrollPage();
}

function showErrorNotification() {
  iziToast.error({
    title: 'Error',
    message: 'No Images found or an error occurred while fetching images.',
  });
}

async function handleFormSubmit(event) {
  event.preventDefault();
  elements.loadMoreBtn.style.display = 'none';
  const trimmedInput = elements.input.value.trim();
  const userInputValue = elements.input.value;

  if (currentQuery !== trimmedInput) {
    page = 1;
    currentQuery = trimmedInput;
    loadedImages = 0;
  }

  elements.gallery.innerHTML = '';
  elements.form.reset();

  if (emptyInputInfo(trimmedInput)) {
    elements.submitBtn.disabled = false;
    return;
  }

  elements.loading.style.display = 'block';

  try {
    const res = await fetchImages(userInputValue, page, perPage);
    totalHits = res.totalHits;

    elements.loading.style.display = 'none';
    if (res.hits.length === 0) {
      noApiResponse();
      return;
    }
    processImages(res);
    elements.gallery.style.display = 'flex';
    page += 1;
  } catch (error) {
    elements.loading.style.display = 'none';
    showErrorNotification();
  }
}

async function handleLoadMore() {
  elements.loading.style.display = 'block';
  try {
    const res = await fetchImages(currentQuery, page, perPage);

    elements.loading.style.display = 'none';
    if (res.hits.length === 0) {
      noApiResponse();
      return;
    }

    const images = res.hits;
    let imageMarkup = '';
    images.forEach(image => {
      imageMarkup += createImageCard(image);
    });
    elements.gallery.insertAdjacentHTML('beforeend', imageMarkup);
    lightbox.refresh();
    loadedImages += images.length;
    if (loadedImages >= totalHits) {
      elements.loadMoreBtn.style.display = 'none';
      showEndOfResultsNotification();
    } else {
      elements.loadMoreBtn.style.display = 'flex';
    }
    scrollPage();
    page += 1;
  } catch (error) {
    elements.loading.style.display = 'none';
    showErrorNotification();
  }
}

function scrollPage() {
  const galleryCards = document.querySelectorAll('.gallery .image-item');
  if (galleryCards.length > 0) {
    let totalHeight = 0;
    galleryCards.forEach(card => {
      totalHeight += card.getBoundingClientRect().height;
    });
    window.scrollBy({
      top: totalHeight,
      behavior: 'smooth',
    });
  }
}

elements.form.addEventListener(`submit`, handleFormSubmit);
elements.loadMoreBtn.addEventListener('click', handleLoadMore);
