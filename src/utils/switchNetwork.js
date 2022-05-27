export async function changeNetwork() {
    try {
        if (!window.ethereum) throw new Error("No crypto wallet found")
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainId: `0x${Number(43113).toString(16)}`,
                    chainName: "Avalanche Fuji",
                    nativeCurrency: {
                        name: "AVAX",
                        symbol: "AVAX",
                        decimals: 18
                    },
                    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
                    blockExplorerUrls: ["https://testnet.snowtrace.io"]
                }
            ]
        })
    } catch (err) {
        console.log(err.message);
    }
}