const throttleByRaf = func => {
  let lock = false

  return (...args) => {
    if (lock) {
      return
    }

    lock = true
    func(...args)

    requestAnimationFrame(() => {
      lock = false
    })
  }
}

export default throttleByRaf
