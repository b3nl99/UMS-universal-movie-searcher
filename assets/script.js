// Variables for input and search buttons
const searchInputElm = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');

// Form handler that gets the value of the input elements and clears it after search
let formSubmitHandler = function (event) {
  event.preventDefault();
  let searchInput = searchInputElm.value.trim();

  if (searchInput) {
    movieSearch(searchInput);

    searchInputElm = '';
  }
};

// The main function of our app that searches for a movie and retrieves desired results
function movieSearch(movie) {
  let userSearch = movie || searchInputElm.value;

  // Variable for API key for easier access
  const apiKey = 'ccdda50f842db20aa95ba4fdf68c962d';
  // Variable for API Url for easier access and concatenation of apiKey and userSearch inputs
  let apiUrl =
    'https://api.themoviedb.org/3/search/movie?api_key=' +
    apiKey +
    '&language=en-US&query=' +
    userSearch +
    '&page=1&include_adult=false';

  // This fetch function retrieves the movies title, release date and overview (summary).
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      // Variables of the targeted response for our app.
      let movieTitle = response.results[0].title;
      let movieYear = response.results[0].release_date;
      let movieOverview = response.results[0].overview;

      // Variable for the path of our poster
      let moviePosterPath = response.results[0].poster_path;

      // Dynamically add HTML elements to display our data fetched from the APIs
      // Selecting the main container where our data will be dynamically displayed
      let listContainer = document.querySelector('#list-container');
      listContainer.setAttribute('class', 'ml-4');

      // The ul container that will hold the list items used to display our title, release date and overview.
      let infoCard;
      if (document.querySelector('#list-container ul')) {
        infoCard = document.querySelector('#list-container ul');
        infoCard.innerHTML = '';
      } else {
        infoCard = document.createElement('ul');
      }
      infoCard.setAttribute(
        'class',
        'w-full flex flex-col justify-start gap-[1rem] mt-4'
      );
      infoCard.setAttribute('id', 'container');

      let infoTitle = document.createElement('li');
      infoTitle.setAttribute(
        'class',
        'text-xl p-4 mt-6 md:text-2xl text-white'
      );

      // Dynamically added list items for the movie's release date
      let infoYear = document.createElement('li');
      infoYear.setAttribute('class', 'text-xl p-4 md:text-2xl text-white');

      let infoOverview = document.createElement('li');
      infoOverview.setAttribute(
        'class',
        'text-xl p-4 mb-6 md:text-2xl text-white'
      );

      // // Dynamically added list items for the movie title, release date and overview.
      infoTitle.innerHTML = 'TITLE:  ' + movieTitle;
      infoCard.appendChild(infoTitle);
      listContainer.appendChild(infoCard);

      infoYear.innerHTML = 'YEAR:  ' + movieYear;
      infoCard.appendChild(infoYear);
      listContainer.appendChild(infoCard);

      infoOverview.innerHTML = 'OVERVIEW:  ' + movieOverview;
      infoCard.appendChild(infoOverview);
      listContainer.appendChild(infoCard);

      let posterSizeApiUrl =
        'https://api.themoviedb.org/3/configuration?api_key=' + apiKey;

      fetch(posterSizeApiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          let moviePosterSize = response.images.poster_sizes[4];

          let moviePoster = document.getElementById('movie-image');
          let moviePosterUrl =
            'https://image.tmdb.org/t/p/' + moviePosterSize + moviePosterPath;
          moviePoster.setAttribute('src', moviePosterUrl);
        });
    });

  // Second API used to retrieve availible streaming service for the searched movie.
  const streamingApiKey = 'fIF2Qizi8Ade6gYtOmTmEs7IryrOH4Mahe3guSLG';
  let streamingApiUrl =
    'https://api.watchmode.com/v1/search/?apiKey=' +
    streamingApiKey +
    '&search_field=name&search_value=' +
    encodeURIComponent(userSearch);

  // Fetch function to retrieve the information for the streaming service.
  fetch(streamingApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      let movieId = response.title_results[0].id;

      let streamingSourceUrl =
        'https://api.watchmode.com/v1/title/' +
        movieId +
        '/sources/?apiKey=' +
        streamingApiKey;

      fetch(streamingSourceUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          let streamingSources = [];

          for (var i = 0; i < data.length; i++) {
            if (data[i].type === 'sub') {
              streamingSources.push(data[i]);
            }
          }

          // Loop over streaming sources array and render the buttons
          let buttonContainer = document.createElement('div');
          buttonContainer.setAttribute('id', 'buttonContainer');
          buttonContainer.setAttribute('class', 'flex');
          document.querySelector('#container').append(buttonContainer);
          for (var i = 0; i < streamingSources.length; i++) {
            let watchNowButton = document.createElement('a');
            watchNowButton.setAttribute('href', streamingSources[i].web_url);
            watchNowButton.setAttribute('target', '_blank');
            watchNowButton.classList =
              'text-xl bg-gray-800/70 text-white border border-white rounded-md mx-4 mb-4 p-4 hover:bg-gray-500/70';
            watchNowButton.textContent =
              'Watch Now on ' + streamingSources[i].name;
            buttonContainer.append(watchNowButton);
          }
        });
    });
}
// Added a keypress functionality so the user can press enter when searching for movies
searchInputElm.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById('search-button').click();
  }
});

// Added an event listener to the search button that initialize our movie search function
searchButton.addEventListener('click', function () {
  let searchHistory = JSON.parse(localStorage.getItem('history')) || [];
  const movie = searchInputElm.value;
  movieSearch(movie);
  searchHistory.push(movie);
  localStorage.setItem('history', JSON.stringify(searchHistory));
});
