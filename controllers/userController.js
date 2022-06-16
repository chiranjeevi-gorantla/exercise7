const User = require("../models/user");

// get the user signUp form
exports.new = (req, res) => {
  res.render("./user/new");
};

//get the login form
exports.login = (req, res) => {
  res.render("./user/login");
};

// create a new user
exports.addingDetails = (req, res, next) => {
  let user = new User(req.body);
  user
    .save()
    .then(() => res.redirect("/users/login"))
    .catch((err) => {
      if (err.name === "ValidaionError") {
        req.flash("error", "err.message");
        return res.redirect("/users/new");
      }

      if (err.code === 11000) {
        req.flash("error", "Email address has been used");
        return res.redirect("/users/new");
      }
      next(err);
    });
};

//process login request
exports.validate = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        user.comparePassword(password).then((result) => {
          if (result) {
            req.session.user = user._id;
            req.flash("success", "You have successfuly logged in");
            res.redirect("/users/profile");
          } else {
            req.flash("error", "Wrong password");
            res.redirect("/users/login");
          }
        });
      } else {
        //console.log("Wrong email address");
        req.flash("error", "Wrong Email address");
        res.redirect("/users/login");
      }
    })
    .catch((err) => next(err));
};

//get the profile
exports.profile = (req, res, next) => {
  let id = req.session.user;
  User.findById(id)
    .then((user) => res.render("./user/profile", { user }))
    .catch((err) => next(err));
};

//logout the user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    else res.redirect("/users/login");
  });
};
