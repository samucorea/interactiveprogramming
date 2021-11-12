
export default function setExecProcedure(emitter, executeNode, df, node) {


    const handleDelete = id => {

        if (node.id === parseInt(id)) {
            if (node.name === 'conditionalNode') {
                const mainBlock = df.drawflow.drawflow[`conditional-main-block-${node.id}`]
                const elseBlock = df.drawflow.drawflow[`conditional-else-block-${node.id}`]

                if (mainBlock !== undefined && elseBlock !== undefined) {
                    Object.keys(mainBlock.data).forEach(id => {
                        df.removeNodeId(`node-${id}`)
                        df.dispatch('nodeRemoved', id)
                    })

                    Object.keys(elseBlock.data).forEach(id => {
                        df.removeNodeId(`node-${id}`)
                        df.dispatch('nodeRemoved', id)
                    })
                    df.removeModule(`conditional-main-block-${node.id}`)
                    df.removeModule(`conditional-else-block-${node.id}`)
                }

            }
            else if (node.name === 'loopNode') {
                const loopBlock = df.drawflow.drawflow[`loop-${id}`]

                if (loopBlock !== undefined) {
                    Object.keys(loopBlock.data).forEach(id => {
                        df.removeNodeId(`node-${id}`)
                        df.dispatch('nodeRemoved', id)
                    })
                }
                df.removeModule(`loop-${node.id}`)
            }
            emitter.off('execute-nodes', executeNode)
            df.removeListener('nodeRemoved', handleDelete)
        }

    }
    emitter.on('execute-nodes', executeNode)
    df.on('nodeRemoved', handleDelete)
}