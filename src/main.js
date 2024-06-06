import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const IZI_TOAST_TIMEOUT = 2000;
const IZI_TOAST_MAX_WIDTH = 350;
const ITEMS_PER_PAGE = 40;
const PHOTO_SERVICE_KEY = '44262715-0f0c36fa7bed0278a9188117f';

async function searchPhotoHandler(event, inputData) {
  event.preventDefault();
  inputData.searchQuery = inputData.elements.searchForm[0].value.trim().toLowerCase();
  inputData.elements.btnLoadMore.classList.add("is_hidden");

  if (inputData.searchQuery) {
    inputData.page = 1;
    inputData.elements.searchForm.reset();

    try {
      const data = await getServicePhoto(inputData, ITEMS_PER_PAGE);
      if (!data.hits.length) {
        iziToast.error({
          message:
            "Sorry, there are no images matching your search query. Please try again.",
        });
        inputData.elements.gallery.innerHTML = "<div></div>";
        return;
      }

      iziToast.success({
        message: `Hooray! We found ${data.totalHits} images.`,
      });
      inputData.elements.gallery.innerHTML = createMarkupGallary(data.hits);
      inputData.lightbox.refresh();
    } catch (error) {
      console.log(error);
      iziToast.error({
        title: "🔻 Oops!",
        message: error.message ?? "Something went wrong!",
        position: "topCenter",
      });
    }
  } else {
    iziToast.warning({
      message: "Fill in the search field!",
    });
    inputData.elements.gallery.innerHTML = "<div></div>";
  }
}

async function loadMoreHandler(inputData) {
  inputData.page += 1;

  try {
    const data = await getServicePhoto(inputData, ITEMS_PER_PAGE);

    inputData.elements.gallery.insertAdjacentHTML(
      "beforeend",
      createMarkupGallary(data.hits)
    );
    inputData.lightbox.refresh();
    inputData.cardHeight =
      inputData.elements.gallery.firstElementChild.getBoundingClientRect();

    scrollBy({
      top: inputData.cardHeight.height * 3,
      behavior: "smooth",
    });

    if (inputData.page >= data.totalHits / ITEMS_PER_PAGE) {
      inputData.elements.btnLoadMore.classList.add("is_hidden");
    }
  } catch (error) {
    console.log(error);
    iziToast.error({
      title: "🔻 Oops!",
      message: error.message ?? "Something went wrong!",
      position: "topCenter",
    });
  }
}

function createMarkupGallary(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="photo-card">
        <a class="gallery-link" href="${largeImageURL}">
            <div class="thumb">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" width="360" />
            </div>
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b> ${likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b> ${views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b> ${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b> ${downloads}
                    </p>
            </div>
        </a>
    </div>
    `
    )
    .join("");
}

async function getServicePhoto(inputData, per_page) {
  const options = {
    params: {
      key: PHOTO_SERVICE_KEY,
      q: inputData.searchQuery,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      per_page,
      page: inputData.page,
    },
  };

  const { data } = await axios.get("https://pixabay.com/api/", options);

  if (inputData.page <= data.totalHits / per_page) {
    inputData.elements.btnLoadMore.classList.remove("is_hidden");
  } else if (data.totalHits) {
    console.log(data.totalHits);
    iziToast.error({
      message: "We're sorry, but you've reached the end of search results.",
    });
  }

  return data;
}

(() => {
  iziToast.settings({
    timeout: IZI_TOAST_TIMEOUT,
    position: "topRight",
    transitionIn: "fadeInRight",
    transitionOut: "fadeOutLeft",
    maxWidth: IZI_TOAST_MAX_WIDTH,
  });

  const lightbox = new SimpleLightbox(".photo-card a", {});
  const elements = {
    searchForm: document.querySelector(".search-form"),
    gallery: document.querySelector(".gallery"),
    btnLoadMore: document.querySelector(".load-more"),
  };

  const inputData = {
    cardHeight: undefined,
    page: 1,
    searchQuery: undefined,
    lightbox,
    elements,
  };

  elements.searchForm.addEventListener("submit", (event) =>
    searchPhotoHandler(event, inputData)
  );

  elements.btnLoadMore.addEventListener("click", () =>
    loadMoreHandler(inputData)
  );
})();
