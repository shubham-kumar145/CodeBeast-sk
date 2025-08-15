import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'https://code-beast-server.vercel.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

