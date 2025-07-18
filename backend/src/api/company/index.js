import express from "express";
const router = express.Router();
import upload from "../../helper/common/multerConfig.js";

import {
    addCompany,
    getCompanyDetail,
    getCompaniesList,
    uploadLogo,
} from "./controller.js";

router.post("/add-company", addCompany);
router.get("/get-company-detail", getCompanyDetail);
router.post("/get-Companies-list", getCompaniesList);
router.post("/upload-logo", upload.single("companyLogo"), uploadLogo);

export default router;