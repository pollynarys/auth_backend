const CustomError = require("../handlers/errorHandler");
const tokenService = require("../services/tokenService");
module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }
        try {
            const authorizationHeader = req.headers.authorization
            if (!authorizationHeader) return next(CustomError.UnauthorizedErr())

            const accessToken = authorizationHeader.split(' ')[1] // bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBvbGluYS52ZG92aW5hQGV4eXRlLmNvbSIsImlkIjoxOCwiaXNfYWN0aXZhdGVkIjpmYWxzZSwiaWF0IjoxNjUyMjExNTMxLCJleHAiOjE2NTQ4MDM1MzF9.fJ1R3QOSaHzGMTOJ51splsf4FoRBMewkKdY2gb8V_tU
            if (!accessToken) return next(CustomError.UnauthorizedErr())

            const userData = tokenService.validateAccessToken(accessToken)
            if (!userData) return next(CustomError.UnauthorizedErr())

            const { roles: userRoles } = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
            let hasRole = false
            userRoles.forEach(role => {
                if (roles.include(role)) hasRole = true
            })
            if (!hasRole) return next(CustomError.noAccess())

            req.user = userData
            next()

        } catch (e) {
            return next(CustomError.UnauthorizedErr())
        }
    }
}
