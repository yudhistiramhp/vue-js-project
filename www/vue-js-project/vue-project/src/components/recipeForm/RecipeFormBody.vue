<template>
    <li class="list-group-item">
      <form @submit.prevent="addNewRecipe">
        <!-- General Information Start -->
        <div>
          <p class="my-3 fs-5 fw-semibold">General Information</p>
          <div>
            <base-input type="file" identity="recipeImage" label="Photo Recipe" class="mb-3" @input="checkImage"> <!-- 1 --></base-input>

            <div>
              <img :src="recipeData.imageLink" :alt="recipeData.name" class="image">
            </div>
  
            <base-input type="text" identity="recipeTitle" placeholder="Give your recipe a title" label="Recipe Title" class="mb-3" v-model="recipeData.name"> <!-- 2 --> </base-input>
            
            <base-text-area identity="recipeDescription" label="Description" placeholder="Share story behind recipe and what is make it special" class="mb-3" v-model="recipeData.description"> <!-- 3 --> </base-text-area>

            <base-select :data="['Breakfast','Lunch','Dinner','Meals','Snacks']" class="mb-3" v-model="recipeData.category"> <!-- 4 --> </base-select>
          </div>
        </div>
        <!-- General Information End -->
  
        <!-- Time Setting Start -->
        <div class="border-top py-1">
          <p class="my-3 fs-5 fw-semibold">Time Setting</p>
          <div>
            <base-input type="number" identity="prepTime" placeholder="0" label="Prep Time" class="mb-3" v-model="recipeData.prepTime"> <!-- 5 --> </base-input>
  
            <base-input type="number" identity="cookTime" placeholder="0" label="Cook Time" class="mb-3" v-model="recipeData.cookTime"> <!-- 6 --> </base-input>
            
            <base-input type="number" identity="totalTime" placeholder="0" label="Total Time"class="mb-3" v-model="recipeData.totalTime" @totalTimeFocus="totalTime" readonly="1"> <!-- 7 --></base-input>
          </div>
        </div>
        <!-- Time Setting End -->
  
        <!-- Ingredients Start -->
        <div class="border-top py-1">
          <p class="my-3 fs-5 fw-semibold">Ingredients</p>
          <p>
            Enter one ingredient per line. Include the quantity (i.e. cups,
            tablespoons) and any special preparation (i.e. sifted, softened,
            chopped). Use optional headers to organize the different parts of the
            recipe (i.e. Cake, Frosting, Dressing).
          </p>
          <div>
            <div class="mb-3 row" v-for="count in ingredientCount" :key="count">
              <base-input type="text" identity="ingredient" placeholder="Ex: 1 cup sugar" class="col-lg-11 col-11"  v-model="recipeData.ingredients[count - 1]"> <!-- 8 --> </base-input>
              <div
                class="col-lg-1 col-1 col-form-label align-self-end delete-ingredient"
                style="color: #cb3a31"
                v-if="ingredientCount > 1" @click="deleteIngredient(count - 1)"
              >
                <i class="fa-regular fa-trash-can px-1"></i
                ><span class="d-none d-md-inline">Delete</span>
              </div>
            </div>
          </div>
          <base-button class="new-ingredient-btn px-3 py-2" type="button" @clickButton="addIngredient">
          + Add More
        </base-button>
        </div>
        <!-- Ingredients End -->
  
        <!-- Direction Start -->
        <div class="border-top my-3">
          <p class="my-3 fs-5 fw-semibold">Directions</p>
          <p>
            Explain how to make your recipe, including oven temperatures, baking
            or cooking times, and pan sizes, etc. Use optional headers to organize
            the different parts of the recipe
          </p>
          <div>
            <div class="mb-3 row" v-for="count in directionCount" :key="count">
              <base-input type="text" identity="direction" placeholder="Ex: 1 cup sugar" class="col-lg-11 col-11" v-model="recipeData.directions[count - 1]"><!-- 10 --></base-input>
              <div
                class="col-lg-1 col-1 col-form-label align-self-end delete-ingredient"
                style="color: #cb3a31"
                v-if="directionCount > 1" @click="deleteDirection(count - 1)"
              >
                <i class="fa-regular fa-trash-can px-1"></i
                ><span class="d-none d-md-inline">Delete</span>
              </div>
            </div>
          </div>
          <base-button class="new-ingredient-btn px-3 py-2" type="button" @clickButton="addDirection">
          + Add More
            </base-button>
        </div>
        <!-- Direction End -->
  
        <!-- Form Button Start -->
        <div class="border-top py-3 d-flex my-4 justify-content-end">
          <base-button class="cancel-btn px-3 py-2 ms-1">
          Cancel
            </base-button>
  
          <base-button type="submit" class="submit-recipe-btn px-3 py-2 ms-1">
          Submit
            </base-button>
        </div>
        <!-- Form Button End -->
      </form>
    </li>
  </template>

<script setup>
import BaseButton from '../ui/BaseButton.vue';
import BaseInput from '../ui/BaseInput.vue';
import BaseTextArea from '../ui/BaseTextArea.vue';
import BaseSelect from '../ui/BaseSelect.vue';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();

onMounted(async () => {
    if (props.isEdit) {
        await store.dispatch('recipe/getRecipeDetail', route.params.id);
        recipeData.value = store.state.recipe.recipeDetail;
        ingredientCount.value = recipeData.value.ingredients.length;
        directionCount.value = recipeData.value.directions.length;
    }
});



// onMounted(async () => {
//   if (props.isEdit) {
//     await store.dispatch(
//       "recipe/getRecipeDetail", route.params.id
//     )
//   }
// })

const recipeData = ref({
  imageLink: "",
    name: "",
    description: "",
    category: "",
    prepTime: 0,
    cookTime: 0,
    totalTime: 0,
    ingredients: [],
    directions: [],
});


const ingredientCount = ref(1);
const directionCount = ref(1);

const addIngredient = () => {
    ingredientCount.value++;
};

const addDirection = () => {
    directionCount.value++;
};

const deleteIngredient = (index) => {
    recipeData.value.ingredients.splice(index, 1);
    ingredientCount.value--;
};

const deleteDirection = (index) => {
    recipeData.value.directions.splice(index, 1);
    directionCount.value--;
};

const totalTime = () => {
    recipeData.value.totalTime = parseInt(recipeData.value.prepTime) +
        parseInt(recipeData.value.cookTime);
};

const checkImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
        recipeData.value.imageLink = reader.result;
    });
};

const store = useStore();
const router = useRouter();

const addNewRecipe = async () => {
    if (props.isEdit) {
        await store.dispatch("recipe/updateRecipe", {
            id: route.params.id,
            newRecipe: recipeData.value,
        });
        router.push("/"); 
    } else {
        await store.dispatch("recipe/addNewRecipe", recipeData.value);
        router.push("/"); 
    }
};

const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false
    }
});

</script>
