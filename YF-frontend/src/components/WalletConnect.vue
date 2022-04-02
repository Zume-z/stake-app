<template>
  <div class="grid justify-end">
    <button
      v-if="!connected"
      class="border-gray-800 box-border p-4 border text-sm transition duration-300 ease-in-out font-Nb hover:bg-gray-100 hover:text-gray-900 active:bg-gray-300"
      @click="connect"
    >
      CONNECT WALLET
    </button>
    <button v-else class="border-gray-800 box-border p-4 border text-sm  transition duration-300 ease-in-out font-Nb hover:bg-gray-100 hover:text-gray-900" @click="disconnect">
      {{ formattedAddress }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import useConnectWallet from '../compositions/useWalletConnectFunction'
export default defineComponent({
  data: () => ({}),
  setup() {
    const { connected, connect, disconnect, account, connectOnLoad } = useConnectWallet()
    return { connected, connect, disconnect, account, connectOnLoad }
  },
  mounted() {
    this.connectOnLoad()
  },
  computed: {
    formattedAddress() {
      return `${this.account.slice(0, 6)}...${this.account.slice(38, 42)}`
    },
  }
})
</script>
