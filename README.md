# Inventory

## Introduction

Inventory is a web application for creating an inventory of home electronic utilities like laptop, computer, television etc. for users. 
This application comes in handy at the time of disaster or at any other times to claim insurance and to know the value of lost items . 


## Features

* **User Signup and Login for personalized product storage**
* **Search product details with upc code upon login**
* **Add, Edit, Delete user's product details to database**
* **Allows users to store receipt images, product images**

## Tech Stack
* **Frontend:** ReactJS, Redux JS, React Router, Formik, Yup, Axios
* **Backend:**  NodeJS, Express JS, Multer JS, PostgreSQL, Bcrypt, JWT, Axios

## Description

Upon signup / login, this application allow users to add purchase date and store at which the product was purchased, serial number, warranty time, return policy,manual link etc. 
In addition to product details, the user can also store receipts and product image. The users can edit, delete products. The user can also see more details of the product if they enter UPC code.


## Deployment
The frontend part of this web application is deployed in netlify. Click [here](https://anusha-inventory.netlify.app/) to see it in action. 
The backend is deployed in heroku.

## Getting Started

To get started clone the repository, install the packages from package.json, create inventory database in postgreSQL

### Clone

* **Clone a copy of the frontend repository: git clone <https://github.com/AnushaV1/Inventory-frontend.git>**
* **Clone a copy of the backend repository: git clone <https://github.com/AnushaV1/Inventory-backend.git>**


### Prerequisites

* **Git**
* **Visual Studio**

### API Details

This application uses [UPCitemdb](https://www.upcitemdb.com/api/explorer#!/lookup/get_trial_lookup) API to lookup for upc code in search. 

### Improve or Contribute

Feel free to improve or contribute on this project. Pull requests are welcome!

## Author

* **Anusha Venkataraghavan**
