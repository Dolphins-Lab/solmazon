// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import SolmazonIDL from '../target/idl/solmazon.json';
import type { Solmazon } from '../target/types/solmazon';

// Re-export the generated IDL and type
export { Solmazon, SolmazonIDL };

// The programId is imported from the program IDL.
export const SOLMAZON_PROGRAM_ID = new PublicKey(SolmazonIDL.address);

// This is a helper function to get the Solmazon Anchor program.
export function getSolmazonProgram(provider: AnchorProvider) {
  return new Program(SolmazonIDL as Solmazon, provider);
}

// This is a helper function to get the program ID for the Solmazon program depending on the cluster.
export function getSolmazonProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return SOLMAZON_PROGRAM_ID;
  }
}
