import http from "./httpService";
import { apiUrl } from "../config/http.json";

const apiEndpoint = apiUrl + "/rentals";

function getRentals(){
    return http.get(apiEndpoint);
}

function addRental(rental){
    return http.post(apiEndpoint, rental);
}

export default{
    getRentals,
    addRental
}