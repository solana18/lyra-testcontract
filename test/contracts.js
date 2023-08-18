const { ethers, network } = require("hardhat");
const { TestSystem } = require('@lyrafinance/protocol');
const { formatUnits, parseUnits } = require("ethers/lib/utils");
const { expect } = require("chai");

describe('Integration Test', () => {
    var testSystem, signer;
    before(async () => {
        [signer] = await ethers.getSigners();
        testSystem = await TestSystem.deploy(signer);
        await TestSystem.seed(signer, testSystem);
    });

    it('buy first boardID', async () => {
        var boardIds = await testSystem.optionMarket.getLiveBoards();
        var strikeIds = await testSystem.optionMarket.getBoardStrikes(boardIds[0]);

        // Buy long call
        await testSystem.optionMarket.openPosition({
            strikeId: strikeIds[0],
            positionId: 0,
            amount: parseUnits('1'),
            setCollateralTo: 0,
            iterations: 1,
            minTotalCost: 0,
            maxTotalCost: ethers.constants.MaxUint256,
            optionType: TestSystem.OptionType.LONG_CALL
        });

        // Wait till board expires

        await network.provider.send("evm_increaseTime", [3600 * 24 * 30]);
        await network.provider.send("evm_mine");

        // Mock sETH price
        await TestSystem.marketActions.mockPrice(testSystem, parseUnits("1500"), 'sETH');

        // Settle option and confirm payout
        await testSystem.optionMarket.settleExpiredBoard(boardIds[0]);
        const preBalance = await testSystem.snx.quoteAsset.balanceOf(signer.address);
        await testSystem.shortCollateral.settleOptions([strikeIds[0]]);
        const postBalance = await testSystem.snx.quoteAsset.balanceOf(signer.address);
        // expect(postBalance.sub(preBalance)).to.eq(parseUnits('500'));
    });
});

