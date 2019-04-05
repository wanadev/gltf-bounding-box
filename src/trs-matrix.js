import { Matrix4, Quaternion } from 'three';

const trsMatrix = {

    /**
     * Get the composed TRS (trasnlation, rotation, scale) affine transformation matrix for a given node.
     *
     * @param {Object} node a node in a GLTF
     * @param {Array<number>} [node.translation] array of 3 values for a translation
     * @param {Array<number>} [node.rotation] an array of four values for a rotation (quaternion)
     * @param {Array<number>} [node.scale] an array of three values for a scale
     */
    getTRSMatrix({ translation, rotation, scale }) {
        const t = translation ? trsMatrix._affineT(translation) : trsMatrix._I();
        const r = rotation ? trsMatrix._affineR(rotation) : trsMatrix._I();
        const s = scale ? trsMatrix._affineS(scale) : trsMatrix._I();

        // Post-multiply: T * R * S
        const TRS = t.multiply(r).multiply(s);

        // toArray returns a column-major, and we need exactly that one
        return TRS.toArray();
    },

    /**
     * Three functions that use `_affine`, to simplify calls above.
     */
    _affineT(t) {
        return trsMatrix._affine({ t });
    },
    _affineR(r) {
        return trsMatrix._affine({ r });
    },
    _affineS(s) {
        return trsMatrix._affine({ s });
    },

    /**
     * Identity 4x4 matrix.
     */
    _I() {
        return new Matrix4().identity();
    },

    /**
     * Convert one of the t, r, or s arrays into a 4x4 affine transformation matrix.
     * The passed parameter object p should contain only one of the fields t, r, or s.
     *
     * @param {Object} p
     * @param {Array<number>} [p.t] an array of three values for a transaltion
     * @param {Array<number>} [p.r] an array of four values for a rotation (quaternion)
     * @param {Array<number>} [p.s] an array of three values for a scale
     */
    _affine({ t, r, s }) {
        if (t) {
            return new Matrix4().makeTranslation(t[0], t[1], t[2]);
        }
        if (r) {
            return new Matrix4().makeRotationFromQuaternion(new Quaternion(r[0], r[1], r[2], r[3]));
        }
        if (s) {
            return new Matrix4().makeScale(s[0], s[1], s[2]);
        }
    },
};

export default trsMatrix;
