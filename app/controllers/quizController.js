const { Quiz, Tag, Question } = require('../models');

const quizzController = {

  quizzPage: async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await Quiz.findByPk(quizId,{
        include: [
          { association: 'author'},
          { association: 'questions', include: ['answers', 'level']},
          { association: 'tags'}
        ]
      });
      if(res.locals.user){
        res.render('play_quiz', {quiz});
      }
      else{
        res.render('quiz', {quiz});
      }
      
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  listByTag: async (req, res) => {
    // plutot que de faire une requete compliquée
    // on va passer par le tag, et laisser les relations de Sequelize faire le taf !
    try {
      const tagId = parseInt(req.params.id);
      const tag = await Tag.findByPk(tagId,{
        include: [{
          association: 'quizzes',
          include: ['author']
        }]
      });
      const quizzes = tag.quizzes;
      res.render('index', { quizzes });
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  //Méthode pour valider les réponses d'un quiz
  quizAction: async (req, res) => {
    try {
      
      //Recupération des réponses
      console.log(req.body);
      //req.body de la forme :
      // {
      //    question.id : answer.id
      //   1:'520',
      //   4:'58'
      // }
      let score=0;
      let questionNb=0;

      //Verif des réponses
      for(question_id in req.body){
        //Pour chaque question
        //1.J'extrais le numéro de la question
        console.log("Numero question", question_id);
        //2. J'extrais la réponse de l'uitlisateur
        const user_answer = req.body[question_id];
        console.log("REPONSE DE L'UTILISATEUR", user_answer);

        //Je vais chercher la bonne réponse 
        const questionBDD = await Question.findByPk(question_id);
        //console.log(questionBDD);
        const good_answer = questionBDD.answer_id;
        console.log("GOOD ANSWER", good_answer);

        questionNb++;
        //Si c'est bon, on incrémente le compteur
        if(user_answer==good_answer){
          score++;
        }

        
      }
      const quizId = parseInt(req.params.id);
        const quiz = await Quiz.findByPk(quizId,{
        include: [
          { association: 'author'},
          { association: 'questions', include: ['answers', 'level']},
          { association: 'tags'}
        ]
      });

        const userAnswers= req.body;
      
     
      res.render('score', { quiz, score, questionNb, userAnswers});

     
    }catch(err){
      console.error(err);
      res.status(500).send(err);
    }
  }

};

module.exports = quizzController;