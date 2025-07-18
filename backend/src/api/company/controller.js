//Models
import companyModel from "../../models/company.js";
//Response
import companyResponse from "../../response/companyResponse.js";
//Functions
import logger from "../../../logger.js";
import { getCompanyById } from "./service.js";
import { getMessage } from "../../helper/common/helpers.js";
import ResponseHelper from "../../helper/common/responseHelper.js";
import { HttpStatus } from "../../helper/common/constant.js";
import reviewModel from "../../models/review.js";
import { validateCompany } from "../../helper/common/joiValidation.js";
import config from "../../helper/envconfig/envVars.js";

/**
 * @Method Method used to add company by Companys
 * @author Neeraj-Mehra
 * @param {*} req
 * @param {*} res
 * @date 18-JULY-2025
 */
export const addCompany = async (req, res) => {
  try {
    const { error } = validateCompany(req.body);
    if (error) {
      return ResponseHelper.validationError(res, error.details[0].message);
    }

    //req body
    const {
      language = "en",
      name,
      location,
      city,
      foundedOn,
      companyLogo,
    } = req.body;


    //save data
    const companyObj = new companyModel({
      name,
      location,
      foundedOn,
      city,
      logoUrl: companyLogo,
    });
    logger.info(`comapnyLogo : Req body==>> ${JSON.stringify(companyObj)}`);

    const companySave = await companyObj.save();

    if (companySave) {
      logger.info(`####****addCompany : Company added successfully****####`);
      return ResponseHelper.success(
        res,
        HttpStatus.OK,
        language,
        "Company_Added_Success",
        null
      );
    }

    logger.info(`####****addCompany : Feild to add company****####`);

    return ResponseHelper.error(
      res,
      HttpStatus.BAD_REQUEST,
      language,
      "Feild_To_Add_Company",
      null
    );
  } catch (error) {
    logger.error(`####****addCompany : Error==>> ${error}`);
    return ResponseHelper.error(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "en",
      "Internal_Server_Error",
      error.message
    );
  }
};

/**
 * @Method Method used to get company details by id
 * @param {*} req
 * @param {*} res
 * @date 18-JULY-2025
 */
export const getCompanyDetail = async (req, res) => {
  try {
    const language = req.query.language;
    const companyId = req.query.companyId;

    if (!companyId) {
      return ResponseHelper.error(
        res,
        HttpStatus.BAD_REQUEST,
        language,
        "Company_ID_Required",
        null
      );
    }

    //get company data by id
    const getCompanyData = await getCompanyById(companyId);

    if (getCompanyData) {
      const Companydata = new companyResponse(getCompanyData);

      Companydata.reviews = await reviewModel
        .find({ companyId })
        .sort({ createdAt: -1 });
      Companydata.reviewCount = await reviewModel.countDocuments({ companyId });

      logger.info(
        `####****getCompanyDetail : Company details fetch successfully****####`
      );
      return ResponseHelper.success(
        res,
        HttpStatus.OK,
        language,
        "Get_Company_Details_Success",
        Companydata
      );
    }

    logger.info(
      `####****getCompanyDetail : Company not found id==>> ${companyId}`
    );
    return ResponseHelper.error(
      res,
      HttpStatus.NOT_FOUND,
      language,
      "Data_Not_Found",
      null
    );
  } catch (error) {
    logger.error(`getCompanyDetail : Error==>> ${error}`);
    return ResponseHelper.error(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "en",
      "Internal_Server_Error",
      error.message
    );
  }
};

/**
 * @Method Method used to get all company list with filter and pagination
 * @param {*} req
 * @param {*} res
 * @date 18-JULY-2025
 */
export const getCompaniesList = async (req, res) => {
  try {
    const {
      language = "en",
      search,
      page = 1,
      perPage = 10,
      sort,
      city,
    } = req.body;

    const pageNo = (page - 1) * perPage;
    let filter = {};

    // Search filter
    if (search) {
      filter.city = { $regex: `.*${search}.*`, $options: "i" };
    }

    // City filter
    if (city) {
      filter.city = { $regex: `.*${city}.*`, $options: "i" };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "name") sortOption = { name: 1 };
    else if (sort === "location") sortOption = { location: 1 }
    else if (sort === "rating") sortOption = { avgRating: -1 }
    else if (sort === "date") sortOption = { createdAt: -1 };


    logger.info(`getCompanyList : filter==>> ${JSON.stringify(filter)}`);

    const companies = await companyModel
      .find(filter)
      .sort(sortOption)
      .skip(pageNo)
      .limit(perPage)
      .lean(); // improves performance
    logger.info(`getCompanyList : filter==>> ${JSON.stringify(companies)}`);

    if (companies && companies.length) {
      const madeCompanyResponse = await Promise.all(
        companies.map(async (company) => {
          const totalReviewCount = await reviewModel.countDocuments({
            companyId: company._id,
          });
          company.reviewCount = totalReviewCount;
          return new companyResponse(company);
        })
      );

      const totalCount = await companyModel.countDocuments(filter);

      logger.info(
        `####****getCompanyList : Company list fetched successfully****####`, madeCompanyResponse
      );

      return res.status(200).send({
        status: true,
        message: await getMessage(language, "Company_List_Fetched_Success"),
        totalCount,
        data: madeCompanyResponse,
      });
    } else {
      logger.error(`####****getCompanyList : Data not found****####`);
      return ResponseHelper.error(
        res,
        HttpStatus.NOT_FOUND,
        language,
        "Data_Not_Found",
        []
      );
    }
  } catch (error) {
    logger.error(`getCompanyList : Error==>> ${error}`);
    return ResponseHelper.error(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      language,
      "Internal_Server_Error",
      error.message
    );
  }
};

/**
 * @Method method used for upload image by multer
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const uploadLogo = async (req, res) => {
  try {
    const language = "en";

    if (!req.file) {
      return ResponseHelper.error(
        res,
        HttpStatus.BAD_REQUEST,
        language,
        "Please_Select_File",
        error.message
      );
    }

    // Fix backslashes in file path
    let filePath = req.file.path.replace(/\\/g, "/");

    logger.info(`####****uploadLogo : File uploaded successfully****####`);
    return res.send({
      status: true,
      message: "File uploaded successfully",
      url: filePath,
      fullUrl: config.IMAGE_ACCESS_URL + filePath,
    });
  } catch (error) {
    console.log(error);
    logger.error(`uploadLogo : Error==>> ${error}`);
    return ResponseHelper.error(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "en",
      "Internal_Server_Error",
      error.message
    );
  }
};
