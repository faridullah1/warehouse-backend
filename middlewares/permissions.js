const AppError = require("../utils/appError")

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.type)) {
			return next(new AppError("You don't have permission to perform this action.", 403));
		}

		next();
	}
}