import mongoose from "mongoose";
const Schema = mongoose.Schema;

//Review schema/model
const reviewSchema = new Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    fullName: { type: String, required: true },
    subject: { type: String, required: true },
    feedback: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
},
    {
        timestamps: true,
        typeCast: true
    }
);


const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;
