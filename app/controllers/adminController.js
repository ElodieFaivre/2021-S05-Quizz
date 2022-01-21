
const dotenv = require('dotenv');

dotenv.config();


const {
  Quiz, User, Tag, Level, Answer

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
      res.status(500).send(err);
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
      await quiz.destroy();

    }


    catch (err) {
      console.error('Something went wrong on destroy', err);
      res.status(500).send(err);
    }

    res.redirect("/admin");
  },


  //Page pour ajouter un QUIZ
  async addQuiz(req, res) {
    try {
      const tags = await Tag.findAll();
      const users = await User.findAll();

      res.render("admin/addQuiz", { tags, users });
    }
    catch (err) {
      console.error('Something went wrong on destroy', err);
      res.status(500).send(err);
    }

  },

  //Traitement formulaire ajouter un QUIZ
  async addQuizAction(req, res) {
    try {
      console.log(req.body);
      //console.log(parseInt(req.body.isGoodAnswer));
      // for(const i=0; i<4;i++){
      //   const newAnswer = await Answer.create({
      //      "description":`req.body.reponse_${i}`
      //   });
      // }
      // const newQuestion = await Question.create({
      //   "question":req.body.question,

      // });

      const author = await User.findByPk(req.body.userID);

      const quiz = await Quiz.build({
        "title": req.body.quiz_title,
        "description": req.body.quiz_description,
      });
      
      //console.log(quiz);
      //console.log(author);

      await quiz.setUser(author);

      console.log(Quiz);
      await quiz.save();
      


      // console.log(quiz);
      // const tagsArray = req.body.tags;
      // const tags = await Tag.findAll({
      //   where: { id: tagsArray }
      // });
      // await quiz.setTags(tags);

      

      



    }
    catch (err) {
      console.error('Something went wrong on destroy', err);
      res.status(500).send(err);
    }

  },


  //Page pour choisir un tag à ajouter au QUIZ
  async addTagToQuizPage(req, res) {
    try {
      tagList = await Tag.findAll({ order: ['name'] });
    }
    catch (err) {
      console.error('Something went wrong on request', err);
      res.status(500).send(err);
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
      res.status(500).send(err);
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
      res.status(500).send(err);
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
      res.status(500).send(err);
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
      res.status(500).send(err);
    }
    res.render('admin/tags', {
      tagList
    });
  },

  //2. AJOUT d'un tag (formulaire, MAJ BDD)
  async addTag(req, res) {

    try {
      if (!req.body.tagName) {
        console.error('Le nom est obligatoire');
      }
      else {
        const newTag = Tag.build({ "name": req.body.tagName });
        console.log(newTag);
        await newTag.save();
      }
    }
    catch (err) {
      console.error('Something went wrong on request', err);
      res.status(500).send(err);
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
      res.status(500).send(err);
    }
    res.render('admin/updateTag', { tag });


  },

  //4. Modif d'un tag (gestion du formulaire, et maj BDD)
  async updateTagAction(req, res) {

    const id = req.params.id;


    try {

      const tag = await Tag.findByPk(id);

      if (!req.body.tagName || req.body.tagName == '') {
        res.render('admin/updateTag', { error: `Le nom du sujet est obligatoire` });
      }
      tag.name = req.body.tagName;
      await tag.save();
      console.log(tag);
    }
    catch (err) {
      console.error('Something went wrong on request', err);
      res.status(500).send(err);
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
      res.status(500).send(err);
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
      res.status(500).send(err);
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
        return res.status(409).render('admin/levels', { error: 'Ce nom est déja pris par un autre niveau' });
      }

      if (!req.body.levelName) {
        console.error('Le nom est obligatoire');
      }
      else {
        //Je créé l'instance
        const newLevel = Level.build({ "name": req.body.levelName });
        //Je sauvegarde dans la BDD
        await newLevel.save();

      }


    }
    catch (err) {
      console.error('Something went wrong on request', err);
      res.status(500).send(err);
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
      res.status(500).send(err);
    }

    return res.redirect('/admin/levels');
  }





}

module.exports = adminController;