const basicLightbox = require('basiclightbox');
import 'basiclightbox/dist/basicLightbox.min.css';

export default function onModalOpen(evt) {
  if (evt.target.nodeName !== 'IMG') {
    return;
  }
  const instance = basicLightbox.create(
    `<img src="${evt.target.dataset.source}" alt="" />`,
  );
  instance.show();
}
