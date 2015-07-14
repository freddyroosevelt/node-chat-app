module.exports = function(express, app, passport, config, rooms) {
    var router = express.Router();

    // Default Route
    router.get('/', function(req, res, next) {
        res.render('index', {title: 'Welcome to ChatApp'});
    });

    // Middleware for securePages - if no Auth redirect to hm page
    function securePages(req, res, next) {
        if(req.isAuthenticated()) {
            next();
        }else {
            res.redirect('/');
        }
    }

    // Define the routes for Facebook Auth for login
    router.get('/auth/facebook', passport.authenticate('facebook'));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect:'/chatrooms',
        // need a error message popup, but for now just redirect to hm pg
        failureRedirect:'/'
    }));

    router.get('/chatrooms', securePages, function(req, res, next) {
        res.render('chatrooms', {title: 'Chatrooms', user:req.user, config:config});
    });

    // Chat Rooms routes with unique id for each room
    router.get('/room/:id', securePages, function(req, res, next) {
        var room_name = findTitle(req.params.id);
        res.render('room', {user:req.user, room_number:req.params.id, room_name:room_name, config:config});
    });

    // get room title/name and id of room
    function findTitle(room_id) {
        var n = 0;
        while(n < rooms.length) {
            if(rooms[n].room_number == room_id) {
                return rooms[n].room_name;
            }else {
                n++
                continue;
            }
        }
    }

    // Logout
    router.get('/logout', function(req, res, next) {
        req.logout();
        res.redirect('/');
    });

    app.use('/', router);
}
