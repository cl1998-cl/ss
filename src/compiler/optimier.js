

//标记静态节点
export function optimize(root, options){
	if (!root) return
	markStatic(root)
	markStaticRoots(root, false)
}


function markStatic(node){

}

function markStaticRoots(){

}

function isStatic (node) {
	if (node.type === 2) { // expression
		return false
	}
	if (node.type === 3) { // text
		return true
	}
	//暂时
	return true
}
