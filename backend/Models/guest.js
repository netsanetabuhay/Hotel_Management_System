const { pool } = require('../Config/database');

// CREATE - Add new guest
const createGuest = async (guestData) => {
  const sql = `
    INSERT INTO guests 
      (guest_id, first_name, last_name, email, phone, address, created_at) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    guestData.guest_id,           // VARCHAR(20)
    guestData.first_name,         // VARCHAR(50)
    guestData.last_name,          // VARCHAR(50)
    guestData.email || null,      // VARCHAR(100) - can be null
    guestData.phone || null,      // VARCHAR(20) - can be null
    guestData.address || null,    // TEXT - can be null
    guestData.created_at || new Date()  // TIMESTAMP
  ];

  try {
    const [result] = await pool.query(sql, values);
    return { 
      success: true, 
      message: 'Guest created successfully',
      guestId: guestData.guest_id 
    };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Guest ID already exists');
    }
    throw error;
  }
};

// READ - Get all guests with filters
const findAllGuests = async (filters = {}) => {
  let sql = 'SELECT * FROM guests WHERE 1 = 1';
  const values = [];

  if (filters.first_name) {
    sql += ' AND first_name LIKE ?';
    values.push(`%${filters.first_name}%`);
  }
  
  if (filters.last_name) {
    sql += ' AND last_name LIKE ?';
    values.push(`%${filters.last_name}%`);
  }
  
  if (filters.email) {
    sql += ' AND email LIKE ?';
    values.push(`%${filters.email}%`);
  }
  
  if (filters.phone) {
    sql += ' AND phone LIKE ?';
    values.push(`%${filters.phone}%`);
  }

  sql += ' ORDER BY created_at DESC';

  try {
    const [rows] = await pool.query(sql, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

// READ - Get single guest by ID
const findGuestById = async (guest_id) => {
  const sql = 'SELECT * FROM guests WHERE guest_id = ?';
  
  try {
    const [rows] = await pool.query(sql, [guest_id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// READ - Get guest by email
const findGuestByEmail = async (email) => {
  const sql = 'SELECT * FROM guests WHERE email = ?';
  
  try {
    const [rows] = await pool.query(sql, [email]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// READ - Get guest by phone
const findGuestByPhone = async (phone) => {
  const sql = 'SELECT * FROM guests WHERE phone = ?';
  
  try {
    const [rows] = await pool.query(sql, [phone]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// UPDATE - Update guest details

// const updateGuest = async (guest_id, updateData) => {
//   // First, get current guest data
//   const currentGuest = await findGuestById(guest_id);
//   if (!currentGuest) {
//     return { 
//       success: false, 
//       message: 'Guest not found' 
//     };
//   }

//   const setClauses = [];
//   const values = [];
//   const checks = [];

//   // Check each field being updated
//   if (updateData.first_name !== undefined) {
//     if (updateData.first_name === currentGuest.first_name) {
//       checks.push('First name is the same as current');
//     } else {
//       setClauses.push('first_name = ?');
//       values.push(updateData.first_name);
//     }
//   }
  
//   if (updateData.last_name !== undefined) {
//     if (updateData.last_name === currentGuest.last_name) {
//       checks.push('Last name is the same as current');
//     } else {
//       setClauses.push('last_name = ?');
//       values.push(updateData.last_name);
//     }
//   }
  
//   if (updateData.email !== undefined) {
//     const newEmail = updateData.email || null;
//     const currentEmail = currentGuest.email;
    
//     // Check 1: Must be different from current
//     if (newEmail === currentEmail) {
//       checks.push('Email is the same as current');
//     } 
//     // Check 2: Must be unique in entire table (if not null)
//     else if (newEmail !== null) {
//       const existingGuestWithEmail = await findGuestByEmail(newEmail);
//       if (existingGuestWithEmail && existingGuestWithEmail.guest_id !== guest_id) {
//         checks.push('Email already exists for another guest');
//       } else {
//         setClauses.push('email = ?');
//         values.push(newEmail);
//       }
//     } else {
//       setClauses.push('email = ?');
//       values.push(null);
//     }
//   }
  
//   if (updateData.phone !== undefined) {
//     const newPhone = updateData.phone || null;
//     const currentPhone = currentGuest.phone;
    
//     // Check 1: Must be different from current
//     if (newPhone === currentPhone) {
//       checks.push('Phone is the same as current');
//     }
//     // Check 2: Must be unique in entire table (if not null)
//     else if (newPhone !== null) {
//       const existingGuestWithPhone = await findGuestByPhone(newPhone);
//       if (existingGuestWithPhone && existingGuestWithPhone.guest_id !== guest_id) {
//         checks.push('Phone already exists for another guest');
//       } else {
//         setClauses.push('phone = ?');
//         values.push(newPhone);
//       }
//     } else {
//       setClauses.push('phone = ?');
//       values.push(null);
//     }
//   }
  
//   if (updateData.address !== undefined) {
//     if (updateData.address === currentGuest.address) {
//       checks.push('Address is the same as current');
//     } else {
//       setClauses.push('address = ?');
//       values.push(updateData.address || null);
//     }
//   }

//   // If any checks failed
//   if (checks.length > 0) {
//     return { 
//       success: false, 
//       message: checks.join(', ') 
//     };
//   }

//   // If no fields to update
//   if (setClauses.length === 0) {
//     return { 
//       success: false, 
//       message: 'No fields provided for update' 
//     };
//   }

//   values.push(guest_id);

//   const sql = `
//     UPDATE guests 
//     SET ${setClauses.join(', ')} 
//     WHERE guest_id = ?
//   `;

//   try {
//     const [result] = await pool.query(sql, values);
    
//     return { 
//       success: result.affectedRows > 0,
//       message: result.affectedRows > 0 ? 'Guest updated successfully' : 'Guest not found',
//       affectedRows: result.affectedRows 
//     };
//   } catch (error) {
//     if (error.code === 'ER_DUP_ENTRY') {
//       if (error.message.includes('email')) {
//         throw new Error('Email already exists for another guest');
//       }
//       if (error.message.includes('phone')) {
//         throw new Error('Phone already exists for another guest');
//       }
//     }
//     throw error;
//   }
// };
// UPDATE - Update guest details (allow duplicates)
// const updateGuest = async (guest_id, updateData) => {
//   const setClauses = [];
//   const values = [];

//   // Add only the fields that are provided
//   if (updateData===first_name) {
//     setClauses.push('first_name = ?');
//     values.push(updateData.first_name);
//   }
  
//   if (updateData===last_name) {
//     setClauses.push('last_name = ?');
//     values.push(updateData.last_name);
//   }

//   if (updateData===email) {
//     setClauses.push('email = ?');
//     values.push(updateData.email || null);
//   }

//   if (updateData===phone) {
//     setClauses.push('phone = ?');
//     values.push(updateData.phone || null);
//   }

//   if (updateData===address) {
//     setClauses.push('address = ?');
//     values.push(updateData.address || null);
//   }

//   // If no fields to update
//   if (setClauses.length === 0) {
//     return { 
//       success: false, 
//       message: 'No fields provided for update' 
//     };
//   }

//   values.push(guest_id);

//   const sql = `
//     UPDATE guests 
//     SET ${setClauses.join(', ')} 
//     WHERE guest_id = ?
//   `;

//   try {
//     const [result] = await pool.query(sql, values);
    
//     return { 
//       success: result.affectedRows > 0,
//       message: result.affectedRows > 0 ? 'Guest updated successfully' : 'Guest not found',
//       affectedRows: result.affectedRows 
//     };
//   } catch (error) {
//     // Still catch duplicate errors but don't block them
//     console.error('Update error:', error);
//     return { 
//       success: false,
//       message: error.message || 'Database error during update'
//     };
//   }
// };
const updateGuest = async (guest_id, updateData) => {
  const setClauses = [];
  const values = [];

  // Destructure updateData
  const { first_name, last_name, email, phone, address } = updateData;

  // Add only the fields that are provided (not undefined)
  if (first_name !== undefined) {
    setClauses.push('first_name = ?');
    values.push(first_name);
  }
  
  if (last_name !== undefined) {
    setClauses.push('last_name = ?');
    values.push(last_name);
  }

  if (email !== undefined) {
    setClauses.push('email = ?');
    values.push(email || null); // Allow null
  }

  if (phone !== undefined) {
    setClauses.push('phone = ?');
    values.push(phone || null); // Allow null
  }

  if (address !== undefined) {
    setClauses.push('address = ?');
    values.push(address || null); // Allow null
  }

  // If no fields to update
  if (setClauses.length === 0) {
    return { 
      success: false, 
      message: 'No fields provided for update' 
    };
  }

  values.push(guest_id);

  const sql = `
    UPDATE guests 
    SET ${setClauses.join(', ')} 
    WHERE guest_id = ?
  `;

  try {
    const [result] = await pool.query(sql, values);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Guest updated successfully' : 'Guest not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    console.error('Update error:', error);
    return { 
      success: false,
      message: error.message || 'Database error during update'
    };
  }
};
// DELETE - Remove guest
const deleteGuest = async (guest_id) => {
  const sql = 'DELETE FROM guests WHERE guest_id = ?';
  
  try {
    const [result] = await pool.query(sql, [guest_id]);
    
    return { 
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Guest deleted successfully' : 'Guest not found',
      affectedRows: result.affectedRows 
    };
  } catch (error) {
    throw error;
  }
};

// READ - Search guests by name or email
const searchGuests = async (query) => {
  const sql = `
    SELECT * FROM guests 
    WHERE first_name LIKE ? 
    OR last_name LIKE ? 
    OR email LIKE ? 
    OR phone LIKE ?
    ORDER BY created_at DESC
  `;
  
  try {
    const [rows] = await pool.query(sql, [
      `%${query}%`,
      `%${query}%`, 
      `%${query}%`,
      `%${query}%`
    ]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// READ - Get guest statistics (total count)
const getGuestStats = async () => {
  const sql = `
    SELECT 
      COUNT(*) as total_guests,
      DATE(created_at) as date,
      COUNT(*) as daily_count
    FROM guests 
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) DESC
    LIMIT 30
  `;
  
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Literal exports
module.exports = {
  createGuest,
  findAllGuests,
  findGuestById,
  findGuestByEmail,
  findGuestByPhone,
  updateGuest,
  deleteGuest,
  searchGuests,
  getGuestStats
};