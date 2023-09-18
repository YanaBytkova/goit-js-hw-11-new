
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { makeRequest } from "./js/utils";


const userForm = document.querySelector('.search-form');
const inputText = document.querySelector("input");
const btnSearch = document.querySelector('.button');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.js-load-more');


function errorMsg() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
    position: 'center-center',
    timeout: 5000,
    width: '400px',
    fontSize: '24px'});
}


const getImages = async (data, page) => {
    // toggleLoader(loader, "show");
    const listImg = await makeRequest(data, page);

    if (listImg) {
      console.log(listImg, listImg.totalHits);
      
        if (listImg.totalHits === 0 ) {
          errorMsg();
          
          return;
  
        }
        renderImages(listImg.hits);
         return listImg.totalHits;
        // toggleLoader(loader, "hide");
        // return listImg;
      }
}

function renderImages(images) {
   
    const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `<div class="photo-card"><a class="gallery__link" href=${largeImageURL}>
        <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a> 
        <div class="info"><p class="info-item"><b>Likes: ${likes}</b></p><p class="info-item">
        <b>Views: ${views}</b></p><p class="info-item"><b>Comments: ${comments}</b></p>
          <p class="info-item"><b>Downlosds: ${downloads}</b></p></div></div>`)
      .join("");
   
  galleryEl.insertAdjacentHTML('beforeend', markup);
   let gallery = new SimpleLightbox('.gallery a', {captionsData: "alt", captionDelay: 250});
    
    gallery.on('show.simplelightbox', function () {
      
    console.log(gallery);
    });
   const { height: cardHeight } = document
   .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
   window.scrollBy({
   top: cardHeight * 2,
    behavior: "smooth",
    });
    }

  // *********************** Кнопка "Load More" ************************** \\

const searchInfoCallback = async (e) => {
  e.preventDefault();
  galleryEl.innerHTML = '';
  loadMoreEl.classList.replace("load-more", "load-more-hidden");
    let page = 1;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
     if (data.searchQuery.trim() === "" ) {
    return Notify.failure("Please write the word in  the field!");
    
  } 
  e.currentTarget.reset();
  
  getImages(data, page);
  const totHits = await makeRequest(data, page);
  Notify.info(`Hooray! We found ${totHits.totalHits} images.`);
 
      const loadMoreHandler = () => {
      page += 1;
      getImages (data, page);
      };
      // loadMoreEl.onclick = () => {
      //   window.scrollTo({
      //     top: 0,
      //     left: 0,
      //     behavior: 'smooth'
      //   });
      // }
      loadMoreEl.addEventListener("click", loadMoreHandler);
      // const totHits = await makeRequest(data, page);
  
  };

 
 userForm.addEventListener("submit", searchInfoCallback);



  


