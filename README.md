# gltf-bounding-box

Computes the global bounding box of a gltf model

[![npm version](http://img.shields.io/npm/v/gltf-bounding-box.svg)](https://www.npmjs.com/package/gltf-bounding-box)
[![Travis build status](http://img.shields.io/travis/wanadev/gltf-bounding-box.svg?style=flat)](https://travis-ci.org/wanadev/gltf-bounding-box)
[![Dependency Status](https://david-dm.org/wanadev/gltf-bounding-box.svg)](https://david-dm.org/wanadev/gltf-bounding-box)
[![devDependency Status](https://david-dm.org/wanadev/gltf-bounding-box/dev-status.svg)](https://david-dm.org/wanadev/gltf-bounding-box#info=devDependencies)

## Usage

```javascript
import gltfBoundingBox from 'gltf-bounding-box';

const model = JSON.parse(fs.readFileSync('suzanne.gltf'), 'utf8');

const boundings = gltfBoundingBox.computeBoundings(model);

// boundings:
{
  dimensions: {
    width: 3,
    depth: 2,
    height: 2,
  },
  center: {
    x: 0,
    y: 0,
    z: 0,
  },
}
```
