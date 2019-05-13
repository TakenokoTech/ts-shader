console.log(
    ((gl: any) => {
        try {
            gl = document.createElement("canvas").getContext("experimental-webgl");
            const ext = gl.getExtension("WEBGL_debug_renderer_info");
            return !ext ? "" : gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
        } catch (e) {
            gl = null;
            return "";
        }
    })(null)
);

console.log(`window.devicePixelRatio=${window.devicePixelRatio}`);
