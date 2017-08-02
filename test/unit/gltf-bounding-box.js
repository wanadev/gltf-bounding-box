
import gltfBoundingBox from '../../src/gltf-bounding-box';

describe('gltfBoundingBox', () => {
  describe('Compute boundings', () => {
    beforeEach(() => {
      const model = require('../example-models/suzanne.json');

      spy(gltfBoundingBox, 'computeBoundings');
      const boundings = gltfBoundingBox.computeBoundings(model);
    });

    it('should have been run once', () => {
      expect(gltfBoundingBox.computeBoundings).to.have.been.calledOnce;
    });

    it('should have always returned the right boundings', () => {
      expect(gltfBoundingBox.computeBoundings).to.have.always.returned({
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
      });
    });
  });
});
