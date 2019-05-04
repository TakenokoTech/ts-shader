import * as THREE from "three";
import * as Obj from "./Object";

export const floar0 = Obj.createFloar(
    new Obj.BoxParam("floar", 800, 100, 800, new THREE.Vector3(0, -50, 0), new THREE.Quaternion(0, 0, 0, 1), false)
);

export const floar1 = Obj.createFloar(
    new Obj.BoxParam("floar1", 100, 600, 900, new THREE.Vector3(400, 200, 0), new THREE.Quaternion(0, 0, 0, 1), true)
);

export const floar2 = Obj.createFloar(
    new Obj.BoxParam("floar2", 900, 600, 100, new THREE.Vector3(0, 200, 400), new THREE.Quaternion(0, 0, 0, 1), false)
);

export const floar3 = Obj.createFloar(
    new Obj.BoxParam("floar3", 100, 600, 900, new THREE.Vector3(-400, 200, 0), new THREE.Quaternion(0, 0, 0, 1), false)
);

export const floar4 = Obj.createFloar(
    new Obj.BoxParam("floar4", 900, 600, 100, new THREE.Vector3(0, 200, -400), new THREE.Quaternion(0, 0, 0, 1), true)
);
