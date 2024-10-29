import RecipeDetail from "@/components/detail/RecipeDetail.vue";
import axios from "axios";

export default {
    namespaced: true,
    state() {
        return {
            recipes: [],
            recipeDetail: []

        }
    },
    getters: {},
    mutations: {
        setRecipeData(state, payload) {
            state.recipes = payload
        },
        setRecipeDetail(state, payload) {
            state.recipeDetail = payload
        },
        setNewRecipe(state, payload) {
            state.recipes.push = payload;
        }
    },
    actions: {
        async getRecipeData({ commit }) {
            try {
                const { data } = await axios.get(
                    "https://vue-js-project-9f319-default-rtdb.firebaseio.com/recipes.json")

                const arr = []
                for (let key in data) {
                    arr.push({ id: key, ...data[key] })
                }

                commit("setRecipeData", arr)

            } catch (err) {
                console.error(err)
            }
        },

        async getRecipeDetail({ commit }, payload) {
            try {
                const uid = isNaN(Number(payload))
                const { data } = await axios.get(
                    `https://vue-js-project-9f319-default-rtdb.firebaseio.com/recipes/${uid ? `${payload}` : payload - 1}.json`)

                commit("setRecipeDetail", data)
                return data
            } catch (err) {
                console.error(err)

            }
        },

        async addNewRecipe({ commit, rootState }, payload) {

            try {
                const newData = {
                    ...payload,
                    username: rootState.auth.userLogin.username,
                    createdAt: Date.now(),
                    likes: ["null"],
                    userId: rootState.auth.userLogin.userId,
                };

                const { data } = await axios.post(
                    `https://vue-js-project-9f319-default-rtdb.firebaseio.com/recipes.json?auth=${rootState.auth.token}`, newData);

                commit("setNewRecipe", { id: data.name, ...newData });

            } catch (err) {
                console.log(err)
            }
        },

        async deleteRecipe({ dispatch, rootState }, payload) {
            try {
                const { data } = await axios.delete(
                    `https://vue-js-project-9f319-default-rtdb.firebaseio.com/recipes/${payload}.json?auth=${rootState.auth.token}`);
                await dispatch("getRecipeData")

            } catch (err) {
                console.log(err);
            }
        },

        async updateRecipe({ dispatch, rootState }, { id, newRecipe }) {
            try {
                const { data } = await axios.put(
                    `https://vue-js-project-9f319-default-rtdb.firebaseio.com/recipes/${id}.json?auth=${rootState.auth.token}`, newRecipe
                );

                await dispatch("getRecipeData")
            } catch (error) {
                console.log(error);
            }
        }
    }
}