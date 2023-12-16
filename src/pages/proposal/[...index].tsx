import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { handleStatus } from '@/functions/helpers';
import { chains } from '@/queries/chainInfo';

export default function Proposal() {
    const router = useRouter();
    const chainName = Array.isArray(router.query.index) ? router.query.index[0] : router.query.index;
    const id = Array.isArray(router.query.index) ? router.query.index[1] : router.query.index;
    const [proposal, setProposal] = useState({proposal_id: "", content: {title: "", description: ""}, status: "", final_tally_result: {yes: "", no: "", no_with_veto: "", abstain: ""}})
    const [votes, setVotes] = useState({});

    
    const COLORS = ['#00ff00', '#ff0000', '#800080', '#000000', '#D5D5D5'];

    useEffect(() => {
        const fetchData = async () => {
          try {
            if (chainName && id) {
              const proposalData = await fetch(`${chains[chainName]}/${id}`); // Replace with your actual API call
              const data = await proposalData.json();
              setProposal(data.proposal);
            }
          } catch (error: any) {
            console.error("Error fetching proposal:", error.message);
          }
        };

        const fetchVotes = async () => {
            try {
              if (chainName && id) {
                const proposalData = await fetch(`${chains[chainName]}/${id}/votes?pagination.limit=10000000`); // Replace with your actual API call
                const votes = await proposalData.json();
                setVotes(votes);
              }
            } catch (error: any) {
              console.error("Error fetching proposal:", error.message);
            }
          };
      
        fetchData();
        fetchVotes();
      }, [chainName, id]);

    const data = [
        { name: 'Yes', value: Number(proposal.final_tally_result.yes), fill: '#00ff00' },
        { name: 'No', value: Number(proposal.final_tally_result.no), fill: '#ff0000' },
        { name: 'No With Veto', value: Number(proposal.final_tally_result.no_with_veto), fill: '#800080' },
        { name: 'Abstain', value: Number(proposal.final_tally_result.abstain), fill: '#000000' },
    ];
    

    return (
        <div className="container-fluid vh-100">
            <div className="container">
                <h1>{proposal.proposal_id}: {proposal.content.title}</h1>
            </div>
            <div className="container-fluid px-5 h-25 d-inline-block mt-5">
                    <div className="description">{proposal.content.description}</div>
            </div>
            <div className="container-fluid h-25 pt-5">
                <div className="row">
                    <div className="col-8">
                        
                            <PieChart width={400} height={400}>
                                <Pie
                                    dataKey="value"
                                    startAngle={180}
                                    endAngle={0}
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                />
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </PieChart>
                        
                    </div>
                    <div className="col-4">
                        Status: {handleStatus(proposal.status)}
                    </div>
                </div>
            </div>
        </div>
    )
}