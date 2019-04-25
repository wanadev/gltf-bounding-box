import { Matrix } from 'matrixmath';
import { flattenDeep, includes } from 'lodash';
import { loadPositions } from './gltf-reader';

import precise from './precise';
import trsMatrix from './trs-matrix';

const gltf2BoundingBox = {

  computeBoundings(gltf, buffers=[], { precision, ceilDimensions } = {}) {
    const boundings = this.getMeshesTransformMatrices(gltf.nodes, gltf, buffers).reduce((acc, point) => {
        acc.min = acc.min.map((elt, i) => elt < point[i] ? elt : point[i]);
        acc.max = acc.max.map((elt, i) => elt > point[i] ? elt : point[i]);
        return acc;
    },{min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity]});

    // Return the dimensions of the bounding box
    const dimensionRound = ceilDimensions ? precise.ceil : precise.round;
    const res =  {
      dimensions: {
        width: dimensionRound(boundings.max[0] - boundings.min[0], precision),
        depth: dimensionRound(boundings.max[2] - boundings.min[2], precision),
        height: dimensionRound(boundings.max[1] - boundings.min[1], precision),
      },
      center: {
        x: precise.round((boundings.max[0] + boundings.min[0]) / 2, precision + 1),
        y: precise.round((boundings.max[2] + boundings.min[2]) / 2, precision + 1),
        z: precise.round((boundings.max[1] + boundings.min[1]) / 2, precision + 1),
      },
    };

    return res;
  },

  getMeshesTransformMatrices(nodes, gltf, buffers) {
    nodes.forEach((node, index) => node.index = index);

    return nodes

      // Get every node which have meshes
      .filter(node => (node.mesh !== undefined))

      .reduce((acc, node) => {
        // Climb up the tree to retrieve all the transform matrices
        const matrices = this.getParentNodesMatrices(node, nodes)
          .map(transformMatrix => new Matrix(4, 4, false).setData(transformMatrix));

        // Compute the global transform matrix
        const matrix = Matrix.multiply(...matrices);
        const positions = this.getPointsFromArray(loadPositions(gltf, node.mesh, buffers));

        const transformedPoints = positions.map(point =>  Matrix.multiply(point, matrix));
        return acc.concat(transformedPoints);
    }, []);
  },

  getParentNodesMatrices(childNode, nodes) {
    // Find the node which has the given node as a child
    const parentNode = nodes
      .find(
        node => node.children &&
        includes(node.children, childNode.index)
      );

    // Get matrix or compose TRS fields if present, TRS is by default Identity
    const childNodeMatrix = childNode.matrix || trsMatrix.getTRSMatrix(childNode);

    return (parentNode !== undefined) ?

      // If found, return the current matrix and continue climbing
      [
        childNodeMatrix,
        ...this.getParentNodesMatrices(parentNode, nodes),
      ].filter(matrix => matrix) :

      // If not, only return the current matrix (if any)
      [childNodeMatrix];
  },

  getPointsFromArray(array) {
    const res = [];
    for (let i = 0; i < array.length ; i+=3) {
        res.push(new Matrix(1,4,false).setData([array[i], array[i+1], array[i+2], 1]));
    }
    return res;
  },

};

export default gltf2BoundingBox;
