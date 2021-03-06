var inherits = require('inherit-class')
var assign = require('object-assign')
var texImage2D = require('./lib/tex-image-2d')
var TextureBase = require('./lib/Texture')
var getChannels = require('./lib/gl-format-channels')
var anArray = require('an-array')
var isDOMImage = require('is-dom-image')

module.exports = createTexture2D
function createTexture2D (gl, element, size, opt) {
  return new Texture2D(gl, element, size, opt)
}

function Texture2D (gl, element, size, opt) {
  // allow options to be second parameter
  if (element && !isDOMImage(element) && !anArray(element)) {
    opt = element
    size = null
    element = null
  }

  if (!Array.isArray(size)) {
    size = [1, 1]
  }

  TextureBase.call(this, gl, gl.TEXTURE_2D, opt)
  this.update(element, size)
}

inherits(Texture2D, TextureBase)

assign(Texture2D.prototype, {

  _upload: function _upload (data, size, offset, level) {
    this.bind()
    this.setPixelStorage()
    texImage2D(this, this.target, data, size, offset, level)
  },

  _reshape: function _reshape (size) {
    this.shape[0] = size[0]
    this.shape[1] = size[1]
    this.shape[2] = getChannels(this.gl, this.format)
  }
})
