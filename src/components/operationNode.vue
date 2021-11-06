<template>
    <div ref="root">
        <div>Node {{nodeId}}</div>
        <div>Operation node</div>
        <div style="margin-bottom:10px;">
            <select v-model="binaryOp">
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
import shouldExecuteInConditionalBlock from './shouldExecuteInConditionalBlock.js';
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
            const binaryOp = ref('+')
            const nodeData = ref({})
            //const nodeNumbers = ref({})

            let result = ref(0)
            let df = getCurrentInstance().appContext.config.globalProperties.$df.value

            
          

           
        
            onMounted(async () => {
                await nextTick()
                
                nodeId.value = root.value.parentElement.parentElement.id.slice(5)
                nodeData.value = df.getNodeFromId(nodeId.value)
                result.value = nodeData.value.data.result
                const moduleName = df.getModuleFromNodeId(nodeId.value)
                const moduleNameParts = moduleName.split('-')

                emitter.on('execute-nodes', () => {

                    if(moduleName !== 'Home')
                    {
                        const blockType = moduleNameParts[0]

                        if(blockType === 'conditional')
                        {
                            const conditionalFlow = moduleNameParts[1]
                            const conditionalNode = df.getNodeFromId(moduleNameParts[3])

                            if(!shouldExecuteInConditionalBlock(conditionalFlow,conditionalNode))
                            {
                                return;
                            }

                            
                        }
                        
                    }
                    result.value = 0
                    nodeData.value = df.getNodeFromId(nodeId.value)
                    const numbersInOperation = []
                    const inputs = nodeData.value.inputs
                
                    
                    Object.keys(inputs).forEach(key => {
                        const input = inputs[key]
                        const connection = input.connections[0]
                        const currentNode = df.getNodeFromId(connection.node)

                        numbersInOperation.push(currentNode.data.result)
                    })
                      switch(binaryOp.value)
                        {

                            case '+':
                                result.value = numbersInOperation[0] + numbersInOperation[1]
                            break;
                            case '-':
                                result.value -= numbersInOperation[0] - numbersInOperation[1]
                            break;
                            case '*':
                                result.value = numbersInOperation[0] * numbersInOperation[1]
                            break;
                            case '/':
                                result.value = numbersInOperation[0] / numbersInOperation[1]
                            break;

                        }
                        console.log(`${numbersInOperation[0]} + ${numbersInOperation[1]}`)
                        nodeData.value.data.result = result.value
                        nodeData.value.data.pythonCode = binaryOp.value
                        df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
                    })
                    
                    
                })
                
            

            return {
                result,
                root,
                binaryOp,
                nodeId
            }
        }
        
    }
</script>