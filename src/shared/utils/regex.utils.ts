export const regexPatterns = {
  email:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

  phoneVN: /^(?:\+84|0)(?:3|5|7|8|9)[0-9]{8}$/,

  phoneInternational: /^\+?[1-9]\d{6,14}$/,

  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,

  passwordStrong:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  passwordMedium: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,

  username: /^[a-zA-Z0-9_-]{3,20}$/,

  cccdVN: /^\d{12}$/,

  cmndVN: /^\d{9}$/,

  taxIdVN: /^\d{10,13}$/,

  dateYYYYMMDD: /^\d{4}-\d{2}-\d{2}$/,

  dateDDMMYYYY: /^\d{2}\/\d{2}\/\d{4}$/,

  decimal: /^-?\d+(\.\d+)?$/,

  integer: /^-?\d+$/,

  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,

  ipv6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,

  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,

  rgbColor: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,

  rgbaColor:
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0(\.\d+)?|1(\.0+)?)\s*\)$/,

  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,

  masterCard: /^5[1-5][0-9]{14}$/,

  amex: /^3[47][0-9]{13}$/,

  filename: /^[a-zA-Z0-9_\-. ]+$/,

  zipCodeVN: /^\d{6}$/,

  facebookId: /^[a-zA-Z0-9.]+$/,

  googleId: /^[a-zA-Z0-9-_]+$/,

  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  vnName: /^[\p{L}\s.]+$/u,

  latinOnly: /^[a-zA-Z\s]+$/,

  vietnameseIdCard: /^[0-9]{9}([0-9]{3})?$/,

  passport: /^[A-Z]{1,2}[0-9]{6,9}$/,

  twitterHandle: /^@?(\w){1,15}$/,

  instagramHandle: /^@?([a-zA-Z0-9_.]){1,30}$/,

  youtubeChannel: /^@?[\w-]{3,30}$/,

  nonWhitespace: /^\S+$/,

  whitespaceOnly: /^\s*$/,

  alphaNumeric: /^[a-zA-Z0-9]+$/,

  htmlTag: /<[^>]+>/,

  markdownHeading: /^#{1,6}\s/,

  timeHHMM: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,

  timeHHMMSS: /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,

  currencyVND: /^\d{1,3}(\.\d{3})*$/,

  ipv4CIDR:
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(3[0-2]|[12]?[0-9])$/,

  macAddress: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,

  queryParam: /[?&]+([^=]+)=([^&]*)/g,
} as const;

export default regexPatterns;
