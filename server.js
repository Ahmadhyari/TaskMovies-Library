"use strict";
const express = require("express");
const app = express();
const appData = require(`./MovieData/data.json`);
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;



function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date
    this.poster_path = poster_path;
    this.overview = overview;

}

app.get(`/`, review);

function review(req, res) {


    let movieInfo = new Movie(appData.title, appData.poster_path, appData.overview);

    return res.status(200).json(movieInfo);

}




app.get("/favorite", favoritePage);

function favoritePage(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}


app.get("/trending", getTrendingHandler);

function getTrendingHandler(req, res) {
    let trendMovie = [];
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`).then(value => {
        value.data.results.forEach(element => {
            let oneMovie = new Movie(element.id, element.title, element.release_date, element.poster_path, element.overview);
            trendMovie.push(oneMovie);
        })
        
        return res.status(200).json(trendMovie);
    }).catch((error) => {
        errorHandler(error, req, res)
    })

}

app.get("/search", searchMoviesHandler);

    function searchMoviesHandler(req, res) {
        let searchQuery = req.query.search;
        let selectedMovie = [];
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${searchQuery}`).then(value => {
            value.data.results.forEach(element => {
                selectedMovie.push(element);
            })
            return res.status(200).json(selectedMovie);


        }).catch((error) => {
            errorHandler(error, req, res)
        })
    }



app.get("/configuration" , conf);
function conf (req ,res){
   
    axios.get(`https://api.themoviedb.org/3/configuration?api_key=${APIKEY}&language=en-US`).then (value => {
       let conf= value.data.images;
       return res.status(200).json(conf);
    }).catch((error) => {
        errorHandler(error, req, res)
    })
}

// --------------add second route----------------

app.get("/discover/movie" , dis);

function dis (req ,res){
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`) .then (value => {
        let dis=value.data.results;
        return res.status(200).json(dis);

    }).catch((error) =>{
        errorHandler(error,res,res)
    })
}











app.use(errorHandler);

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        message: error
    }

     return res.status(500).send(err);
}



app.use("*", notFountHandler);
function notFountHandler(req, res) {
    res.status(404).send("Something Error -Not found-");
}


app.listen(PORT, () => {
    console.log(`im listen to ${PORT}`);
});
