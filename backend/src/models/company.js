import mongoose from "mongoose";
const Schema = mongoose.Schema;

//Company schema/model
const companySchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    foundedOn: { type: String, required: true },
    city: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    avgRating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    typeCast: true,
  }
);

const companyModel = mongoose.model("Company", companySchema);

export default companyModel;
