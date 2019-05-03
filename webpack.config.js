const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const entry = {
    app: "./src/sample/app",
}

const babelRule = {
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    loader: "babel-loader"
}

const shaderRule = {
    test: /\.(glsl|vert)$/,
    loader: 'ts-shader-loader'
}

const development = {
    entry: entry,
    output: {
        path: path.resolve(__dirname, "dev-dist"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json", ".glsl", ".vert"]
    },
    module: {
        rules: [babelRule, shaderRule]
    },
    plugins: [
        new CopyWebpackPlugin([{ from: ".", to: ".", ignore: ["!*.html"] }], { context: "static" }),
        new CopyWebpackPlugin([{ from: ".", to: ".", ignore: ["!*.css"] }], { context: "static/css" })
    ],
    devtool: "inline-source-map"
};

const production = {
    mode: "production",
    entry: entry,
    output: {
        path: path.resolve(__dirname, "prod-dist"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json", ".glsl"]
    },
    module: {
        rules: [babelRule, shaderRule]
    },
    plugins: [
        new CopyWebpackPlugin([{ from: ".", to: ".", ignore: ["!*.html"] }], { context: "static" }),
        new CopyWebpackPlugin([{ from: ".", to: ".", ignore: ["!*.css"] }], { context: "static/css" })
    ]
};

if ((process.env.NODE_ENV || "").trim() != "production") {
    console.log("NODE_ENV", "development");
    module.exports = development;
} else {
    console.log("NODE_ENV", "production");
    module.exports = production;
}