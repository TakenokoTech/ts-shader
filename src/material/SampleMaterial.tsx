import * as THREE from "three";
import EventListener from "../sample/EventListener";

import vertexShader from "../shader/vertex/vertexShader";
// import vertexShader from "../shader/tempShader";

// import fragmentShader from "../shader/fragment/texture";
// import fragmentShader from "../shader/fragment/rainbow";
// import fragmentShader from "../shader/fragment/fragmentShader";
// import fragmentShader from "../shader/fragment/whitenoise";
// import fragmentShader from "../shader/fragment/colorful";
import fragmentShader from "../shader/fragment/parameter";

export default class SampleMaterial {
    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        texture: { type: "t", value: new THREE.TextureLoader().load("a.jpg") },
        color: { type: "v3", value: new THREE.Vector3() },
        param2: { type: "f", value: 0.1 },
        param3: { type: "f", value: 0.1 }
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
        this.uniforms.u_resolution.value.set(width, height);
        this.uniforms.u_mouse.value.set(EventListener.mouse.x, EventListener.mouse.y);
        this.uniforms.u_time.value += 0.05;
        this.uniforms.color.value.set(
            -EventListener.param("param1") / -100,
            -EventListener.param("param2") / -100,
            -EventListener.param("param3") / -100
        );
    }
}
