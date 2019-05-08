import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import Stats from "stats-js";

import { MeshEnum } from "./Constance";
import * as Obj from "./Object";
import * as Prefab from "./Prefab";
import { FresnelShader } from "./FresnelShader";
import SampleMaterial from "../material/SampleMaterial";

class Shader {
    private width = 0;
    private height = 0;
    private stats: Stats;

    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private lights: THREE.Light[] = [];
    private objMap: { [key: string]: THREE.Mesh } = {};
    private delegate: { [key: string]: (...param: any) => void } = {};
    private objList: THREE.Object3D[] = [];

    constructor() {
        this.animate = this.animate.bind(this);
        this.render = this.render.bind(this);
        this.setupControls = this.setupControls.bind(this);

        const len = Math.min(window.innerWidth, window.innerHeight);
        [this.width, this.height] = [window.innerWidth, window.innerHeight];
        this.camera = this.setupCamera();
        this.renderer = this.setupRenderer();
        this.lights.push(...this.setupLight());
        document.body.appendChild(this.renderer.domElement);
        this.controls = this.setupControls();

        this.objList.push(Prefab.floar0);
        // this.objList.push(Prefab.floar1);
        // this.objList.push(Prefab.floar2);
        // this.objList.push(Prefab.floar3);
        // this.objList.push(Prefab.floar4);

        this.objMap[MeshEnum.Plane] = this.createPlane();
        this.objMap[MeshEnum.Ball] = this.createBall({
            name: "ball",
            size: 150,
            position: { x: 0, y: 100, z: 0 },
            rotation: { x: Math.PI / 2, y: Math.PI / 2, z: 0 }
        });
        this.scene.background = new THREE.Color(0xb8e6ff);
        Object.keys(this.objMap).forEach(key => this.scene.add(this.objMap[key]));
        this.lights.forEach(l => this.scene.add(l));
        this.objList.forEach(element => this.scene.add(element));
        this.stats = this.createStats();
    }

    private setupRenderer(): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(this.width, this.height);
        renderer.shadowMap.enabled = true;
        renderer.domElement.id = "canvas";
        return renderer;
    }

    private setupCamera(): THREE.Camera {
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 50000);
        camera.position.set(200, 400, -1000);
        return camera;
    }

    private setupControls(): OrbitControls {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.target.set(0, 75, 0);
        controls.enableKeys = false;
        controls.update();
        return controls;
    }

    private setupLight(): THREE.Light[] {
        const lights = [];
        lights.push(Obj.createDictLight());
        lights.push(Obj.createAmbientLight());
        return lights;
    }

    private createPlane(): THREE.Mesh {
        const sampleMaterial = new SampleMaterial();
        this.delegate[MeshEnum.Plane] = () => {
            sampleMaterial.delegate(this.renderer.domElement.width, this.renderer.domElement.height, this.renderer);
            this.renderer.render(this.scene, this.camera);
            this.renderer.setRenderTarget(null);
            // mesh.rotation.set(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z);
        };

        // var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 200, 200, 200), sampleMaterial.build());
        var mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(100, 100, 100), sampleMaterial.build());
        mesh.position.set(0, 300, 0);
        mesh.rotation.set(0, -Math.PI / 1, 0);
        console.log(mesh);
        return mesh;
    }

    private createBall(param: any): THREE.Mesh {
        const sampleMaterial = new SampleMaterial();
        this.delegate[MeshEnum.Ball] = () => {
            sampleMaterial.delegate(this.renderer.domElement.width, this.renderer.domElement.height, this.renderer);
            this.renderer.render(this.scene, this.camera);
            this.renderer.setRenderTarget(null);
            mesh.rotation.set(0, 0, 0);
        };

        const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(param.size, param.size, param.size, 10, 10, 10), sampleMaterial.build());
        mesh.name = param.name;
        mesh.position.set(param.position.x, param.position.y, param.position.z);
        mesh.rotation.set(param.rotation.x, param.rotation.y, param.rotation.z);
        mesh.castShadow = true;
        return mesh;
    }

    createStats(): Stats {
        const stats = new Stats();
        stats.dom.style.position = "fix";
        stats.dom.style.top = "4px";
        stats.dom.style.left = "4px";
        stats.dom.style.margin = "auto";
        document.body.appendChild(stats.dom);
        return stats;
    }

    private render() {
        Object.keys(this.delegate).forEach(key => this.delegate[key]());
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }

    public animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }
}

const shader = new Shader();
shader.animate();
