export const REGEX_RESOLUTION = /\[(\d{3,4}p)\]\s?/gi;


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

export function GenerateEpisodeMeta(episodes) {
    const data = {
        id: 1,
        resolution: ''
    }

    if(!episodes) return data;

    var latestID = 0, latestEp = null;

    for(let key of Object.keys(episodes)) {
        const epId = Number(key.substr(2));
        if(epId <= latestID)
            continue;

        latestID = epId;
        latestEp = episodes[key];
    }

    if(latestEp) {
        data.id = latestID + 1;

        const matches = new RegExp(REGEX_RESOLUTION).exec(latestEp.title);
        if(matches && matches.length >= 2)
            data.resolution =  matches[1];
    }

    return data;
}

export function ExtractResolutionFromName(text) {
    const data = {
        title: text,
        resolution: ''
    }

    const matches = new RegExp(REGEX_RESOLUTION).exec(text);

    if(matches && matches.length >= 2) {
        data.title = text.replaceAll(matches[0], '');
        data.resolution = matches[1];
    }

    return data
}

/**
 * True if the URL's last path segment looks like an episode file: digits + dot + extension
 * (e.g. .../01.mp4). Use this to validate batch URLs without {n}/{nn}/{nnn} placeholders.
 */
export function urlHasEpisodeDotFilename(template) {
    const s = template && String(template).trim();
    if (!s || !/^https?:\/\//i.test(s)) return false;
    try {
        const u = new URL(s);
        const parts = u.pathname.split('/').filter(Boolean);
        if (!parts.length) return false;
        return /^\d+\.[^/]+$/.test(parts[parts.length - 1]);
    } catch {
        return false;
    }
}

/**
 * For http(s) URLs only: if the last pathname segment is digits.extension (e.g. 01.mp4),
 * replace that numeric part with the episode number (padding ≥ original digit count).
 * Other numbers elsewhere in the path are left alone.
 */
function replaceTrailingEpisodeFilenameDigits(urlStr, episodeNum) {
    try {
        const u = new URL(urlStr);
        const parts = u.pathname.split('/').filter(Boolean);
        if (parts.length === 0) return urlStr;
        const last = parts[parts.length - 1];
        const m = last.match(/^(\d+)\.(.+)$/);
        if (!m) return urlStr;
        const [, digitStr, ext] = m;
        const width = Math.max(digitStr.length, String(episodeNum).length);
        const padded = PadTimeText(episodeNum, width);
        parts[parts.length - 1] = `${padded}.${ext}`;
        u.pathname = '/' + parts.join('/');
        return u.toString();
    } catch {
        return urlStr;
    }
}

/** Replace {nnn}, {nn}, {n}; then for http(s) URLs, episode-shaped .../NN.ext last segment. */
export function applyEpisodeTemplate(template, episodeNum) {
    if (template == null || template === '') return '';
    const n = String(episodeNum);
    const nn = PadTimeText(episodeNum, 2);
    const nnn = PadTimeText(episodeNum, 3);
    let result = template
        .replace(/\{nnn\}/g, nnn)
        .replace(/\{nn\}/g, nn)
        .replace(/\{n\}/g, n);

    if (/^https?:\/\//i.test(result)) {
        result = replaceTrailingEpisodeFilenameDigits(result, episodeNum);
    }

    return result;
}