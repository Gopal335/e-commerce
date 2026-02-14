import { Parser } from "json2csv";

const generateCsv = (users) => {

  const fields = ["name", "email", "phone", "createdAt"];

  const parser = new Parser({ fields });

  const csv = parser.parse(users);

  return Buffer.from(csv);
};

export default generateCsv;
