<template>
  <div class="flex md:flex-row flex-col-reverse w-full max-w-screen-lg m-auto "> 
    <Content class="md:flex-1 mt-10" />
    </div>
</template>

<script lang="ts">
import Content from '../components/Content.vue'
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  components: {
    Content,
  },
})
</script>
