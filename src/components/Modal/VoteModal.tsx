import { Check, X } from 'heroicons-react';
import { useState } from 'react';
import { useBalance, usePublicClient, useWalletClient } from 'wagmi';
import { useChainId } from '../../hooks/useChainId';
import { IAccount, IProposal } from '../../types';
import { ZERO_ADDRESS } from '../../utils/constant';
import { useEthersSigner } from '../../utils/ethers';
import Step from '../Step';
import snapshot from '@snapshot-labs/snapshot.js';



function VoteModal({ proposal, account, index }: { proposal: IProposal; account: IAccount; index: number }) {
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient({
    chainId,
  });
  const publicClient = usePublicClient({ chainId });
  const [show, setShow] = useState(false);
  const { data: ethBalance } = useBalance({ address: account.address });
  const isProposalUseEth: boolean = proposal.rateToken.address === ZERO_ADDRESS;
  const { data: tokenBalance } = useBalance({
    address: account.address ,
    token: '0xC6d4abdd1661Afe7a5f50B81A0c6436bfe37706F',
  });
  const signer = useEthersSigner()

  console.log(index)


  const vote = async () => {
    if(!account?.address){
      return;
    }

    const hub = 'https://testnet.snapshot.org'; // or https://testnet.snapshot.org for testnet
    const client = new snapshot.Client712(hub);

    const receipt = await client.vote(signer, account.address, {
      space: 'cisly2.eth',
      proposal: '0x3479d46ee5b5ba09edbcbccd45c3c083c903182a9bcd8c0a83f7ba75e67f61ea',
      type: 'single-choice',
      choice: index + 1,
      reason: 'Choice ' + (index + 1) + ' make lot of sense',
      app: 'gg'
    });

    console.log(receipt)

    // setShow(false);
  }

  const hasEnoughBalance = () => {
    return tokenBalance ? tokenBalance.value > 0 : false;
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className='block text-green-600 bg-green-50 hover:bg-redpraha hover:text-white rounded-xl px-5 py-2.5 text-center'
        type='button'
        data-modal-toggle='defaultModal'>
        Vote
      </button>

      <div
        className={`${
          !show ? 'hidden' : ''
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-black/75 flex flex-col items-center justify-center`}>
        <div className='relative p-4 w-full max-w-2xl h-auto'>
          <div className='relative bg-white rounded-xl shadow '>
            <div className='flex justify-between items-start p-4 rounded-t border-b '>
              <h3 className='text-xl font-semibold text-gray-900 '>Vote validation</h3>
              <button
                onClick={() => setShow(false)}
                type='button'
                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm p-1.5 ml-auto inline-flex items-center '
                data-modal-toggle='defaultModal'>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'></path>
                </svg>
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            <div className='p-6 space-y-6'>
              {!isProposalUseEth && (
                <nav className='mb-8'>
                  <ol
                    role='list'
                    className='divide-y divide-gray-200 rounded-xl border border-redpraha md:flex md:divide-y-0'>
                    <Step title='Allow spending' status={'inprogress'} order={1} />
                    <Step
                      title='Send money to escrow and validate the proposal'
                      status={'todo'}
                      order={2}
                      isLast={true}
                    />
                  </ol>
                </nav>
              )}


              <div className='flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6'>
                <h3 className='text-xl font-semibold leading-5 text-gray-800'>Your balances</h3>
                <div className='flex justify-center items-center w-full space-y-4 flex-col'>
                  {tokenBalance && (
                    <div className='flex justify-between w-full'>
                      <p className='text-base leading-4 text-gray-800'>
                        {tokenBalance.formatted} {tokenBalance.symbol}
                      </p>
                      <p className=''>
                        <span
                          className={`block ${
                            hasEnoughBalance() ? 'bg-redpraha' : 'bg-red-500'
                          } p-1 text-xs font-medium text-white rounded-full`}>
                          {hasEnoughBalance() ? (
                            <Check className='w-4 h-4' />
                          ) : (
                            <X className='w-4 h-4' />
                          )}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='flex items-center p-6 space-x-2 rounded-b border-t border-redpraha '>
              {hasEnoughBalance() ? (
                <button
                  onClick={() => vote()}
                  type='button'
                  className='hover:text-green-600 hover:bg-green-50 bg-redpraha text-white rounded-xl px-5 py-2.5 text-center'>
                  Vote
                </button>
              ) : (
                <span>you can't vote</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VoteModal;
