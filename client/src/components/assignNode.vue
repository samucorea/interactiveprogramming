<template>
    <div ref="root">
        <div>Node {{ nodeId }}</div>
        <div style="margin-bottom:10px;">Assign</div>
        <div style="margin-bottom:10px;">
            <el-input df-name v-model="assignName" placeholder="variable name..." type="text" />
        </div>
        <div>{{ assignValue }}</div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { getCurrentInstance, nextTick, onMounted } from '@vue/runtime-core'
import useEmitter from './useEmitter.js'
// import handleModule from './handleModule.js'
import setExecProcedure from './setExecProcedure.js'
import showError from './showError.js'

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



        onMounted(async () => {
            await nextTick()
            nodeId.value = root.value.parentElement.parentElement.id.slice(5)
            nodeData.value = df.getNodeFromId(nodeId.value)




            assignName.value = nodeData.value.data.name
            assignValue.value = nodeData.value.data.value

            setExecProcedure(emitter, executeNode, df, nodeData.value)


        })
        return {
            assignName,
            assignValue,
            root,
            nodeId
        }

        function executeNode() {

            if (!isNaN(assignName.value) || assignName.value === undefined) {
                showError(`A variable name can't be a number. Please specify a set of characters, not only numbers at Node ${nodeId.value}`)
                return;
            }

            try

            {
                const moduleName = df.getModuleFromNodeId(nodeId.value)

                nodeData.value = df.getNodeFromId(nodeId.value)
                const connectedNode = df.getNodeFromId(nodeData.value.inputs.input_1.connections[0].node)


                assignValue.value = connectedNode.data.result



                nodeData.value.data.name = assignName.value
                nodeData.value.data.value = assignValue.value
                nodeData.value.data.pythoncode = `${assignName.value} = ${connectedNode.data.pythoncode}\n`


                df.updateNodeDataFromId(nodeId.value, nodeData.value.data)
            }
            catch
            {
                setTimeout(() => {
                    showError(`Please, connect the assignNode input to another node at Node ${nodeId.value}`)
                },200)
            }
            
        }





    },
}
</script>
