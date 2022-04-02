import { run } from 'hardhat'
import { ethers } from 'hardhat'
import deploy from '../functions/deploy'
import { parseUnits } from 'ethers/lib/utils'
import { Contract } from '@ethersproject/contracts'
import { logSuccess, logInfo, logTrace } from '../utils/logger'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

let wallet1: SignerWithAddress
let wallet2: SignerWithAddress
let wallet3: SignerWithAddress

const func = async () => {
  ;[wallet1, wallet2, wallet3] = await ethers.getSigners()

  logInfo('Deploying...')
  const EthTokenContract = (await deploy('EthToken')).contract
  const RewTokenContract = (await deploy('RewToken')).contract
  const TokenFarmContract = (await deploy('TokenFarm', [RewTokenContract.address, EthTokenContract.address])).contract

  logSuccess('Deploy success')
  logTrace('TokenFarm contract:', TokenFarmContract.address)
  logTrace('RewToken contract:', RewTokenContract.address)
  logTrace('EthToken contract:', EthTokenContract.address)
  logTrace('Deployer address:', wallet1.address)
  logTrace('User address:', wallet2.address)
  logTrace('Second address:', wallet3.address)

  await RewTokenContract.transfer(TokenFarmContract.address, parseUnits('1000000', 'ether'))
  await EthTokenContract.transfer(TokenFarmContract.address, parseUnits('1000000', 'ether'))

  logTrace('Succesful Transfer, TokenFarm Rew token:', await RewTokenContract.balanceOf(TokenFarmContract.address))
  logTrace('Succesful Transfer, TokenFarm Rew token:', await EthTokenContract.balanceOf(TokenFarmContract.address))
  // logTrace('Succesful Transfer, Wallet2 Eth token:', await EthTokenContract.balanceOf(wallet2.address))
  // logTrace('Succesful Transfer, Wallet2 Eth token:', await EthTokenContract.balanceOf(wallet2.address))

  const mineNextBlock = async () => {
    await ethers.provider.send('evm_mine', []) // force mine the next block)
    const blockNumber = await ethers.provider.getBlockNumber()
    logTrace('Block Mined', blockNumber)
  }
  setInterval(mineNextBlock, 30000)

  await run('node')

  // // Transfer All tokens to Token farm
  // await RewTokenContract.transfer(TokenFarmContract.address, '1000000000000000000000000')
  // await EthTokenContract.transfer(wallet2.address, '1000000000000000000000000')
  // logTrace('Succesful Transfer, TokenFarm Rew token:', await RewTokenContract.balanceOf(TokenFarmContract.address))
  // logTrace('Succesful Transfer, Wallet2 Dai token:', await EthTokenContract.balanceOf(wallet2.address))

  // await RewTokenContract.transfer(RewTokenContract.address, '1000000000000000000000000')

  // console.log('contract:', baseContract)

  // logInfo('Minting token...')
  // await baseContract.mint({ value: parseUnits('0.1', 'ether') })
  // logSuccess('Mint Success')

  // logInfo('Check owner of token 1...')
  // const owner = await baseContract.ownerOf(1)
  // logSuccess('Owner:', owner)

  // logInfo('Set royalties...')
  // await baseContract.setRoyalties(1, baseContract.address, 1000)
  // const raribleRoyalties = await baseContract.getRaribleV2Royalties(1)
  // logSuccess('Royalties:', raribleRoyalties)

  // const ERC2981Royalties = await baseContract.royaltyInfo(1, 1000)
  // logSuccess('ERC2981 Royalties For Sale of 1000:', ERC2981Royalties)

  // logInfo('Get token URI...')
  // const tokenURI = await baseContract.tokenURI(1)
  // logSuccess('Token URI:', tokenURI)
}

func()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
