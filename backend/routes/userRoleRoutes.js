const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');

router.get('/', userRoleController.getAllUserRoles);
router.get('/:id_user/:id_role', userRoleController.getUserRole);
router.post('/', userRoleController.createUserRole);
router.delete('/:id_user/:id_role', userRoleController.deleteUserRole);

module.exports = router;