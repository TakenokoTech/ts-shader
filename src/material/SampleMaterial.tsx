import * as THREE from "three";
import { ImageUtils } from "three";

import vertexShader from "../shader/vertex/vertexShader";
// import vertexShader from "../shader/tempShader";

import fragmentShader from "../shader/fragment/texture";
// import fragmentShader from "../shader/fragment/rainbow";
// import fragmentShader from "../shader/fragment/fragmentShader";
// import fragmentShader from "../shader/untitled";

export default class SampleMaterial {
    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        texture: { type: "t", value: new THREE.TextureLoader().load("a.jpg") }
    };

    constructor() {
        this.delegate = this.delegate.bind(this);
    }

    get parameters(): THREE.ShaderMaterialParameters {
        return {
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
            // color: 0x88ccff
            // wireframe: true
        };
    }

    build() {
        const material = new THREE.ShaderMaterial(this.parameters);
        material.side = THREE.DoubleSide;
        return material;
    }

    delegate(width: number, height: number) {
        // console.log(width, height);
        this.uniforms.u_resolution.value.x = width;
        this.uniforms.u_resolution.value.y = height;
        this.uniforms.u_time.value += 0.05;
    }
}
