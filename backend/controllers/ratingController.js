const { Rating, Store } = require('../models');

exports.upsertRating = async (req, res, next) => {
  try {
    const { storeId, score } = req.body;
    const userId = req.user.id;

    // Check if the store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.'
      });
    }

    // Find existing rating or create a new one
    const [rating, created] = await Rating.findOrCreate({
      where: { userId, storeId },
      defaults: { score }
    });

    // If rating already existed, update its score
    if (!created) {
      rating.score = score;
      await rating.save();
    }

    return res.status(200).json({
      success: true,
      message: created ? 'Rating submitted successfully.' : 'Rating updated successfully.',
      data: rating
    });
  } catch (error) {
    next(error);
  }
};
