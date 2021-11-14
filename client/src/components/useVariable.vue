<template>
    <div ref="root">
        <div>Node {{nodeId}}</div>
        <div>Variable</div>
        <el-input @change="handleChange" df-pythoncode size="small"  v-model="variableName" type="text" />
        <div>
            {{variableValue}}
        </div>
    </div>
</template>

<script>
import { defineComponent,onMounted,ref,getCurrentInstance,nextTick } from 'vue'
import useEmitter from './useEmitter';
import setExecProcedure from './setExecProcedure';
import showError from './showError';

export default defineComponent({
    setup() {
        const root = ref(null);
        const nodeId = ref(0);
        const nodeData = ref({})
        const internalInstance = getCurrentInstance()
        const variableName = ref('')
        const variableValue = ref('')
        const df = internalInstance.appContext.app._context.config.globalProperties.$df.value
        const emitter = useEmitter()

        onMounted(async () => {
            await nextTick()
   
            nodeId.value = root.value.parentElement.parentElement.id.slice(5)
            nodeData.value = df.getNodeFromId(nodeId.value)

           

            variableName.value = nodeData.value.data.pythoncode
            variableValue.value = nodeData.value.data.result

            setExecProcedure(emitter,executeNode,df,nodeId)

            

        })
        
        function executeNode()
        {
            if(variableName.value === undefined || !isNaN(variableName.value))
            {
                setTimeout(() => {
                    showError(`Please, specify the variable to use at Node ${nodeId.value}`)
                },200)
            }
            
                nodeData.value.data.pythoncode = variableName.value
                df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
        }

        function handleChange()
        {
            nodeData.value = df.getNodeFromId(nodeId.value)

            nodeData.value.pythoncode = variableName.value

            df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
        }
       

        return{
            variableName,
            variableValue,
            root,
            nodeId,
            handleChange
        }
    },
})
</script>
