const User = require("../../models/users");
const FacebookStrategy = require("passport-facebook").Strategy;

module.exports = function(passport) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        profileFields: ["email", "displayName", "photos"],
        callbackURL: "/api/user/auth/facebook/callback",
        passReqToCallback: true,
        proxy: true,
      },
      async (req, token, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ facebook: profile.id });
          if (user) {
            return done(null, user);
          }
          const newUser = new User();
          newUser.facebook = profile.id;
          newUser.local.username = profile.displayName;
          newUser.local.email = profile._json.email;
          newUser.userImage = `https://graph.facebook.com/${
            profile.id
          }/picture?type=large`;
          newUser.fbTokens.push({ token });
          const savedUser = await newUser.save();
          done(null, savedUser);
        } catch (err) {
          return done(err, false);
        }
      },
    ),
  );
};
