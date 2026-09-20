/**
 * Utility to calculate member net balances and simplified debt settlement transfers.
 */

const calculateSettlement = (trip, tripExpenses) => {
  const members = trip.members || [];
  
  // Map member names by ID for easy lookup
  const nameMap = {};
  members.forEach((m) => {
    nameMap[m.id] = m.name || `User ${m.id}`;
  });

  // Track total paid and total share owed per user ID
  const paidMap = {};
  const shareMap = {};

  members.forEach((m) => {
    paidMap[m.id] = 0;
    shareMap[m.id] = 0;
  });

  // Process all trip expenses
  tripExpenses.forEach((exp) => {
    const amount = Number(exp.amount) || 0;
    const paidBy = exp.paidBy;

    if (paidMap[paidBy] !== undefined) {
      paidMap[paidBy] += amount;
    }

    const participants = exp.participants || members.map(m => m.id);
    const splits = exp.splits || {};

    if (Object.keys(splits).length > 0) {
      Object.keys(splits).forEach((userId) => {
        if (shareMap[userId] !== undefined) {
          shareMap[userId] += Number(splits[userId]) || 0;
        }
      });
    } else {
      // Fallback equal split
      const perPerson = participants.length > 0 ? amount / participants.length : 0;
      participants.forEach((userId) => {
        if (shareMap[userId] !== undefined) {
          shareMap[userId] += perPerson;
        }
      });
    }
  });

  // Calculate net balance for each member (paid - share)
  const balances = members.map((m) => {
    const paid = Number((paidMap[m.id] || 0).toFixed(2));
    const share = Number((shareMap[m.id] || 0).toFixed(2));
    const netBalance = Number((paid - share).toFixed(2));

    return {
      userId: m.id,
      name: m.name,
      paid,
      share,
      balance: netBalance
    };
  });

  // Debt Simplification Algorithm
  const debtors = [];
  const creditors = [];

  balances.forEach((b) => {
    if (b.balance < -0.01) {
      debtors.push({ userId: b.userId, name: b.name, amount: Math.abs(b.balance) });
    } else if (b.balance > 0.01) {
      creditors.push({ userId: b.userId, name: b.name, amount: b.balance });
    }
  });

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
        from: debtor.name,
        fromUserId: debtor.userId,
        to: creditor.name,
        toUserId: creditor.userId,
        amount: Number(transferAmount.toFixed(2))
      });
    }

    debtor.amount -= transferAmount;
    creditor.amount -= transferAmount;

    if (debtor.amount <= 0.01) i++;
    if (creditor.amount <= 0.01) j++;
  }

  return {
    balances,
    settlements
  };
};

module.exports = calculateSettlement;
