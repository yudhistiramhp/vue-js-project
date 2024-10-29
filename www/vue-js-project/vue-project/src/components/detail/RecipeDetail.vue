<template>
    <div class="col-12 col-sm-8">
        <recipe-description></recipe-description>
        <recipe-ingredients></recipe-ingredients>
        <recipe-directions></recipe-directions>
    </div>
</template>

<script setup>
    import { onMounted, ref } from "vue"
    import { useRoute } from "vue-router"
    import { useStore } from "vuex"
    import RecipeDescription from './RecipeDescription.vue'
    import RecipeDirections from "./RecipeDirections.vue"
    import RecipeIngredients from "./RecipeIngredients.vue"

    const store = useStore()
    const route = useRoute()

    // const recipesData = ref(null);

    onMounted(async () => {
        const result = await store.dispatch(
            "recipe/getRecipeDetail", route.params.id
        )
    })
</script>