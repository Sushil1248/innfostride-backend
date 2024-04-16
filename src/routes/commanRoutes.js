const express = require('express');
const { getAllDomain } = require('../controllers/common/DomainOperation');
const { createEditNavigationItem, getAllNavigationItems, getNavigationItemById, quickEditNavItem } = require('../controllers/common/NavigationController');
const router = express.Router();

router.get('/get-all-domains',getAllDomain );
// API routes
router.post('/create-or-edit/navigation-items', createEditNavigationItem);
router.get('/navigation-items', getAllNavigationItems);
router.get('/navigation-items/:navigation_item_id', getNavigationItemById);
router.patch('/navigation-item-quick-edit/:id', quickEditNavItem);

module.exports = router;