/**
 * Utility functions for expense splitting logic
 */

/**
 * Calculate equal split per member
 * @param {number} totalAmount
 * @param {Array<string>} memberIds
 * @returns {Object<string, number>} { [memberId]: amount }
 */
export const calculateEqualSplit = (totalAmount = 0, memberIds = []) => {
  const count = memberIds.length;
  if (count === 0 || !totalAmount) return {};
  
  const perPerson = Number((totalAmount / count).toFixed(2));
  const shares = {};
  
  // Calculate total allocated to handle rounding cents
  let allocated = 0;
  memberIds.forEach((id, index) => {
    if (index === memberIds.length - 1) {
      // Last person takes remainder to match exact sum
      shares[id] = Number((totalAmount - allocated).toFixed(2));
    } else {
      shares[id] = perPerson;
      allocated += perPerson;
    }
  });

  return shares;
};

/**
 * Validate custom split amounts sum up to total expense
 * @param {number} totalAmount
 * @param {Object<string, number>} customShares { [memberId]: amount }
 * @returns {{ isValid: boolean, sum: number, diff: number }}
 */
export const validateCustomSplit = (totalAmount = 0, customShares = {}) => {
  const sum = Object.values(customShares).reduce((acc, val) => acc + (Number(val) || 0), 0);
  const diff = Number((totalAmount - sum).toFixed(2));
  return {
    isValid: Math.abs(diff) <= 0.05,
    sum: Number(sum.toFixed(2)),
    diff
  };
};

/**
 * Calculate percentage split amounts
 * @param {number} totalAmount
 * @param {Object<string, number>} percentages { [memberId]: percentage }
 * @returns {Object<string, number>}
 */
export const calculatePercentageSplit = (totalAmount = 0, percentages = {}) => {
  const shares = {};
  Object.keys(percentages).forEach((id) => {
    const pct = Number(percentages[id]) || 0;
    shares[id] = Number(((totalAmount * pct) / 100).toFixed(2));
  });
  return shares;
};
