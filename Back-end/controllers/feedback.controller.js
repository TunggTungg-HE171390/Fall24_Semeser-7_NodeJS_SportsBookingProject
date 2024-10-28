const db = require("../models");
require("dotenv").config();

async function getFeedbackByCustomerId(req, res, next) {
    try {
        console.log(req.params.id);
        const feedbacks = await db.feedback.find({ customerId: req.params.id });
        res.status(200).json({
            feedbacks
        });
    } catch (error) {
        next(error);
    }
}

async function updateFeedback(req, res, next) {
    try {
        const newStarNumber = req.body.starNumber;
        const newDetail = req.body.detail;

        const updateFeedbackDetail = {
            starNumber: newStarNumber,
            detail: newDetail
        }

        const feedback = await db.feedback.findByIdAndUpdate(req.params.id, updateFeedbackDetail, { new: true });
        res.status(200).json({
            message: "Update successfully",
            feedback
        });
    } catch (error) {
        next(error);
    }
}

async function deleteFeedback(req, res, next) {
    try {
        const feedback = await db.feedback.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Delete successfully",
            feedback
        });
    } catch (error) {
        next(error);
    }
}

async function getAllFeedbacks(req, res, next) {
    try {
        const feedbacks = await db.feedback.find().populate("customerId", "profile.name");
        res.status(200).json({
            feedbacks
        });
    } catch (error) {
        next(error);
    }
}

async function createFeedback(req, res, next) {
    try {
        const feedback = await db.feedback.create(req.body);
        res.status(201).json({
            feedback
        });
    } catch (error) {
        next(error);
    }
}

const AuthController = {
    getFeedbackByCustomerId,
    updateFeedback,
    deleteFeedback,
    getAllFeedbacks,
    createFeedback
};

module.exports = AuthController;