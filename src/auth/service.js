import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import generateToken from '../../utils/generateToken.js';

const registerUser = async ({ name, email, phone, password, role }) => {

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role
  });


  console.log("✅ New User Registered:");
  console.log({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt
  });


  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
  
};


 const loginUser = async (email, password) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

   console.log("🔥 User Logged In:");
  console.log({
    id: user._id,
    email: user.email,
    time: new Date().toISOString()
  });


  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  };
  
};


export {registerUser, loginUser};