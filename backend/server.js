const app = require('./app');
const Problem = require('./models/Problem');
const Goal = require('./models/Goal');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// GET /api/problems - return all problems
app.get('/api/problems', async (req, res) => {
  try {
    console.log("hello");
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching problems', error: err.message });
  }
});

// POST /api/problems - add a new problem
app.post('/api/problems', async (req, res) => {
  try {
    const { title, platform, link } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Problem title is required.' });
    }
    if (!platform || typeof platform !== 'string' || !platform.trim()) {
      return res.status(400).json({ message: 'Platform is required.' });
    }
    if (link && (typeof link !== 'string' || !/^https?:\/\//.test(link))) {
      return res.status(400).json({ message: 'If provided, link must be a valid URL.' });
    }
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ message: 'Error adding problem', error: err.message });
  }
});

// GET /api/goals - return all goals for the authenticated user (protected)
app.get('/api/goals', authenticateToken, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching goals', error: err.message });
  }
});

// POST /api/goals - add a new goal (protected)
app.post('/api/goals', authenticateToken, async (req, res) => {
  try {
    const { title, target_count, target_date } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Goal title is required.' });
    }
    if (!target_count || typeof target_count !== 'number' || target_count < 1) {
      return res.status(400).json({ message: 'Target count must be a positive number.' });
    }
    if (!target_date || typeof target_date !== 'string' || !target_date.trim()) {
      return res.status(400).json({ message: 'Target date is required.' });
    }
    const goalData = { title: title.trim(), target_count, target_date, current_count: 0, user: req.user.userId };
    const goal = new Goal(goalData);
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ message: 'Error adding goal', error: err.message });
  }
});

// PUT /api/goals/:id/increment - increment goal count
app.put('/api/goals/:id/increment', authenticateToken, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.userId });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    
    goal.current_count += 1;
    await goal.save();
    
    res.json(goal);
  } catch (err) {
    res.status(400).json({ message: 'Error incrementing goal', error: err.message });
  }
});

// PUT /api/goals/:id - update a goal
app.put('/api/goals/:id', async (req, res) => {
  try {
    const { title, target_count, target_date } = req.body;
    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({ message: 'Goal title is required.' });
    }
    if (target_count !== undefined && (typeof target_count !== 'number' || target_count < 1)) {
      return res.status(400).json({ message: 'Target count must be a positive number.' });
    }
    if (target_date !== undefined && (typeof target_date !== 'string' || !target_date.trim())) {
      return res.status(400).json({ message: 'Target date is required.' });
    }
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ message: 'Error updating goal', error: err.message });
  }
});

// DELETE /api/goals/:id - delete a goal
app.delete('/api/goals/:id', async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted', id: req.params.id });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting goal', error: err.message });
  }
});

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Server-side validation
    if (!username || typeof username !== 'string' || username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters.' });
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'A valid email is required.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    // Generate token for auto-login
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    // Return token and user info for auto-login
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { username: user.username, email: user.email, id: user._id }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    // Server-side validation
    if (!emailOrUsername || typeof emailOrUsername !== 'string') {
      return res.status(400).json({ message: 'Email or username is required.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    
    // Check if input is email or username
    const isEmail = /^\S+@\S+\.\S+$/.test(emailOrUsername);
    
    // Find user by email or username
    const user = await User.findOne(
      isEmail ? { email: emailOrUsername } : { username: emailOrUsername }
    );
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { username: user.username, email: user.email, id: user._id } });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Logout route (client should just delete token, but endpoint for completeness)
app.post('/api/auth/logout', (req, res) => {
  // No server-side session to destroy with JWT; just respond OK
  res.json({ message: 'Logged out' });
});

// GET /api/profile - get current user's profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      name: user.name || '',
      username: user.username,
      codeforces: user.codeforces || '',
      codechef: user.codechef || '',
      leetcode: user.leetcode || '',
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// PUT /api/profile - update current user's profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, username, password, oldPassword, codeforces, codechef, leetcode } = req.body;
    // If changing password, require oldPassword
    if (password) {
      if (!oldPassword) {
        return res.status(400).json({ message: 'Old password is required to change password.' });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Old password is incorrect.' });
      }
    }
    if (name !== undefined) user.name = name;
    if (username && username !== user.username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (codeforces !== undefined) user.codeforces = codeforces;
    if (codechef !== undefined) user.codechef = codechef;
    if (leetcode !== undefined) user.leetcode = leetcode;
    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// Example: GET /api/message
app.get('/api/message', (req, res) => {
  console.log("hello");
  res.json({ message: 'Hello from the backend!' });
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Global error handler (should be last middleware)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message || err });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
