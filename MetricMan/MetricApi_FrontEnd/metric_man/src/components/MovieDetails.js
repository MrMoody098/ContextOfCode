import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ReviewsList from './ReviewsList.js'
const MovieDetails = ({ movie }) => {
  if (!movie) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <div className="movie-details-container">
      <h2>{movie.title}</h2>
      <p>Rating: {movie.rating}</p>
      <p>Description: {movie.description}</p>
    </div>
  );
};
export default MovieDetails;