import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { handleStatus } from '@/functions/helpers';
import { chains } from '@/queries/chainInfo';

export default function Proposal() {
    const router = useRouter();
    const chainName = Array.isArray(router.query.index) ? router.query.index[0] : router.query.index;
    const id = Array.isArray(router.query.index) ? router.query.index[1] : router.query.index;
    const [proposal, setProposal] = useState({proposal_id: null,
                                              id: null, 
                                              content: {title: null, description: null},
                                              title: null,
                                              summary: null, 
                                              status: "", 
                                              final_tally_result: {yes: 0, no: 0, no_with_veto: 0, abstain: 0, yes_count: 0, no_count: 0, no_with_veto_count: 0, abstain_count: 0}})
    const [votes, setVotes] = useState({votes: [{options: [{option: ""}]}]});

    
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

    const yes = Number(proposal.final_tally_result.yes) || 0;
    const no = Number(proposal.final_tally_result.no) || 0;
    const noWithVeto = Number(proposal.final_tally_result.no_with_veto) || 0;
    const abstain = Number(proposal.final_tally_result.abstain) || 0;
    const yes_count = Number(proposal.final_tally_result.yes_count) || 0;
    const no_count = Number(proposal.final_tally_result.no_count) || 0;
    const noWithVeto_count = Number(proposal.final_tally_result.no_with_veto_count) || 0;
    const abstain_count = Number(proposal.final_tally_result.abstain_count) || 0;

    const total = yes + no + noWithVeto + abstain;
    const total_count = yes_count + no_count + noWithVeto_count + abstain_count;
    
    const data = [
        { name: 'Yes', value: Number(total > 0 ? yes/total : ((yes_count*100/total_count).toFixed(1))), fill: '#00ff00' },
        { name: 'No', value: Number(total > 0 ? no : (no_count*100/total_count).toFixed(1)), fill: '#ff0000' },
        { name: 'No With Veto', value: Number(total > 0 ? noWithVeto : (noWithVeto_count*100/total_count).toFixed(1)), fill: '#800080' },
        { name: 'Abstain', value: Number(total > 0 ? abstain : (abstain_count*100/total_count).toFixed(1)), fill: '#000000' },
    ];
    

    let result = "";
    let yes_votes = 0;
    let no_votes = 0;
    let nWV_votes = 0;
    let abstain_votes = 0;
    let rest = 0
    const count_votes = votes.votes.forEach(vote => {
                                                      result = vote.options[0].option;
                                                      switch(result) {
                                                        case "VOTE_OPTION_YES":
                                                          yes_votes += 1;
                                                          break;
                                                        case "VOTE_OPTION_NO":
                                                          no_votes += 1;
                                                          break;
                                                        case "VOTE_OPTION_NO_WITH_VETO":
                                                          nWV_votes += 1;
                                                          break;
                                                        case "VOTE_OPTION_ABSTAIN":
                                                          abstain_votes += 1;
                                                          break;
                                                          
                                                        default: rest += 1
                                            }})

    const data_votes = [
      { name: 'Yes', value: Number(yes_votes), fill: '#00ff00' },
      { name: 'No', value: Number(no_votes), fill: '#ff0000' },
      { name: 'No With Veto', value: Number(nWV_votes), fill: '#800080' },
      { name: 'Abstain', value: Number(abstain_votes), fill: '#000000' },
      { name: 'Weighted', value: Number(rest), fill: '#888888' },
  ];

    return (
        <div className="container-fluid vh-100">
            <div className="container">
                <h1>{proposal.proposal_id ?? proposal.id}: {proposal.content? proposal.content.title : proposal.title}</h1>
            </div>
            <div className="container-fluid px-5 h-25 d-inline-block mt-5">
                    <div className="description">{proposal.content ? proposal.content.description : proposal.summary}</div>
            </div>
            <div>
                        Status: {handleStatus(proposal.status)}
            </div>
            <div className="container-fluid h-25 pt-5">
                <div className="row">
                    <div className="col-6">
                        
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

                    <div className="col-6">
                        
                            <PieChart width={400} height={400}>
                                <Pie
                                    dataKey="value"
                                    startAngle={180}
                                    endAngle={0}
                                    data={data_votes}
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
                    
                </div>
            </div>
        </div>
    )
}