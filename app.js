const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const app = express();
let db = null;
const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(`Data base error is ${error.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

convertMovieDbObject = (object) => {
  return {
    movieName: object.movie_name,
  };
};

//Get movies API
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT *
    FROM movie;`;
  const movieResponse = await db.all(getMoviesQuery);
  response.send(movieResponse.map((movie) => convertMovieDbObject(movie)));
});

// create movie API
app.post("/movies", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const createMovieQuery = `
    INSERT INTO movie(director_id,movie_name,lead_actor)
    VALUES(${directorId},'${movieName}','${leadActor}');`;
  const createMovieResponse = await db.run(createMovieQuery);
  response.send("Movie Successfully Added");
});

//Get movie API

convertMovieDbObjectAPI3 = (object) => {
  return {
    movieId: object.movie_id,
    directorId: object.director_id,
    movieName: object.movie_name,
    leadActor: object.lead_actor,
  };
};
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT *
    FROM movie
    WHERE movie_id=${movieId};`;
  const getMovieResponse = await db.get(getMovieQuery);
  response.send(convertMovieDbObjectAPI3(getMovieResponse));
});

//Update movie API
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
    UPDATE movie
    SET director_id=${directorId},
    movie_name='${movieName}',
    lead_actor='${leadActor}'
    WHERE movie_id=${movieId};`;
  const updateMovieResponse = await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

//Delete movie API
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM movie
    WHERE movie_id=${movieId};`;
  const deleteMovieResponse = await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//Get Director API
convertMovieDbObjectAPI6 = (object) => {
  return {
    directorId: object.director_id,
    directorName: object.director_name,
  };
};
app.get("/directors", async (request, response) => {
  const getDirectorQuery = `
    SELECT * FROM director;`;
  const getDirectorResponse = await db.all(getDirectorQuery);
  response.send(
    getDirectorResponse.map((object) => convertMovieDbObjectAPI6(object))
  );
});

//get movies by director API
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMoviesByDirectorQuery = `SELECT movie_name AS movieName FROM movie WHERE 
  director_id = ${directorId};`;
  const getMoviesByDirectorResponse = await db.all(getMoviesByDirectorQuery);
  response.send(getMoviesByDirectorResponse);
});

module.exports = app;
