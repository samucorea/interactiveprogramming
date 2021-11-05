<template>
    <div ref="root">
      <select v-model="option" style="margin-bottom:10px;">
          <option id="Number">Number</option>
          <option id="useVariable">Use variable</option>
      </select>
      <input type="text" @change="handleChange"  v-model="result" df-number  />
      
    </div>
</template>


<script>
    import { ref } from "@vue/reactivity"
import { getCurrentInstance,  nextTick, onMounted } from "@vue/runtime-core"
import useEmitter from "./useEmitter";




    export default {
        name: 'numberNode',
        setup() {
            const root = ref(null);
            const nodeId = ref(0)
            const option = ref('Number')
            const emitter = useEmitter()
            const result = ref(0)
            const nodeData = ref({})
        
            
            let df = getCurrentInstance().appContext.config.globalProperties.$df.value;
            
            const variables = getCurrentInstance().appContext.config.globalProperties.$variables
           
           onMounted( async () => {
               await nextTick()
   
               nodeId.value = root.value.parentElement.parentElement.id.slice(5)
               nodeData.value = df.getNodeFromId(nodeId.value)
               result.value = nodeData.value.data.result
               const moduleName = df.getModuleFromNodeId(nodeId.value)

               emitter.on('execute-nodes', () => {
                   if (option.value === 'Use variable')
                   {
                       console.log(variables)
                       if(variables[moduleName][result.value] !== undefined)
                       {
                           result.value = variables[moduleName][result.value]
                           handleChange()
                       }
                       else
                       {
                           result.value = NaN
                           handleChange()
                       }
                   }
               })

              
               
               
           })

           const handleChange = () => {
               nodeData.value.data.result = parseInt(result.value)
               
               
               df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
               
           }


            return {
                result,
                root,
                handleChange,
                option
            }
           
        }
    }
</script>

<style scoped>
input{
    width:3.5rem;
}
</style>