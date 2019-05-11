import * as THREE from "three";
import { matIV } from "../utils/minMatrix";
import * as GLUtils from "./GLUtils";

import EventListener from "../sample/EventListener";

// import vertexShader from "../shader/vertex/vertexShader";
// import vertexShader from "../shader/tempShader";
import vertexShader from "../shader/vertex/reflection";

// import fragmentShader from "../shader/fragment/texture";
// import fragmentShader from "../shader/fragment/rainbow";
// import fragmentShader from "../shader/fragment/fragmentShader";
// import fragmentShader from "../shader/fragment/whitenoise";
// import fragmentShader from "../shader/fragment/colorful";
// import fragmentShader from "../shader/fragment/parameter";
import fragmentShader from "../shader/fragment/reflection";

export default class SampleMaterial {
    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        texture: { type: "t", value: new THREE.TextureLoader().load("assets/texture3.png") },
        samplerCube: { type: "t", value: new THREE.TextureLoader().load("assets/a.jpg") },
        alpha: { type: "f", value: 0.5 },
        color: { type: "v3", value: new THREE.Vector3() },
        param2: { type: "f", value: 0.1 },
        param3: { type: "f", value: 0.1 },
        mMatrix: { type: "m4", value: new THREE.Matrix4() },
        mvpMatrix: { type: "m4", value: new THREE.Matrix4() }
    };

    renderTarget: THREE.WebGLRenderTarget;
    texture: THREE.Texture;

    constructor() {
        this.delegate = this.delegate.bind(this);
        this.texture = new THREE.TextureLoader().load("assets/a.jpg");

        GLUtils.generateCubeMap().then((tex: WebGLTexture) => {
            this.uniforms.samplerCube.value = tex as THREE.Texture;
        });

        this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            magFilter: THREE.NearestFilter,
            minFilter: THREE.NearestFilter,
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping
        });
    }

    get parameters(): /*THREE.ShaderMaterialParameters*/ any {
        return {
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            // color: 0x88ccff,
            // wireframe: true
            map: this.renderTarget.texture
        };
    }

    build() {
        const material = new THREE.ShaderMaterial(this.parameters);
        // const material = new THREE.MeshLambertMaterial(this.parameters);
        material.side = THREE.DoubleSide;
        return material;
    }

    delegate(width: number, height: number, renderer: THREE.WebGLRenderer) {
        this.uniforms.u_resolution.value.set(width, height);
        this.uniforms.u_mouse.value.set(EventListener.mouse.x, EventListener.mouse.y);
        this.uniforms.u_time.value += 0.05;
        this.uniforms.color.value.set(
            -EventListener.param("param1") / -100,
            -EventListener.param("param2") / -100,
            -EventListener.param("param3") / -100
        );
        this.uniforms.texture.value = this.texture;

        var m = new matIV();
        const mMatrix = m.identity(m.create()); // モデル変換行列
        const vMatrix = m.identity(m.create()); // ビュー変換行列
        const pMatrix = m.identity(m.create()); // プロジェクション変換行列
        const mvpMatrix = m.identity(m.create()); // 最終座標変換行列
        m.multiply(pMatrix, vMatrix, mvpMatrix); // p に v を掛ける
        m.multiply(mvpMatrix, mMatrix, mvpMatrix); // さらに m を掛ける

        renderer.setRenderTarget(this.renderTarget);
    }
}
