import * as THREE from "three";
import Water from "../extension/Water";

// declare module "three" {
//     export class Water extends THREE.Mesh {
//         material: THREE.ShaderMaterial;
//     }
// }

export default class WaterMaterial {
    light: THREE.Light;
    water: Water | null = null;

    constructor(light: THREE.Light) {
        this.delegate = this.delegate.bind(this);
        this.light = light;
    }

    get parameters(): /*THREE.ShaderMaterialParameters*/ any {
        return {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load("assets/waternormals.jpg", function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            alpha: 1.0,
            sunDirection: this.light.position.clone().normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7
            // fog: scene.fog !== undefined
        };
    }

    build(): THREE.Mesh {
        var waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000);
        this.water = new Water(waterGeometry, this.parameters);
        return this.water;
    }

    delegate() {
        if (this.water) this.water.material.uniforms["time"].value += 1.0 / 60.0;
    }
}
