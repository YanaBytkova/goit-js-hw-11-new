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
let page = 1;

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
        console.log(listImg);
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
      
    //   console.log("serchParams:", searchParams.toString());
    try {
      const result = await fetch(BASE_URL + "?" + searchParams.toString())
      loadMoreEl.classList.replace("load-more-hidden", "load-more");
        if (result.ok) {
        // console.log(result.json())
        // if (result.page === result.totalHits) {
        //   loadMoreEl.classList.replace("load-more", "load-more-hidden");
        //   }
          
        return result.json();
      }
      
      throw new Error(result.statusText);
      
    } catch (error) {
       errorMsg();
        console.log(err)
        
    }
  
//     return axios.get(`${BASE_URL}?${searchParams.toString()}`)
//       .then((res) => {
//         if (res.ok) {
//             console.log(res.json())
//           return res.json();
//         }
//         throw new Error(res.statusText);
//       }).then((res) => {
//               loadMoreEl.classList.replace("load-more-hidden", "load-more");
        
//               if (res.page === res.total) {
//                 loadMoreEl.classList.replace("load-more", "load-more-hidden");
//               }
//               return res;
//             })
//       .catch((err) => {Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
//         position: 'center-center',
//         timeout: 5000,
//         width: '400px',
//         fontSize: '24px'});
//     console.log(err)
// });
  };

  // *********************** Кнопка "Load More" ************************** \\

 


const searchInfoCallback = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    getImages (data, page);
    const loadMoreHandler = async () => {
      page += 1;
      getImages (data, page);
      };
    
      loadMoreEl.addEventListener("click", loadMoreHandler);
    e.currentTarget.reset();
    
  };

  userForm.addEventListener("submit", searchInfoCallback);
//   let gallery = new SimpleLightbox('.gallery a', {captionsData: "alt", captionDelay: 250});
    
//   gallery.on('show.simplelightbox', function () {
      
// console.log(gallery);
// });


