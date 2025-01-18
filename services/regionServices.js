const pool = require('../config/database');

async function createRegion(regionName) {
  if (!regionName) {
    throw new Error('regionName is required');
  }

  try {
    const result = await pool.query(
      'INSERT INTO regions (name) VALUES ($1) RETURNING *',
      [regionName]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding region:', error.message);
    throw new Error('Error adding region');
  }
}


module.exports = {
  createRegion
};