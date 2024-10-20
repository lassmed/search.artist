import express from "express";
import { ArtistController } from "../controllers/artistController";

const artistRoutes = express.Router();
let artistController = new ArtistController();

artistRoutes.route("/search").get(artistController.searchArtist); // this endpint searches for artists list with name = artist from query param, if no results , its retrieves a name from fallbackArtists and return its info
artistRoutes.route("/Download").get(artistController. exportArtistData); // this endpoint do the same search process and downloads the result as a csv file

export { artistRoutes };
