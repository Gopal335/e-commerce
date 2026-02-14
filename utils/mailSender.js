import transporter from "../config/transporter.js";

const mailSender = async (
  adminEmail,
  csvData,
  pdfBuffer
) => {

  try {

    const info = await transporter.sendMail({
      from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: "Users Report (CSV + PDF)",
      html: `
            <h2>Users Report</h2>
            <p>Please find the attached CSV and PDF files containing all users data.</p>
        `,
      attachments: [
        {
          filename: "users.csv",
          content: csvData,
        },
        {
          filename: "users.pdf",
          content: pdfBuffer,
        },
      ],
    });

    console.log("✅ Report Email Sent:", info.messageId);

  } catch (error) {
  console.error("❌ REAL MAIL ERROR:", error);
  throw error; // 🔥 do NOT create new error
}
};

export default mailSender;
