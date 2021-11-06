<template>
    <div ref="root">
      <div>Node {{nodeId}}</div>
      <div>Number</div>
      <input type="text" @change="handleChange"  v-model="result"  />
      
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
               nodeData.value.data.pythonCode = `${result.value}`
               
               
               df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
               
           }


            return {
                result,
                root,
                handleChange,
                nodeId
            }
           
        }
    }
</script>

<style scoped>

</style>