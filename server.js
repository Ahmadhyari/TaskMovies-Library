"use strict";
const express = require("express");
const app = express();
const appData = require(`./MovieData/data.json`);
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;

app.use(express.json());
const pg = require("pg");
const DATABASE_URL = process.env.DATA
const Client = new pg.Client(DATABASE_URL);


app.post("/addMovie", addMovieHandler);
app.get("/getMovies", getMovieHandler);
app.get(`/`, review);
app.get("/favorite", favoritePage);
app.get("/trending", getTrendingHandler);
app.get("/search", searchMoviesHandler);
app.get("/configuration", conf);


app.get("/getMovie/id" ,getMovieByIdHandler);
app.put("/UPDATE/id" , updateMovieHandler);
app.delete("/DELETE/id", deleteMovieHandler);






function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date
    this.poster_path = poster_path;
    this.overview = overview;

}



function addMovieHandler(req, res) {
    let movie = req.body;

    const sql = `INSERT INTO addMovie( id,title,release_date, poster_path, overview,comment) VALUES($1, $2, $3, $4, $5,$6) RETURNING * ;`
    let values = [movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment];
    client.query(sql, values).then((data) => {
        return res.status(201).json(data.rows[0]);
    }).catch((error) => {
        errorHandler(error, req, res);
    })
};






function getMovieHandler(req, res) {
    const sql = `SELECT * FROM addMovie`;
    client.query(sql).then(data => {
        return res.status(200).json(data.rows);
    }).catch((error) => {
        errorHandler(error, req, res);
    })
}





function getMovieByIdHandler(req,res){
const id=req.params.id;
const sql =`SELECT * FROM addMovie WHERE id =${id} `;
client.query(sql).then (data => {
res.status(200).json(data.rows);
}).catch((error) => {
    errorHandler(error, req, res);
})



}




function updateMovieHandler(req,res) {
const id =req.params.id;
const movie = req.body;
const sql =`UPDATE addMovie SET id=$1, title=$2 ,release_date=$3 , poster_path=$4 , overview=$5 , Comment =$6  WHERE id=${id} RETURNING * ;`;
const values =[movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview,movie.comment];
client.query(sql,values).then (data => {
   return res.status(200).json(data.rows);
}).catch((error) => {
    errorHandler(error, req, res);
  
})

}




function  deleteMovieHandler (req,res){
const id =req.params.id;
const sql =`DELETE FROM addMovie WHERE id =${id} ;`
client.query(sql).then(() =>{
    return res.status(204).json([]);
}).catch((error) => {
    errorHandler(error, req, res);
  
})


}



function review(req, res) {


    let movieInfo = new Movie(appData.title, appData.poster_path, appData.overview);

    return res.status(200).json(movieInfo);

}






function favoritePage(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}








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
//  --------------------------------------






function conf(req, res) {

    axios.get(`https://api.themoviedb.org/3/configuration?api_key=${APIKEY}&language=en-US`).then(value => {
        let conf = value.data.images;
        return res.status(200).json(conf);
    }).catch((error) => {
        errorHandler(error, req, res)
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



Client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`im listen to ${PORT}`);
    });
});