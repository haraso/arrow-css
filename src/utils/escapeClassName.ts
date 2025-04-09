export function escapeClassName(className: string) {
  let escapedClassName = "";
  if (/^[0-9]/.test(className[0])) {
    escapedClassName += "\\3" + className[0] + " ";
  }
  for (
    let charIdx = escapedClassName.length > 0 ? 1 : 0;
    charIdx < className.length;
    charIdx++
  ) {
    const char = className[charIdx];
    if (/[0-9a-zA-Z]/.test(char)) {
      escapedClassName += char;
    } else {
      escapedClassName += "\\" + char;
    }
  }
  return escapedClassName;
}
