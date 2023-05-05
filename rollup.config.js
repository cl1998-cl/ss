import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
export default{
	input: './src/index.js',
	output:{
		file: './dist/vue.js',
		name: 'Vue',
		format: 'umd',
		sourcemap: true
	},
	plugins: [
		babel({
			exclude: 'node_modules/**'
		}),
		serve({
			port: 3000,
			contentBase: './dist',
			openPage: './index.html'
		}),
		resolve()
	]
}
