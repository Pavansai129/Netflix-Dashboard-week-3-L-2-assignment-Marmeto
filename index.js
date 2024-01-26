var recommendedMoviesSlider = new Splide("#recommendedMoviesSplide", {
  perPage: 2,
  type: "loop",
  gap: "10px",
  pagination: false,
});
var favoritesListSlider = new Splide("#favoritesListSplide", {
  perPage: 2,
  type: "slide",
  gap: "10px",
  pagination: false,
});

const searchIconEl = document.querySelector("#searchIcon");
const recommendedMoviesSpliderEl = document.querySelector("#recommendedMovies");
const favoritesListSpliderEl = document.querySelector("#favoritesList");

const sortFavoriteList = document.querySelector("#sortFavoriteList");

function sortFavoriteListSlides(event) {
  const value = event.target.value;
  if (value === "Title Asc") {
    favoritesList.sort((a, b) => {
      if (a.title > b.title) {
        return 1;
      } else {
        return -1;
      }
    });
  } else if (value === "Title Desc") {
    favoritesList.sort((a, b) => {
      if (b.title > a.title) {
        return 1;
      } else {
        return -1;
      }
    });
  } else if (value === "Release Date Asc") {
    favoritesList.sort(
      (a, b) => new Date(a.release_date) - new Date(b.release_date)
    );
  } else if (value === "Release Date Desc") {
    favoritesList.sort(
      (a, b) => new Date(b.release_date) - new Date(a.release_date)
    );
  }

  localStorage.setItem("netflixFavoriteList", JSON.stringify(favoritesList));
  renderCurousel(favoritesList, favoritesListSpliderEl, favoritesListSlider);
}
sortFavoriteList.addEventListener("change", sortFavoriteListSlides);

let userInputEl = document.querySelector("#searchBox");
let searchedMovieResultsBlockEl = document.querySelector(
  ".searched-movie-results-block"
);

let storedData = localStorage.getItem("netflixFavoriteList");
storedData = storedData !== null ? JSON.parse(storedData) : [];

let recommendedMoviesList = [];
let favoritesList = storedData;

function renderSearchedMovie(movie, genres) {
  const { title, poster_path, release_date, overview } = movie;
  searchedMovieResultsBlockEl.innerHTML = `
    <div class="searched-movie-poster-container">
    <img class="searched-movie-poster" src=https://image.tmdb.org/t/p/w500/${poster_path} alt=${title} />
          </div>
            <div class="searched-movie-details-block-container">
              <div class="searched-movie-details-container">
                <h1 class="searchd-movie-title">${title}</h1>
                <p class="searched-movie-genre">
                  ${genres}
                </p>
                <p class="searched-movie-release-date-text">
                  Release Date:
                  ${release_date}
                </p>
                <p class="searched-movie-overview">
                  ${overview}
                </p>
              </div>
            </div>
          `;
}

function updateMoviesDataLists(data) {
  let movieObj = favoritesList.find((each) => each.id === data.id);
  if (!movieObj) {
    favoritesList.unshift(data);
    let filteredRecommendedMoviesList = recommendedMoviesList.filter(
      (each) => each.id !== data.id
    );
    recommendedMoviesList = filteredRecommendedMoviesList;
  } else {
    recommendedMoviesList.unshift(data);
    let filteredFavoritesList = favoritesList.filter(
      (each) => each.id !== data.id
    );
    favoritesList = filteredFavoritesList;
  }
  localStorage.setItem("netflixFavoriteList", JSON.stringify(favoritesList));
  renderCurousel(
    recommendedMoviesList,
    recommendedMoviesSpliderEl,
    recommendedMoviesSlider
  );
  renderCurousel(favoritesList, favoritesListSpliderEl, favoritesListSlider);
}

