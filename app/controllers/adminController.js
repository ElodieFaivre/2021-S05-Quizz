
const dotenv = require('dotenv');
dotenv.config();

const {
  Quiz, User, Tag

} = require('../models');

const adminController = {

  async displayAllQuiz(req, res) {
    const options = {
      include: ["author", "tags"],

    };

    let quizList = [];
    try {
      quizList = await Quiz.findAll(options);
    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }

    res.render('admin/index', {
      quizList
    });

  },


  async deleteQuizById(req, res) {
    const id = req.params.id;

    let quiz = [];
    try {
      quiz = await Quiz.findByPk(id);

    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }
    try {

      await quiz.destroy();
    }

    catch (err) {
      console.error('Something went wrong on destroy', err);
    }

    res.redirect("/admin");
  },



  async addQuiz(req, res) {
    res.render("admin/addQuiz");
  },

  async displayAllUsers(req, res) {
    try {
      userList = await User.findAll({ order: ['firstname'] });
    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }
    res.render('admin/users', {
      userList
    });
  },

  async setRole(req, res) {
    const role = req.params.role;
    const id = req.params.id;

    try {
      // je récupère l'utilisateur concerné
      const user = await User.findByPk(id);

      // je modifie le rôle
      user.role = role;

      // je sauvegarde en BDD
      await user.save();
    }
    catch (err) {
      console.error(err);
    }

    res.redirect("/admin/users");
  },

  async displayAllTags(req, res) {
    try {
      tagList = await Tag.findAll({ order: ['name'] });
    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }
    res.render('admin/tags', {
      tagList
    });
  },

  async addTag(req, res) {
    const newTag = Tag.build({ "name": req.body.tagName });

    try {
      await newTag.save();
    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }
    res.redirect('/tags');


  }










}

module.exports = adminController;