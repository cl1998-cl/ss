import * as nodeOps from './web/node-ops'
import baseModules from './modules/index'
import platformModules from './web/modules/index'
import { VNode } from './vnode'
import { isDef } from '../util/share'


const modules = [...baseModules, ...platformModules]
export const emptyNode = new VNode('', {}, [])

const hooks = ['create', 'activate', 'update', 'remove', 'destroy']



export function patch(){
	return createPatchFunction({nodeOps, modules})
}

export function createPatchFunction(backend){
	let i, j, cbs = {}
	const {modules, nodeOps} = backend
	
	//合并
	for(i = 0; i < hooks.length; ++i){
		cbs[hooks[i]] = []
		for (j = 0; j < modules.length; ++j) {
			if (isDef(modules[j][hooks[i]])) {
				cbs[hooks[i]].push(modules[j][hooks[i]])
			}
		}
	}
	
	//定义了许多函数
	
	
	
	
	
	return (oldVnode, vnode, hydrating, removeOnly) => {
		console.log('执行了patch')
		return 'patch'
	}
	
}
