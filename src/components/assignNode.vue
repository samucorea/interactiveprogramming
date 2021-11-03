<template>
    <div ref="root">
        <div style="margin-bottom:10px;">Assign</div>
        <div style="margin-bottom:10px;">
           <input df-name v-model="assignName"  placeholder="variable name..." type="text">
        </div>
        <div >
            <span df-value>{{assignValue}}</span>
        </div>
        
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { getCurrentInstance } from '@vue/runtime-core'

export default {
    setup() {
        const assignName = ref('')
        const assignValue = ref(0)
        let df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        df.on('connectionCreated', function(connections){
            const inputNode = df.getNodeFromId(connections.input_id)
            const outputNode = df.getNodeFromId(connections.output_id)
            
            if(inputNode.name === 'assignNode')
            {
                if(outputNode.name === 'numberNode')
                {
                    assignValue.value = outputNode.data.number


                }
                else if(outputNode.name === 'operationNode')
                {
                    console.log('operationNode input to assignNode')
                }
            }
        })
        return{
            assignName,
            assignValue
        }

        

    },
}
</script>
