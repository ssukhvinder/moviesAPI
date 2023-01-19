/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: __Sukhvinder____________ Student ID: _____159790211_________ Date: ________18-01-2023________
*  Cyclic Link: _______________________________________________________________
*
********************************************************************************/

// Installed packages 
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();


require('dotenv').config({path: "./keys.env"}); 
const { MONGODB_CONN_STRING } = process.env;

// Required for MoviesDB module
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

// using JSON routes
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});


app.get("/", (req, res) => {
    res.json({message: "API Listening"});
})

// POST /api/movies
app.post('/api/movies', (req, res) => {
    if(Object.keys(req.body).length === 0) {
      res.status(500).json({ error: "Invalid number "});
    } else {
      db.addNewMovie(req.body).then((data) => { res.status(201).json(data)
      }).catch((err) => { res.status(500).json({ error: err }); });
    }
  });
  
  // GET /api/movies
  app.get('/api/movies', (req, res) => {
      db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data) => {
        if (data.length === 0) res.status(204).json({ message: "No data returned"}); 
      }).catch((err) => {
        res.status(500).json({ error: err });  
      })
  });
  
  // GET /api/movies
  app.get('/api/movies/:_id', (req, res) => {
    db.getMovieById(req.params._id).then((data) => {
      res.status(201).json(data)  
    }).catch((err) => {
      res.status(500).json({ error: err });
    })
  })
  // PUT /api/movies
  app.put('/api/movie/:_id', async (req, res) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(500).json({ error: "No data to update"});
      }
      const data = await db.updateMovieById(req.body, req.params._id);
      res.json({ success: "Movie updated!"});
    }catch(err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  //	DELETE /api/movies
  app.delete('/api/movies/:_id', async (req, res) => {
    db.deleteMovieById(req.params._id).then(() => {
      res.status(202).json({ message: `The ${req.params._id} removed from the system`})  // 202 status code accepted to delete the movie
      .catch((err) => {
        res.status(500).json({ error: err })
      })
    })
  });