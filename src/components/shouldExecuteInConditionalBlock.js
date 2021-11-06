

export default function shouldExecuteInConditionalBlock(conditionalFlow, conditionalNode) {
    let shouldExecute = true


    if (conditionalFlow === 'main') {
        shouldExecute = conditionalNode.data.conditionMet
    }
    else {
        shouldExecute = !conditionalNode.data.conditionMet
    }

    return shouldExecute
}