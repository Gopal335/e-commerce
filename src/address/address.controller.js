import {
  addAddressService,
  getAddressesService,
  updateAddressService,
  deleteAddressService
} from "./address.service.js";

import asyncHandler from "express-async-handler";
import { successResponse } from "../../utils/apiResponse.js"; 

 const addAddress = asyncHandler(async (req, res) => {
  const address = await addAddressService( req.user._id, req.body ); 
  return successResponse( 201, res, "Address added successfully", address );
}); 

 const getMyAddresses = asyncHandler(async (req, res) => {
   const addresses = await getAddressesService( req.user._id );
   return successResponse( 200, res, "Addresses fetched successfully", addresses ); 
});

 const updateAddress = asyncHandler(async (req, res) => {
  const address = await updateAddressService( req.user._id, req.params.id, req.body );
  return successResponse( 200, res, "Address updated successfully", address );
});

 const deleteAddress = asyncHandler(async (req, res) => {
   await deleteAddressService( req.user._id, req.params.id );
   return successResponse( 200, res, "Address deleted successfully", null );
});

export {
  addAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress
};