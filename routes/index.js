var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const upload = require("./multer");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { nav: false });
});
/* GET register page. */
router.get("/register", function (req, res, next) {
  res.render("register", { nav: false });
});
/* GET profile page. */
router.get("/profile", isLoggedIn, async function (req, res, next) {
  let user = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("posts");
  // console.log(user.posts)
  res.render("profile", { user, nav: true });
});

/* GET show post page. */
router.get("/show/posts", isLoggedIn, async function (req, res, next) {
  let user = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("posts");
  res.render("show", { user, nav: true });
});

/* GET feed page. */
router.get("/feed", isLoggedIn, async function (req, res, next) {
  let user = await userModel.findOne({
    username: req.session.passport.user,
  });
  let posts = await postModel.find().populate('user')
  res.render('feed', {user, posts, nav: true})
});

/* GET add page. */
router.get("/add", isLoggedIn, async function (req, res, next) {
  let user = await userModel.findOne({
    username: req.session.passport.user,
  });
  res.render("add", { user, nav: true });
});

/* Create add Post. */
router.post(
  "/createpost",
  isLoggedIn,
  upload.single("postImage"),
  async function (req, res, next) {
    let user = await userModel.findOne({
      username: req.session.passport.user,
    });
    let post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename,
    });

    user.posts.push(post.id);
    await user.save();
    res.redirect("/profile");
  }
);

/*  profile pic upload. */
router.post(
  "/fileupload",
  isLoggedIn,
  upload.single("image"),
  async function (req, res, next) {
    let user = await userModel.findOne({ username: req.session.passport.user });
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/profile");
  }
);

/* create register function. */
router.post("/register", async function (req, res, next) {
  let data = new userModel({
    username: req.body.username,
    fullName: req.body.fullname,
    email: req.body.email,
    contact: req.body.contact,
  });
  userModel.register(data, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

/* create login function. */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }),
  function (req, res, next) {}
);

/* create logout function. */
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
