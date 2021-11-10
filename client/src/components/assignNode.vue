<template>
    <div ref="root">
        <div>Node {{nodeId}}</div>
        <div style="margin-bottom:10px;">Assign</div>
        <div style="margin-bottom:10px;">
           <el-input df-name v-model="assignName"  placeholder="variable name..." type="text" />
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
import handleModule from './handleModule.js'
import setExecProcedure from './setExecProcedure.js'

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
            
          


            assignName.value = nodeData.value.data.name
            assignValue.value = nodeData.value.data.value

            setExecProcedure(emitter,executeNode,df,nodeId)
        
            
        })
        return{
            assignName,
            assignValue,
            root,
            nodeId
        }

        function executeNode()
        {
            
            if(!isNaN(assignName.value))
            {
                alert(`Variable name can't be a number at Node ${nodeId.value}`)
                return;
            }
            const moduleName = df.getModuleFromNodeId(nodeId.value)
            
             if(!handleModule(moduleName,df))
             {
                 return;
             }

           
            nodeData.value = df.getNodeFromId(nodeId.value)
            const connectedNode = df.getNodeFromId(nodeData.value.inputs.input_1.connections[0].node)
            const scopeVariables = variables[moduleName]
           

                assignValue.value = connectedNode.data.result

                if(scopeVariables === undefined)
                {
                    variables[moduleName] = {}
                }

                variables[moduleName][assignName.value] = assignValue.value

         
                nodeData.value.data.name = assignName.value
                nodeData.value.data.value = assignValue.value
                nodeData.value.data.pythonCode = `${assignName.value} = ${connectedNode.data.pythonCode}\n`
           

                df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
        }
     


        

    },
}
</script>
