import * as THREE from "three";

// フレームバッファをオブジェクトとして生成する関数
export function createFramebuffer(postScene: THREE.Scene): { renderer: THREE.WebGLRenderer; texture: THREE.WebGLRenderTarget } {
    var baseCamera, baseScene, renderTarget;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // rendererの作成
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    renderer.setClearColor("#CCC");

    // canvasをbodyに追加
    document.body.appendChild(renderer.domElement);

    // canvasをリサイズ
    renderer.setSize(windowWidth, windowHeight);

    // ベースの描画処理（renderTarget への描画用）
    baseScene = new THREE.Scene();

    //ベースの描画処理用カメラ
    baseCamera = new THREE.PerspectiveCamera(50, windowWidth / windowHeight, 0.1, 1000);
    baseCamera.position.z = 20;

    //ライトを追加
    var baseLight = new THREE.DirectionalLight(new THREE.Color(0xffffff), 1);
    baseLight.position.set(0, 10, 20);
    baseScene.add(baseLight);

    //ベース用のマテリアルとジオメトリ
    var texture = THREE.ImageUtils.loadTexture("assets/a.jpg");
    var baseGeometry = new THREE.BoxGeometry(10, 10, 10);
    var baseMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        wireframe: false
    });
    var baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseScene.add(baseMesh);

    renderer.render(baseScene, baseCamera);

    //オフスクリーンレンダリング用
    renderTarget = new THREE.WebGLRenderTarget(256, 256, {
        magFilter: THREE.NearestFilter,
        minFilter: THREE.NearestFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping
    });

    return { renderer: renderer, texture: renderTarget };
}

// キューブマップを生成する関数
export function generateCubeMap(): Promise<WebGLTexture> {
    return new Promise(resolve => {
        const gl = getGL();
        var program = gl.createProgram();
        if (!program) throw new Error("");

        var source = new Array(
            "assets/cube_PX.png",
            "assets/cube_PY.png",
            "assets/cube_PZ.png",
            "assets/cube_NX.png",
            "assets/cube_NY.png",
            "assets/cube_NZ.png"
        );
        var target = new Array(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        );

        const img: any[] = [];
        for (let i = 0; i < source.length; i++) {
            img[i] = new Image();
            img[i].src = source[i];
            img[i].onload = () => {
                img[i].imageDataLoaded = true;
                checkLoaded();
            };
        }

        const checkLoaded = () => {
            for (let j = 0; j < source.length; j++) {
                if (!img[j].imageDataLoaded) return;
            }
            final();
        };

        const final = () => {
            var tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
            // for (var j = 0; j < source.length; j++) gl.texImage2D(target[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            // gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

            if (!tex) throw new Error("");
            resolve(tex);
        };
    });
}

function getGL(): WebGLRenderingContext {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) throw new Error("");
    var gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
    return gl;
}
