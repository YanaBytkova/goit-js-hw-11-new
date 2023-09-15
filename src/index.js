import { BASE_URL } from "./js/api.js";
import { API_KEY } from "./js/api.js";
import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// axios.defaults.headers.common["x-api-key"] = API_KEY;
axios.defaults.headers.common["Content-Type"] = "application/json";
const userForm = document.querySelector('.search-form');
const inputText = document.querySelector("input");
const btnSearch = document.querySelector('.button');
const gallery = document.querySelector('.gallery');

const getImages = async (data) => {
    // toggleLoader(loader, "show");
    const listImg = await makeRequest(data);
  
    if (listImg) {
        console.log(listImg);
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
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>${likes}</b>
          </p>
          <p class="info-item">
            <b>${views}</b>
          </p>
          <p class="info-item">
            <b>${comments}</b>
          </p>
          <p class="info-item">
            <b>${downloads}</b>
          </p>
        </div>
      </div>`;
      })
      .join("");
   
    gallery.innerHTML = markup;
    }
    const makeRequest = async (data) => {
    const searchParams = new URLSearchParams({
        key: API_KEY,
        q: data.searchQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        per_page: 40,
      });
      
    //   console.log("serchParams:", searchParams.toString());
    try {
      const result = await fetch(BASE_URL + "?" + searchParams.toString())
  
      if (result.ok) {
        // console.log(result.json())
        return result.json();
      }
      throw new Error(result.statusText);
    } catch (error) {
        {Notify.failure('"Sorry, there are no images matching your search query. Please try again."', {
            position: 'center-center',
            timeout: 5000,
            width: '400px',
            fontSize: '24px'});
        console.log(err)
    };
    }
  
    return axios.get(`${BASE_URL}?${searchParams.toString()}`)
      .then((res) => {
        if (res.ok) {
            console.log(res.json())
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .catch((err) => {Notify.failure('"Sorry, there are no images matching your search query. Please try again."', {
        position: 'center-center',
        timeout: 5000,
        width: '400px',
        fontSize: '24px'});
    console.log(err)
});
  };

 

const searchInfoCallback = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    getImages(data);
    
    

    // if (user) {
    //   const users = await getUsers();
    //   console.log(users);

      
    // }
  };

  userForm.addEventListener("submit", searchInfoCallback);
//   getImages();