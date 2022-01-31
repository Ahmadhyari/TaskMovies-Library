"use strict";
const express = require("express");
const app = express();
const appData = require(`./MovieData/data.json`);


app.get(`/`, review);

function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

}

function review(req, res) {

    let movieInfo = new Movie(appData.title, appData.poster_path, appData.overview);

    return res.status(200).json(movieInfo);

}




app.get("/favorite", favoritePage);

function favoritePage(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}



app.listen(3198, () => {
    console.log("im listen");
});
