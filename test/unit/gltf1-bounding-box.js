import fs from 'fs';
import gltf1BoundingBox from '../../src/gltf1-bounding-box';
import lib from '../../src/index';

describe('gltf1BoundingBox', () => {
  describe('Compute boundings', () => {
    beforeEach(() => {
      const model = JSON.parse(fs.readFileSync('./test/example-models/suzanne.gltf').toString());

      spy(gltf1BoundingBox, 'computeBoundings');
      const boundings = lib.computeBoundings(model);
    });

    it('should have been run once', () => {
      expect(gltf1BoundingBox.computeBoundings).to.have.been.calledOnce;
    });

    it('should have always returned the right boundings', () => {
      expect(gltf1BoundingBox.computeBoundings).to.have.always.returned({
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
