import axios from "axios";

const Api = axios.create({
    baseURL: process.env.API_URL || "https://api-fidaf.deltex.com.br"
})

export default Api;