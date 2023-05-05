import { createCompileToFunctionFn } from './to-function'
import { extend } from '../util/share'

export function createCompilerCreator(baseCompile){
	return (baseOptions) => {
		function compiler(template, options){
			const finalOptions = Object.create(baseOptions)
			if(options){
				if (options.modules) {
					finalOptions.modules =
						(baseOptions.modules || []).concat(options.modules)
				}
				// merge custom directives
				if (options.directives) {
					finalOptions.directives = extend(
						Object.create(baseOptions.directives || null),
						options.directives
					)
				}
				// copy other options
				for (const key in options) {
					if (key !== 'modules' && key !== 'directives') {
						finalOptions[key] = options[key]
					}
				}
			}
			const compiled = baseCompile(template.trim(), finalOptions)
			compiled.a = 'return compiled'
			return compiled
		}
		return {
			compiler,
			compileToFunctions: createCompileToFunctionFn(compiler)
			// compileToFunctions: () => {
			// 	console.log('compileToFunctions')
			// }
		}
	}
}
