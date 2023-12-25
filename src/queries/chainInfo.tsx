export interface Chains {
    [chain: string]: string;
}

export const chains: Chains = {
    Cosmos_Hub: "https://cosmos-rest.publicnode.com/cosmos/gov/v1beta1/proposals",
    Juno: "https://juno-rest.publicnode.com/cosmos/gov/v1/proposals",
}