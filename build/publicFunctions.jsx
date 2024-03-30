export function removeTrailingZeros(number) {
  // Convert to string and use a regex to remove trailing zeros
  return number.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, "$1");
}
//0.21156100000000000000 => 0.211561
