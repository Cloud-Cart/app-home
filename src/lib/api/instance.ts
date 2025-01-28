import axios from "axios";

axios.defaults.withCredentials = true;
const publicInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_VERSION}`,
});

export default publicInstance;
