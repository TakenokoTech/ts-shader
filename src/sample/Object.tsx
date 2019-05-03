import * as THREE from "three";

export function createAmbientLight(): THREE.Light {
    const ambient = new THREE.AmbientLight(0x333333);
    ambient.name = "Ambient Light";
    return ambient;
}

export function createDictLight(position: THREE.Vector3 = new THREE.Vector3(-128, 256, -128)): THREE.DirectionalLight {
    const FIELD_SIZE = position.y;
    const directionalLight = new THREE.DirectionalLight(0xaaaaaa, 1.6);
    directionalLight.name = "Directional Light";
    directionalLight.position.set(position.x, position.y, position.z);
    directionalLight.shadow.camera.near = 0; //0.5;
    directionalLight.shadow.camera.top = FIELD_SIZE;
    directionalLight.shadow.camera.bottom = FIELD_SIZE * -1;
    directionalLight.shadow.camera.left = FIELD_SIZE;
    directionalLight.shadow.camera.right = FIELD_SIZE * -1;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.castShadow = true;
    return directionalLight;
}

export function createFloar(param: BoxParam): THREE.Object3D {
    const material = {
        color: 0xcccccc,
        wireframe: param.wireframe
    };
    const meshFloor = new THREE.Mesh(
        new THREE.BoxGeometry(param.width, param.height, param.depth),
        new THREE.MeshLambertMaterial(material)
    );
    meshFloor.name = param.name;
    meshFloor.position.set(param.position.x, param.position.y, param.position.z);
    meshFloor.receiveShadow = true;
    return meshFloor;
}

/**
 * Box Wrapper
 */
export class BoxParam {
    name: string;
    width: number;
    height: number;
    depth: number;
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
    wireframe: boolean = false;

    constructor(
        name: string,
        width: number,
        height: number,
        depth: number,
        position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
        quaternion: THREE.Quaternion = new THREE.Quaternion(0, 0, 0, 1),
        wireframe: boolean = false
    ) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.position = position;
        this.quaternion = quaternion;
        this.wireframe = wireframe;
    }
}
