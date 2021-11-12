
export default function setExecProcedure(emitter, executeNode, df, node) {


    const handleDelete = id => {


        if (node.name === 'conditionalNode') {
            const mainBlock = df.drawflow.drawflow[`conditional-main-block-${node.id}`]
            const elseBlock = df.drawflow.drawflow[`conditional-else-block-${node.id}`]

            removeNodesFromModules(df, mainBlock, elseBlock)

        }
        else if (node.name === 'loopNode') {
            const loopBlock = df.drawflow.drawflow[`loop-${id}`]

            removeNodesFromModules(df, loopBlock)
        }



    }
    emitter.off('execute-nodes', executeNode)
    df.removeListener('nodeRemoved', handleDelete)

    emitter.on('execute-nodes', executeNode)
    df.on('nodeRemoved', handleDelete)
}

function removeNodesFromModules(df, ...modules) {
    modules.forEach(module => {
        const moduleBlock = df.drawflow.drawflow[module]

        if (moduleBlock !== undefined) {
            Object.keys(moduleBlock.data).forEach(id => {
                df.removeNodeId(`node-${id}`)
                df.dispatch('nodeRemoved', id)
            })
        }

        df.removeModule(module)
    })
}