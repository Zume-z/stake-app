import { run } from 'hardhat'
import { ethers } from 'hardhat'
import deploy from '../functions/deploy'
import { parseUnits } from 'ethers/lib/utils'
import { Contract } from '@ethersproject/contracts'
import { logSuccess, logInfo, logTrace } from '../utils/logger'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { callbackify } from 'util'

let wallet1: SignerWithAddress
let wallet2: SignerWithAddress
let wallet3: SignerWithAddress

const func = async () => {
  ;[wallet1, wallet2, wallet3] = await ethers.getSigners()

  logInfo('Deploying...')
  const DaiTokenContract = (await deploy('DaiToken')).contract
  const DappTokenContract = (await deploy('DaiToken')).contract
  const TokenFarmContract = (await deploy('TokenFarm', [DappTokenContract.address, DaiTokenContract.address])).contract

  logSuccess('Deploy success')
  logTrace('TokenFarm contract:', TokenFarmContract.address)
  logTrace('DappToken contract:', DappTokenContract.address)
  logTrace('DaiToken contract:', DaiTokenContract.address)
  logTrace('Deployer address:', wallet1.address)
  logTrace('User address:', wallet2.address)
  logTrace('Second address:', wallet3.address)

  await TokenFarmContract.issueTokens()
  logSuccess('Tokens Issued')

}

func()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
