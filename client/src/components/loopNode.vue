<template>
    <div ref="root">
        <div>
            Node {{nodeId}}
        </div>
        <div>
            From: <input df-from v-model="from" type="text">
        </div>
        <div>
            To: <input df-to v-model="to" type="text">
        </div>
        <button @click="handleClick">Enter loop code block</button>
    </div>
</template>

<script>
import { defineComponent, nextTick, onMounted,ref,getCurrentInstance } from 'vue'
import setExecProcedure from './setExecProcedure'
import showError from './showError'
import useEmitter from './useEmitter'


export default defineComponent({
    setup() {
        const root = ref(null)
        const nodeId = ref(0)
        const nodeData = ref({})
        const from = ref(0)
        const to = ref(0)
        let blockName = ''
        const emitter = useEmitter()
        const df = getCurrentInstance().appContext.app._context.config.globalProperties.$df.value

        onMounted(async () => {
            await nextTick()
            
            nodeId.value = root.value.parentElement.parentElement.id.slice(5)
            nodeData.value = df.getNodeFromId(nodeId.value)
            blockName = `loop-${nodeId.value}`

            from.value = nodeData.value.data.from
            to.value = nodeData.value.data.to

            if(df.drawflow.drawflow[blockName] === undefined)
            {
                df.addModule(blockName)
            }

            setExecProcedure(emitter,executeNode,df,nodeData.value)

            
            
          


        })

        function handleClick()
        {
            df.changeModule(blockName)
        }

        function executeNode()
        {
            nodeData.value = df.getNodeFromId(nodeId.value)

            nodeData.value.data.from = parseInt(from.value) || 0
            if(isNaN(parseInt(to.value)))
            {
                to.value = 0
                setTimeout(() => {
                    showError(`Please, specify to what number the loop node should execute at input at Node ${nodeId.value}`)
                },200)
            }

            if(isNaN(parseInt(from.value)))
            {
                from.value = 0
            }
            nodeData.value.data.to = parseInt(to.value)
            nodeData.value.data.pythoncode = `for i in range(${from.value},${to.value}):\n`

            df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
        }

        return{
            root,
            nodeId,
            from,
            to,
            handleClick
        }
    },
})
</script>
