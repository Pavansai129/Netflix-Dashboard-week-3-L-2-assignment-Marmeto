var recommendedMovies = new Splide("#recommendedMovies");
var favouritesList = new Splide("#favoritesList");

let userInputEl = document.querySelector("#searchBox");
let searchedMovieResultsBlockEl = document.querySelector(
  ".searched-movie-results-block"
);
function renderSearchedMovie(movie) {
  const { genre_ids, title, poster_path, release_date, overview } = movie;
  searchedMovieResultsBlockEl.innerHTML = `
  <div class="searched-movie-poster-container">
  <img class="searched-movie-poster" src=https://image.tmdb.org/t/p/w500/${poster_path} alt=${title} />
        </div>
          <div class="searched-movie-details-block-container">
            <div class="searched-movie-details-container">
              <h1 class="searchd-movie-title">${title}</h1>
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
async function getSearchResult() {
  const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${this.value}&api_key=5d0ff838a746fd727dff5ae6f0997054&language=en-US&page=1&append_to_response=genre`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDBmZjgzOGE3NDZmZDcyN2RmZjVhZTZmMDk5NzA1NCIsInN1YiI6IjY1YjIwMGNmNzg1NzBlMDE4NDY3ZjZjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gXfV_WLb26tnbM2ViX6IZVtQbjshXexntInw7WX17lE`,
    },
  };
  const responseData = await fetch(apiUrl);
  const data = await responseData.json();
  console.log(data);
  const { results } = data;
  const firstMovieData = results[0];
  renderSearchedMovie(firstMovieData);
}
const fetchMovieData = () => {
  userInputEl.addEventListener("change", getSearchResult);
};
fetchMovieData();

recommendedMovies.mount();
favouritesList.mount();
