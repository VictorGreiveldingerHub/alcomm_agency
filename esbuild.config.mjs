import { glsl } from "esbuild-plugin-glsl";

export default {
  entryPoints: ["app.js"],
  outfile: "public/js/dist/out.js",
  bundle: true,
  plugins: [
    glsl({
      extensions: [".glsl"],
      compress: true,
    }),
  ],
};
