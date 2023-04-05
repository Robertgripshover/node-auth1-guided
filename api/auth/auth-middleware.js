async function protect(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        next({ status: 401, message: 'You shall not pass!' })
    }
}

//this peice of code could not be any easier. //this is going to the server
//and saying can this user access this data? do they already have an
//open seesion? if see next() proceed... 
//or they get a you shall not pass











module.exports = {
    protect,
}