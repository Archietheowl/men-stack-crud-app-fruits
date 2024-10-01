const isSignedIn = (req, res, next) => {
    // if the user is athenticated
    if (req.session.user) return next();
    // else the user is redircted
    res.redirect("/auth/sign-in");
};

module.exports = isSignedIn;