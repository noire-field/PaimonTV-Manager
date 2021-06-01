import config from './../config.json'

export const Debug = (message) => {
    if(config.DEBUG)
        console.log(message);
};