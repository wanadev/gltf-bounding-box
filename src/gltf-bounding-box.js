import { Matrix } from 'matrixmath';
import { flattenDeep } from 'lodash';

const gltfBoundingBox = {

  computeBoundings(gltf) {
    const meshesTransformMatrices = this.getMeshesTransformMatrices(gltf.nodes);

    // Loop over each mesh of the model to get the position accessors of each of
    // its primitives
    const boundings = flattenDeep(
      Object.keys(gltf.meshes).map(
        meshName => gltf.meshes[meshName].primitives.map(
          primitive =>

            // Get the points from the bounding box of each position accessor
            this.getPointsFromBoundings(
              gltf.accessors[primitive.attributes.POSITION].min,
              gltf.accessors[primitive.attributes.POSITION].max
            )

            // Multiply by the transform matrix of the mesh
            .map(point => Matrix.multiply(point, meshesTransformMatrices[meshName]))
        )
      )
    ).reduce((boundings, point) => {
      boundings.min[0] = Math.min(boundings.min[0], point[0]);
      boundings.min[1] = Math.min(boundings.min[1], point[1]);
      boundings.min[2] = Math.min(boundings.min[2], point[2]);
      boundings.max[0] = Math.max(boundings.max[0], point[0]);
      boundings.max[1] = Math.max(boundings.max[1], point[1]);
      boundings.max[2] = Math.max(boundings.max[2], point[2]);

      return boundings;
    }, {
      min: [Infinity, Infinity, Infinity],
      max: [-Infinity, -Infinity, -Infinity],
    })

    // Return the dimensions of the bounding box
    return {
      dimensions: {
        width: Math.round(boundings.max[0] - boundings.min[0]),
        depth: Math.round(boundings.max[2] - boundings.min[2]),
        height: Math.round(boundings.max[1] - boundings.min[1]),
      },
      center: {
        x: Math.round((boundings.max[0] + boundings.min[0]) / 2),
        y: Math.round((boundings.max[2] + boundings.min[2]) / 2),
        z: Math.round((boundings.max[1] + boundings.min[1]) / 2),
      },
    };
  },

  getMeshesTransformMatrices(nodes) {
    return Object.keys(nodes)

      // Get every node which have meshes
      .filter(nodeName => nodes[nodeName].meshes)

      // Get a list of every mesh with a reference to its parent node name
      .reduce((meshes, nodeName) => [
        ...meshes,
        ...nodes[nodeName].meshes
          .map(mesh => ({ mesh, nodeName }))
      ], [])

      .reduce((tree, { mesh, nodeName }) => {

        // Climb up the tree to retrieve all the transform matrices
        const matrices = this.getParentNodesMatrices(nodeName, nodes)
          .map(transformMatrix => new Matrix(4, 4, false).setData(transformMatrix));

        // Compute the global transform matrix
        tree[mesh] = Matrix.multiply(...matrices);

        return tree;
      }, {})
  },

  getParentNodesMatrices(childNodeName, nodes) {

    // Find the node which has the given node as a child
    const parentNodeName = Object.keys(nodes)
      .find(
        nodeName => nodes[nodeName].children &&
        nodes[nodeName].children.includes(childNodeName)
      );

    return parentNodeName ?

      // If found, return the current matrix and continue climbing
      [
        nodes[childNodeName].matrix,
        ...this.getParentNodesMatrices(parentNodeName, nodes),
      ].filter(matrix => matrix) :

      // If not, only return the current matrix (if any)
      [nodes[childNodeName].matrix] || [];
  },

  getPointsFromBoundings(min, max) {
    return [
      new Matrix(1, 4, false).setData([
        min[0], min[1], min[2], 1,
      ]),
      new Matrix(1, 4, false).setData([
        min[0], min[1], max[2], 1,
      ]),
      new Matrix(1, 4, false).setData([
        min[0], max[1], min[2], 1,
      ]),
      new Matrix(1, 4, false).setData([
        min[0], max[1], max[2], 1,
      ]),
      new Matrix(1, 4, false).setData([
        max[0], min[1], min[2], 1,
      ]),
      new Matrix(1, 4, false).setData([
        max[0], min[1], max[2], 1,
      ]),
      new Matrix(1, 4, false).setData([
        max[0], max[1], min[2], 1,
      ]),
      new Matrix(1, 4, false).setData([
        max[0], max[1], max[2], 1,
      ]),
    ]
  },
};

export default gltfBoundingBox;
