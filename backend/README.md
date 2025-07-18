# 🏢 Company Rating & Review Platform

A complete MERN-based platform for managing companies and their reviews, enabling users to add companies, view listings, submit reviews, and explore company ratings. Built with **Node.js**, **Express.js**, **MongoDB**, **React.js**, it provides a scalable backend and responsive frontend with a clean architecture.


### Technical Features
- RESTful API with proper status codes
- MVC architecture
- Request validation
- Comprehensive logging
- Error handling
- API documentation

# env file
NODE_ENV = localhost
PORT = 3000
DB_HOST = localhost
DB_NAME = companies_information
DB_PORT = 27017
IMAGE_ACCESS_URL = http://localhost:3000/


# Backend dependencies
cd backend
npm install
node index.js


# Front-End dependencies
cd frontend
npm install
npm run dev

# Swagger URL
http://localhost:3000/api-docs/#/


API Endpoints

# Companys
POST /company/add-company
GET /company/get-company-detail?companyId=""&langauge="en"
POST /company/get-Companies-list
POST /company/upload-logo

# Rating & Review
POST /reviews/add-review
GET /company/get-rating-reviews?companyId=""&langauge="en"
