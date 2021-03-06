var prop = require('dprop')
var defined = require('defined')
var assign = require('object-assign')
var noop = require('no-op')
var isPOT = require('is-power-of-two')

module.exports = Texture
function Texture (gl, target, opt) {
  opt = opt || {}

  this.gl = gl
  this.format = opt.format || gl.RGBA
  this.compressed = Boolean(opt.compressed)
  this.type = opt.type || gl.UNSIGNED_BYTE
  this.flipY = Boolean(opt.flipY)
  this.unpackAlignment = defined(opt.unpackAlignment, 1)
  this.premultiplyAlpha = Boolean(opt.premultiplyAlpha)
  this.handle = gl.createTexture()
  this.target = target
  this.shape = [0, 0, 4]

  this._wrap = []
  this._minFilter = null
  this._magFilter = null
  this._mipSamples = 1

  this.minFilter = defined(opt.minFilter, gl.NEAREST)
  this.magFilter = defined(opt.magFilter, gl.NEAREST)
  this.wrap = defined(opt.wrap, gl.CLAMP_TO_EDGE)
  this.mipSamples = defined(opt.mipSamples, 1)
}

Object.defineProperties(Texture.prototype, {

  wrap: prop(function () {
    return this._wrap
  }, function (modes) {
    if (!Array.isArray(modes)) {
      modes = [ modes, modes ]
    }

    if (modes.length !== 2) {
      throw new Error('must specify wrapS, wrapT modes')
    }

    var gl = this.gl
    this.bind()
    this._wrap[0] = modes[0]
    this._wrap[1] = modes[1]
    gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, modes[0])
    gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, modes[1])
  }),

  // anisotropic filtering
  mipSamples: prop(function () {
    return this._mipSamples
  }, function (samples) {
    var old = this._mipSamples
    this._mipSamples = Math.max(samples, 1) | 0
    if (old !== this._mipSamples) {
      var gl = this.gl
      var ext = gl.getExtension('EXT_texture_filter_anisotropic')
      if (ext) {
        gl.texParameterf(this.target, ext.TEXTURE_MAX_ANISOTROPY_EXT, this._mipSamples)
      }
    }
  }),

  minFilter: prop(function () {
    return this._minFilter
  }, function (filter) {
    var gl = this.gl
    this._minFilter = filter
    this.bind()
    gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, filter)
  }),

  magFilter: prop(function () {
    return this._magFilter
  }, function (filter) {
    var gl = this.gl
    this._magFilter = filter
    this.bind()
    gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, filter)
  }),

  width: prop(function () {
    return this.shape[0]
  }),

  height: prop(function () {
    return this.shape[1]
  }),

  depth: prop(function () {
    return 1
  }),

  channels: prop(function () {
    return this.shape[2]
  })
})

assign(Texture.prototype, {

  _upload: noop,
  _reshape: noop,

  dispose: function dispose () {
    this.gl.deleteTexture(this.handle)
    return this
  },

  setPixelStorage: function setPixelStorage () {
    var gl = this.gl
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, this.unpackAlignment)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY)
    return this
  },

  bind: function bind (slot) {
    var gl = this.gl
    var target = this.target
    if (typeof slot === 'number') {
      gl.activeTexture(gl.TEXTURE0 + slot)
    }
    gl.bindTexture(target, this.handle)
    return this
  },

  generateMipmap: function generateMipmap () {
    this.bind()
    if (isNPOT(this.width) || isNPOT(this.height)) {
      console.warn('Mipmapping not supported for non-power of ' +
        'two texture size', this.width + 'x' + this.height)
    }
    this.gl.generateMipmap(this.target)
    return this
  },

  update: function update (data, shape, level) {
    if (!Array.isArray(shape)) {
      throw new Error('must provide shape array to texture')
    }

    if (!level) {
      // reshape the texture if level zero / undefined
      this._reshape(shape)
      shape = this.shape
    }

    this._upload(data, shape, null, level)
    return this
  },

  updateSubImage: function updateSubImage (data, shape, offset, level) {
    if (!Array.isArray(shape)) {
      throw new Error('must provide shape array to texture')
    }
    if (!Array.isArray(offset)) {
      throw new Error('must provide offset array to texture updateSubImage')
    }

    this._upload(data, shape, offset, level)
    return this
  }
})

function isNPOT (n) {
  return (!isPOT(n) || n === 0) && n >= 0
}
