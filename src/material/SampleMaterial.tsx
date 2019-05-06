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
        texture: { type: "t", value: new THREE.TextureLoader().load("a.jpg") },
        samplerCube: { type: "t", value: new THREE.TextureLoader().load("a.jpg") },
        alpha: { type: "f", value: 0.5 },
        color: { type: "v3", value: new THREE.Vector3() },
        param2: { type: "f", value: 0.1 },
        param3: { type: "f", value: 0.1 },
        mMatrix: { type: "m4", value: new THREE.Matrix4() },
        mvpMatrix: { type: "m4", value: new THREE.Matrix4() }
    };

    constructor() {
        this.delegate = this.delegate.bind(this);

        // GLUtils.generateCubeMap().then((tex: WebGLTexture) => {
        ///this.uniforms.samplerCube.value = tex as THREE.Texture;
        // });
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

        var m = new matIV();
        const mMatrix = m.identity(m.create()); // モデル変換行列
        const vMatrix = m.identity(m.create()); // ビュー変換行列
        const pMatrix = m.identity(m.create()); // プロジェクション変換行列
        const mvpMatrix = m.identity(m.create()); // 最終座標変換行列
        m.multiply(pMatrix, vMatrix, mvpMatrix); // p に v を掛ける
        m.multiply(mvpMatrix, mMatrix, mvpMatrix); // さらに m を掛ける
        // console.log(mvpMatrix);

        var fBuffer = GLUtils.createFramebuffer();
        this.uniforms.samplerCube.value = fBuffer.t as THREE.Texture;
        // console.log(fBuffer);
    }
}

function createShader(gl: WebGLRenderingContext, type: number, text: string) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("");
    gl.shaderSource(shader, text);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    } else {
        throw new Error(gl.getShaderInfoLog(shader) || "");
    }
}

function createProgram(gl: WebGLRenderingContext, vs, fs) {
    var program = gl.createProgram();
    if (!program) throw new Error("");
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        return program;
    } else {
        throw new Error(gl.getProgramInfoLog(program) || "");
    }
}
