import Address from "../../models/address.model.js";
import { NotFoundError } from "../../utils/appError.js";

/* ======================================
   ADD ADDRESS
====================================== */
export const addAddressService = async (userId, addressData) => {

  if (addressData.isDefault) {
    await Address.updateMany(
      { user: userId, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  const address = await Address.create({
    ...addressData,
    user: userId,
  });

  return address;
};


/* ======================================
   GET ADDRESSES
====================================== */
export const getAddressesService = async (userId) => {

  const addresses = await Address
    .find({ user: userId })
    // .select('-user')
    // .populate({
    //   path: "user",
    //   select: "name email phone" // only required fields
    // })
    
    .sort({ createdAt: -1 });

  return addresses;
};



/* ======================================
   UPDATE ADDRESS
====================================== */
export const updateAddressService = async (
  userId,
  addressId,
  updateData
) => {

  if (updateData.isDefault === true) {
    await Address.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );
  }

  const updatedAddress = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedAddress) {
    throw new NotFoundError("Address not found");
  }

  return updatedAddress;
};



/* ======================================
   DELETE ADDRESS
====================================== */
export const deleteAddressService = async (
  userId,
  addressId
) => {

  const deleted = await Address.findOneAndDelete({
    _id: addressId,
    user: userId,
  });

  if (!deleted) {
    throw new NotFoundError("Address not found");
  }

  return true;
};
