const Note = require('../models/Note');
const User = require('../models/User');
const Food = require('../models/Food');

const createNote = async (req, res) => {
    const { foodId, content, rating } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food not found',
            });
        }

        const note = new Note({
            user: user._id,
            food: food._id,
            content,
            rating,
        });
        await note.save();

        return res.status(201).json({
            success: true,
            message: 'Note created successfully',
            note: note,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const getNotesByUserId = async (req, res) => {
    const userId = req.user._id;

    try {
        const notes = await Note.find({ user: userId })
            .populate('food')

        if (!notes || notes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No notes found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Notes retrieved successfully',
            notes: notes,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const getNoteById = async (req, res) => {
    const { id } = req.params;

    try {
        const note = await Note.findById(id)
            .populate('food');

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Note retrieved successfully',
            note: note,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const getNotesByRating = async (req, res) => {
    const { rating } = req.query;
    const userId = req.user._id;

    if(rating !== 'healthy' && rating !== 'unhealthy') {
        return res.status(400).json({
            success: false,
            message: 'Invalid rating value',
        });
    }

    const ratingQuery = rating === 'healthy' ? 'Lành mạnh' : 'Không lành mạnh';

    try {
        const notes = await Note.find({ 
            user: userId, 
            rating: ratingQuery
        })
            .populate('food')

        if (!notes || notes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No notes found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Notes retrieved successfully',
            notes: notes,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const updateNote = async (req, res) => {
    const { id } = req.params;
    const { content, rating } = req.body;

    try {
        const note = await Note.findById(id)
            .populate('food');

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found',
            });
        }

        note.content = content || note.content;
        note.rating = rating || note.rating;
        await note.save();

        return res.status(200).json({
            success: true,
            message: 'Note updated successfully',
            note: note,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const deleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        const note = await Note.findByIdAndDelete(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Note deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

module.exports = {
    createNote,
    getNotesByUserId,
    getNoteById,
    getNotesByRating,
    updateNote,
    deleteNote,
}