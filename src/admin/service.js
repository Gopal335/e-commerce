import User from '../../models/User.js';
import generateCsv from '../../utils/generateCsv.js';
import generatePdf from '../../utils/generatePdf.js';
import mailSender from '../../utils/mailSender.js';
import Product from '../../models/Product.js';


 const fetchAllUsers = async () => {

  return await User
    .find({
    role: { $ne: 'admin' } // 🔥 exclude admins
  })
    .select('-password'); // NEVER send passwords
};



 const fetchUser = async (id) => {

  const user = await User
    .findById(id)
    .select('-password');

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};



 const updateUser = async (id, data) => {

  // Prevent role tampering
  delete data.role;
  delete data.password;

  const user = await User.findByIdAndUpdate(
    id,
    data,
    { new:true }
  ).select('-password');

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};



 const deleteUser = async (id) => {

  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === 'admin') {
    throw new Error("Cannot delete admin");
  }

  await user.deleteOne();
};

const createUserByAdmin = async (data) => {

  const { name, email, phone, password } = data;

  const exists = await User.findOne({ email });

  if (exists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'user' // 🔥 FORCE user role
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
};

const sendUsersReportService = async (adminId) => {

  const admin = await User.findById(adminId);

  if (!admin || admin.role !== "admin") {
    throw new Error("Unauthorized");
  }

  // ❗ exclude admins
  const users = await User.find({ role: { $ne: "admin" } })
    .select("-password");

  if (!users.length) {
    throw new Error("No users found");
  }

  const csvBuffer = generateCsv(users);

  const pdfBuffer = await generatePdf(users);

  await mailSender(admin.email, csvBuffer, pdfBuffer);

  return true;
};




// /* ======================================
//    CREATE PRODUCT (ADMIN)
// ====================================== */

// const createProductByAdmin = async (adminId, data) => {

//   const product = await Product.create({
//     ...data,
//     createdBy: adminId
//   });

//   return product;
// };


// /* ======================================
//    UPDATE PRODUCT (ADMIN)
// ====================================== */

// const updateProductByAdmin = async (productId, data) => {

//   const product = await Product.findById(productId);

//   if (!product) {
//     throw new Error('Product not found');
//   }

//   Object.keys(data).forEach(key => {
//     product[key] = data[key];
//   });

//   await product.save();

//   return product;
// };


// /* ======================================
//    DELETE PRODUCT (SOFT DELETE)
// ====================================== */

// const deleteProductByAdmin = async (productId) => {

//   const product = await Product.findById(productId);

//   if (!product) {
//     throw new Error('Product not found');
//   }

//   product.isActive = false;

//   await product.save();

//   return true;
// };




export{fetchAllUsers, fetchUser,updateUser, deleteUser, createUserByAdmin, sendUsersReportService,  
  // createProductByAdmin,
  // updateProductByAdmin,
  // deleteProductByAdmin
}