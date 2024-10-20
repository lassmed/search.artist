import { NextFunction, Request, Response } from "express";
import { ArtistService } from "../services/artistService";
import { AppError } from "../utils/appError";
import fs from "fs"

export class ArtistController {
  private artistServices: ArtistService;
  constructor() {
    this.artistServices = ArtistService.getInstance();
  }

  searchArtist = async (req: Request, res: Response, next: NextFunction) => {
    const { artist , limit , page} = req.query;

    if (!artist) {
      return next(new AppError("An artist name must be provided", 400));
    }
    try {
      const artistInfo = await this.artistServices.locateArtistOrFetchRandom(
        artist as string,
        limit as string ,
        page as string
      );
      return res.status(200).json(artistInfo);
    } catch (error: any) {
      return next(new AppError(error.message, 500));
    }
  };

  exportArtistData = async (req: Request, res: Response, next: NextFunction) => {
    const { artist ,limit , page  } = req.query;

    if (!artist) {
      return next(new AppError("An artist name must be provided", 400));
    }

    const fileName = req.query.filename || "artist_search.csv";
    const completeFileName =
      fileName + (fileName.toString().endsWith(".csv") ? "" : ".csv");

    try {
      const response = await this.artistServices.exportArtistsDataToCsv(
        artist as string,
        completeFileName,
        limit as string ,
        page as string,
      );

    res.download(response, (err) => {
      if (err) {
        console.error("Error downloading the CSV file:", err);
        return next(new AppError("Failed to download the CSV file", 500));
      }
      fs.unlink(response, (error:any) => {
        if (error) {
          console.error("Error deleting the CSV file:", error);
        } else {
          console.log("CSV file has been successfully deleted");
        }
      });
    });
    } catch (error: any) {
      return next(new AppError(error.message, 500));
    }
  };


}