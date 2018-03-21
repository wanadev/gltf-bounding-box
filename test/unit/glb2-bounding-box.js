import fs from 'fs';
import glb2BoundingBox from '../../src/glb2-bounding-box';
import lib from '../../src/index';

describe('glb2BoundingBox', () => {
  describe('Compute boundings', () => {
    beforeEach(() => {
      const model = fs.readFileSync('./test/example-models/suzanne.glb');

      spy(glb2BoundingBox, 'computeBoundings');
      const boundings = lib.computeBoundings(model);
    });

    it('should have been run once', () => {
      expect(glb2BoundingBox.computeBoundings).to.have.been.calledOnce;
    });

    it('should have always returned the right boundings', () => {
      expect(glb2BoundingBox.computeBoundings).to.have.always.returned({
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
