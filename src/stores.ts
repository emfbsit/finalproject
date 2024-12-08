import { writable } from "svelte/store"
import axios from "axios"

const questionStore = ((): object => {
	const { subscribe, update } = writable([])
	
	return {
	 	subscribe,
	 	getSessionToken: async function(): Promise<string> {
	 		let sessionToken?: string = localStorage.sessionToken
	 		console.log(this)
	 		
	 		if (!sessionToken) {
	 			return await this.fetchSessionToken()
	 		} else {
	 			let sessionTokenObject = JSON.parse(sessionToken)
	 			
	 			if (sessionTokenObject.age - Date.now() >= 21600000) {
	 				return await this.fetchSessionToken()
	 			}
	 			
	 			return sessionTokenObject.tokenStr
	 		}
	 		
	 	},
	 	fetchSessionToken: async function() {
 			const res = await axios.get("https://opentdb.com/api_token.php?command=request")
 			
 			localStorage.sessionToken = JSON.stringify({
 				tokenStr: res.data.token,
 				age: Date.now()
 			})
 			
 			return res.data.token
	 	}
		loadQuestions: async function(difficulty: string, token: string): Promise<void> {
			const req = await axios.get(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&token=${token}`)
			update(questions => [...questions, ...req.data.results])
		}
	}
}())

export {
	questionStore
}