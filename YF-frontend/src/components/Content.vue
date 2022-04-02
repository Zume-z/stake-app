<template>
  <div class="flex flex-col font-Nb m-auto">
    <!-- Stake Button -->

    <div class="border-2 border-gray-800 p-2">
      <div class="border-2 border-gray-50 p-10 relative">
        <Loader v-if="loading" class="absolute w-full h-full top-0 left-0" />
        <div :class="loading && 'opacity-0'">
          <div class="flex flex-row w-full place-content-center text-center mb-8">
            <div class="grid w-full grid-cols-3">
              <div class="text-xl col-start-2">Yield Farm</div>
              <div class="flex justify-end">
                <div
                  class="text-xl w-8 border-gray-800 box-border border transition duration-300 ease-in-out font-Nb hover:bg-gray-100 hover:text-gray-900 active:bg-gray-300 z-10 cursor-pointer"
                  @click="helpToggle()"
                >
                  ?
                </div>
              </div>
            </div>
          </div>
          <div class="text-sm text-gray-200 py-2">Stake (ETH)</div>

          <div class="relative flex border border-gray-50 box-content mb-8">
            <input
              v-model.number="stakeInput"
              type="number"
              :placeholder="ethTokenBalance"
              class="flex-1 p-4 text-sm font-Nb transition duration-300 ease-in-out focus:outline-none bg-transparent"
            />
            <span class="text-gray-500 hover:text-gray-50 active:text-gray-300 duration-300 ease-in-out mr-4 my-4 text-sm cursor-pointer" @click="maxStake(ethTokenBalance)"
              >MAX</span
            >

            <div
              class="relative border-l border-gray-400 shadow-sm px-8 py-4 text-left cursor-pointer focus:outline-none text-sm hover:bg-gray-100 hover:text-gray-900 active:bg-gray-300 transition duration-300 ease-in-out"
              @click="runStake(stakeInput), clear()"
            >
              <span class="text-center">Stake</span>
            </div>
          </div>

          <!-- Unstake Button -->
          <div class="text-sm py-2 text-gray-200">Unstake (ETH)</div>
          <div class="relative flex border border-gray-50 box-content mb-8">
            <input
              v-model.number="unstakeInput"
              type="number"
              :placeholder="stakeBalance"
              class="flex-1 p-4 text-sm font-Nb transition duration-300 ease-in-out focus:outline-none bg-transparent ]"
            />
            <span class="text-gray-500 hover:text-gray-50 active:text-gray-300 duration-300 ease-in-out mr-4 my-4 text-sm cursor-pointer" @click="MaxUnstake(stakeBalance)"
              >MAX</span
            >

            <div
              class="relative w-22 border-l border-gray-400 shadow-sm p-6 py-4 text-left cursor-pointer focus:outline-none text-sm hover:bg-gray-100 hover:text-gray-900 active:bg-gray-300 transition duration-300 ease-in-out"
              @click="runUnstake(unstakeInput), clear()"
            >
              <span class="text-center">Unstake</span>
            </div>
          </div>

          <!-- Yield Button -->
          <div class="text-sm py-2 text-gray-200">Rewards (REW)</div>
          <div class="relative flex border border-gray-50 box-content mb-8">
            <input
              type="number"
              :placeholder="yieldBalance"
              class="flex-1 p-4 text-sm font-Nb transition duration-300 ease-in-out focus:outline-none bg-transparent cursor-not-allowed"
              readonly
            />

            <div
              class="relative border-l border-gray-400 shadow-sm px-7 py-4 text-left cursor-pointer focus:outline-none text-sm hover:bg-gray-100 hover:text-gray-900 active:bg-gray-300 transition duration-300 ease-in-out"
              @click="runWithdrawYield(), clear()"
            >
              <span class="text-center">Collect</span>
            </div>
          </div>

          <div class="flex justify-between py-2">
            <!-- Unstake + collect -->
            <div
              class="relative w-48 border border-gray-50 shadow-sm mb-2 p-4 text-center cursor-pointer focus:outline-none text-sm hover:bg-gray-50 hover:text-gray-900 active:bg-gray-300 transition duration-300 ease-in-out"
              @click="runUnstakeAll(), clear()"
            >
              <span class="text-center">Unstake + Collect</span>
            </div>

            <div class="text-xs text-gray-400">
              <div>Rinkeby Network</div>
              <div>REW Token: 0x896c6357540116F6943F025ac4D16450F5ad06b9</div>
              <div>Mock ETH Token: 0x6516DD1E91b5A7661664A09B66DE20993D31F641</div>
              <div>Yield Farm Contract: 0x442E86dEe941A99BAE8bf50f5b9D32DB1e4c39Fc</div>
            </div>
          </div>
        </div>

        <Help v-if="help" class="absolute w-full h-full top-0 left-0" />
        <div :class="help && 'opacity-0'"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Loader from './Loader.vue'
import Help from './Help.vue'
import { defineComponent } from '@vue/runtime-core'
import walletConnectFunction from '../compositions/useWalletConnectFunction'

export default defineComponent({
  components: {
    Loader,
    Help,
  },

  setup() {
    const { ethTokenBalance, stakeBalance, yieldBalance, stake, unstake, withdrawYield, unstakeAll } = walletConnectFunction()
    return {
      ethTokenBalance,
      stakeBalance,
      yieldBalance,
      stake,
      unstake,
      withdrawYield,
      unstakeAll,
    }
  },

  data: () => ({
    loading: false,
    help: false,
    stakeInput: '',
    unstakeInput: '',
    stakedAmount: '0.0',
  }),
  methods: {
    maxStake(ethTokenBalance: string) {
      this.stakeInput = ethTokenBalance
    },
    MaxUnstake(stakeBalance: string) {
      this.unstakeInput = stakeBalance
    },
    clear() {
      this.stakeInput = ''
      this.unstakeInput = ''
    },
    async runStake(amount: string) {
      this.loading = true
      await this.stake(amount)
      this.loading = false
    },
    async runUnstake(amount: string) {
      this.loading = true
      await this.unstake(amount)
      this.loading = false
    },
    async runUnstakeAll() {
      this.loading = true
      await this.unstakeAll()
      this.loading = false
    },
    async runWithdrawYield() {
      this.loading = true
      await this.withdrawYield()
      this.loading = false
    },
    helpToggle() {
      if (this.help == false) {
        this.help = true
      } else {
        this.help = false
      }
    },
  },
})
</script>
