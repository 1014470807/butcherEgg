'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt();
  router.get('/', controller.home.index);
  router.get('/info', controller.home.info);
  router.get('/student', controller.home.student);
  router.get('/lession', controller.home.lession);
  router.get('/lessionStudent', controller.home.lessionStudent);
  router.get('/article', controller.home.Tarticle);
  router.get('/codedata', controller.home.codedata);
  router.get('/testcodedata',jwt, controller.home.codedata);
  router.post('/register',controller.home.register);
  router.post('/login',controller.home.login);
  router.post('/collection',jwt,controller.home.collection);
  router.get('/getjinshi',controller.home.getjinshi);
  router.get('/getWeather',controller.home.getWeather);
  router.get('/getOpenId',controller.home.getOpenId);
  router.post('/getUserData',controller.home.getUserData);
  router.get('/getAccessToken',controller.home.getAccessToken);


  router.get('/getTodayAll',controller.home.getTodayAll);
  router.get('/getIndex',controller.home.getIndex);
  router.get('/getSinaDD',controller.home.getSinaDD);
  router.get('/getSinaIndustryClassified',controller.home.getSinaIndustryClassified);
  router.get('/getlhb',controller.home.getlhb);
  router.get('/getSinaClassifyDetails',controller.home.getSinaClassifyDetails);
  router.get('/getLiveData',controller.home.getLiveData);
  router.get('/getTodayTick',controller.home.getTodayTick);
  router.get('/getTradingNews',controller.home.getTradingNews);
};
