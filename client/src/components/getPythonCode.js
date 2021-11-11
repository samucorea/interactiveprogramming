export default function getPythonCode(modules, moduleSelected, prefix = '') {
    let code = ''
    const nodes = modules[moduleSelected].data
    const nodesarr = []
    Object.keys(nodes).forEach(id => {
        nodesarr.push(nodes[id])


    })

    const filteredNodes = nodesarr.filter(node => {
        return node.name === 'operationNode'
            || node.name === 'assignNode'
            || node.name === 'conditionalNode'
            || node.name === 'loopNode'
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
            const connectedNodeIndex = orderedNodes.findIndex(node => node.id === parseInt(element.inputs.input_1.connections[0].node))

            if (connectedNodeIndex !== -1) {
                orderedNodes.splice(connectedNodeIndex, 1)
            }


            code = prefix + element.data.pythoncode + code



        }


        else if (element.name === 'conditionalNode') {


            const mainBlockCode = getPythonCode(modules, `conditional-main-block-${element.id}`, prefix + '    ')
            const elseBlockCode = getPythonCode(modules, `conditional-else-block-${element.id}`, prefix + '    ')

            code = prefix + element.data.pythoncode + mainBlockCode + prefix + 'else:\n' + elseBlockCode + code


        }

        else if (element.name === 'operationNode') {
            code = prefix + element.data.pythoncode + code
        }

        else if (element.name === 'loopNode') {
            const loopBlock = getPythonCode(modules, `loop-${element.id}`, prefix + '    ')

            code = prefix + element.data.pythoncode + loopBlock + code
        }
        else if (element.name === 'printNode') {
            code = prefix + element.data.pythoncode
        }




    }



    return code










    // orderedNodes.sort((a, b) => a.pos_x > b.pos_x)
    // console.log(orderedNodes.length)
    // for (let i = orderedNodes.length; i >= 0; i--) {
    //     const node = orderedNodes[i]

    //     if (node.name === 'operationNode') {
    //         code = node.data.pythoncode + code
    //     }

    // }
    // console.log(orderedNodes)
    // console.log(code)
}