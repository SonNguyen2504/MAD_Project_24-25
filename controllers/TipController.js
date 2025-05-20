const Tip = require('../models/Tip');

const createTip = async (req, res) => {
    const { tipType, title, content, target } = req.body;
    const user = req.user._id;

    try {
        const newTip = new Tip({ tipType, title, content, target, user });
        await newTip.save();

        return res.status(201).json({
            success: true,
            message: 'Tip created successfully',
            data: newTip,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
}

const getTipsForUser = async (req, res) => {
    const target = req.user.target;

    try {
        const tips = await Tip.find({ target: target });

        return res.status(200).json({
            success: true,
            message: `Tips for target: ${target} retrieved successfully`,
            data: tips,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
}

const updateTipById = async (req, res) => {
    const { id } = req.params;
    const { tipType, title, content, target } = req.body;

    try {
        const updatedTip = await Tip.findById(id);

        if (!updatedTip) {
            return res.status(404).json({
                success: false,
                message: 'Tip not found',
            });
        }

        updatedTip.tipType = tipType || updatedTip.tipType;
        updatedTip.title = title || updatedTip.title;
        updatedTip.content = content || updatedTip.content;
        updatedTip.target = target || updatedTip.target;

        await updatedTip.save();

        return res.status(200).json({
            success: true,
            message: 'Tip updated successfully',
            data: updatedTip,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
}

const deleteTipById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTip = await Tip.findByIdAndDelete(id);

        if (!deletedTip) {
            return res.status(404).json({
                success: false,
                message: 'Tip not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tip deleted successfully',
            data: deletedTip,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
}

module.exports = {
    createTip,
    getTipsForUser,
    updateTipById,
    deleteTipById,
}