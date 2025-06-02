import axios from "axios";

export const api = axios.create({
    //baseURL: "http://10.111.135.208:3333"
    baseURL: "https://backbeer.vercel.app/"
})
