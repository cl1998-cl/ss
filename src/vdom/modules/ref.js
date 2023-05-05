import { isDef, remove } from '../../util/share'

export default {
	create(_, vnode){
		registerRef(vnode)
	},
	update(oldVnode, vnode){
		if (oldVnode.data.ref !== vnode.data.ref) {
			registerRef(oldVnode, true)
			registerRef(vnode)
		}
	},
	destroy(vnode){
		registerRef(vnode, true)
	}
}


function registerRef(vnode, isRemoval){
	const key = vnode.data.ref
	if (!isDef(key)) return
	
	const vm = vnode.context
	const ref = vnode.componentIntance || vnode.elm
	const refs = vm.$refs
	if(isRemoval){
		//删除
		if(Array.isArray(refs[key])){
			remove(refs[key], ref)
		}else if(refs[key] === ref){
			refs[key] = undefined
		}
	}else {
		//添加
		if(vnode.data.refInFor){
			if(!Array.isArray(refs[key])){
				refs[key] = [ref]
			}else if(refs[key].indexOf(ref) < 0 ){
				refs[key].push(ref)
			}
		}else {
			refs[key] = ref
		}
	}
}
