var test = require('tape')
var createTexture3D = require('../3d')
var createTexture2DArray = require('../2d-array')
var getContext = require('get-canvas-context')
var getGL2 = getContext.bind(null, 'webgl2')

test('should create texture3d', function (t) {
  var gl = getGL2()
  t.notEqual(gl, null, 'not null')

  var tex = createTexture3D(gl)
  t.deepEqual(tex.target, gl.TEXTURE_3D)
  t.deepEqual(tex.shape, [1, 1, 1, 4])
  t.deepEqual(tex.depth, 1)
  t.deepEqual(tex.width, 1)
  t.deepEqual(tex.height, 1)
  tex.dispose()

  tex = createTexture3D(gl, null, [2, 1, 3])
  t.deepEqual(tex.shape, [2, 1, 3, 4])
  t.deepEqual(tex.depth, 3)
  t.deepEqual(tex.width, 2)
  t.deepEqual(tex.height, 1)
  tex.dispose()

  var buf = new Uint8Array([
    255, 255, 255,
    255, 255, 255,
    255, 0, 255,
    255, 0, 0,
    128, 128, 128,
    128, 128, 128
  ])
  tex = createTexture3D(gl, buf, [1, 2, 3], { format: gl.RGB })
  t.deepEqual(tex.shape, [1, 2, 3, 3])
  tex.dispose()

  tex = createTexture3D(gl, [
    [255, 255, 0]
  ], [1, 1, 1], { format: gl.RGB })
  t.deepEqual(tex.shape, [1, 1, 1, 3])
  tex.dispose()

  tex = createTexture3D(gl, [
    255, 255, 0,
    155, 128, 255
  ], [1, 1, 2], { format: gl.RGB })
  t.deepEqual(tex.shape, [1, 1, 2, 3])
  tex.bind()
  var minFilter = gl.getTexParameter(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER)
  var magFilter = gl.getTexParameter(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER)
  t.deepEqual(minFilter, gl.NEAREST, 'nearest by default')
  t.deepEqual(magFilter, gl.NEAREST, 'nearest by default')

  tex.minFilter = gl.LINEAR_MIPMAP_LINEAR
  tex.magFilter = gl.LINEAR
  minFilter = gl.getTexParameter(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER)
  magFilter = gl.getTexParameter(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER)
  t.deepEqual(minFilter, gl.LINEAR_MIPMAP_LINEAR, 'changes minFilter')
  t.deepEqual(magFilter, gl.LINEAR, 'changes magFilter')
  tex.dispose()
  t.end()
})

test('should create texture 2D array', function (t) {
  var gl = getGL2()
  t.notEqual(gl, null, 'not null')

  var tex = createTexture2DArray(gl)
  t.deepEqual(tex.target, gl.TEXTURE_2D_ARRAY)
  t.deepEqual(tex.shape, [1, 1, 1, 4])
  t.deepEqual(tex.depth, 1)
  t.deepEqual(tex.width, 1)
  t.deepEqual(tex.height, 1)
  tex.dispose()

  t.end()
})
