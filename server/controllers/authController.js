const User = require('../models/User');
const bcrypt = require ("bcryptjs")
const jwt = require ("jsonwebtoken");

exports.signup = async (req, res ) => {
  const { username, email, password } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) return res.status(400).json({ error: "Email already exists" });

  const usernameExists = await User.findOne({ username });
  if (usernameExists) return res.status(400).json({ error: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(201).json({
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};



exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne( { email });
    if (!user) return res.status(404).json({ message: "User Not found"});

    const match = await bcrypt.compare( password, user.password);
    if (!match) return res.status(401).json({message: "Incorrect password"});

    const token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    res.json({ token, user: {
        _id: user._id,
        username: user.username,
        email: user.email
    } });
}
     