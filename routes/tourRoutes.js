const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
// TOUR ROUTE MIDDLEWARES
router.use((req, res, next) => {
  next();
});
router.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
