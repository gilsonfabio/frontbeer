import axios from "axios";

export const apicontrol = axios.create({
    baseURL: "https://192.168.0.100/"    
})
