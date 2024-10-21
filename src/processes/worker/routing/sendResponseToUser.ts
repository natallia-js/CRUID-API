import { ServerResponse } from "node:http";

export function sendResponseToUser(
  res: ServerResponse,
  data: any,
  reqMethod: string | null = null,
  statusCode: number | null = null,
) {
  res.setHeader("Content-Type", "application/json; charset=utf-8;");
  if (statusCode) {
    res.statusCode = statusCode;
  } else {
    switch (reqMethod) {
      case "GET":
      case "PUT":
        res.statusCode = 200;
        break;
      case "POST":
        res.statusCode = 201;
        break;
      case "DELETE":
        res.statusCode = 204;
        break;
      default:
        res.statusCode = 501;
        break;
    }
  }
  res.write(JSON.stringify(data));
  return res.end();
}

export default sendResponseToUser;
