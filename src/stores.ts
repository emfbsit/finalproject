import { writable } from "svelte/store";
import axios from "axios";

const questionStore = (() => {
    const { subscribe, update } = writable([]);

    return {
        subscribe,
        getSessionToken: async function () {
            let sessionToken = localStorage.sessionToken;

            if (!sessionToken) {
                return await this.fetchSessionToken();
            } else {
                let sessionTokenObject = JSON.parse(sessionToken);

                // Check if the token is older than 6 hours
                if (Date.now() - sessionTokenObject.age >= 21600000) {
                    return await this.fetchSessionToken();
                }

                return sessionTokenObject.tokenStr;
            }
        },
        fetchSessionToken: async function () {
            const res = await axios.get("https://opentdb.com/api_token.php?command=request");

            localStorage.sessionToken = JSON.stringify({
                tokenStr: res.data.token,
                age: Date.now(),
            });

            return res.data.token;
        },
        loadQuestions: async function (difficulty, token) {
            const req = await axios.get(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&token=${token}`);
            update((questions) => [...questions, ...req.data.results]);
        },
    };
})();

export { questionStore };
