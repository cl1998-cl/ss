import config from '../config'
import { remove } from '../util/share'

let uid = 0
export class Dep{
	static target;
	id;
	subs;
	
	constructor () {
		this.id = uid++
		this.subs = []
	}
	
	depend(){
		if(Dep.target){
			
			//Dep.target.addDep()
		}
	}
	
	notify(){
		const subs = this.subs.slice()
		if(!config.async){
			subs.sort((a, b) => a.id - b.id)
		}
		for(let i = 0, length = subs.length; i < length; i++){
		    subs[i].update()
		}
	}
	addSub (sub) {
		this.subs.push(sub)
	}
	
	removeSub (sub) {
		remove(this.subs, sub)
	}
}


Dep.target = null
const targetStack = []
export function pushTarget (target) {
	targetStack.push(target)
	Dep.target = target
}

export function popTarget () {
	targetStack.pop()
	Dep.target = targetStack[targetStack.length - 1]
}
