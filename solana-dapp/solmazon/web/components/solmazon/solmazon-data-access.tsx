'use client';

import { getSolmazonProgram, getSolmazonProgramId } from '@solmazon/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useSolmazonProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getSolmazonProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getSolmazonProgram(provider);

  const accounts = useQuery({
    queryKey: ['solmazon', 'all', { cluster }],
    queryFn: () => program.account.solmazon.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['solmazon', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ solmazon: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useSolmazonProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useSolmazonProgram();

  const accountQuery = useQuery({
    queryKey: ['solmazon', 'fetch', { cluster, account }],
    queryFn: () => program.account.solmazon.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['solmazon', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ solmazon: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['solmazon', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ solmazon: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['solmazon', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ solmazon: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['solmazon', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ solmazon: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
