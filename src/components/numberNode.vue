<template>
    <div ref="root">
      <p>Number</p>
      <input type="number" @change="handleChange" v-model="number" />
      
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
            const number = ref(0)
            const nodeData = ref({})
          
            
            let df = getCurrentInstance().appContext.config.globalProperties.$df.value;
            
          
           
           onMounted( async () => {
               await nextTick()
   
               nodeId.value = root.value.parentElement.parentElement.id.slice(5)
               console.log(nodeId.value)
               nodeData.value = df.getNodeFromId(nodeId.value)
               number.value = nodeData.value.data.number
               
               
           })

           const handleChange = () => {
               nodeData.value.data.number = parseInt(number.value)
               df.updateNodeDataFromId(nodeId.value,nodeData.value)
           }


            return {
                number,
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