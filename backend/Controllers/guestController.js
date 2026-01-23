// Literal imports from Models
const {
  createGuest,
  findAllGuests,
  findGuestById,
  findGuestByEmail,
  findGuestByPhone,
  updateGuest,
  deleteGuest,
  searchGuests,
  getGuestStats
} = require('../Models/guest');

const { generateId } = require('../Utils/generateId');
const { sendSuccess, sendError } = require('../Utils/response');

// Create a new guest
const createGuestHandler = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address } = req.body;
    
    // Validation
    if (!first_name || !last_name) {
      return sendError(res, 'First name and last name are required', 400);
    }
    
    // Generate guest ID
    const guest_id = generateId('GUEST');
    
    // Create guest data object
    const guestData = {
      guest_id,
      first_name,
      last_name,
      email: email || null,
      phone: phone || null,
      address: address || null,
      created_at: new Date()
    };
    
    // Save to database
    const result = await createGuest(guestData);
    
    return sendSuccess(res, 'Guest created successfully', {
      guest_id,
      first_name,
      last_name,
      email: guestData.email,
      phone: guestData.phone,
      address: guestData.address,
      created_at: guestData.created_at
    }, 201);
    
  } catch (error) {
    console.error('Create guest error:', error);
    if (error.message.includes('already exists')) {
      return sendError(res, error.message, 409);
    }
    return sendError(res, 'Failed to create guest: ' + error.message, 500);
  }
};

// Get all guests (with optional filters)
const getAllGuests = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const filters = {
      first_name: req.query.first_name,
      last_name: req.query.last_name,
      email: req.query.email,
      phone: req.query.phone
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });
    
    const guests = await findAllGuests(filters);
    
    return sendSuccess(res, 'Guests retrieved successfully', {
      count: guests.length,
      guests
    });
    
  } catch (error) {
    console.error('Get all guests error:', error);
    return sendError(res, 'Failed to retrieve guests', 500);
  }
};

// Get single guest by ID
const getGuestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const guest = await findGuestById(id);
    
    if (!guest) {
      return sendError(res, 'Guest not found', 404);
    }
    
    return sendSuccess(res, 'Guest retrieved successfully', guest);
    
  } catch (error) {
    console.error('Get guest by ID error:', error);
    return sendError(res, 'Failed to retrieve guest', 500);
  }
};

// Get guest by email
const getGuestByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    const guest = await findGuestByEmail(email);
    
    if (!guest) {
      return sendError(res, 'Guest not found', 404);
    }
    
    return sendSuccess(res, 'Guest retrieved successfully', guest);
    
  } catch (error) {
    console.error('Get guest by email error:', error);
    return sendError(res, 'Failed to retrieve guest', 500);
  }
};

// Get guest by phone
const getGuestByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    
    const guest = await findGuestByPhone(phone);
    
    if (!guest) {
      return sendError(res, 'Guest not found', 404);
    }
    
    return sendSuccess(res, 'Guest retrieved successfully', guest);
    
  } catch (error) {
    console.error('Get guest by phone error:', error);
    return sendError(res, 'Failed to retrieve guest', 500);
  }
};


// const updateGuestHandler = async (req, res) => {
//   try {
//     const { identifier } = req.params;
//     const updateData = req.body;
//     console.log('Update data received:', updateData);
    
//     let existingGuest = null;
    
//     // Find guest by identifier
//     if (identifier.includes('@')) {
//       existingGuest = await findGuestByEmail(identifier);
//     } else if (/^\d+$/.test(identifier)) {
//       existingGuest = await findGuestByPhone(identifier);
//     } else {
//       existingGuest = await findGuestById(identifier);
//     }
    
//     if (!existingGuest) {
//       return res.status(404).json({
//         success: false,
//         message: 'Guest not found'
//       });
//     }
    
//     // Update guest (allow duplicates)
//     const result = await updateGuest(existingGuest.guest_id, updateData);
    
//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: result.message
//       });
//     }
    
//     // Get updated guest
//     const updatedGuest = await findGuestById(existingGuest.guest_id);
    
//     return res.json({
//       success: true,
//       message: 'Guest updated successfully',
//       data: updatedGuest
//     });
    
//   } catch (error) {
//     console.error('Update guest error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Server error updating guest'
//     });
//   }
// };


// Delete guest
const updateGuestHandler = async (req, res) => {
  try {
    const { identifier } = req.params;
    const updateData = req.body;
    //  console.log('=== REQUEST DEBUG ===');
    // console.log('Method:', req.method);
    // console.log('URL:', req.url);
    // console.log('Headers:', req.headers);
    // console.log('Raw body:', req.body);
    // console.log('Body type:', typeof req.body);
    // console.log('=== END DEBUG ===');
    // console.log('Update data received:', updateData);
    
    let existingGuest = null;
    
    // Find guest by identifier
    if (identifier.includes('@')) {
      existingGuest = await findGuestByEmail(identifier);
    } else if (/^\d+$/.test(identifier)) {
      existingGuest = await findGuestByPhone(identifier);
    } else {
      existingGuest = await findGuestById(identifier);
    }
    
    if (!existingGuest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }
    
    // Update guest
    const result = await updateGuest(existingGuest.guest_id, updateData);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
    // Get updated guest
    const updatedGuest = await findGuestById(existingGuest.guest_id);
    
    return res.json({
      success: true,
      message: 'Guest updated successfully',
      data: updatedGuest
    });
    
  } catch (error) {
    console.error('Update guest error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating guest'
    });
  }
};
const deleteGuestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if guest exists
    const existingGuest = await findGuestById(id);
    if (!existingGuest) {
      return sendError(res, 'Guest not found', 404);
    }
    
    // Delete guest
    const result = await deleteGuest(id);
    
    if (!result.success) {
      return sendError(res, 'Failed to delete guest', 400);
    }
    
    return sendSuccess(res, 'Guest deleted successfully', {
      guest_id: id,
      name: `${existingGuest.first_name} ${existingGuest.last_name}`
    });
    
  } catch (error) {
    console.error('Delete guest error:', error);
    return sendError(res, 'Failed to delete guest', 500);
  }
};

// Search guests
const searchGuestsHandler = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return sendError(res, 'Search query is required', 400);
    }
    
    const guests = await searchGuests(q);
    
    return sendSuccess(res, 'Search results retrieved successfully', {
      count: guests.length,
      query: q,
      guests
    });
    
  } catch (error) {
    console.error('Search guests error:', error);
    return sendError(res, 'Failed to search guests', 500);
  }
};

// Get guest statistics
const getGuestStatistics = async (req, res) => {
  try {
    const stats = await getGuestStats();
    
    // Calculate total guests
    const totalGuests = stats.reduce((total, stat) => total + parseInt(stat.daily_count), 0);
    
    return sendSuccess(res, 'Guest statistics retrieved successfully', {
      total_guests: totalGuests,
      daily_stats: stats
    });
    
  } catch (error) {
    console.error('Get guest statistics error:', error);
    return sendError(res, 'Failed to retrieve guest statistics', 500);
  }
};

// Literal exports
module.exports = {
  createGuest: createGuestHandler,
  getAllGuests,
  getGuestById,
  getGuestByEmail,
  getGuestByPhone,
  updateGuest: updateGuestHandler,
  deleteGuest: deleteGuestHandler,
  searchGuests: searchGuestsHandler,
  getGuestStatistics
};