# glo-texture

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A generic WebGL texture interface for 2D, 3D, Cube and 2DArray data.

**Experimental and subject to change.**

```js
var createTexture = require('glo-texture/2d')

var tex = createTexture(gl, pixels, [ width, height ])
tex.minFilter = gl.LINEAR
tex.magFilter = gl.LINEAR
tex.generateMipmap()
tex.bind()
```

## Usage

[![NPM](https://nodei.co/npm/glo-texture.png)](https://www.npmjs.com/package/glo-texture)

Todo.

## See Also

- [gl-texture2d](https://www.npmjs.com/package/gl-texture2d)

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/glo-texture/blob/master/LICENSE.md) for details.
