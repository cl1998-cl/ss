import { createCompilerCreator } from './create-compiler'
import { parse } from './parser'
import { optimize } from './optimier'
import { generate } from './codegen'

export const createCompiler = createCompilerCreator((templates, options = {}) => {
	const ast = parse(templates.trim(), options)
	
	/*
	@todo 暂时不做静态标记
	* */
	if (options.optimize !== false) {
		optimize(ast, options)
	}
	/*
	* @todo 暂时只做简单的生成
	* */
	const code = generate(ast, options)
	return {
		ast,
		render: code.render,
		staticRenderFns: code.staticRenderFns
	}
})
