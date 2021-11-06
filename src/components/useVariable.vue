<template>
    <div ref="root">
        <div>Node {{nodeId}}</div>
        <div>Variable</div>
        <input  v-model="variableName" type="text">
        <div>
            {{variableValue}}
        </div>
    </div>
</template>

<script>
import { defineComponent,onMounted,ref,getCurrentInstance,nextTick } from 'vue'
import useEmitter from './useEmitter';
import shouldExecuteInConditionalBlock from './shouldExecuteInConditionalBlock';

export default defineComponent({
    setup() {
        const root = ref(null);
        const nodeId = ref(0);
        const nodeData = ref({})
        const internalInstance = getCurrentInstance()
        const variableName = ref('')
        const variableValue = ref('')
        const variables = internalInstance.appContext.app._context.config.globalProperties.$variables
        const df = internalInstance.appContext.app._context.config.globalProperties.$df.value
        const emitter = useEmitter()

        onMounted(async () => {
            await nextTick()
   
            nodeId.value = root.value.parentElement.parentElement.id.slice(5)
            nodeData.value = df.getNodeFromId(nodeId.value)
            const moduleName = df.getModuleFromNodeId(nodeId.value)
            const moduleNameParts = moduleName.split('-')

            variableName.value = nodeData.value.data.variableName
            variableValue.value = nodeData.value.data.result

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
                
                let value = variables[moduleName][variableName.value]

                if(value !== undefined)
                {
                    variableValue.value = value
                    nodeData.value.data.variableName = variableName.value
                    nodeData.value.data.result = value

                    df.updateNodeDataFromId(nodeId.value,nodeData.value.data)

                }
            })

            

        })
        
       

        return{
            variableName,
            variableValue,
            root,
            nodeId
        }
    },
})
</script>
