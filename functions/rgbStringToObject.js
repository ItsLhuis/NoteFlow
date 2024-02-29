export const rgbStringToObject = (rgbString) => {
  const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/
  const match = rgbString.match(regex)

  if (match) {
    const [, r, g, b] = match
    return `${parseInt(r)}, ${parseInt(g)}, ${parseInt(b)}`
  } else {
    return rgbString
  }
}
