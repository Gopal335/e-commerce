import PDFDocument from "pdfkit";

const generatePdf = (users) => {

  return new Promise((resolve) => {

    const doc = new PDFDocument();

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.fontSize(18).text("Users Report", { align: "center" });

    doc.moveDown();

    users.forEach((user, index) => {

      doc
        .fontSize(12)
        .text(
          `${index + 1}.
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}
Joined: ${user.createdAt}
`
        );

      doc.moveDown();
    });

    doc.end();
  });
};

export default generatePdf;
