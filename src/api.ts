const API_KEY = "a37686c59e37854e9fb5b97756926511";
const BASE_PATH = "https://api.themoviedb.org/3";

// Movies

interface IMovies {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovies[];
  total_pages: number;
  total_results: number;
}

interface ITopRated {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetTopRated {
  page: number;
  results: ITopRated[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=en&page=1`
  ).then((response) => response.json());
}

export function getTopRated() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=en`
  ).then((response) => response.json());
}

export function getUpcoming() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=en&page=3`
  ).then((response) => response.json());
}

// TV
interface ITopRated {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface ITvResult {
  page: number;
  results: ITopRated[];
  total_pages: number;
  total_results: number;
}

export function getAiringToday() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=en`
  ).then((response) => response.json());
}

export function getPopular() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=en&page=4`
  ).then((response) => response.json());
}

export function getTopRatedTv() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=en&page=2`
  ).then((response) => response.json());
}

// Search
interface ISearchMovieResult {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface ISearchMovie {
  page: number;
  results: ISearchMovieResult[];
  total_pages: number;
  total_results: number;
}

export function getSearchMovie(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`
  ).then((response) => response.json());
}

interface ISearchTvResult {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface ISearchTv {
  page: number;
  results: ISearchTvResult[];
  total_pages: number;
  total_results: number;
}

export function getSearchTv(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=en-US&page=1&query=${keyword}&include_adult=false`
  ).then((response) => response.json());
}

interface IGenres {
  id: number;
  name: string;
}

export interface IGetMovieDetail {
  backdrop_path: string;
  genres: IGenres[];
  homepage: string;
  id: number;
  title: string;
  vote_average: number;
  overview: string;
  poster_path?: string;
  name: string;
  runtime: number;
}

export function getMovieDetail(movieId: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=en`
  ).then((response) => response.json());
}
export function getTvDetail(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=en`).then(
    (response) => response.json()
  );
}
