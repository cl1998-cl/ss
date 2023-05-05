import { emptyNode } from '../patch'
import { no } from '../../util/share'
import { mergeVNodeHook } from '../helper/merge-hook'
import { resolveAsset } from '../../util/options'

export default {
	create: updateDirectives,
	update: updateDirectives,
	destroy: vnode => {
		updateDirectives(vnode, emptyNode)
	}
}


//更新
function updateDirectives(oldVnode, vnode){
	if(oldVnode.data.directives || vnode.data.directives){
		_update(oldVnode, vnode)
	}
}

/**
 * @author pomelo
 * @param oldVnode 。。。
 * @param vnode 。。。
 * @private
 */
function _update(oldVnode, vnode){
	const isCreate = oldVnode === emptyNode
	const isDestroy = vnode === emptyNode
	const oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context)
	const newDirs = normalizeDirectives(vnode.data.directives, vnode.context)
	
	const dirsWithInsert = []
	const dirsWithPostPatch = []
	
	let key, oldDir, dir
	for(key in newDirs){
		oldDir = oldDirs[key]
		dir = newDirs[key]
		
		if(!oldDir){
			callHook(dir, 'bind', vnode, oldVnode)
			if(dir.def && dir.def.inserted){
				dirsWithInsert.push(dir)
			}
		}else {
			dir.oldValue = oldDir.value
			dir.oldArg = oldDir.arg
			callHook(dir, 'update', vnode, oldVnode)
			if (dir.def && dir.def.componentUpdated) {
				dirsWithPostPatch.push(dir)
			}
		}
	}
	
	if(dirsWithInsert.length){
		const callInsert = () => {
			for(let i = 0; i < dirsWithInsert.length; i++){
			    callHook(dirsWithInsert[i], 'inserted', vnode,oldVnode)
			}
		}
		
		if(isCreate){
			mergeVNodeHook(vnode, 'insert', callInsert)
		}else {
			callInsert()
		}
	}
	
	if(dirsWithPostPatch.length){
		mergeVNodeHook(vnode, 'postpatch', () => {
			for (let i = 0; i < dirsWithPostPatch.length; i++) {
				callHook(dirsWithPostPatch[i], 'componentUpdated', vnode, oldVnode)
			}
		})
	}
	
	if(!isCreate){
		for(key in oldDirs){
			if(!newDirs[key]){
				callHook(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy)
			}
		}
	}
	
}
const emptyModifiers = Object.create(null)

function normalizeDirectives(dirs, vm){
	const res = Object.create(null)
	if(!dirs) return res
	
	let i, dir
	for( i = 0; i < dirs.length; i++){
	    dir = dirs[i]
		if (!dir.modifiers) {
			dir.modifiers = emptyModifiers
		}
		res[getRawDirName(dir)] = dir
		dir.def = resolveAsset(vm.$options, 'directives', dir.name, true)
	}
	return res
}

function getRawDirName (dir) {
	return dir.rawName || `${dir.name}.${Object.keys(dir.modifiers || {}).join('.')}`
}

function callHook(dir, hook, vnode, oldVnode, isDestroy){
	const fn = dir.def && dir.def[hook]
	if(fn){
		try{
			fn(vnode.elm, dir, oldVnode, isDestroy)
		}catch (e){
			console.log(e)
		}
	}
}

