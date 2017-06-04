export function assert(msg, tst) {
  if (!tst) {
    throw new Error(msg);
  }
}
