import './css/common.css';
import getRefs from './js/get-refs.js';
import ImagesApiService from './js/images-service';
import imagesTpl from './templates/imageCard.hbs';
import LoadMoreBtn from './js/load-more-btn';
import onOpenModal from './js/modal';

import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';

const refs = getRefs();

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
refs.imagesContainer.addEventListener('click', onOpenModal);

function onSearch(evt) {
  evt.preventDefault();
  imagesApiService.query = evt.currentTarget.elements.query.value;
  try {
    if (imagesApiService.query === '') {
      return showErrorMessage('Please enter a keyword!');
    }
    loadMoreBtn.show();
    imagesApiService.resetPage();
    clearImagesContainer();
    fetchImages();
  } catch (error) {
    console.log(error);
  }
}

async function fetchImages() {
  loadMoreBtn.disable();
  const hits = await imagesApiService.fetchImages();
  if (hits.length === 0) {
    loadMoreBtn.hide();
    showErrorMessage('No matches, try another keyword!');
  } else {
    appendImagesMarkup(hits);
    loadMoreBtn.enable();
  }
}
function showErrorMessage(message) {
  error({
    text: message,
    delay: 2000,
  });
}

function appendImagesMarkup(hits) {
  refs.imagesContainer.insertAdjacentHTML('beforeend', imagesTpl(hits));
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

function onScroll() {
  window.scrollTo({
    top: document.documentElement.clientHeight,
    behavior: 'smooth',
  });
}
function onLoadMore() {
  fetchImages()
    .then(setTimeout(onScroll, 1200))
    .catch(err => console.log(err));
}
