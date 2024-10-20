import { createObjectCsvWriter } from "csv-writer";
import { Artist } from "../models/artistModel";
import { AppError } from "../utils/appError";
import { ArtistRepository } from '../repositories/artistRepository';
import fs from "fs";
import path from "path";

export class ArtistService {

    private artistRepository: ArtistRepository;
    private static fallbackFilePath = path.join(__dirname, '../utils/fallbackArtists.json');
    private static instance: ArtistService;
    static getInstance () {
        if (!ArtistService.instance) {
            ArtistService.instance = new ArtistService();
        }
        return ArtistService.instance;
    }
    private constructor () {
        this.artistRepository = ArtistRepository.getInstance();
    }


    // function to rertieve artist data from the api by name
    fetchArtist = async (name: string, maxResults: string = "30", currentPage: string = "1") => {
        try {
            const result = await this.artistRepository.findArtistByName(name, maxResults, currentPage);
            return result;
        } catch (err: any) {
            throw new AppError("Error retrieving artist by name", 500);
        }
    };


    // Function to get a random artist name from the fallback json file
    getRandomArtistName = async () => {

        try {

            if (!fs.existsSync(ArtistService.fallbackFilePath)) {
                throw new AppError("Fallback JSON file not found", 404);
            }
            const artistNamesJSON = fs.readFileSync(ArtistService.fallbackFilePath);
            const artistNames = JSON.parse(artistNamesJSON.toString());
            const randomIndex = Math.floor(Math.random() * artistNames.artists.length);
            const randomArtistName = artistNames.artists[randomIndex];
            return randomArtistName;
        } catch (error: any) {
            throw new AppError("Failed to get random artist name from the fallback JSON file", 500);
        }
    }


    // this function searches artist data by name from query param , if inexisting it returns data of an artist from the json fallbackArtist file
    locateArtistOrFetchRandom  = async (artistName: string, limit: string = "20", page: string = "1") => {
        try {
            let artistInfo = await this.fetchArtist(artistName, limit, page);

            // Fallback mechanism if artist not found
            if (!artistInfo.results.artistmatches.artist.length) {
                const randomArtist = await this.getRandomArtistName();
                artistInfo= await this.fetchArtist(randomArtist, limit, page);
            }

            return artistInfo.results.artistmatches.artist;
        } catch (error: any) {
            throw new AppError("Error locating artist info and no random info provided", 500);
        }
    }


    // Function to download the result list in csv format file
    exportArtistsDataToCsv= async(artistName: string, filename: string, limit: string = "30", page: string = "1")=> {
        try {
            const artistInfo = await this.locateArtistOrFetchRandom(artistName, limit, page);
            const records = artistInfo.map((artist: any) => {
                const artistInstance = new Artist(artist.name, artist.mbid, artist.url, artist.image);
                return artistInstance.convertToArtistDto();
            });
            const csvWriter = createObjectCsvWriter({
                path: filename,
                header: [
                    { id: "name", title: "Name" },
                    { id: "mbid", title: "MBID" },
                    { id: "url", title: "URL" },
                    { id: "image_small", title: "Image_Small" },

                    { id: "image", title: "Image" },
                ],
            });
            await csvWriter.writeRecords(records);
            return filename;
        } catch (error: any) {
            throw new AppError("Failed to download artists CSV", 500);
        }
    }


}