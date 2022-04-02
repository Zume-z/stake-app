import Web3Modal from 'web3modal'
import Fortmatic from 'fortmatic'
import { utils } from 'ethers/lib'
import { ethers, constants } from 'ethers'
import ethAbi from '../assets/abi/ethAbi.json'
import rewAbi from '../assets/abi/rewAbi.json'
import tokenFarm from '../assets/abi/tokenFarmAbi.json'
import { computed, ComputedRef, Ref, ref } from 'vue'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { Web3Provider, ExternalProvider } from '@ethersproject/providers'

let signer: any
let provider: Web3Provider | null = null
const error: Ref<string> = ref('')
const account: Ref<string> = ref('')
const connected: ComputedRef<boolean> = computed(() => !!account.value)
const ethTokenBalance: Ref<string> = ref('0.0')
const rewTokenBalance: Ref<string> = ref('0.0')
const stakeBalance: Ref<string> = ref('0.0')
const yieldBalance: Ref<string> = ref('0.0')

// Rinkebyy
const ethTokenAddress = '0x6516DD1E91b5A7661664A09B66DE20993D31F641'
const rewTokenAddress = '0x896c6357540116F6943F025ac4D16450F5ad06b9'
const tokenFarmAddress = '0x442E86dEe941A99BAE8bf50f5b9D32DB1e4c39Fc'

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  theme: {
    background: 'rgb(18, 23, 40)',
    main: 'rgb(199, 199, 199)',
    secondary: 'rgb(136, 136, 136)',
    border: 'rgba(255, 255, 255, 0.14)',
    hover: 'rgb(32, 49, 74)',
  },
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: { infuraId: import.meta.env.VITE_INFURA_KEY },
    },
    fortmatic: {
      package: Fortmatic, // required
      options: { key: import.meta.env.VITE_FORTMATIC_KEY },
    },
  },
})

const connect = async () => {
  try {
    console.log('connecting wallet...')
    const instance = await web3Modal.connect()
    instance.on('accountsChanged', updateWallet)
    instance.on('disconnect', updateWallet)
    provider = new Web3Provider(instance)
    const externalProvider = provider.provider as ExternalProvider
    const accounts = await externalProvider.request!({ method: 'eth_requestAccounts' })
    setSigner(provider.getSigner())
    setAccount(accounts[0])
    getBalances()
    console.log('Wallet Connected')

    provider.on('block', (blockNumber) => {
      getBalances()
    })
  } catch (err) {
    console.log(err)
    error.value = 'Error retrieving account.'
  }
}

const connectOnLoad = async () => {
  if (web3Modal.cachedProvider)
    try {
      console.log('Reconnecting wallet...')
      const connectedUser = await web3Modal.connect()
      provider = new Web3Provider(connectedUser)
      setSigner(provider.getSigner())
      setAccount(connectedUser.selectedAddress)
      getBalances()
      console.log('walletConnected')
    } catch (err) {
      console.log(err)
    }
}

const disconnect = async () => {
  setAccount('')
  web3Modal.clearCachedProvider()
}

const getProvider = () => {
  if (provider) return provider
  throw new Error('Provider has not been set.')
}

const updateWallet = async () => {
  if (provider) {
    const accounts = await provider.listAccounts()
    if (accounts.length) account.value = accounts[0]
  }
}

const setSigner = (signature: any) => {
  signer = signature
}

const setAccount = (newAccount: string) => {
  if (newAccount === '') {
    account.value = ''
    localStorage.removeItem('userConnected')
  } else {
    account.value = newAccount
    localStorage.setItem('userConnected', account.value)
  }
}

const setBalances = (newEthBalance: string, newRewBalance: string, newStakeBalance: string, newYieldBalance: string) => {
  ethTokenBalance.value = newEthBalance
  rewTokenBalance.value = newRewBalance
  stakeBalance.value = newStakeBalance
  yieldBalance.value = newYieldBalance
}

