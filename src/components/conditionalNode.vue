<template>
    <div  ref="root">
        <div>Conditional node</div>
        <div style="margin-bottom:10px;">
            <select v-model="logicOperator">
            <option value="Greater than">Greater than</option>
            <option value="Lesser than">Lesser than</option>
            <option value="Equal than">Equal than</option>
        </select>
        </div>
        <button @click="handleClickEnter">Enter code block</button>
        <div>{{conditionMet}}</div>
        
    </div>
</template>

<script>
import { defineComponent, nextTick, onMounted,ref,getCurrentInstance} from 'vue'
import useEmitter from './useEmitter.js';


export default defineComponent({
    setup() {
       
        const root = ref(null);
        const nodeId = ref(0);
        const nodeData = ref({})
        const conditionMet = ref(null)
        const logicOperator = ref('')
       
        const emitter = useEmitter()
        let df = getCurrentInstance().appContext.config.globalProperties.$df.value

        onMounted(async () => {
           await nextTick()
            nodeId.value = root.value.parentElement.parentElement.id.slice(5)
            nodeData.value = df.getNodeFromId(nodeId.value)

            if(df.drawflow.drawflow[`conditional-block-${nodeId.value}`] === undefined)
            {
                df.addModule(`conditional-block-${nodeId.value}`)
            }
        })

        function handleClickEnter()
        {
            df.changeModule(`conditional-block-${nodeId.value}`)
        }

        emitter.on('execute-nodes', () => {
            nodeData.value = df.getNodeFromId(nodeId.value)
            const comparisonValues = []

            Object.keys(nodeData.value.inputs).forEach(key => {
                const nodeConnectedId = nodeData.value.inputs[key].connections[0].node
                const nodeConnected = df.getNodeFromId(nodeConnectedId)
                comparisonValues.push(nodeConnected.data.result)

            })

            switch(logicOperator.value)
            {
                case 'Greater than':
                    conditionMet.value = comparisonValues[0] > comparisonValues[1]
                break;
                case 'Lesser than':
                    conditionMet.value = comparisonValues[0] < comparisonValues[1]
                break;
                case 'Equal than':
                    conditionMet.value = comparisonValues[0] === comparisonValues[1]
                break;
            }

            nodeData.value.data.conditionMet = conditionMet.value

            df.updateNodeDataFromId(nodeId.value,nodeData.value.data)

           



            
        })

        return{
            root,
            handleClickEnter,
            conditionMet,
            logicOperator
        }   
    },
})
</script>

<style scoped>

    .static{
        padding:20px;
        background-color:none;
    }
    .isFalse{
        background-color:red;
    }

    .isTrue{
        background-color:green;
    }

</style>