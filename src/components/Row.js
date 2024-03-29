import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { IMAGE_BASE_URL } from "../utils/requests";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

function Row({ title, fetchUrl, isPoster }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      if (movie?.name || movie?.title) {
        movieTrailer(movie?.name || movie?.title)
          .then((url) => {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get("v"));
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  return (
    <div className="row">
      <h2 className={`row__title${isPoster ? " row__titlePrimary" : ""}`}>{title}</h2>

      <div className="row__thumbnails">
        {movies.map((movie) => (
          <AsyncImage
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__thumbnail${isPoster ? " row__poster" : ""}`}
            src={`${IMAGE_BASE_URL}${isPoster ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name}
          />
        ))}
      </div>

      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

const AsyncImage = (props) => {
  const [loadedSrc, setLoadedSrc] = React.useState(null);
  React.useEffect(() => {
    setLoadedSrc(null);
    if (props.src) {
      const handleLoad = () => {
        setLoadedSrc(props.src);
      };
      const image = new Image();
      image.addEventListener("load", handleLoad);
      image.src = props.src;
      return () => {
        image.removeEventListener("load", handleLoad);
      };
    }
  }, [props.src]);
  if (loadedSrc === props.src) {
    return <img {...props} alt="banner" />;
  }
  return null;
};

export default Row;
