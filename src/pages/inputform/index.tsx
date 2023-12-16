import Link from 'next/link';
import { useState } from 'react';
import { chains } from '@/queries/chainInfo';
import { handleStatus } from '@/functions/helpers';


interface Proposal {
    proposal_id: string;
    content: {title: string};
    status: string;
  }

export default function Inputform() {
    const [proposalsFetched, setProposalsFetched] = useState(false);
    const [proposalsData, setProposalsData] = useState({proposals: []});
    const [chainName, setChainName] = useState("");

    async function getProposals(chain: string) {
        const name = typeof document !== 'undefined' && document.getElementById('chainName');
        if (name) {
            name.textContent = chain;
        }
        setChainName(chain);
        try {
            const response = await fetch(chains[chain] + '?pagination.limit=1000'); // Use the first URL in the array
            if (response.ok) {
              const data = await response.json();
              setProposalsData(data);
              setProposalsFetched(true);
            } else {
              console.error('Failed to fetch proposals:', response.statusText);
            }
          } catch (error: any) {
            console.error('Error fetching proposals:', error.message);
          }
    }

    function handleLink(id: string) {
        const link = "proposal/" + chainName + '/' + id
        return link
    }

    const resetProposals = () => {
        setProposalsData({proposals: []});
        setProposalsFetched(false);
        const name = typeof document !== 'undefined' && document.getElementById('chainName');
        if (name) {
            name.textContent = "";
        }
    };

    return (
        <div className="container-fluid vh-100">
            <div className="container-fluid chain"
            >
                <div className="row pt-5">
                    <div className="col d-flex justify-content-end">
                        <div className="btn-group">
                            <button 
                                type="button" 
                                className="btn btn-primary dropdown-toggle" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                                onClick={() => {
                                    resetProposals();
                                  }}
                            >
                                Choose a chain:
                            </button>
                            <ul className="dropdown-menu">
                                {Object.keys(chains).map((chain, index) => (
                                    <li><a 
                                        className="dropdown-item"
                                        key={index}
                                        onClick={() => getProposals(chain)}
                                    >{chain}</a> </li>
                                ))}
                                
                            </ul>
                        </div>
                    </div>
                    <div className="col my-auto">
                        <p className="my-auto" id="chainName"></p>
                    </div>
                </div>
            </div>
            {proposalsFetched && (
                <div className="container-fluid proposal">
                    <div className="row pt-5">
                        <div className="col d-flex justify-content-center">
                            Choose a proposal:
                        </div>
                    </div>
                    <div className="pt-5">
                    <table className="table table-striped table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Status</th>
                            <th scope="col">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        proposalsData.proposals.length > 0 ? (
                            proposalsData.proposals.slice().reverse().map((proposal: Proposal, index: number) => (
                            <tr key={index}>
                                <td>{proposal.proposal_id}</td>
                                <td>{proposal.content.title}</td>
                                <td>{handleStatus(proposal.status)}</td>
                                <td
                                    //onClick={() => }
                                ><Link href={handleLink(proposal.proposal_id)}>{proposal.status != "PROPOSAL_STATUS_DEPOSIT_PERIOD" ? "Details" : ""}</Link></td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>No Data</td>
                            </tr>
                        )
                    }
                    </tbody>
                    </table>
                    </div>
                </div>
            )}
        </div>
    );
  }