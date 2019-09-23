const User = require("../../models/users");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        profileFields: ["email", "displayName", "photos"],
        callbackURL: "/api/users/auth/google/callback",
        passReqToCallback: true,
        proxy: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log("Here");
          const user = await User.findOne({ google: profile.id });
          if (user) {
            console.log("User already exist");
            return done(null, user);
          }
          const newUser = new User();
          newUser.google = profile.id;
          newUser.local.username = profile.displayName;
          newUser.local.email = profile.emails[0].value;
          newUser.userImage = profile._json.image.url;
          const savedUser = await newUser.save();
          done(null, savedUser);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};
