
// Installed packages 
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express()

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
app.post("/api/movies", (req, res)=>{
    db.addNewMovie(req.body).then((data)=>{
        res.status(201).json(data);
    }).catch((err)=>{
       res.json({ message: err });
    });
 });
 
 app.get("/api/movies", (req, res)=>{
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.status(404).json({ message: err });
    });
 });
 
 app.get("/api/movies/:id", (req, res)=>{
    const id = req.params.id;
    db.getMovieById(id).then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        const msg = 'Cannot find Movie id: ${id} in the database. ERROR: ${err}';
        console.log(msg);
        res.status(204).json(msg);
    });
 });
 
 app.put("/api/movies/:id", (req, res)=>{
   const id = req.params.id;
    db.updateMovieById(req.body, id).then(()=>{
       res.send(`${req.body.title} updated.`);
    }).catch((err)=>{
       res.status(500).send('Cannot update Movie. ERROR: ${err}');
    });
 });
 
 app.delete("/api/movies/:id", (req, res)=>{
    const id = req.params.id;
    db.deleteMovieById(id).then(()=>{
       res.send('Movie id: ${id} deleted');
    }).catch((err)=>{
       res.status(204).send('Cannot find Movie id: ${id} in the database. ERROR: ${err}');
    });
 });
app.use(cors());



app.get("/", (req, res) => {
    res.json({message: "API Listening"});
})

app.post('/api/movies', (req, res) => {
    if(Object.keys(req.body).length === 0) {
      res.status(500).json({ error: "Invalid number "});
    } else {
      db.addNewMovie(req.body).then((data) => { res.status(201).json(data)
      }).catch((err) => { res.status(500).json({ error: err }); });
    }
  });
  
  app.get('/api/movies', (req, res) => {
      db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data) => {
        if (data.length === 0) res.status(204).json({ message: "No data returned"});  // 204 status code it's no content
        else res.status(201).json(data);  // 201 status code it's when is created
      }).catch((err) => {
        res.status(500).json({ error: err });  // 500 to show msg internal server error
      })
  });
  
  // this route to accepting a id
  app.get('/api/movies/:_id', (req, res) => {
    db.getMovieById(req.params._id).then((data) => {
      res.status(201).json(data)  // when it accepts should be code status 201 that proved data has crated
    }).catch((err) => {
      res.status(500).json({ error: err });
    })
  })
  
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
  
  app.delete('/api/movies/:_id', async (req, res) => {
    db.deleteMovieById(req.params._id).then(() => {
      res.status(202).json({ message: `The ${req.params._id} removed from the system`})  // 202 status code accepted to delete the movie
      .catch((err) => {
        res.status(500).json({ error: err })
      })
    })
  });
  

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});