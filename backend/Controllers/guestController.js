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

// Helper response functions
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

// ========== CREATE GUEST ==========
const createGuestHandler = async (req, res) => {
  try {
    const { first_name, email, last_name, phone, address } = req.body;
    
    // Only first_name and email required
    if (!first_name) {
      return sendError(res, 'First name is required', 400);
    }
    
    if (!email) {
      return sendError(res, 'Email is required', 400);
    }
    
    // Validate email format
    if (!email.includes('@')) {
      return sendError(res, 'Invalid email format', 400);
    }
    
    const guest_id = generateId('GUEST');
    const guestData = {
      guest_id,
      first_name,
      last_name: last_name || null,  // Optional
      email,
      phone: phone || null,          // Optional
      address: address || null,      // Optional
      created_at: new Date()
    };
    
    await createGuest(guestData);
    
    return sendSuccess(res, 'Guest created successfully', guestData, 201);
  } catch (error) {
    console.error('Create guest error:', error);
    if (error.message.includes('already exists')) {
      return sendError(res, error.message, 409);
    }
    return sendError(res, 'Failed to create guest: ' + error.message, 500);
  }
};

// ========== GET ALL GUESTS ==========
const getAllGuests = async (req, res) => {
  try {
    const filters = {
      first_name: req.query.first_name,
      last_name: req.query.last_name,
      email: req.query.email,
      phone: req.query.phone
    };
    
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) delete filters[key];
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



// ========== UNIVERSAL SEARCH ==========
// Handles ALL search types: ID, Email, Phone, Name
// const searchGuestsHandler = async (req, res) => {
//   try {
//     const { identifier } = req.params;
    
//     if (!identifier) {
//       return sendError(res, 'Search identifier is required', 400);
//     }
    
//     let guest = null;
    
//     // 1. Check if it's a guest_id (starts with GST)
//     if (identifier.startsWith('GST')) {
//       guest = await findGuestById(identifier);
//     }
//     // 2. Check if it's an email (contains @)
//     else if (identifier.includes('@')) {
//       guest = await findGuestByEmail(identifier);
//     }
//     // 3. Check if it's a phone number (only digits)
//     else if (/^\d+$/.test(identifier)) {
//       guest = await findGuestByPhone(identifier);
//     }
    
//     if (guest) {
//       return sendSuccess(res, 'Guest found successfully', guest);
//     }
    
//     return sendError(res, 'Guest not found', 404);
//   } catch (error) {
//     console.error('Search guests error:', error);
//     return sendError(res, 'Server error during search', 500);
//   }
// };
// Your current code:
// const searchGuestsHandler = async (req, res) => {
//   try {
//     const { identifier } = req.params;
//     console.log('Searching for:', identifier);
//     console.log('Type of identifier:', typeof identifier);
//     console.log('Starts with GST?:', identifier.startsWith('GST'));
//     console.log('Contains @?:', identifier.includes('@'));
//     console.log('Is only digits?:', /^\d+$/.test(identifier));
    
//     if (!identifier) {
//       return sendError(res, 'Search identifier is required', 400);
//     }
    
//     let guest = null;
    
//     // 1. Check if it's a guest_id (starts with GST)
//     if (identifier.startsWith('GST')) {
//       guest = await findGuestById(identifier);
//     }
//     // 2. Check if it's an email (contains @)
//     else if (identifier.includes('@')) {
//       guest = await findGuestByEmail(identifier);
//     }
//     // 3. Check if it's a phone number (only digits)
//     else if (/^\d+$/.test(identifier)) {
//       guest = await findGuestByPhone(identifier);
//     }
//     // MISSING: Name search logic!
    
//     if (guest) {
//       return sendSuccess(res, 'Guest found successfully', guest);
//     }
    
//     return sendError(res, 'Guest not found', 404);
//   } catch (error) {
//     console.error('Search guests error:', error);
//     return sendError(res, 'Server error during search', 500);
//   }
// };
// ========== UNIVERSAL SEARCH ==========
// Handles ALL search types: ID, Email, Phone, Name
const searchGuestsHandler = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Debug logs
    console.log('🔍 SEARCH DEBUG:');
    console.log('Identifier:', identifier);
    console.log('Starts with G?:', identifier.toUpperCase().startsWith('G'));
    console.log('Contains @?:', identifier.includes('@'));
    console.log('Is only digits?:', /^\d+$/.test(identifier));
    
    if (!identifier) {
      return sendError(res, 'Search identifier is required', 400);
    }
    
    let guest = null;
    
    // 1. Check if it's a guest_id (starts with G - case insensitive)
    if (identifier.toUpperCase().startsWith('G')) {
      console.log(' Trying ID search...');
      guest = await findGuestById(identifier);
      console.log('ID search result:', guest ? 'FOUND' : 'NOT FOUND');
    }
    // 2. Check if it's an email (contains @)
    else if (identifier.includes('@')) {
      console.log(' Trying email search...');
      guest = await findGuestByEmail(identifier);
      console.log('Email search result:', guest ? 'FOUND' : 'NOT FOUND');
    }
    // 3. Check if it's a phone number (only digits)
    else if (/^\d+$/.test(identifier)) {
      console.log(' Trying phone search...');
      guest = await findGuestByPhone(identifier);
      console.log('Phone search result:', guest ? 'FOUND' : 'NOT FOUND');
    }
    
    // If found by ID/email/phone, return it
    if (guest) {
      return sendSuccess(res, 'Guest found successfully', guest);
    }
    
    // 4. Try name search (for everything else, including names)
    console.log(' Trying name search...');
    // IMPORTANT: You need to import 'searchGuests' from your model!
    // Check if it's imported at the top:
    const guestsByName = await searchGuests(identifier);
    console.log('Name search result count:', guestsByName.length);
    
    if (guestsByName.length > 0) {
      return sendSuccess(res, 'Guests found by name', {
        count: guestsByName.length,
        guests: guestsByName
      });
    }
    
    console.log(' No results found for:', identifier);
    return sendError(res, 'Guest not found', 404);
    
  } catch (error) {
    console.error(' Search guests error:', error);
    return sendError(res, 'Server error during search', 500);
  }
};

// ========== UPDATE GUEST ==========
const updateGuestHandler = async (req, res) => {
  try {
    const { identifier } = req.params;
    const updateData = req.body;
    
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
      return sendError(res, 'Guest not found', 404);
    }
    
    const result = await updateGuest(existingGuest.guest_id, updateData);
    
    if (!result.success) {
      return sendError(res, result.message, 400);
    }
    
    const updatedGuest = await findGuestById(existingGuest.guest_id);
    return sendSuccess(res, 'Guest updated successfully', updatedGuest);
  } catch (error) {
    console.error('Update guest error:', error);
    return sendError(res, 'Server error updating guest', 500);
  }
};

// ========== DELETE GUEST ==========
const deleteGuestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingGuest = await findGuestById(id);
    
    if (!existingGuest) {
      return sendError(res, 'Guest not found', 404);
    }
    
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

// ========== GET GUEST STATISTICS ==========
const getGuestStatistics = async (req, res) => {
  try {
    const stats = await getGuestStats();
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

// ========== EXPORTS ==========
module.exports = {
  createGuest: createGuestHandler,
  getAllGuests,
  updateGuest: updateGuestHandler,
  deleteGuest: deleteGuestHandler,
  searchGuests: searchGuestsHandler,  // ← This handles ALL searches
  getGuestStatistics
};