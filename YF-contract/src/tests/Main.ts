import { assert, expect, should } from 'chai'
import { ethers } from 'hardhat'
import { parseUnits } from 'ethers/lib/utils'
import { Contract } from '@ethersproject/contracts'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('Liquidity Pool Test', () => {
  let EthTokenContract: any
  let RewTokenContract: any
  let TokenFarmContract: any
  let deployerWallet: SignerWithAddress
  let investorWallet: SignerWithAddress
  let wallet3: SignerWithAddress

  beforeEach(async function () {
    ;[deployerWallet, investorWallet, wallet3] = await ethers.getSigners()
    EthTokenContract = await (await ethers.getContractFactory('EthToken')).deploy()
    RewTokenContract = await (await ethers.getContractFactory('EthToken')).deploy()
    TokenFarmContract = await (await ethers.getContractFactory('TokenFarm')).deploy(RewTokenContract.address, EthTokenContract.address)

    await EthTokenContract.transfer(investorWallet.address, parseUnits('100', 'ether'))
    await RewTokenContract.transfer(TokenFarmContract.address, parseUnits('1000000', 'ether'))
  })

  describe('Token Farm Test', () => {
    it('Token Farm has RewTokens', async () => {
      let balance = await RewTokenContract.balanceOf(TokenFarmContract.address)
      expect(balance).to.be.equal(parseUnits('1000000', 'ether'))
    })
  })


  describe('Farming tokens', () => {
    it('Rewards investors for staking mockEth tokens', async () => {
      let res: any

      // Check Investor balance before staking
      res = await EthTokenContract.balanceOf(investorWallet.address)
      expect(res).to.be.equal(parseUnits('100', 'ether'))

      // Stake Mock Eth Tokens
      await EthTokenContract.connect(investorWallet).approve(TokenFarmContract.address, parseUnits('100', 'ether'))
      await TokenFarmContract.connect(investorWallet).stake(parseUnits('100', 'ether'))

      // Check staking res
      res = await EthTokenContract.balanceOf(investorWallet.address)
      expect(res.toString()).to.be.equal(parseUnits('0', 'ether'), 'Investor Mock Eth wallet balance correct after staking')

      res = await EthTokenContract.balanceOf(TokenFarmContract.address)
      expect(res.toString()).to.be.equal(parseUnits('100', 'ether'), 'Token Farm Mock Eth balance correct after staking')

      res = await TokenFarmContract.stakeBalance(investorWallet.address)
      expect(res.toString()).to.be.equal(parseUnits('100', 'ether'), 'Investor staking balance correct after staking')

      res = await TokenFarmContract.isStaking(investorWallet.address)
      expect(res.toString()).to.be.equal('true', 'investor staking status correct after staking')
      
      res = await RewTokenContract.balanceOf(investorWallet.address)
      expect(res.toString()).to.be.equal(parseUnits('0', 'ether'), 'Investor Rew Token wallet balance 0 after staking')

      //Unstake Eth Tokens
      await TokenFarmContract.connect(investorWallet).unstake(parseUnits('100', 'ether'))

      // // Check ress after unstaking
      res = await EthTokenContract.balanceOf(investorWallet.address)
      expect(res.toString()).to.be.equal(parseUnits('100', 'ether'), 'Investor Mock Eth wallet balance correct after unstaking')

      res = await EthTokenContract.balanceOf(TokenFarmContract.address)
      expect(res.toString()).to.be.equal(parseUnits('0', 'ether'), 'Token Farm Mock Eth balance correct after unstaking')

      res = await TokenFarmContract.stakeBalance(investorWallet.address)
      expect(res.toString()).to.be.equal(parseUnits('0', 'ether'), 'Investor staking balance correct after unstaking')

      res = await TokenFarmContract.isStaking(investorWallet.address)
      expect(res.toString()).to.be.equal('false', 'Investor staking status correct after unstaking')
    })
  })
})

