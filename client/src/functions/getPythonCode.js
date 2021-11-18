import convertToCode from "./convertToCodeFunctions"

export default function getPythonCode(modules, moduleSelected, prefix = '', df) {
    let code = ''
    const nodes = modules[moduleSelected].data

    if (nodes.length === 0) {
        return code
    }
    const nodesarr = []
    Object.keys(nodes).forEach(id => {
        convertToCode(nodes[id].name, nodes[id], df)

        nodesarr.push(nodes[id])


    })

    const filteredNodes = nodesarr.filter(node => {
        return node.name === 'operationNode'
            || node.name === 'assignNode'
            || node.name === 'conditionalNode'
            || node.name === 'loopNode'
            || node.name === 'printNode'
    })

    const orderedNodes = filteredNodes.sort((a, b) => {

        return a.pos_x > b.pos_x
    })

    for (let i = orderedNodes.length - 1; i >= 0; i--) {
        if (orderedNodes.length === 0) {
            break;
        }
        const element = orderedNodes.pop();
        if (element.name === 'assignNode') {

            removeConnectedNodes(orderedNodes, element)


            code = prefix + element.data.pythoncode + code



        }


        else if (element.name === 'conditionalNode') {


            const mainBlockCode = getPythonCode(modules, `conditional-main-block-${element.id}`, prefix + '    ', df)
            const elseBlockCode = getPythonCode(modules, `conditional-else-block-${element.id}`, prefix + '    ', df)

            let conditionalCodeBlock = prefix + element.data.pythoncode
            if (mainBlockCode === '') {
                conditionalCodeBlock += prefix + '    pass\n'
            }
            else {
                conditionalCodeBlock += mainBlockCode
            }

            if (elseBlockCode !== '') {
                conditionalCodeBlock += prefix + 'else:\n' + elseBlockCode
            }

            code = conditionalCodeBlock + code
        }

        else if (element.name === 'operationNode') {

            removeConnectedNodes(orderedNodes, element)
            code = prefix + element.data.pythoncode + '\n' + code
        }

        else if (element.name === 'loopNode') {
            const loopBlock = getPythonCode(modules, `loop-${element.id}`, prefix + '    ', df)

            code = prefix + element.data.pythoncode + loopBlock + code
        }
        else if (element.name === 'printNode') {
            removeConnectedNodes(orderedNodes, element)
            code = prefix + element.data.pythoncode + code
        }
    }
    return code

}

function removeConnectedNodes(nodes, nodeSelected) {
    if (nodes.length === 0) {
        return;
    }
    const inputs = nodeSelected.inputs
    Object.keys(inputs).forEach(input => {
        const connectedNode = nodes.find(node => node.id === parseInt(inputs[input].connections[0].node))
        if (connectedNode !== undefined) {
            removeConnectedNodes(nodes, connectedNode)
            nodes.splice(nodes.indexOf(connectedNode), 1)

        }
    })



}