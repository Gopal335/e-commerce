const validateSignup = (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // Check required fields
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  // // ✅ Phone: exactly 10 digits
  // const phoneRegex = /^[0-9]{10}$/;

  // if (!phoneRegex.test(phone)) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Phone number must be exactly 10 digits"
  //   });
  // }

  // // ✅ Gmail only
  // const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.com$/;


  // if (!emailRegex.test(email)) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Email must be a valid Gmail address"
  //   });
  // }

  // // ✅ Password rules:
  // // - 1 capital letter
  // // - 1 special character
  // // - at least 2 digits
  // // - minimum 8 characters

  // const passwordRegex =
  //   /^(?=(?:.*\d){2,})(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  // if (!passwordRegex.test(password)) {
  //   return res.status(400).json({
  //     success: false,
  //     message:
  //       "Password must be at least 8 characters and include 1 capital letter, 1 special character, and 2 digits"
  //   });
  // }

  next();
};

export default validateSignup;
