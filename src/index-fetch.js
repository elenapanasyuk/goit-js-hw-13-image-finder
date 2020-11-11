import './css/common.css';
import getRefs from './js/get-refs.js';
import ImagesApiService from './js/images-service';
import imagesTpl from './templates/imageCard.hbs';
import LoadMoreBtn from './js/load-more-btn';

import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { alert, error } from '@pnotify/core';

const refs = getRefs();

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();
  imagesApiService.query = evt.currentTarget.elements.query.value;

  if (imagesApiService.query === '') {
    return alert({
      text: 'Please enter a keyword!',
      delay: 2000,
    });
  }
  loadMoreBtn.show();
  imagesApiService.resetPage();
  clearImagesContainer();
  fetchImages();
}

function fetchImages() {
  loadMoreBtn.disable();
  return imagesApiService.fetchImages().then(hits => {
    if (hits.length === 0) {
      loadMoreBtn.hide();
      error({
        text: 'No matches, try another keyword!',
        delay: 2000,
      });
    } else {
      appendImagesMarkup(hits);
      loadMoreBtn.enable();
    }
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

// function onLoadMore() {
//   fetchImages()
//     .then(
//       setTimeout(() => {
//         window.scrollTo({
//           top: document.documentElement.clientHeight,
//           behavior: 'smooth',
//         });
//       }, 1200),
//     )
//     .catch(err => console.log(err));
// }
