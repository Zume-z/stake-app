<template>
  <div class="flex flex-col w-full h-screen bg-[#111729] text-gray-50 bg-[fbfbfd]">
    <Header />
    <Background />
    <router-view class="flex-1 min-h-0" />
  </div>
</template>

<script lang="ts">
import Header from './components/Header.vue'
import Background from './components/Background.vue'
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  components: {
    Header,
    Background,
  },
})
</script>
