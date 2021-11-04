<template>
    <div ref="root">
        <div style="margin-bottom:10px;">Assign</div>
        <div style="margin-bottom:10px;">
           <input df-name v-model="assignName"  placeholder="variable name..." type="text">
        </div>
        <div >
            {{assignValue   }}
        </div>
        
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { getCurrentInstance, nextTick, onMounted } from '@vue/runtime-core'
import useEmitter from './useEmitter.js'

export default {
    setup() {
        const root = ref(null)
        const nodeId = ref(0)
        const nodeData = ref({})
        const assignName = ref('')
        const assignValue = ref(0)

        const emitter = useEmitter()
        let df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        
        onMounted(async () => {
            await nextTick()
            nodeId.value = root.value.parentElement.parentElement.id.slice(5)
            nodeData.value = df.getNodeFromId(nodeId.value)
            emitter.on('execute-nodes', () => {
                nodeData.value = df.getNodeFromId(nodeId.value)

            
                const connectedNode = df.getNodeFromId(nodeData.value.inputs.input_1.connections[0].node)

               
                assignValue.value = connectedNode.data.result
                
            })
            
        //     df.on('connectionCreated', function(connections){
        //     const inputNode = df.getNodeFromId(connections.input_id)
        //     const outputNode = df.getNodeFromId(connections.output_id)
            
        //     if(inputNode.name === 'assignNode')
        //     {
        //         if(outputNode.name === 'numberNode')
        //         {
        //             assignValue.value = outputNode.data.number 


        //         }
        //         else if(outputNode.name === 'operationNode')
        //         {
                    
        //            emitter.on(`operation-node-changed-${outputNode.id}`, sum =>
        //            {

        //                assignValue.value = sum

                    
        //            })
        //         }
        //     }
        // })
            
        })
        return{
            assignName,
            assignValue,
            root
        }
     


        

    },
}
</script>
