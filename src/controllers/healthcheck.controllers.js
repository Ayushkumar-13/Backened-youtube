import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async(req,res) => {
    // TODO: build a healthcheck message that simply return the ok status as json with a message 
})

export{
    healthcheck
}