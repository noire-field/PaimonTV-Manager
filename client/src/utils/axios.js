import axios from 'axios';

export default axios.create({
    baseURL: "https://pvp.world:280421/api/"
});