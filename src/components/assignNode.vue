<template>
    <div ref="root">
        <div>Node {{nodeId}}</div>
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
import shouldExecuteInConditionalBlock from './shouldExecuteInConditionalBlock.js'

export default {
    setup() {
        const root = ref(null)
        const nodeId = ref(0)
        const nodeData = ref({})
        const assignName = ref('')
        const assignValue = ref(0)
        const internalInstance = getCurrentInstance()

        const emitter = useEmitter()
        let df = internalInstance.appContext.config.globalProperties.$df.value;
        const variables = internalInstance.appContext.config.globalProperties.$variables

        
        onMounted(async () => {
            await nextTick()
            nodeId.value = root.value.parentElement.parentElement.id.slice(5)
            nodeData.value = df.getNodeFromId(nodeId.value)
            const moduleName = df.getModuleFromNodeId(nodeId.value)
            const moduleNameParts = moduleName.split('-')
          


            assignName.value = nodeData.value.data.variableName
            assignValue.value = nodeData.value.data.variableValue

            emitter.on('execute-nodes', () => {
                nodeData.value = df.getNodeFromId(nodeId.value)
                const connectedNode = df.getNodeFromId(nodeData.value.inputs.input_1.connections[0].node)
                const scopeVariables = variables[moduleName]

               

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

                assignValue.value = connectedNode.data.result
                let pythonCode = `${assignName.value} = ${assignValue.value}`
                

                if(scopeVariables === undefined)
                {
                    variables[moduleName] = {}
                }

                variables[moduleName][assignName.value] = assignValue.value

               
                console.log(pythonCode)

                nodeData.value.data.pythonCode = pythonCode
                nodeData.value.data.variableName = assignName.value
                nodeData.value.data.variableValue = assignValue.value

                df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
                
                
            })
            
        
            
        })
        return{
            assignName,
            assignValue,
            root,
            nodeId
        }
     


        

    },
}
</script>
