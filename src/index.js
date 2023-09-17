import { BASE_URL } from "./js/api.js";
import { API_KEY } from "./js/api.js";
import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


// axios.defaults.headers.common["x-api-key"] = API_KEY;
axios.defaults.headers.common["Content-Type"] = "application/json";
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

function infoMsg() {
  Notify.failure("We are sorry, but you've reached the end of search results.", {
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
        if (listImg.total === 0 ) {
          errorMsg();
          return ;
  
        }
        renderImages(listImg.hits);
        
        // toggleLoader(loader, "hide");
        // return listImg;
      }
}

function renderImages(images) {
   
    const markup = images
      .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `
        <div class="photo-card">
        <a class="gallery__link" href=${largeImageURL}>
        <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a> 
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downlosds: ${downloads}</b>
          </p>
        </div>
        </div>`;
      })
      .join("");
   
    galleryEl.innerHTML = markup;
    }
    const makeRequest = async (data, page) => {
    const searchParams = new URLSearchParams({
        key: API_KEY,
        q: data.searchQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        per_page: 40,
        page,
      });
      const endpoint = BASE_URL + "?" + searchParams.toString();
    //   console.log("serchParams:", searchParams.toString());
    // try {
    //   const result = await fetch(BASE_URL + "?" + searchParams.toString())
    //   loadMoreEl.classList.replace("load-more-hidden", "load-more");
    //     if (result.ok) {
    //     // console.log(result.json())
    //     // if (result.page === result.totalHits) {
    //     //   loadMoreEl.classList.replace("load-more", "load-more-hidden");
    //     //   }
          
    //     return result.json();
    //   }
      
    //   throw new Error(result.statusText);
      
    // } catch (error) {
    //    errorMsg();
    //     console.log(err)
        
    // }
  
    return fetch(endpoint)
      .then((res) => {
        if (res.status === 200) {
                  return res.json();
                }
        
        // if (res.ok) {
        //     console.log(res.json())
        //   // return res.json();
        // }
        throw new Error(res.statusText);
      })
      .then((res) => {
              loadMoreEl.classList.replace("load-more-hidden", "load-more");
              console.log(page * res.hits.length);
              if ((page * res.hits.length) >= res.totalHits) {
                loadMoreEl.classList.replace("load-more", "load-more-hidden");
                infoMsg();
              }
              return res;
            })
      .catch((err) => errorMsg());
  };

  // *********************** Кнопка "Load More" ************************** \\

 


const searchInfoCallback = async (e) => {
    e.preventDefault();
    let page = 1;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    e.currentTarget.reset();
    getImages (data, page);
 
      const loadMoreHandler = () => {
      page += 1;
      getImages (data, page);
      };
      loadMoreEl.onclick = () => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
      loadMoreEl.addEventListener("click", loadMoreHandler);
      const totHits = await makeRequest(data, page);
      Notify.info(`Hooray! We found ${totHits.totalHits} images.`);
  };

//  let gallery = new SimpleLightbox('.gallery a', {captionsData: "alt", captionDelay: 250});
    
//     gallery.on('show.simplelightbox', function () {
      
//     console.log(gallery);
//     });


 userForm.addEventListener("submit", searchInfoCallback);
 const { height: cardHeight } = document
 .querySelector(".gallery")
 .firstElementChild.getBoundingClientRect();

 window.scrollBy({
 top: cardHeight * 2,
 behavior: "smooth",
});


  


