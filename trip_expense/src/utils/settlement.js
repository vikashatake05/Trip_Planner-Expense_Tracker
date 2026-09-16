/**
 * Debt Minimization Settlement Engine for TripLedger.
 * Minimizes unnecessary transaction transfers between group members.
 */

/**
 * Calculate net balance for each member in a trip based on all expenses
 * @param {Array} expenses List of expense objects
 * @param {Array} members List of trip member objects
 * @returns {Array<{ memberId: string, name: string, paid: number, share: number, netBalance: number }>}
 */
export const calculateBalances = (expenses = [], members = []) => {
  const memberMap = {};

  // Initialize members map
  members.forEach((m) => {
    const id = m.userId || m.id;
    memberMap[id] = {
      memberId: id,
      name: m.name || m.email || 'Member',
      paid: 0,
      share: 0,
      netBalance: 0
    };
  });

  if (!Array.isArray(expenses)) return Object.values(memberMap);

  expenses.forEach((exp) => {
    const totalAmount = Number(exp.amount) || 0;
    const payerId = exp.paidById || exp.paidBy;

    // Add to payer's total paid
    if (memberMap[payerId]) {
      memberMap[payerId].paid += totalAmount;
    } else {
      // Fallback if payer match by name
      const foundPayer = Object.values(memberMap).find((m) => m.name === payerId);
      if (foundPayer) foundPayer.paid += totalAmount;
    }

    // Calculate split share owed by each member
    const splitBetween = exp.splitBetween || members.map(m => m.userId || m.id);
    const splitShares = exp.splitShares || {};

    if (Object.keys(splitShares).length > 0) {
      Object.keys(splitShares).forEach((id) => {
        if (memberMap[id]) {
          memberMap[id].share += Number(splitShares[id]) || 0;
        }
      });
    } else {
      // Equal split fallback
      const perPerson = splitBetween.length > 0 ? totalAmount / splitBetween.length : 0;
      splitBetween.forEach((id) => {
        if (memberMap[id]) {
          memberMap[id].share += perPerson;
        }
      });
    }
  });

  // Calculate net balances (paid - share)
  return Object.values(memberMap).map((m) => {
    const paid = Number(m.paid.toFixed(2));
    const share = Number(m.share.toFixed(2));
    const netBalance = Number((paid - share).toFixed(2));
    return {
      ...m,
      paid,
      share,
      netBalance
    };
  });
};

/**
 * Greedy Debt Minimization Algorithm to generate minimum required transfer payments
 * @param {Array} balances Summary balance list from calculateBalances
 * @returns {Array<{ fromId: string, fromName: string, toId: string, toName: string, amount: number }>}
 */
export const calculateSettlements = (balances = []) => {
  const debtors = [];
  const creditors = [];

  balances.forEach((b) => {
    if (b.netBalance < -0.01) {
      debtors.push({ ...b, amount: Math.abs(b.netBalance) });
    } else if (b.netBalance > 0.01) {
      creditors.push({ ...b, amount: b.netBalance });
    }
  });

  // Sort debtors & creditors descending
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const transferAmount = Math.min(debtor.amount, creditor.amount);
    
    if (transferAmount > 0.01) {
      settlements.push({
        fromId: debtor.memberId,
        fromName: debtor.name,
        toId: creditor.memberId,
        toName: creditor.name,
        amount: Number(transferAmount.toFixed(2))
      });
    }

    debtor.amount -= transferAmount;
    creditor.amount -= transferAmount;

    if (debtor.amount <= 0.01) i++;
    if (creditor.amount <= 0.01) j++;
  }

  return settlements;
};
