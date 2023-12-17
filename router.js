const express = require('express');
var router = express.Router();
const { body } = require('express-validator');
const validateToken = require("./middleware/validateToken");

const validateLoginForm = [
    body('username', 'Enter a valid email').isEmail(),
    body('userpassword', 'Password cannot be blank').exists(),
];

const validateBannerForm = [
    body('itemTitle').notEmpty().withMessage('Title is required'),
    body('itemDescription').notEmpty().withMessage('Description is required'),
    body('itemImage').notEmpty().withMessage('Please select an image'),
];

var loginController = require("./controllers/loginController")
router.get('/admin/create-user', loginController.createUser);
router.post('/admin/validate-user', validateLoginForm, loginController.validateUser);

var bannerController = require("./controllers/bannerController");
router.post('/admin/save-banner', validateToken, validateBannerForm, bannerController.saveBanner);
router.post('/admin/fetch-banner', validateToken, bannerController.fetchBanner);
router.post('/admin/fetch-each-banner', validateToken, bannerController.fetchEachBanner);
router.post('/admin/delete-banner', validateToken, bannerController.deleteBanner);

module.exports = router;