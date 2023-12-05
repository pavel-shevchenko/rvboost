export function prefixUrlWithHttp(url: string) {
  if (url.indexOf("http") !== 0) return "http://" + url;
  else return url;
}

export function getFormData(data: Record<string, any>) {
  const fd = new FormData();
  for (const key in data) {
    if (!Array.isArray(data[key])) {
      fd.append(key, data[key]);
    } else {
      for (const dataEl of data[key]) {
        fd.append(key + "[]", dataEl);
      }
    }
  }
  return fd;
}

export const declOfNum = (
  value: number | string,
  words: [string, string, string]
) => {
  if (!value) value = 0;
  value = +value;
  value = Math.abs(value) % 100;
  var num = value % 10;
  if (value > 10 && value < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num == 1) return words[0];
  return words[2];
};
