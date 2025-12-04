import { AsyncParser } from "@json2csv/node";

export const exportToCsv = async (data = [], fields = []) => {
  try {
    const parser = new AsyncParser({ fields });
    // .parse returns stream wrapper; .promise() returns final CSV string
    return parser.parse(data).promise();
  } catch (err) {
    console.error("CSV export failed:", err);
    throw new Error("Failed to export CSV");
  }
};
