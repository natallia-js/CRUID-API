function getURLParam(url: string, fullUrl: string) {
  return fullUrl.slice(url.length);
}

export default getURLParam;