function renderCurousel(data, curouselEl, splide) {
  curouselEl.textContent = "";
  data.forEach((eachMovieData) => {
    splide.destroy();

    const curouselSlideEl = document.createElement("li");
    curouselSlideEl.classList.add("splide__slide");
    curouselEl.appendChild(curouselSlideEl);

    const slideDataContainerEl = document.createElement("div");
    slideDataContainerEl.classList.add("slide-data-container");
    curouselSlideEl.appendChild(slideDataContainerEl);

    const slideImageEl = document.createElement("img");
    slideImageEl.src = `https://image.tmdb.org/t/p/w500${eachMovieData.poster_path}`;
    slideImageEl.classList.add("slide-image");
    slideDataContainerEl.appendChild(slideImageEl);

    const slideFavouriteButtonEl = document.createElement("button");
    slideFavouriteButtonEl.classList.add("slide-favourite-button");

    slideFavouriteButtonEl.addEventListener("click", () =>
      updateMoviesDataLists(eachMovieData)
    );
    slideDataContainerEl.appendChild(slideFavouriteButtonEl);

    const slideFavoriteButtonIconEl = document.createElement("i");
    slideFavoriteButtonIconEl.classList.add(
      "fa-solid",
      "fa-heart",
      "favorite-icon"
    );
    if (curouselEl === favoritesListSpliderEl) {
      slideFavoriteButtonIconEl.classList.add("fill-icon");
    } else {
      slideFavoriteButtonIconEl.classList.remove("fill-icon");
    }
    slideFavouriteButtonEl.appendChild(slideFavoriteButtonIconEl);

    const slideTitleEl = document.createElement("h3");
    slideTitleEl.textContent = eachMovieData.original_title;
    slideTitleEl.classList.add("slide-title");
    slideDataContainerEl.appendChild(slideTitleEl);
    let genres = "";
    function assignGenres(genre) {
      genres = genre;
    }
    async function getGenres() {
      const movieDataresponse = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${eachMovieData.original_title}&api_key=5d0ff838a746fd727dff5ae6f0997054`
      );
      const movieData = await movieDataresponse.json();

      //   fetched movie details with genre names
      const detailResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieData.results[0].id}?api_key=5d0ff838a746fd727dff5ae6f0997054`
      );

      const movieDetails = await detailResponse.json();

      movieDetails.genres.forEach((each) => (genres += each.name + ","));

      const slideGenreEl = document.createElement("p");
      slideGenreEl.textContent = genres.toString();
      slideGenreEl.classList.add("slide-genre");
      slideDataContainerEl.appendChild(slideGenreEl);
      assignGenres();
    }
    getGenres(eachMovieData.original_title);

    splide.mount();
  });
}

async function getSearchResult(value) {
  const movieDataresponse = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${value}&api_key=5d0ff838a746fd727dff5ae6f0997054`
  );
  const movieData = await movieDataresponse.json();

  //   fetched movie details with genre names
  const detailResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieData.results[0].id}?api_key=5d0ff838a746fd727dff5ae6f0997054`
  );

  const movieDetails = await detailResponse.json();
  let genres = "";
  movieDetails.genres.forEach((each) => (genres += each.name + ","));
  const { results } = movieData;
  const firstMovieData = results[0];
  renderSearchedMovie(firstMovieData, genres);

  //   recommended movies
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=5d0ff838a746fd727dff5ae6f0997054&with_genres=${firstMovieData.genre_ids.join(
      ","
    )}`
  );
  const data = await response.json();
  recommendedMoviesList = data.results;
  recommendedMoviesList = recommendedMoviesList.filter((each) => {
    const isMovieInFavoriteList = favoritesList.find(
      (eachMovie) => eachMovie.id === each.id
    );
    if (isMovieInFavoriteList !== undefined) {
      return false;
    } else {
      return true;
    }
  });
  renderCurousel(
    recommendedMoviesList,
    recommendedMoviesSpliderEl,
    recommendedMoviesSlider
  );
  renderCurousel(favoritesList, favoritesListSpliderEl, favoritesListSlider);
}

userInputEl.addEventListener("change", (event) =>
  getSearchResult(event.target.value)
);

searchIconEl.addEventListener("click", () => {
  if (userInputEl.value !== "") {
    getSearchResult(userInputEl.value);
  }
});

getSearchResult("bahubali");
recommendedMoviesSlider.mount();
favoritesListSlider.mount();
