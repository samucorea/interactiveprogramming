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
import setExecProcedure from './setExecProcedure';
import useEmitter from './useEmitter';
import showError from './showError';





    export default {
        name: 'numberNode',
        setup() {
            const root = ref(null);
            const nodeId = ref(0)
            const result = ref(0)
            const nodeData = ref({})
            const emitter = useEmitter()
        
            
            let df = getCurrentInstance().appContext.config.globalProperties.$df.value;
            
           
           onMounted( async () => {
               await nextTick()
   
               nodeId.value = root.value.parentElement.parentElement.id.slice(5)
               nodeData.value = df.getNodeFromId(nodeId.value)
               result.value = nodeData.value.data.result

                setExecProcedure(emitter,executeNode,df,nodeData.value)

              
               
               
           })

           const handleChange = () => {
               nodeData.value.data.result = parseInt(result.value)
               nodeData.value.data.pythoncode = `${result.value}`
               
               
               df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
               
           }

           function executeNode()
           {
               if(isNaN(result.value))
               {
                 result.value = 0
                 handleChange()
                 setTimeout(() => {
                     showError(`Please, specify a number at the number Node ${nodeId.value}`)
                 },200)
                 
               }
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