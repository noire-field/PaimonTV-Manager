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