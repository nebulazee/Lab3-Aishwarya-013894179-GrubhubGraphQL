var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

const { Customer, Items, Orders, OrderDetails, Owner, Restaurant } = require('../MongoDB/Mongoose')


// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  var opts = {};
  //opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  console.log(opts.jwtFromRequest)
  opts.secretOrKey = "aishwaryaisagoodboy";//config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    Customer.findOne({id: jwt_payload.id}, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        Owner.findOne({id: jwt_payload.id},function(err,user){
          if(err) {
            return done(err, false);
          }
          if (user) {
            done(null, user);
          }
          else {
            done(null, false);
          }
        })
       // done(null, false);
      }
    });
  }));
};