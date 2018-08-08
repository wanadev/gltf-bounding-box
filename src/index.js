import gltf1BoundingBox from './gltf1-bounding-box';
import gltf2BoundingBox from './gltf2-bounding-box';
import glb2BoundingBox from './glb2-bounding-box';

const gltfBoundingBox = {

  /**
   * @param {Object|Buffer} gltf
   * @param {Buffer} [buffers={}] External buffers list if any.
   */
  computeBoundings(gltf, buffers={},precision=0) {
    if (Boolean(gltf.readUInt32LE)) {
      const version = gltf.readUInt32LE(4);
      if (version === 2) {
        return glb2BoundingBox.computeBoundings(gltf, buffers, precision);
      } else {
        throw new Error("gltf-bounding-box only currently handles glTF1 and glTF/glb2.");
      }
    } else {
      if (+gltf.asset.version === 1) {
        return gltf1BoundingBox.computeBoundings(gltf, buffers, precision);
      } else if (+gltf.asset.version === 2) {
        return gltf2BoundingBox.computeBoundings(gltf, buffers, precision);
      } else {
        throw new Error("gltf-bounding-box only currently handles glTF1 and glTF/glb2.");
      }
    }
  },

};

export default gltfBoundingBox;
