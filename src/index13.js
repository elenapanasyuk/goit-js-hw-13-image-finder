import './css/common.css';
import getRefs from './js/get-refs.js';
import ImagesApiService from './js/images-service';
import imagesTpl from './templates/imageCard.hbs';
import LoadMoreBtn from './js/load-more-btn';

const refs = getRefs();

const options = {
  headers: {
    Authorization: '19039117-820a9ced6542bb27a724ef11a',
  },
};

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

  loadMoreBtn.show();
  imagesApiService.resetPage();
  clearImagesContainer();
  fetchImages();
}

function fetchImages() {
  loadMoreBtn.disable();
  imagesApiService.fetchImages().then(hits => {
    appendImagesMarkup(hits);
    loadMoreBtn.enable();
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
    top: 1500,
    behavior: 'smooth',
  });
}

function onLoadMore() {
  fetchImages()
    .then(
      setTimeout(() => {
        window.scrollTo({
          top: 200,
          behavior: 'smooth',
        });
      }, 1500),
    )
    .catch(err => console.log(err));
}

/*
function onLoadMore() {
  fetchImages()
    .then(setTimeout(onScroll(), 5000))
    .catch(err => console.log(err));
}

*/
