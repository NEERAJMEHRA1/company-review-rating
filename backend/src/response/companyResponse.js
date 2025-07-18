import config from "../helper/envconfig/envVars.js";


class companyResponse {
    constructor(instant) {
        this._id = instant._id ? instant._id : null;
        this.name = instant.name ? instant.name : '';
        this.location = instant.location ? instant.location : '';
        this.foundedOn = instant.foundedOn ? instant.foundedOn : '';
        this.city = instant.city ? instant.city : '';
        this.reviewCount = instant.reviewCount ? instant.reviewCount : 0;
        this.logo = instant.logoUrl ? config.IMAGE_ACCESS_URL + instant.logoUrl : "";
        this.avgRating = instant.avgRating ? instant.avgRating : 0;
        this.createdAt = instant.createdAt ? instant.createdAt : '';
    }
};

export default companyResponse;