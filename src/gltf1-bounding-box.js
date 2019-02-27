import { Matrix } from 'matrixmath';
import { flattenDeep, includes } from 'lodash';
import { loadPositions } from './gltf-reader';

import precise from './precise';

const gltf1BoundingBox = {

  computeBoundings(gltf, buffers = {}, precision = 0) {
    // get all the points and retrieve min max
    const boundings = this.getMeshesTransformMatrices(gltf.nodes, gltf).reduce((acc, point) => {
        acc.min = acc.min.map((elt, i) => elt < point[i] ? elt : point[i]);
        acc.max = acc.max.map((elt, i) => elt > point[i] ? elt : point[i]);
        return acc;
    },{min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity]});

    // Return the dimensions of the bounding box
    const res =  {
      dimensions: {
        width: precise.round(boundings.max[0] - boundings.min[0], precision),
        depth: precise.round(boundings.max[2] - boundings.min[2], precision),
        height: precise.round(boundings.max[1] - boundings.min[1], precision),
      },
      center: {
        x: precise.round((boundings.max[0] + boundings.min[0]) / 2, precision),
        y: precise.round((boundings.max[2] + boundings.min[2]) / 2, precision),
        z: precise.round((boundings.max[1] + boundings.min[1]) / 2, precision),
      },
    };

    return res;
  },

  getMeshesTransformMatrices(nodes, gltf) {
    return Object.keys(nodes)

      // Get every node which have meshes
      .filter(nodeName => nodes[nodeName].meshes)

      // Get a list of every mesh with a reference to its parent node name
      .reduce((meshes, nodeName) => [
        ...meshes,
        ...nodes[nodeName].meshes
          .map(mesh => ({ mesh, nodeName }))
      ], [])

      .reduce((acc, { mesh, nodeName }) => {

        // Climb up the tree to retrieve all the transform matrices
        const matrices = this.getParentNodesMatrices(nodeName, nodes)
          .map(transformMatrix => new Matrix(4, 4, false).setData(transformMatrix));

        // Compute the global transform matrix
        const matrix = Matrix.multiply(...matrices);
        const positions = this.getPointsFromArray(loadPositions(gltf, mesh));


        const transformedPoints = positions.map(point =>  Matrix.multiply(point, matrix));
        acc.push(...transformedPoints);

        return acc;
    }, []);
  },

  getParentNodesMatrices(childNodeName, nodes) {

    // Find the node which has the given node as a child
    const parentNodeName = Object.keys(nodes)
      .find(
        nodeName => nodes[nodeName].children &&
        includes(nodes[nodeName].children, childNodeName)
      );

    // Specify identity matrix if not present
    const nodeMatrix = nodes[childNodeName].matrix || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    return parentNodeName ?

      // If found, return the current matrix and continue climbing
      [
        nodeMatrix,
        ...this.getParentNodesMatrices(parentNodeName, nodes),
      ].filter(matrix => matrix) :

      // If not, only return the current matrix (if any)
      [nodeMatrix];
  },

  getPointsFromArray(array) {
    const res = [];
    for(let i = 0; i< array.length ; i+=3) {
        res.push(new Matrix(1,4,false).setData([array[i], array[i+1], array[i+2], 1]));
    }
    return res;
  },

};

export default gltf1BoundingBox;
