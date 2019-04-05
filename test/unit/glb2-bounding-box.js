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

  describe('Compute boundings with more precision', () => {
    beforeEach(() => {
      const model = fs.readFileSync('./test/example-models/suzanne.glb');

      spy(glb2BoundingBox, 'computeBoundings');
      const boundings = lib.computeBoundings(model, undefined, {precision: 1});
    });

    it('should have been run once', () => {
      expect(glb2BoundingBox.computeBoundings).to.have.been.calledOnce;
    });

    it('should have always returned the right boundings', () => {
      expect(glb2BoundingBox.computeBoundings).to.have.always.returned({
        dimensions: {
          width: 2.7,
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

  /**
   * This test uses a scene where a 2 by 4.5 by 6.5 parallelepiped is scaled to be a 2x2x2 cube.
   * This is to test the scaling transformation. 
   */
  describe('Compute boundings with scaling', () => {
    beforeEach(() => {
      const model = fs.readFileSync('./test/example-models/weird_cube.glb');

      spy(glb2BoundingBox, 'computeBoundings');
      const boundings = lib.computeBoundings(model, undefined, { precision: 3 });
    });

    it('should have been run once', () => {
      expect(glb2BoundingBox.computeBoundings).to.have.been.calledOnce;
    });

    it('should have always returned the right boundings', () => {
      expect(glb2BoundingBox.computeBoundings).to.have.always.returned({
        dimensions: {
          width: 2,
          depth: 2,
          height: 2,
        },
        center: {
          x: 0,
          y: -0.5556,
          z: 0.6923,
        },
      });
    });
  });

  /**
   * This test uses a scene where a 2x2x2 cylinder is scaled to be taller (2x2x6) and then rotated to
   * be lying with length 6 onto the x axis.
   * This is to test the scaling and rotation transformations. 
   */
  describe('Compute boundings with scaling and rotation', () => {
    beforeEach(() => {
      const model = fs.readFileSync('./test/example-models/flat_cylinder.glb');

      spy(glb2BoundingBox, 'computeBoundings');
      const boundings = lib.computeBoundings(model, undefined, { precision: 3 });
    });

    it('should have been run once', () => {
      expect(glb2BoundingBox.computeBoundings).to.have.been.calledOnce;
    });

    it('should have always returned the right boundings', () => {
      expect(glb2BoundingBox.computeBoundings).to.have.always.returned({
        dimensions: {
          width: 6,
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
