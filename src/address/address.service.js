import Address from "../../models/address.model.js";
import { NotFoundError } from "../../utils/appError.js";

const addAddressService = async (userId, addressData) => {
  if (addressData.isDefault) {
    await Address.updateMany(
      { userId, isDefault: { $ne: false } },
      { $set: { isDefault: { $ne: true } } }
    );
  }
  const address = await Address.create({
    ...addressData,
    userId
  })
  return address;
};


const getAddressesService = async (userId) => {
  const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
  return addresses;
};


const updateAddressService = async (userId, addressId, updateData) => {
  if (updateData.isDefault === true) {
    await Address.updateMany(
      { userId },
      { $set: { isDefault: false } }
    );
  }
  const updatedAddress = await Address.findOneAndUpdate(
    { _id: addressId, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!updatedAddress) {
    throw new NotFoundError("Address not found");
  }
  return updatedAddress;
};

const deleteAddressService = async (userId, addressId) => {
  const deleted = await Address.findOneAndDelete({
    _id: addressId,
    userId
  });
  if (!deleted) {
    throw new NotFoundError("Address not found");
  }
  return true;
};

export{ deleteAddressService, updateAddressService, getAddressesService, addAddressService};