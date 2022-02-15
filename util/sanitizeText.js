import stripTags from "./stripTags";
export default function sanitizeText(input) {
  let s = input;
  s = s.replace(/<div>/g, "");
  s = s.replace(/<\/div>/g, "<br/>");
  s = stripTags(s, "<br>");
  return s.trim();
}
