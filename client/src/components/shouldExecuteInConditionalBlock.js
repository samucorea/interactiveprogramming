

export default function shouldExecuteInConditionalBlock(conditionalFlow, conditionalNode) {
    return conditionalFlow === 'main' ? conditionalNode.data.conditionMet : !conditionalNode.data.conditionMet
}


