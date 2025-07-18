//Models
import reviewModel from "../../models/review.js";
//Functions
import logger from '../../../logger.js';
import ResponseHelper from "../../helper/common/responseHelper.js";
import { HttpStatus } from "../../helper/common/constant.js";
import { getMessage } from "../../helper/common/helpers.js";
import { validateReview } from "../../helper/common/joiValidation.js";
import { getAverageRating } from "./service.js";

/**
 * @Method Method used to submit a review/rating for a company
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 18-JULY-2025
 */
export const addReview = async (req, res) => {
    try {
        //validate request
        const { error } = validateReview(req.body);
        if (error) {
            return ResponseHelper.validationError(res, error.details[0].message);
        }

        const { language = "en", companyId, fullName, subject, rating, feedback } = req.body;

        logger.info(`addReview : Req body==>> ${JSON.stringify(req.body)}`);

        // Save review
        const reviewObj = new reviewModel({
            companyId,
            fullName,
            subject,
            rating,
            feedback,
        });

        const reviewSave = await reviewObj.save();

        if (reviewSave) {
            //avg rating calculate
            await getAverageRating(companyId, true);

            logger.info(`####****addReview : Review submitted successfully****####`);
            return ResponseHelper.success(res, HttpStatus.CREATED, language, 'Review_Submitted_Successfully', reviewSave);
        }

        logger.error(`####****addReview : Failed to submit review****####`);
        return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Failed_To_Submit_Review', null);

    } catch (error) {
        logger.error(`addReview : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};

/**
 * @Method Method used to get all company rating/review listing
 * @param {*} req 
 * @param {*} res 
 * @date 18-JULY-2025
 */
export const getReviewList = async (req, res) => {
    try {
        const { language = 'en', companyId } = req.query;

        logger.info(`getReviewList : companyId==>> ${companyId}`);

        const reviews = await reviewModel.find({ companyId: companyId }).lean(); // improves performance

        if (reviews && reviews.length) {

            const totalCount = await reviewModel.countDocuments({ companyId: companyId });
            //avg rating calculate
            const averateRate = await getAverageRating(companyId, false);

            logger.info(`####****getReviewList : Company list fetched successfully****####`);

            return res.status(200).send({
                status: true,
                message: await getMessage(language, "Review_List_Fetched_Success"),
                totalCount,
                avgRating: averateRate,
                data: reviews,
            });
        } else {
            logger.error(`####****getReviewList : Data not found****####`);
            return ResponseHelper.error(res, HttpStatus.NOT_FOUND, language, 'Data_Not_Found', []);
        }

    } catch (error) {
        logger.error(`getReviewList : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, language, 'Internal_Server_Error', error.message);
    }
};