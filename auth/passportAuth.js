module.exports = function(passport, FacebookStrategy, config, mongoose) {

    // Create Chat userSchema to interact with database
    var chatUser = new mongoose.Schema({
        profileID: String,
        fullname: String,
        profilePic: String
    })

    // user model
    var userModel = mongoose.model('chatUser', chatUser);

    // The unique id stored to the database for each user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        userModel.findById(id, function(err, user) {
            done(err, user);
        })
    });

    

    passport.use(new FacebookStrategy({
        clientID: config.fb.appID,
        clientSecret: config.fb.appSecret,
        callbackURL: config.fb.callbackURL,
        profileFields: ['id', 'displayName', 'photos']
    }, function(accessToken, refreshToken, profile, done) {
        // Check if user exist in Mongodb database
        // If not, create one and return profile
        // if user exist, return pofile
        userModel.findOne({'profileID': profile.id}, function(err, result) {
            if(result) {
                done(null, result);
            }else {
                // No user Create one
                var newChatUser = new userModel({
                    profileID:profile.id,
                    fullname:profile.displayName,
                    profilePic:profile.photos[0].value || ''
                });

                // Store new user to database
                newChatUser.save(function(err) {
                    done(null, newChatUser);
                })
            }
        });
    }));
}
