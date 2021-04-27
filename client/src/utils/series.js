export function SeriesToArray(series) {
    const seriesArray = [];

    for(const key in series) {
        seriesArray.unshift({
            id: key,
            title: series[key].title,
            movies: series[key].movies || [],
            createdAt: series[key].createdAt
        });
    }

    seriesArray.sort((a, b) => b.createdAt - a.createdAt);

    return seriesArray;
}

export function MapMoviesIntoSeries(seriesList, movieList, singleSeries=false) {
    if(!singleSeries) {
        for(const seriesId in seriesList) {
            const series = seriesList[seriesId];
            if(!series.movies) continue;

            const newMoviesList = {};
            
            for(const movieId in series.movies) {
                const movieAddedAt = series.movies[movieId];

                if(!movieList[movieId]) continue; // Movie not found in list somehow?

                newMoviesList[movieId] = {
                    data: movieList[movieId],
                    addedAt: movieAddedAt
                }
            }

            series.movies = newMoviesList;
        }

        return seriesList;
    } else {
        const series = {
            movies: seriesList
        }; // Single

        if(!series.movies) return {};
        const newMoviesList = {};
            
        for(const movieId in series.movies) {
            const movieAddedAt = series.movies[movieId];

            if(!movieList[movieId]) continue; // Movie not found in list somehow?

            newMoviesList[movieId] = {
                data: movieList[movieId],
                addedAt: movieAddedAt
            }
        }

        return newMoviesList;
    }
}

export function SeriesMoviesToArray(movies) {
    const movieList = [];
    
    for(const movieId in movies) {
        const movie = movies[movieId];
        movieList.push({
            id: movieId,
            ...movie.data,
            addedAt: movie.addedAt
        });
    }

    movieList.sort((a, b) => b.addedAt - a.addedAt);

    return movieList;
}