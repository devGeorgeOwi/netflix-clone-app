import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
	const [movies, setMovies] = useState([]);
	const [trailerUrl, setTrailerUrl] = useState("");

	// use React Hooks - run a snippet of code based on a specific condition
	useEffect(() => {
		// if set to empty [], run once when the row loads,
		// if movies added to [movies], run once when the row loads and
		// run whenever the movies variable changes
		async function fetchData() {
			const request = await axios.get(fetchUrl);
			// console.log(request.data.results);
			// set the request data into the setMovies state
			setMovies(request.data.results);
			return request;
		}
		fetchData();
	}, [fetchUrl]);

	// console.log(movies);

	const opts = {
		height: "390",
		width: "100%",
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			autoplay: 1,
		},
	};

	const handleClick = movie => {
		if (trailerUrl) {
			setTrailerUrl("");
		} else {
			movieTrailer(movie?.name || "")
				.then(url => {
					// https://www.youtube.com/watch?v=ByOPqVzGvJw
					const urlParams = new URLSearchParams(new URL(url).search);
					setTrailerUrl(urlParams.get("v"));
				})
				.catch(error => console.log(error));
		}
	};

	return (
		<div className="row">
			<h2>{title}</h2>

			<div className="row_posters">
				{/* several row_poster(s) */}

				{movies.map(movie => (
					<img
						key={movie.id}
						onClick={() => handleClick(movie)}
						// check if row is large and add a class of row_posterLarge
						className={`row_poster ${isLargeRow && "row_posterLarge"}`}
						src={`${base_url}${
							isLargeRow ? movie.poster_path : movie.backdrop_path
						}`}
						alt={movie.name}
					/>
				))}
			</div>
			{trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
		</div>
	);
}

export default Row;
