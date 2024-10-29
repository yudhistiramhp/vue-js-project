<template>
    <main>
        <div class="container-md my-5 py-5">
            <recipe-form v-if="detailData && !isLoading" :isEdit="true"></recipe-form>
        </div>
    </main>
</template>

<script setup>
    import RecipeForm from '../recipeForm/RecipeForm.vue';
    import { useRoute } from 'vue-router';
    import { useStore } from 'vuex';
    import { onMounted, ref } from 'vue';

    const store = useStore();
    const route = useRoute();
    const detailData = ref(null);
    const isLoading = ref(false);

    onMounted(async () => {
        isLoading.value = true;
        try {
            await store.dispatch('getRecipeDetail', route.params.id)
            detailData.value = store.state.recipe.recipeDetail;
        } catch (err) {
            console.log(err)
        }
        isLoading.value = false;
    })
</script>