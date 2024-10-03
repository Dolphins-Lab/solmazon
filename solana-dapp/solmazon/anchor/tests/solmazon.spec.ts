import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Solmazon } from '../target/types/solmazon';

describe('solmazon', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Solmazon as Program<Solmazon>;

  const solmazonKeypair = Keypair.generate();

  it('Initialize Solmazon', async () => {
    await program.methods
      .initialize()
      .accounts({
        solmazon: solmazonKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solmazonKeypair])
      .rpc();

    const currentCount = await program.account.solmazon.fetch(
      solmazonKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Solmazon', async () => {
    await program.methods
      .increment()
      .accounts({ solmazon: solmazonKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solmazon.fetch(
      solmazonKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Solmazon Again', async () => {
    await program.methods
      .increment()
      .accounts({ solmazon: solmazonKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solmazon.fetch(
      solmazonKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Solmazon', async () => {
    await program.methods
      .decrement()
      .accounts({ solmazon: solmazonKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solmazon.fetch(
      solmazonKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set solmazon value', async () => {
    await program.methods
      .set(42)
      .accounts({ solmazon: solmazonKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solmazon.fetch(
      solmazonKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the solmazon account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solmazon: solmazonKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solmazon.fetchNullable(
      solmazonKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
