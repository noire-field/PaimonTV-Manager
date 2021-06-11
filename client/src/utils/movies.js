
export function MoviesToArray(movies) {
    const moviesArray = [];

    for(const key in movies) {
        moviesArray.unshift({
            id: key,
            title: movies[key].title,
            subTitle: movies[key].subTitle || "",
            thumbnail: movies[key].thumbnail,
            year: movies[key].year,
            createdAt: movies[key].createdAt,
            episodeCount: movies[key].episodes !== undefined ? Object.keys(movies[key].episodes).length : 0
        });
    }

    moviesArray.sort((a, b) => b.createdAt - a.createdAt);

    return moviesArray;
}

export function EpisodesToArray(episodes) {
    const episodesArray = [];

    for(const key in episodes) {
        episodesArray.unshift({
            id: key.substring(2),
            title: episodes[key].title,
            duration: episodes[key].duration,
            progress: episodes[key].progress,
            url: episodes[key].url,
            status: episodes[key].status
        });
    }

    episodesArray.sort((a, b) => a.id - b.id);

    return episodesArray;
}

export function PadTimeText(num, size = 2) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

export function DurationSecondToText(duration) {
    var text;
    if(duration >= 3600) {
        var hour = PadTimeText(Math.floor(duration / 3600));
        var remainSecond = Math.floor(duration % 3600);
        var minute = PadTimeText(Math.floor(remainSecond / 60));
        remainSecond = PadTimeText(remainSecond % 60);

        text = `${hour}:${minute}:${remainSecond}`;
    } else {
        text = `${PadTimeText(Math.floor(duration / 60))}:${PadTimeText(Math.floor(duration % 60))}`;
    }

    return text;
}

export function ScanMovieEpisodes(episodes) {
    var episodeIndex = 0;

    for(var i = 0; i < episodes.length; i++) {
        let ep = episodes[i];
        let completedPercent = GetEpisodeCompletedRate(ep);

        if(completedPercent >= 92) continue;
        else {
            episodeIndex = i;
            break;
        }
    }

    return episodeIndex;
}

export function GetEpisodeCompletedRate(episode) {
    return Math.max(Math.min(Math.round(episode.progress / episode.duration * 100), 100), 0);
}