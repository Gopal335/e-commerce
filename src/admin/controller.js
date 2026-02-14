import * as adminService from './service.js';
import asyncHandler from '../../middleware/asyncHandler.js';
import { sendUsersReportService } from './service.js';


 const getAllUsers = asyncHandler(async (req, res) => {

  const users = await adminService.fetchAllUsers();

  res.json({
    success:true,
    count: users.length,
    data: users
  });
});


const getUserById = asyncHandler(async (req, res) => {

  const user = await adminService.fetchUser(req.params.id);

  res.json({
    success:true,
    data:user
  });
});


const updateUser = asyncHandler(async (req, res) => {

  const updated = await adminService.updateUser(
    req.params.id,
    req.body
  );

  res.json({
    success:true,
    data:updated
  });
});


 const deleteUser = asyncHandler(async (req, res) => {

  await adminService.deleteUser(req.params.id);

  res.json({
    success:true,
    message:"User deleted"
  });
});

const createUser = asyncHandler(async (req, res) => {

  const user = await adminService.createUserByAdmin(req.body);

  res.status(201).json({
    success:true,
    data:user
  });
});

const sendUsersReportController = asyncHandler(
  async (req, res) => {

    await sendUsersReportService(req.user._id);

    res.status(200).json({
      success: true,
      message: "Users report sent to admin email",
    });

  }
);


// /* ======================================
//    PRODUCT MANAGEMENT (ADMIN)
// ====================================== */

// const createProduct = asyncHandler(async (req, res) => {

//   const product = await adminService.createProductByAdmin(
//     req.user._id,
//     req.body
//   );

//   res.status(201).json({
//     success: true,
//     data: product
//   });
// });


// const updateProduct = asyncHandler(async (req, res) => {

//   const product = await adminService.updateProductByAdmin(
//     req.params.id,
//     req.body
//   );

//   res.json({
//     success: true,
//     data: product
//   });
// });


// const deleteProduct = asyncHandler(async (req, res) => {

//   await adminService.deleteProductByAdmin(req.params.id);

//   res.json({
//     success: true,
//     message: "Product deleted successfully"
//   });
// });

export {getAllUsers, getUserById,updateUser,deleteUser, createUser, sendUsersReportController,
  //  createProduct,
  // updateProduct,
  // deleteProduct
}