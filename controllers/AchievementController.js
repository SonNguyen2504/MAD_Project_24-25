const Achievement = require('../models/Achievement');
const Target = require('../models/Target');

const createAchievement = async(req, res) => {
    const { targetId, title, content} = req.body;
    const userId = req.user._id;

    const target = await Target.findByIdAndDelete(targetId);
    if(!target) {
        return res.status(404).json({
            success: false,
            message: 'Target not found',
        });
    }

    try {
        const achievement = await Achievement.create({
            title,
            content,
            user: userId,
        });

        return res.status(201).json({
            success: true,
            message: 'Achievement created successfully',
            achievement,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating achievement',
            error: error.message,
        });
    }
}

const getAchievementsByUserId = async (req, res) => {
    const userId = req.user._id;

    try {
        const achievements = await Achievement.find({ user: userId });

        return res.status(200).json({
            success: true,
            messages: `Achievements of user with id: ${userId} fetched successfully`,
            achievements,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching achievements',
            error: error.message,
        });
    }
}

const getAllAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find({});

        return res.status(200).json({
            success: true,
            messages: 'All achievements fetched successfully',
            achievements,
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching all achievements',
            error: error.message,
        });
    }
}

module.exports = {
    createAchievement,
    getAchievementsByUserId,
    getAllAchievements,
}