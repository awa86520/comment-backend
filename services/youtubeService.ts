import axios from 'axios';

export const fetchYouTubeComments = async (videoId: string) => {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${process.env.YOUTUBE_API_KEY}&maxResults=50`;

    const response = await axios.get(url);
    return response.data.items.map((item: any) => ({
        username: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textDisplay
    }));
};
