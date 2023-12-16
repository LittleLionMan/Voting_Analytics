export function handleStatus(status: string) {
    switch(status) {
        case "PROPOSAL_STATUS_PASSED":
            return "Passed"
        case "PROPOSAL_STATUS_FAILED":
            return "Failed"
        case "PROPOSAL_STATUS_REJECTED":
            return "Rejected"
        case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
            return "Deposit Period"
        case "PROPOSAL_STATUS_VOTING_PERIOD":
            return "Voting Period"
        default:
            return "unknown"
    }
}