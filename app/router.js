const express = require('express');

// importer les controllers
const mainController = require('./controllers/mainController');
const quizController = require('./controllers/quizController');
const tagController = require('./controllers/tagController');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');

// importer les middlewares
const adminModule = require('./middlewares/admin');

const router = express.Router();

// page d'accueil
router.get('/', mainController.homePage);

// page "quizz"
router.get('/quiz/:id', quizController.quizzPage);
router.post('/quiz/:id', quizController.quizAction)

// page "tags" ("sujets")
router.get('/tags', tagController.tagList);

// quizzes par tag
router.get('/quizzes/tag/:id', quizController.listByTag);

// user signup/login
router.get('/signup', userController.signupPage);
router.get('/login', userController.loginPage);

router.post('/signup', userController.signupAction);
router.post('/login', userController.loginAction);

router.get('/disconnect', userController.disconnect);

router.get('/profile', userController.profilePage);

//ADMIN
//router.use('/admin', adminModule.hasAccess)
router.get('/admin', adminController.displayAllQuiz);
router.get('/admin/quiz/delete/:id', adminController.deleteQuizById);
router.get('/admin/addQuiz', adminController.addQuiz);
router.get('/admin/users', adminController.displayAllUsers);
router.get('/admin/users/:id/:role', adminController.setRole);

router.get('/admin/tags', adminController.displayAllTags);
router.post('/admin/tags', adminController.addTag);
router.get('/admin/updateTag/:id', adminController.updateTagPage);
router.post('/admin/updateTag/:id', adminController.updateTagAction);
module.exports = router;