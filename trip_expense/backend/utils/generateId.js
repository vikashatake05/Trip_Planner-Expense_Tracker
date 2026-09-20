/**
 * Helper to generate simple unique IDs
 * @param {string} prefix
 * @returns {string}
 */
const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

module.exports = generateId;
