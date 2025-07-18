//NPM
import mongoose from "mongoose";
import reviewModel from "../../models/review.js";
import companyModel from "../../models/company.js";
import logger from "../../../logger.js";


/**
 * @Method Method used to calculate average rating review and add in company
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 18-JULY-2025
 */
export const getAverageRating = async (companyId, update) => {
    try {

        const result = await reviewModel.aggregate([
            { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
            { $group: { _id: null, averageRating: { $avg: '$rating' } } },
        ]);
        const average = result[0]?.averageRating || 0;
        if (update) {
            await companyModel.updateOne(
                { _id: companyId },
                {
                    $set: {
                        avgRating: Number(average.toFixed(1))
                    }
                },
            );
        }
        return Number(average.toFixed(1));

    } catch (error) {
        logger.error("getAverageRating :  Error==>> " + error);
    }
};