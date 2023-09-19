import { BASE_URL } from "./api.js";
import { API_KEY } from "./api.js";
import axios from "axios";
// axios.defaults.headers.common["x-api-key"] = API_KEY;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
axios.defaults.headers.common["Content-Type"] = "application/json";
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.js-load-more');


export const makeRequest = async (data, page) => {
      
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
  
   return axios.get(`${BASE_URL}?${searchParams.toString()}`)
      .then((res) => {
        if (res.status === 200) {
                  return res.data;
                }
        
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
      .catch((err) => {
          galleryEl.innerHTML = '';
          loadMoreEl.classList.replace("load-more", "load-more-hidden");
          errorMsg()
          return
      })
      .finally(function () {
        console.log("finally");
        return 
  });
  };
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