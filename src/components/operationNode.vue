<template>
    <div ref="root">
        <div>Operation node</div>
        <div style="margin-bottom:10px;">
            <select>
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
        </select>
        </div>
        <span>{{result}}</span>
    </div>
</template>

<script>
import { getCurrentInstance, nextTick, onMounted, ref } from '@vue/runtime-core'
import useEmitter from './useEmitter.js';
    export default{
        props:{
            execute: Boolean
        },
        //eslint-disable-next-line
        setup()
        {
            const emitter = useEmitter()
            const root = ref(null);
            const nodeId = ref(0)
            const nodeData = ref({})
            //const nodeNumbers = ref({})

            let result = ref(0)
            let df = getCurrentInstance().appContext.config.globalProperties.$df.value
          

           
        
            onMounted(async () => {
                await nextTick()
                
                nodeId.value = root.value.parentElement.parentElement.id.slice(5)
                nodeData.value = df.getNodeFromId(nodeId.value)
                result.value = nodeData.value.data.result

                emitter.on('execute-nodes', () => {
                    result.value = 0
                    nodeData.value = df.getNodeFromId(nodeId.value)

                    nodeData.value.inputs.input_1.connections.forEach(connection => {
                        const currentNode = df.getNodeFromId(connection.node)
                        result.value += currentNode.data.result
                    })

                    nodeData.value.data.result = result.value
                    df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
                })
                
            })

            return {
                result,
                root
            }
        }
        
    }
</script>