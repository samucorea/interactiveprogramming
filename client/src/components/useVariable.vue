<template>
    <div ref="root">
        <div>Node {{nodeId}}</div>
        <div>Variable</div>
        <el-input df-pythoncode size="small"  v-model="variableName" type="text" />
        <div>
            {{variableValue}}
        </div>
    </div>
</template>

<script>
import { defineComponent,onMounted,ref,getCurrentInstance,nextTick } from 'vue'
import useEmitter from './useEmitter';
import handleModule from './handleModule';
import setExecProcedure from './setExecProcedure';

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

           

            variableName.value = nodeData.value.data.name
            variableValue.value = nodeData.value.data.result

            setExecProcedure(emitter,executeNode,df,nodeId)

            

        })
        
        function executeNode()
        {
            const moduleName = df.getModuleFromNodeId(nodeId.value)
            
                    if(!handleModule(moduleName,df))
                {
                    return;
                }
              let value = variables[moduleName][variableName.value]
                
                if(value !== undefined)
                {
                    variableValue.value = value
                 
                    nodeData.value.data.result = value

                    
                }
                nodeData.value.data.pythoncode = variableName.value
                df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
        }
       

        return{
            variableName,
            variableValue,
            root,
            nodeId
        }
    },
})
</script>
