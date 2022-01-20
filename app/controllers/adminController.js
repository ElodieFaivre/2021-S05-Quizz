
const dotenv = require('dotenv');
dotenv.config();

const {
  Quiz, User, Tag, Level

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


  //Page pour choisir un tag à ajouter au QUIZ
  async addTagToQuizPage(req, res) {
    try {
      tagList = await Tag.findAll({ order: ['name'] });
    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }
    res.render('admin/addTagToQuiz', {
      tagList
    });
  },

  //Ajout du tag (formulaire)
  async addTagToQuizAction(req, res) {
    console.log(req.body.tag);
    try {
      const quiz = await Quiz.findByPk(req.params.id);
      const tag = await Tag.findByPk(req.body.tag);
      await quiz.addTag(tag);
    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }
    res.redirect('/admin');

  },

  /************************USERS*********************** */

  //1.Affichage de la page users
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

  //2. Changement du role du user
  // L'inscription est géré par l'utilisatuer, voir userController
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


  /************************TAG*********************** */
  //TAG
  //1.Affihcage de la page tags
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

  //2. AJOUT d'un tag (formulaire, MAJ BDD)
  async addTag(req, res) {
    const newTag = Tag.build({ "name": req.body.tagName });

    try {
      await newTag.save();
    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }
    res.redirect('./tags');


  },

  //3. Modif d'un tag (affichage de la page)
  async updateTagPage(req, res) {

    const id = req.params.id;
    let tag = {};
    try {
      tag = await Tag.findByPk(id);
    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }
    res.render('admin/updateTag', { tag });


  },

  //4. Modif d'un tag (gestion du formulaire, et maj BDD)
  async updateTagAction(req, res) {

    const id = req.params.id;


    try {
      const tag = await Tag.findByPk(id);
      tag.name = req.body.tagName;
      await tag.save();
      console.log(tag);
    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }
    res.redirect('/admin/tags');


  },

  //5. Supression d'un tag
  async deleteTag(req, res) {
    try {
      const tagToDelete = await Tag.findByPk(req.params.id);


      // je supprime le level
      await tagToDelete.destroy();
    }
    catch (err) {
      console.error('Something went wrong', err);
    }

    return res.redirect('/admin/tags');
  },

  /************************LEVELS*********************** */
  //1. Affichage de la page levels
  async displayAllLevels(req, res) {
    try {
      levelList = await Level.findAll({ order: ['name'] });
    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }
    res.render('admin/levels', {
      levelList
    });
  },

  //2. AJOUT d'un level (formulaire, MAJ BDD)
  async addLevel(req, res) {

    try {
      //Je verif qu'il n'existe pas
      const existingLevel = await Level.findOne({
        where: {
          "name": req.body.levelName
        }
      });

      if (existingLevel) {
        return res.status(409).render('create_level', { error: 'Ce nom est déja pris par un autre niveau' });
      }

      //Je créé l'instance
      const newLevel = Level.build({ "name": req.body.levelName });
      //Je sauvegarde dans la BDD
      await newLevel.save();
    }
    catch (err) {
      console.error('Something went wrong on request', err);
    }
    res.redirect('/admin/levels');


  },

  //3. Supression d'un level
  async deleteLevel(req, res) {
    try {
      const levelToDelete = await Level.findByPk(req.params.id);


      // je supprime le level
      await levelToDelete.destroy();
    }
    catch (err) {
      console.error('Something went wrong', err);
    }

    return res.redirect('/admin/levels');
  }





}

module.exports = adminController;