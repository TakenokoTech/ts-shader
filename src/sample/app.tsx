import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import Stats from "stats-js";

import vertexShader from "../shader/vertexShader.vert";
import fragmentShader from "../shader/sample";
import { MeshEnum } from "./Constance";
import * as Obj from "./Object";
import * as Prefab from "./Prefab";
import { FresnelShader } from "./FresnelShader";

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

        // this.objMap[MeshEnum.Plane] = this.createPlane();
        this.objMap[MeshEnum.Ball] = this.createBall({
            name: "ball",
            size: 150,
            position: { x: 0, y: 100, z: 0 },
            rotation: { x: Math.PI / 2, y: Math.PI / 2, z: 0 }
        });
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
        const uniforms = {
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new THREE.Vector2() },
            u_mouse: { type: "v2", value: new THREE.Vector2() }
        };

        this.delegate[MeshEnum.Plane] = () => {
            uniforms.u_resolution.value.x = this.renderer.domElement.width;
            uniforms.u_resolution.value.y = this.renderer.domElement.height;
            uniforms.u_time.value += 0.05;
        };

        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        var geometry = new THREE.PlaneBufferGeometry(2, 2);
        var mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    private createBall(param: any): THREE.Object3D {
        const uniforms = {
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new THREE.Vector2() },
            u_mouse: { type: "v2", value: new THREE.Vector2() }
        };

        this.delegate[MeshEnum.Plane] = () => {
            uniforms.u_resolution.value.x = this.renderer.domElement.width;
            uniforms.u_resolution.value.y = this.renderer.domElement.height;
            uniforms.u_time.value += 0.05;
        };
        console.log(vertexShader);
        const material = {
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
            // color: 0x88ccff
            // wireframe: true
        };

        const ball = new THREE.Mesh(
            new THREE.BoxBufferGeometry(param.size, param.size, param.size),
            new THREE.ShaderMaterial(material)
            // new THREE.MeshLambertMaterial(material)
        );

        ball.name = param.name;
        ball.position.set(param.position.x, param.position.y, param.position.z);
        ball.rotation.set(param.rotation.x, param.rotation.y, param.rotation.z);
        ball.castShadow = true;
        return ball;
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
        this.delegate[MeshEnum.Plane]();
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
        // console.log(this.camera.position);
    }

    public animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }
}

const shader = new Shader();
shader.animate();
