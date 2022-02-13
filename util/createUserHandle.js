export default function createUserHandle(username) {
  let name = username;
  name = name.toLowerCase();
  name = name.replaceAll(" ", "_");
  name = name.trim();
  return encodeURI(name);
}
