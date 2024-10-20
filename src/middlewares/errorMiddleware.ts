import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }
    return res.status(500).json({
        error: "Internal Server Error"
    });
};
