const express = require('express');
const { 
  getAllClients, 
  getClientById, 
  deleteClient, 
  updateClientStatus 
} = require('../controllers/adminClientController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /admin/clients - Get all clients with profiles (admin only)
router.get('/', protect, isAdmin, getAllClients);

// GET /admin/clients/:id - Get client by ID with profile (admin only)
router.get('/:id', protect, isAdmin, getClientById);

// DELETE /admin/clients/:id - Delete client (admin only)
router.delete('/:id', protect, isAdmin, deleteClient);

// PUT /admin/clients/:id/status - Update client status (admin only)
router.put('/:id/status', protect, isAdmin, updateClientStatus);

module.exports = router;
