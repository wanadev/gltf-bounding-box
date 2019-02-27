import gltf2BoundingBox from './gltf2-bounding-box';

const glb2BoundingBox = {

  computeBoundings(glb, buffers = {}, precision = 0) {
    // Extract json chunk
    const jsonChunkLength = glb.readUInt32LE(12);
    const jsonChunkData = glb.slice(20, 20 + jsonChunkLength);
    const gltf = JSON.parse(jsonChunkData.toString());

    // Extract bin chunk
    const binChunkOffset = 20 + jsonChunkLength;
    const binChunkLength = glb.readUInt32LE(binChunkOffset);
    const binChunkData = glb.slice(binChunkOffset + 8, binChunkOffset + 8 + binChunkLength);

    return gltf2BoundingBox.computeBoundings(gltf, [binChunkData],precision);
  },

};

export default glb2BoundingBox;
