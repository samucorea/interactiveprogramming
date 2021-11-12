<template>
    <div ref="root">
        <div>Node {{nodeId}}</div>
        <div>Print</div>
    </div>
</template>

<script>
import { ref, defineComponent, onMounted, nextTick,getCurrentInstance } from 'vue'
import setExecProcedure from './setExecProcedure'
import useEmitter from './useEmitter'

export default defineComponent({
    setup() {
        const root = ref(null)
        const nodeId = ref(0)
        const nodeData = ref({})
        const emitter = useEmitter()
        const df = getCurrentInstance().appContext.app._context.config.globalProperties.$df.value
        onMounted(async () => {
            await nextTick()
            nodeId.value = root.value.parentElement.parentElement.id.slice(5)
            nodeData.value = df.getNodeFromId(nodeId.value)
    
            setExecProcedure(emitter,executeNode,df,nodeData.value)
        })

        function executeNode()
        {
            nodeData.value = df.getNodeFromId(nodeId.value)
                const connection = nodeData.value.inputs.input_1.connections[0]
                if(connection)
                {
                    const connectedNode = df.getNodeFromId(connection.node)

                    nodeData.value.data.pythoncode = `print(${connectedNode.data.pythoncode})\n`

                    
                }
                else
                {
                    alert(`Print node should have input connected at Node ${nodeId.value}`)
                    nodeData.value.data.pythoncode = `print()\n`
                }
                df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
        }

        return {
            root,
            nodeId
        }
    },
})
</script>
