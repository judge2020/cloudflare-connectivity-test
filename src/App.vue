<template>
 <div id="app" class="container">
    <Main/>
 </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Main from './components/Main.vue';

@Options({
  components: {
    Main,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "~bulma";
</style>
