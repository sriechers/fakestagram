export default function truncateString(str, n) {
  if (str.length > n) {
    return str.substring(0, n) + "…";
  } else {
    return str;
  }
}
