<template>
  <div class="w-full h-full flex flex-col items-center bg-[#111729]">
    <div class="flex flex-row w-full place-content-center text-center p-10">
      <div class="grid w-full grid-cols-3">
        <div class="text-xl col-start-2">How To.</div>
        <div class="flex justify-end"></div>
      </div>
    </div>
    <div class="px-10 space-y-5 text-base">
      <div>*DAPP is for test purposes on the Rinkeby test newtork only.</div>
      <div>Step 1: Change network to Rinkeby test network.</div>
      <div>Step 2: Connect wallet to DAPP with "connect wallet" button.</div>
      <div>Step 3: Claim Mock Eth Token with "claim" button below.</div>
      <div>Step 4: Stake claimed Eth in yield farm.</div>
      <div>Step 5: Claim REW token.</div>
    </div>
    <div class="p-8">
      <div
        class="relative w-48 border border-gray-50 shadow-sm p-6 py-4 text-center cursor-pointer focus:outline-none text-sm hover:bg-gray-50 hover:text-gray-900 active:bg-gray-300 transition duration-300 ease-in-out"
        @click="claimMockEth"
      >
        <span class="text-center">Claim 10 Mock ETH</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import walletConnectFunction from '../compositions/useWalletConnectFunction'

export default defineComponent({
  setup() {
    const { claimMockEth } = walletConnectFunction()
    return {
      claimMockEth,
    }
  },
})
</script>
