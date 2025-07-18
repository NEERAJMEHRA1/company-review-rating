import Joi from 'joi';
const currentYear = new Date().getFullYear();

// Company validation schema
const companySchema = Joi.object({
    language: Joi.string().optional().default('en'),
    name: Joi.string()
        .min(5)
        .required()
        .messages({
            'string.base': "Company name must be a string.",
            'string.empty': "Company name is required.",
            'string.min': "Company name must be at least 5 characters long.",
            'any.required': "Company name is required."
        }),

    location: Joi.string()
        .min(5)
        .required()
        .messages({
            'string.base': "Company location must be a string.",
            'string.empty': "Company location is required.",
            'string.min': "Company location must be at least 2 characters long.",
            'any.required': "Company location is required."
        }),

    city: Joi.string()
        .min(5)
        .required()
        .messages({
            'string.base': "Company city must be a string.",
            'string.empty': "Company city is required.",
            'string.min': "Company city must be at least 2 characters long.",
            'any.required': "Company city is required."
        }),

    foundedOn: Joi.date()
        .less(new Date(`${currentYear + 1}`)) // ensures not a future date
        .greater('1-1-1800')
        .required()
        .messages({
            'date.base': 'Founded year must be a valid date.',
            'date.less': 'Founded date cannot be in the future.',
            'date.greater': 'Founded date cannot be earlier than 1800.',
            'any.required': 'Founded date is required.',
        }),
    companyLogo: Joi.string().allow(''), // optional

});


//Rating-Review validation schema
const reviewSchema = Joi.object({
    language: Joi.string().optional().default('en'),
    companyId: Joi.string().required()
        .messages({
            'string.base': "Company id must be a string.",
            'string.empty': "Company id is required.",
            'any.required': "Full name is required."
        }),
    fullName: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': "Full name must be a string.",
            'string.empty': "Full name is required.",
            'string.min': "Full name must be at least 3 characters long.",
            'any.required': "Full name is required."
        }),
    subject: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': "Subject must be a string.",
            'string.empty': "Subject is required.",
            'string.min': "Subject must be at least 3 characters long.",
            'any.required': "Subject is required."
        }),

    feedback: Joi.string()
        .min(4)
        .required()
        .messages({
            'string.base': "Feedback must be a string.",
            'string.empty': "Feedback is required.",
            'string.min': "Review must be at least 4 characters long.",
            'any.required': "Feedback is required."
        }),

    rating: Joi.number()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.base': "Rating must be a number.",
            'number.min': "Rating must be at least 1.",
            'number.max': "Rating cannot be more than 5.",
            'any.required': "Rating is required."
        }),
});

export const validateCompany = (data) => companySchema.validate(data);
export const validateReview = (data) => reviewSchema.validate(data);
