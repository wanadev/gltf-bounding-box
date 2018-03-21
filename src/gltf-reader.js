"use strict";

const gltfReader = {
  /**
     * @private
     * @param {Object} gltf
     * @param {String|Number} meshName A number in glTF2
     * @param {Object} [buffers={}] External buffers associations uri -> buffer
     * @return {Object} Mesh geometry data
     */
  loadPositions(gltf, meshName, buffers = {}) {
    const mesh = gltf.meshes[meshName];
    const primitivesCount = mesh.primitives ? mesh.primitives.length : 0;

    if (primitivesCount > 1) {
      console.error(
        "gltfReader: Currently unable to load meshes with more than 1 primitive."
      );
      return null;
    } else if (primitivesCount === 0) {
      console.error("gltfReader: Mesh has no primitive.");
      return null;
    }

    const primitive = mesh.primitives[0];

    // Attributes
    const attributes = {};
    if (!primitive.attributes) return [];
    return gltfReader._loadAccessor(
      gltf,
      primitive.attributes.POSITION,
      buffers
    );
  },

  /**
     * @private
     * @param {Object} gltf
     * @param {String|Number} accessorName A number in glTF2
     * @param {Object} buffers
     * @return {Number[]|null}
     */
  _loadAccessor(gltf, accessorName, buffers) {
    if (accessorName === undefined) return null;

    const accessor = gltf.accessors[accessorName];
    const offset = accessor.byteOffset || 0;

    const buffer = gltfReader._loadBufferView(
      gltf,
      accessor.bufferView,
      offset,
      buffers
    );

    const array = [];
    switch (accessor.componentType) {
      case 5123: // UNSIGNED_SHORT
        for (let i = 0; i < buffer.length; i += 2) {
          array.push(buffer.readUInt16LE(i));
        }
        break;
      case 5126: // FLOAT
        for (let i = 0; i < buffer.length; i += 4) {
          array.push(buffer.readFloatLE(i));
        }
        break;
      default:
        console.error(
          "gltfLoader: Unsupported component type: " + accessor.componentType
        );
    }

    return array;
  },

  /**
     * @private
     * @param {Object} gltf
     * @param {String|Number} bufferViewName A number in glTF2
     * @param {Number} offset
     * @param {Object} buffers
     * @return {Buffer}
     */
  _loadBufferView(gltf, bufferViewName, offset, buffers) {

    const bufferView = gltf.bufferViews[bufferViewName];
    const length = bufferView.byteLength || 0;

    offset += bufferView.byteOffset ? bufferView.byteOffset : 0;

    const buffer = gltfReader._loadBuffer(gltf, bufferView.buffer, buffers);
    return buffer.slice(offset, offset + length);
  },

  /**
     * @private
     * @param {Object} gltf
     * @param {String|Number} bufferName A number in glTF2
     * @param {Object} buffers
     * @return {Buffer}
     */
  _loadBuffer(gltf, bufferName, buffers) {
    if (buffers[bufferName]) {
      return buffers[bufferName];
    }

    const buffer = gltf.buffers[bufferName];

    if (!buffer.uri.startsWith("data:")) {
      console.error(
        "gltfReader: Currently unable to load buffers that are not data-URI based."
      );
      return null;
    }

    buffers[bufferName] = Buffer.from(
      buffer.uri.split(",")[1],
      "base64"
    );
    return buffers[bufferName];
  }
};

export default gltfReader;
