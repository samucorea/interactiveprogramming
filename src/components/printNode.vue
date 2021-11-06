<template>
    <div ref="root">
        <div>Node {{nodeId}}</div>
        <div>Print</div>
    </div>
</template>

<script>
import { ref, defineComponent, onMounted, nextTick,getCurrentInstance } from 'vue'
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
            // nodeData.value = df.getNodeFromId(nodeId.value)

            emitter.on('execute-nodes', () => {
                nodeData.value = df.getNodeFromId(nodeId.value)
                const connection = nodeData.value.inputs.input_1.connections[0]
                if(connection)
                {
                    const connectedNode = df.getNodeFromId(connection.node)

                    alert(connectedNode.data.result)
                }
            })
        })

        return {
            root,
            nodeId
        }
    },
})
</script>