const getBalances = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const ethTokenContract = new ethers.Contract(ethTokenAddress, ethAbi, signer)
    const rewTokenConract = new ethers.Contract(rewTokenAddress, rewAbi, signer)
    const tokenFarmContract = new ethers.Contract(tokenFarmAddress, tokenFarm, signer)
    const ethBalance = utils.formatEther(await ethTokenContract.balanceOf(account.value))
    const rewBalance = utils.formatEther(await rewTokenConract.balanceOf(account.value))
    const stakeBalance = utils.formatEther(await tokenFarmContract.stakeBalance(account.value))
    const calculatedYield = String(await tokenFarmContract.calculateYieldTotal(account.value))
    const yieldStoredBalance = String(await tokenFarmContract.yieldBalance(account.value))
    const totalYield = calculatedYield + yieldStoredBalance
    const yieldBalance = utils.formatEther(totalYield)
    setBalances(ethBalance, rewBalance, stakeBalance, yieldBalance)
  }
}

const stake = async (stakeInput: string) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      console.log('Staking...')
      const ethTokenContract = new ethers.Contract(ethTokenAddress, ethAbi, signer)
      const rewTokenConract = new ethers.Contract(rewTokenAddress, rewAbi, signer)
      const tokenFarmContract = new ethers.Contract(tokenFarmAddress, tokenFarm, signer)
      const parsedInput = utils.parseUnits(stakeInput.toString(), 'ether')
      await ethTokenContract.connect(signer).approve(tokenFarmContract.address, constants.MaxUint256)
      const stake = await tokenFarmContract.stake(parsedInput)
      await provider!.waitForTransaction(stake.hash, 1, 150000).then(async () => {
        console.log('Stake Successful')
        await getBalances()
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    console.log('Contract not found.')
  }
}

const unstake = async (unstakeInput: string) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      console.log('Unstaking...')
      const tokenFarmContract = new ethers.Contract(tokenFarmAddress, tokenFarm, signer)
      const parsedInput = utils.parseUnits(unstakeInput.toString(), 'ether')
      const unstake = await tokenFarmContract.unstake(parsedInput)
      await provider!.waitForTransaction(unstake.hash, 1, 150000).then(async () => {
        console.log('Unstake Successful')
        await getBalances()
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    console.log('Contract not found.')
  }
}

const withdrawYield = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      console.log('Withdrawing...')
      const tokenFarmContract = new ethers.Contract(tokenFarmAddress, tokenFarm, signer)
      const withdraw = await tokenFarmContract.withdrawYield()
      await provider!.waitForTransaction(withdraw.hash, 1, 150000).then(async () => {
        console.log('Withdraw Success')
        await getBalances()
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    console.log('Contract not found.')
  }
}

const unstakeAll = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      console.log('Unstaking...')
      const tokenFarmContract = new ethers.Contract(tokenFarmAddress, tokenFarm, signer)
      const unstakeAll = await tokenFarmContract.unstakeAll()
      await provider!.waitForTransaction(unstakeAll.hash, 1, 150000).then(async () => {
        console.log('Unstaked All Success')
        await getBalances()
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    console.log('Contract not found.')
  }
}

const claimMockEth = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      console.log('Claiming Mock Eth...')
      const tokenFarmContract = new ethers.Contract(tokenFarmAddress, tokenFarm, signer)
      const claimEth = await tokenFarmContract.claimMockEth()
      await provider!.waitForTransaction(claimEth.hash, 1, 150000).then(async () => {
        console.log('Claimed Mock Eth Success')
        await getBalances()
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    console.log('Contract not found.')
  }
}

export default () => ({
  account,
  connect,
  connected,
  connectOnLoad,
  disconnect,
  ethTokenBalance,
  stakeBalance,
  yieldBalance,
  stake,
  unstake,
  withdrawYield,
  unstakeAll,
  claimMockEth,
})
