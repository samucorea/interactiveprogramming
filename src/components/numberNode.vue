<template>
    <div ref="root">
      <p>Number</p>
      <input type="number" @change="handleChange"  v-model="result" df-number  />
      
    </div>
</template>


<script>
    import { ref } from "@vue/reactivity"
import { getCurrentInstance,  nextTick, onMounted } from "@vue/runtime-core"



    export default {
        name: 'numberNode',
        setup() {
            const root = ref(null);
            const nodeId = ref(0)
            
            const result = ref(0)
            const nodeData = ref({})
          
            
            let df = getCurrentInstance().appContext.config.globalProperties.$df.value;
            
          
           
           onMounted( async () => {
               await nextTick()
   
               nodeId.value = root.value.parentElement.parentElement.id.slice(5)
               nodeData.value = df.getNodeFromId(nodeId.value)
               result.value = nodeData.value.data.result 
               
               
           })

           const handleChange = () => {
               nodeData.value.data.result = parseInt(result.value)
               
               
               df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
               
           }


            return {
                result,
                root,
                handleChange
            }
           
        }
    }
</script>

<style scoped>
input{
    width:3.5rem;
}
</style>