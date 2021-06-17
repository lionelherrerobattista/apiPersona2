const handlerNotFound = (req, res, next) => {
    res.status(200).json({ok:false, error:"No existe ese recurso"});
};

exports.handlerNotFound = handlerNotFound;