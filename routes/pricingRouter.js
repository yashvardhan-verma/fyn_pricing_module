const express = require('express');
const pricingController = require('../controllers/pricingController')
const { verifyToken } = require('../middleware/verifyJWT')
const router = express.Router()


router.get('/config', verifyToken, pricingController.getallConfig);
router.post('/config', verifyToken, pricingController.createConfig);

// router.patch('/distance-additional-price/:id', verifyToken, pricingController.updateDistanceAdditionalPrice);
router.patch('/distance-base-price', verifyToken, pricingController.updateDistanceBasePrice);
router.patch('/update-pricing-config', verifyToken, pricingController.updatePricingConfig);
router.patch('/time-multiplier-factor', verifyToken, pricingController.updateTimeMultiplierFactor);
router.patch('/waiting-charges', verifyToken, pricingController.updateWaitingCharges);

router.get('/calculate', verifyToken, pricingController.calculatePrice);

module.exports = router