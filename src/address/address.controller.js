import {
  addAddressService,
  getAddressesService,
  updateAddressService,
  deleteAddressService
} from "./address.service.js";

import asyncHandler from '../../middleware/asyncHandler.js';

/* ======================================
   ADD ADDRESS
====================================== */
export const addAddress = asyncHandler(async (req, res) => {
  const address = await addAddressService(
    req.user._id,
    req.body
  );

  res.status(201).json({
    success: true,
    address,
  });
});


/* ======================================
   GET MY ADDRESSES
====================================== */
export const getMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await getAddressesService(
    req.user._id
  );

  res.status(200).json({
    success: true,
    addresses,
  });
});


/* ======================================
   UPDATE ADDRESS
====================================== */
export const updateAddress = asyncHandler(async (req, res) => {
  const address = await updateAddressService(
    req.user._id,
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    address,
  });
});


/* ======================================
   DELETE ADDRESS
====================================== */
export const deleteAddress = asyncHandler(async (req, res) => {
  await deleteAddressService(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});
