import * as THREE from "three";
import RenderPass from "../three/RenderPass";
import EffectComposer from "../three/EffectComposer";
import UnrealBloomPass from "../three/UnrealBloomPass";
import ShaderPass from "../three/ShaderPass";

import vertexShader from "../shader/vertex/bloom.vert";
import fragmentShader from "../shader/fragment/bloom.glsl";
import { LayerType } from "../sample/Constance";

export default class Bloom {
    bloomComposer: EffectComposer;
    finalComposer: EffectComposer;

    darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    materials: { [key: string]: THREE.Material | THREE.Material[] } = {};

    constructor(private scene: THREE.Scene, private camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
        this.delegate = this.delegate.bind(this);
        this.darkenNonBloomed = this.darkenNonBloomed.bind(this);
        this.restoreMaterial = this.restoreMaterial.bind(this);
        this.test = this.test.bind(this);

        this.scene = scene;
        this.camera = camera;

        var renderScene = new RenderPass(this.scene, this.camera);

        var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0;
        bloomPass.strength = 5;
        bloomPass.radius = 0;

        this.bloomComposer = new EffectComposer(renderer);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
        this.bloomComposer.addPass(renderScene);
        this.bloomComposer.addPass(bloomPass);

        var finalPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                defines: {}
            }),
            "baseTexture"
        );
        finalPass.needsSwap = true;

        this.finalComposer = new EffectComposer(renderer);
        this.finalComposer.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
        this.finalComposer.addPass(renderScene);
        this.finalComposer.addPass(finalPass);
    }

    test() {
        for (var i = 0; i < 10; i++) {
            var color = new THREE.Color();
            color.setHSL(Math.random(), 0.7, Math.random() * 0.2 + 0.05);
            var material = new THREE.MeshBasicMaterial({ color: color });
            var box = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(100, 4), material);
            box.name = "ball" + i;
            box.position.x = Math.random() * 1000 - 500;
            box.position.y = Math.random() * 1000 - 500;
            box.position.z = Math.random() * 1000 - 500;
            box.position.normalize().multiplyScalar(Math.random() * 400.0 + 200.0);
            box.scale.setScalar(Math.random() * Math.random() + 0.5);
            box.layers.enable(LayerType.BLOOM_SCENE);
            this.scene.add(box);
        }
    }

    static enableBloom(mesh: THREE.Mesh) {
        mesh.layers.enable(LayerType.BLOOM_SCENE);
    }

    delegate() {
        const white = new THREE.Color(0x000000);
        const tempBackground = this.scene.background || white;

        this.scene.background = white;
        this.scene.traverse(this.darkenNonBloomed);
        this.bloomComposer.render();

        this.scene.background = tempBackground;
        this.scene.traverse(this.restoreMaterial);
        this.finalComposer.render();
    }

    darkenNonBloomed(o: THREE.Object3D) {
        const obj = o as THREE.Mesh;
        var bloomLayer = new THREE.Layers();
        bloomLayer.set(LayerType.BLOOM_SCENE);
        if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
            this.materials[obj.uuid] = obj.material;
            obj.material = this.darkMaterial;
        }
    }

    restoreMaterial(o: THREE.Object3D) {
        const obj = o as THREE.Mesh;
        if (this.materials[obj.uuid]) {
            obj.material = this.materials[obj.uuid];
            delete this.materials[obj.uuid];
        }
    }
}
