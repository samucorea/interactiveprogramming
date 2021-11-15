<template>
    <div  ref="root">
        <div>Node {{nodeId}}</div>
        <div>Conditional node</div>
        <div style="margin-bottom:10px;">
            <select @change="handleOptionChange" v-model="logicOperator">
            <option value="Greater than">Greater than</option>
            <option value="Lesser than">Lesser than</option>
            <option value="Equal than">Equal than</option>
        </select>
        </div>
        <button @click="handleClickMain">Enter main code block</button>
        <button @click="handleClickElse">Enter else code block</button>
        <div>{{conditionMet}}</div>
        
    </div>
</template>

<script>
import { defineComponent, nextTick, onMounted,ref,getCurrentInstance, readonly} from 'vue'
import 'element-plus/dist/index.css'
// import handleModule from './handleModule.js';



export default defineComponent({
    setup() {
       
        const root = ref(null);
       
        const nodeId = ref(0);
        const nodeData = ref({})
        const conditionMet = ref(null)
        const logicOperator = ref('')
       

        let df = getCurrentInstance().appContext.config.globalProperties.$df.value

        onMounted(async () => {
           await nextTick()
            nodeId.value = root.value.parentElement.parentElement.id.slice(5)
            nodeData.value = df.getNodeFromId(nodeId.value)
            logicOperator.value = nodeData.value.data.logicOperator

            if(df.drawflow.drawflow[`conditional-main-block-${nodeId.value}`] === undefined)
            {
                df.addModule(`conditional-main-block-${nodeId.value}`)
            }
            if(df.drawflow.drawflow[`conditional-else-block-${nodeId.value}`] === undefined)
            {
                df.addModule(`conditional-else-block-${nodeId.value}`)
            }


            

        })

        function handleClickMain()
        {
            df.changeModule(`conditional-main-block-${nodeId.value}`)
        }
        function handleClickElse()
        {
            df.changeModule(`conditional-else-block-${nodeId.value}`)
        }

        function handleOptionChange()
        {
            nodeData.value.data.logicOperator = logicOperator.value
            df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
        }

        return{
            root,
            handleClickMain,
            conditionMet,
            logicOperator,
            handleClickElse,
            handleOptionChange,
            nodeId
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