const SystemLog = require("../models/SystemLog");

exports.logAction = async (level, type, message, meta = {}, userId = null) => {
    try {
        await SystemLog.create({
            level,
            type,
            message,
            meta,
            user: userId
        });
    } catch (error) {
        console.error("SystemLog Error:", error);
    }
};

exports.requestLogger = async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function (body) {
        res.send = originalSend;
        
        // Log asynchronously after response
        setImmediate(async () => {
            const userId = req.user ? req.user.id : null;
            const message = `${req.method} ${req.originalUrl} - ${res.statusCode}`;
            const level = res.statusCode >= 400 ? (res.statusCode >= 500 ? "error" : "warn") : "info";
            
            await exports.logAction(level, "REQUEST", message, {
                ip: req.ip,
                body: req.method !== "GET" ? req.body : null
            }, userId);
        });
        
        return res.send(body);
    };
    next();
};

exports.errorLogger = async (err, req, res, next) => {
    const userId = req.user ? req.user.id : null;
    await exports.logAction("error", "ERROR", err.message, { stack: err.stack }, userId);
    next(err);
};
