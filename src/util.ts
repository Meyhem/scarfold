export default {
  lowercaseKeys(obj: any) {
    let key, keys = Object.keys(obj);
    let n = keys.length;
    let newobj: any = {}
    while (n--) {
      key = keys[n];
      newobj[key.toLowerCase()] = obj[key];
    }
    return newobj
  }
}