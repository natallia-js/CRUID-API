import { IncomingMessage } from "node:http";
import url from "url";

export function getReqRenormalized(normalizedUrl: string) {
  if (normalizedUrl?.endsWith("/"))
    return normalizedUrl.slice(0, normalizedUrl.length - 1);
  return normalizedUrl;
}

function getReqURLNormalized(req: IncomingMessage) {
  let normalizedUrl = url.parse(req.url || "").pathname;
  if (!normalizedUrl?.endsWith("/")) normalizedUrl += "/";
  return normalizedUrl;
}

export default getReqURLNormalized;
