let globalShim

if (typeof window !== 'undefined') {
  // browser环境
  globalShim = window
} else if (typeof global !== 'undefined') {
  // node环境
  globalShim = global
} else {
  globalShim = {}
}

export default globalShim
