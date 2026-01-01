import React from 'react';
import { ThumbsUp, ThumbsDown, Clock, CheckCircle2 } from 'lucide-react';
import { MOCK_PROPOSALS } from '../constants';
import { Proposal } from '../types';

const Voting: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Proposals & Voting</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
          + New Proposal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_PROPOSALS.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  );
};

const ProposalCard: React.FC<{ proposal: Proposal }> = ({ proposal }) => {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const percentageFor = totalVotes === 0 ? 0 : Math.round((proposal.votesFor / totalVotes) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${
            proposal.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {proposal.status === 'Active' ? <Clock size={12} /> : <CheckCircle2 size={12} />}
            {proposal.status}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{proposal.title}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Ends</p>
          <p className="text-sm font-medium text-gray-900">{new Date(proposal.endDate).toLocaleDateString()}</p>
        </div>
      </div>

      <p className="text-gray-600 mb-6 flex-grow">{proposal.description}</p>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Approval Rate</span>
            <span className="font-bold text-gray-900">{percentageFor}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${percentageFor}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{proposal.votesFor} For</span>
            <span>{proposal.votesAgainst} Against</span>
          </div>
        </div>

        {proposal.status === 'Active' && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all">
              <ThumbsUp size={16} />
              Vote For
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all">
              <ThumbsDown size={16} />
              Vote Against
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Voting;