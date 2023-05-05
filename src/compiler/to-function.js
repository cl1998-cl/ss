import { extend, noop } from '../util/share'

export function createCompileToFunctionFn(compile){
	const cache = Object.create(null)
	return (template, options, vm) => {
		options = extend({}, options)
		const warn = options.warn
		delete options.warn
		
		const key = options.delimiters
			? String(options.delimiters) + template
			: template
		if (cache[key]) {
			return cache[key]
		}
		
		const compiled = compile(template, options)
		const res = {}
		res.render = createFunction(compiled.render)
		res.staticRenderFns = 'res.staticRenderFns'
		
		return (cache[key] = res)
	}
}

function createFunction (code, errors) {
	try {
		return new Function(code)
	} catch (err) {
		errors.push({ err, code })
		return noop
	}
}
