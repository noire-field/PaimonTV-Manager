export interface SharedSeries {
    title: string;
    subTitle: string;
    year: string;
    thumbnail: string; 
    episodes: SharedEpisode[];
}

export interface SharedEpisode {
    id: string;
    title: string;
    url: string;
    duration: number;
}