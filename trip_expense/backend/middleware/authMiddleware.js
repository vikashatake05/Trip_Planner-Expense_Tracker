const supabase = require('../config/supabase');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const token = header.slice(7).trim();
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ success: false, message: 'Invalid or expired token' });

    const supabaseUser = data.user;
    const name = supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'TripLedger User';
    const user = await User.findOneAndUpdate(
      { supabaseId: supabaseUser.id },
      { $set: { name, email: (supabaseUser.email || '').toLowerCase() } },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );

    req.user = user;
    req.supabaseUser = supabaseUser;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
