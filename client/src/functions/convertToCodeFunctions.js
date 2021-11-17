import showError from '../components/showError'
import { readonly } from 'vue'

export default function convertToCode(nodeName, node, df) {
    if (nodeName === 'numberNode') {
        numberNodeToCode(node, df)
    }
    else if (nodeName === 'operationNode') {
        operationNodeToCode(node, df)

    }
    else if (nodeName === 'assignNode') {
        assignNodeToCode(node, df)
    }
    else if (nodeName === 'conditionalNode') {
        conditionalNodeToCode(node, df)
    }
    else if (nodeName === 'loopNode') {
        loopNodeToCode(node, df)
    }
    else if (nodeName === 'printNode') {
        printNodeToCode(node, df)
    }
    else if (nodeName === 'useVariableNode') {
        useVariableNodeToCode(node, df)
    }
}

function numberNodeToCode(node, df) {
    if (isNaN(node.data.result) || node.data.result === null) {

        node.data.result = 0
        df.updateNodeDataFromId(node.id, node.data)
        setTimeout(() => {

            showError(`Please, specify a number at the number Node ${node.id}`)
        }, 0)

    }
    else {
        return node.data.result.toString()
    }
}

function operationNodeToCode(node, df) {
    let result = 0
    const data = node.data
    const numbersInOperation = []
    const expressionsInOperation = []
    const inputs = node.inputs

    try {
        Object.keys(inputs).forEach(key => {



            const input = inputs[key]
            const connection = input.connections[0]

            const currentNode = df.getNodeFromId(connection.node)



            numbersInOperation.push(currentNode.data.result)
            expressionsInOperation.push(currentNode.data.pythoncode)



        })
    }
    catch
    {
        setTimeout(() => {
            showError(`All operation node inputs should be connected at Node ${node.id}`)
        }, 200)
    }

    if (!data.binaryop) {
        setTimeout(() => {
            showError(`Please, specify a binary operator in operation node ${node.id}`)
        }, 200)
    }
    switch (data.binaryop) {

        case '+':
            result = numbersInOperation[0] + numbersInOperation[1]
            break;
        case '-':
            result = numbersInOperation[0] - numbersInOperation[1]
            break;
        case '*':
            result = numbersInOperation[0] * numbersInOperation[1]
            break;
        case '/':
            result = numbersInOperation[0] / numbersInOperation[1]
            break;

    }

    data.result = result
    data.pythoncode = `${expressionsInOperation[0]} ${data.binaryop} ${expressionsInOperation[1]}`
    df.updateNodeDataFromId(node.id, data)

}

function assignNodeToCode(node, df) {
    const data = node.data
    if (!isNaN(data.name) || data.name === undefined) {
        showError(`A variable name can't be a number. Please specify a set of characters, not only numbers at Node ${node.id}`)
        return;
    }

    try {


        const connectedNode = df.getNodeFromId(node.inputs.input_1.connections[0].node)


        data.value = connectedNode.data.result
        data.pythoncode = `${data.name} = ${connectedNode.data.pythoncode}\n`


        df.updateNodeDataFromId(node.id, data)
    }
    catch
    {
        setTimeout(() => {
            showError(`Please, connect the assignNode input to another node at Node ${node.id}`)
        }, 200)
    }

    return data.pythoncode
}

function conditionalNodeToCode(node, df) {

    const logicDict = readonly({
        'Greater than': '>',
        'Lesser than': '<',
        'Equal than': '=='
    })
    const data = node.data
    const comparisonValues = []
    const comparisonItemExpressions = []

    try {
        Object.keys(node.inputs).forEach(key => {
            const nodeConnectedId = node.inputs[key].connections[0].node
            const nodeConnected = df.getNodeFromId(nodeConnectedId)


            comparisonItemExpressions.push(nodeConnected.data.pythoncode)
            comparisonValues.push(nodeConnected.data.result)

        })
    }
    catch
    {
        setTimeout(() => {
            showError(`All conditional node inputs should be connected at Node ${node.id}`)
        }, 200)
        return
    }

    if (data.logicOperator === undefined) {
        setTimeout(() => {
            showError(`Logic operator should be specified in conditional node  at Node ${node.id}`)
        }, 200)
        return

    }


    data.pythoncode = `if ${comparisonItemExpressions[0]} ${logicDict[data.logicOperator]} ${comparisonItemExpressions[1]}:\n`

    df.updateNodeDataFromId(node.id, data)

}

function loopNodeToCode(node, df) {

    const data = node.data
    // node.value.data.from = parseInt(from.value) || 0
    if (isNaN(parseInt(data.to))) {
        data.to = 0

        setTimeout(() => {
            showError(`Please, specify to what number the loop node should execute at input at Node ${node.id}`)
        }, 200)
    }

    if (isNaN(parseInt(data.from))) {
        data.from = 0

    }

    data.pythoncode = `for i in range(${data.from},${data.to}):\n`

    df.updateNodeDataFromId(node.id, data)

}

function printNodeToCode(node, df) {
    const data = node.data
    const connection = node.inputs.input_1.connections[0]
    if (connection) {
        const connectedNode = df.getNodeFromId(connection.node)

        data.pythoncode = `print(${connectedNode.data.pythoncode})\n`


    }
    else {
        setTimeout(() => {
            showError(`Print node should have input connected at Node ${nodeId.value}`)
        }, 200)
        data.pythoncode = `print()\n`
    }
    df.updateNodeDataFromId(node.id, data)
}

function useVariableNodeToCode(node, df) {
    const data = node.data
    if (data.name === undefined) {
        setTimeout(() => {
            showError(`Please, specify the variable to use at Node ${node.id}`)
        }, 200)
    }
    else if (!isNaN(data.name)) {
        setTimeout(() => {
            showError(`A variable cannot be a number. Please, specify a set of characters.`)
        }, 200)
    }

    data.pythoncode = data.name
    df.updateNodeDataFromId(node.id, data)
}