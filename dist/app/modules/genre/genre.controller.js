import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { GenreService } from "./genre.service.js";
const getAllGenres = catchAsync(async (_req, res) => {
    const result = await GenreService.getAllGenres();
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Genres fetched successfully",
        data: result,
    });
});
const createGenre = catchAsync(async (req, res) => {
    const name = String(req.body.name);
    const result = await GenreService.createGenre(name);
    sendResponse(res, {
        httpStatusCode: httpStatus.CREATED,
        success: true,
        message: "Genre created successfully",
        data: result,
    });
});
const deleteGenre = catchAsync(async (req, res) => {
    await GenreService.deleteGenre(String(req.params.id));
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Genre deleted successfully",
    });
});
export const GenreController = { getAllGenres, createGenre, deleteGenre };
//# sourceMappingURL=genre.controller.js.map