const Target = require('../models/Target');

const createTarget = async (req, res) => {
    const { targetName, content } = req.body;
    const userId = req.user._id;

    if (!targetName || !content) {
        return res.status(400).json({
            success: false,
            message: 'Target name and content are required',
        });
    }

    try {
        const newTarget = new Target({
            targetName,
            content,
            user: userId,
        });

        await newTarget.save();
        return res.status(201).json({
            success: true,
            message: 'Target created successfully',
            target: newTarget
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating target',
            error: error.message,
        });
    }
}

const getTargetsByUserId = async (req, res) => {
    const userId = req.user._id;

    try {
        const targets = await Target.find({ user: userId });

        return res.status(200).json({
            success: true,
            messages: `Targets of user with id: ${userId} fetched successfully`,
            targets,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching targets',
            error: error.message,
        });
    }
}

const getTargetById = async (req, res) => {
    const { targetId } = req.params;

    try {
        const target = await Target.findById(targetId);

        if (!target) {
            return res.status(404).json({
                success: false,
                message: 'Target not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Target fetched successfull',
            target,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching target',
            error: error.message,
        });
    }
}

const updateTargetById = async (req, res) => {
    const { targetId } = req.params;
    const { newTargetName, newContent } = req.body;

    try {
        const target = await Target.findById(targetId);

        if (!target) {
            res.status(404).json({
                success: false,
                message: 'Target not found',
            });
        }

        target.targetName = newTargetName || target.targetName;
        target.content = newContent || target.content;
        await target.save();

        return res.status(200).json({
            success: true,
            message: 'Target updated successfully',
            target,
        });

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating target',
            error: error.message,
        });
    }
}

const deleteTargetById = async(req, res) => {
    const { targetId } = req.params;

    try {
        const target = await Target.findByIdAndDelete(targetId);

        if(!target) {
            return res.status(404).json({
                success: false,
                message: 'Target not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Target deleted successfully',
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting target',
            error: error.message,
        });
    }
}

module.exports = {
    createTarget,
    getTargetsByUserId,
    getTargetById,
    updateTargetById,
    deleteTargetById,
}