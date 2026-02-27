const authService = require('../services/authService');

const signup = async (req, res, next) => {
    try {
        const { full_name, email, password, mobile_number } = req.body;
        const result = await authService.signup({ full_name, email, password, mobile_number });
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user._id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login, getMe };
