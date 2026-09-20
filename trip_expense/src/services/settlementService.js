import api from './api';

export const getSettlement = async (tripId) => {
  try {
    const response = await api.get(`/settlements/${tripId}`);
    if (response.data?.success && response.data.data) {
      const result = response.data.data;
      return {
        balances: (result.balances || []).map((balance) => ({
          memberId: balance.userId,
          name: balance.name,
          paid: balance.paid,
          share: balance.share,
          netBalance: balance.balance
        })),
        settlements: (result.settlements || []).map((settlement) => ({
          fromId: settlement.fromUserId,
          fromName: settlement.from,
          toId: settlement.toUserId,
          toName: settlement.to,
          amount: settlement.amount
        }))
      };
    }

    throw new Error('Invalid settlement response');
  } catch (error) {
    throw new Error(`Unable to load settlement: ${error.message}`);
  }
};
