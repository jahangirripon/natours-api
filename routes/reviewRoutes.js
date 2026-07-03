const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(reviewController.createReview);

router.use((req, res, next) => {
  next();
});
router.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    reviewController.deleteReview,
  );

module.exports = router;
