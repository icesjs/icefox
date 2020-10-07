/**
 * 判断传入的值是否是一个DOM元素。
 * @param obj 待判定的对象。
 * @returns {boolean}
 */
export function isElement(obj) {
  return (
    obj !== null &&
    typeof obj == 'object' &&
    typeof obj.tagName === 'string' &&
    obj.nodeType === 1
  )
}

/**
 * 判断一个对象是否是一个es6模块
 * @param obj 待判定的对象
 * @returns {boolean}
 */
export function isESModule(obj) {
  if (!obj || typeof obj !== 'object') {
    return false
  }
  const hasSymbol =
    typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol'
  return !!(
    obj.__esModule ||
    (hasSymbol && obj[Symbol.toStringTag] === 'Module')
  )
}

/**
 * 判定一个对象是否是一个普通对象。
 * @param val 需要判断的对象
 * @returns {boolean} 判定结果
 */
export function isPlainObject(val) {
  if (Object.prototype.toString.call(val) !== '[object Object]') {
    return false
  }
  const prototype = Object.getPrototypeOf(val)
  return prototype === null || prototype === Object.prototype
}
