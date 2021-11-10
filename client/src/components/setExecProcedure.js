
export default function setExecProcedure(emitter, executeNode, df, nodeId) {


    const handleDelete = id => {

        if (nodeId.value === id) {
            emitter.off('execute-nodes', executeNode)
            df.removeListener('nodeRemoved', handleDelete)
        }

    }
    emitter.on('execute-nodes', executeNode)
    df.on('nodeRemoved', handleDelete)
}