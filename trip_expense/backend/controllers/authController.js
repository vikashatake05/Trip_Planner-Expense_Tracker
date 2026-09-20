const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.supabaseUser.id,
      email: req.supabaseUser.email,
      name: req.user.name
    }
  });
};

module.exports = { getCurrentUser };
