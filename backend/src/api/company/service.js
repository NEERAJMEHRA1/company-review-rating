import fs from "fs";
import path from "path";
import companyModel from "../../models/company.js";
import logger from "../../../logger.js";

/**
 * @Method Method used for get company data by id
 * @author Neeraj-Mehra
 * @param {*} companyId 
 * @date 18-JULY-2025
 */
export const getCompanyById = async (companyId) => {
    try {

        //get company data
        const companyData = await companyModel.findOne({ _id: companyId }).lean();

        return companyData;

    } catch (error) {
        logger.error("getCompanyById : Error==>> " + error);
        throw new Error(error.message);
    }
};

/**
 * @Method used create directory
 * @author Neeraj-Mehra
 * @date 18-JULY-2025
 */
export const createDirectory = async (targetDir) => {
    try {
        const sep = path.sep;

        const initDir = path.isAbsolute(targetDir) ? sep : "";
        targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(parentDir, childDir);
            if (!fs.existsSync(curDir)) {
                fs.mkdirSync(curDir);
                fs.chmodSync(curDir, 777);
            }
            return curDir;
        }, initDir);
    } catch (error) {
        throw new Error(error.message);
    }
}

