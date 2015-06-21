var VolumeTexture = require('./lib/VolumeTexture')

module.exports = createTexture2DArray
function createTexture2DArray (gl, data, size, opt) {
  return new VolumeTexture(gl, gl.TEXTURE_2D_ARRAY, data, size, opt)
}
