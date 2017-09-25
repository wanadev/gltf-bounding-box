"use strict";

const gltfReader = {

    /**
     * @private
     * @param {Object} gltf
     * @param {String} meshName
     * @return {Object} Mesh geometry data
     */
    loadPositions(gltf, meshName) {
        const mesh = gltf.meshes[meshName];
        const primitivesCount = mesh.primitives ? mesh.primitives.length : 0;

        // @todo If more than one primitive, merge geometry and use MultiMaterial
        if (primitivesCount > 1) {
            console.error("gltfLoader: Currently unable to load meshes with more than 1 primitive.");
            return null;
        } else if (primitivesCount === 0) {
            console.error("gltfLoader: Mesh has no primitive.");
            return null;
        }

        const primitive = mesh.primitives[0];

        // Attributes
        const attributes = {};
        if (!primitive.attributes) return [];
        return gltfReader._loadAccessor(gltf, primitive.attributes.POSITION);
    },

    /**
     * @private
     * @param {Object} gltf
     * @param {String} accessorName
     * @return {Number[]|null}
     */
    _loadAccessor(gltf, accessorName) {
        if (!accessorName) return null;

        const accessor = gltf.accessors[accessorName];
        const offset = accessor.byteOffset || 0;
        const buffer = gltfReader._loadBufferView(gltf, accessor.bufferView, offset);

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
                console.error("gltfLoader: Unsupported component type: " + accessor.componentType);
        }

        return array;
    },

    /**
     * @private
     * @param {Object} gltf
     * @param {String} bufferViewName
     * @param {Number} offset
     * @return {Buffer}
     */
    _loadBufferView(gltf, bufferViewName, offset) {
        const bufferView = gltf.bufferViews[bufferViewName];
        const length = bufferView.byteLength || 0;

        offset += bufferView.byteOffset ? bufferView.byteOffset : 0;

        const buffer = gltfReader._loadBuffer(gltf, bufferView.buffer);
        return buffer.slice(offset, offset + length);
    },

    /**
     * @private
     * @param {Object} gltf
     * @param {String} bufferName
     * @return {Buffer}
     */
    _loadBuffer(gltf, bufferName) {
        if (gltf.loadedBuffers[bufferName]) {
            return gltf.loadedBuffers[bufferName];
        }

        const buffer = gltf.buffers[bufferName];

        if (!buffer.uri.startsWith("data:")) {
            console.error("gltfLoader: Currently unable to load buffers that are not data-URI based.");
            return null;
        }

        gltf.loadedBuffers[bufferName] = Buffer.from(buffer.uri.split(",")[1], "base64");
        return gltf.loadedBuffers[bufferName];
    },
};

export default gltfReader;
// module.exports = gltfReader;
