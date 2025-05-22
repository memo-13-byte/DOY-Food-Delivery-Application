import axios from "axios";

export default class AuthorizedRequest {


    constructor(parameters) {

    }

    static getParameters(parameters) {
        let p = {}
        if (parameters !== null) {
            console.log("here")
            for (let key in parameters) {
                if (parameters.hasOwnProperty(key)) {

                    p[key] = parameters[key]
                }
            }
        }

        p["headers"] = { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
        } 
        return p;
    }

    static async getRequest(url, parameters=null) {
        return await axios.get(url, this.getParameters(parameters));
    }

    static async postRequest(url,  payload=null, parameters=null) {
        return await axios.post(url, payload, this.getParameters(parameters));
    }

    static async patchRequest(url,  payload=null, parameters=null) {
        return await axios.patch(url, payload, this.getParameters(parameters));
    }

    static async putRequest(url,  payload=null, parameters=null) {
        return await axios.put(url, payload, this.getParameters(parameters));
    }

    static async deleteRequest(url, parameters=null) {
        return await axios.delete(url, this.getParameters(parameters));
    }

    static updateAuthorization(newToken) {
        localStorage.setItem("token", newToken);
    }
};