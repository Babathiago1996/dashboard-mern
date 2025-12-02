import { AsyncParser, NodeAsyncParser } from '@json2csv/node';

export const exportToCsv = async (data, fields) => {
  const parser = new AsyncParser({ fields });
  return parser.parseAsync(data);
};