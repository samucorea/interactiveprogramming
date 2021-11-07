
export default function setExecProcedure(emitter, executeNode, df, nodeId) {
    emitter.on('execute-nodes', executeNode)


    df.on('nodeRemoved', id => {
        if (nodeId.value === id) {
            emitter.off('execute-nodes', executeNode)
        }
    })
}