<template>
    <div ref="root">
        <div>Node {{nodeId}}</div>
        <div>Operation node</div>
        <div style="margin-bottom:10px;">
            <el-select size="small" v-model="binaryOp">
            <el-option value="+">Sum</el-option>
            <el-option value="-">Substract</el-option>
            <el-option value="*">Multiply</el-option>
            <el-option value="/">Divide</el-option>
        </el-select>
        </div>
        <span>{{result}}</span>
    </div>
</template>

<script>
import { getCurrentInstance, nextTick, onMounted, ref } from '@vue/runtime-core'
import useEmitter from './useEmitter.js';
// import handleModule from './handleModule.js';
import setExecProcedure from './setExecProcedure.js';
    export default{

        setup()
        {
            const emitter = useEmitter()
            const root = ref(null);
            const nodeId = ref(0)
            const binaryOp = ref('+')
            const nodeData = ref({})
            //const nodeNumbers = ref({})

            let result = ref(0)
            let df = getCurrentInstance().appContext.config.globalProperties.$df.value
        
            onMounted(async () => {
                await nextTick()
                
                nodeId.value = root.value.parentElement.parentElement.id.slice(5)
                nodeData.value = df.getNodeFromId(nodeId.value)
                result.value = nodeData.value.data.result
              
                

                setExecProcedure(emitter,executeNode,df,nodeId)
               
                    
                    
                })

            function executeNode()
            {
                // const moduleName = df.getModuleFromNodeId(nodeId.value)
            
                //     if(!handleModule(moduleName,df))
                // {
                //     return;
                // }
                    result.value = 0
                    nodeData.value = df.getNodeFromId(nodeId.value)
                    const numbersInOperation = []
                    const expressionsInOperation = []
                    const inputs = nodeData.value.inputs
                
                    
                    Object.keys(inputs).forEach(key => {
                        const input = inputs[key]
                        const connection = input.connections[0]
                        const currentNode = df.getNodeFromId(connection.node)

                        numbersInOperation.push(currentNode.data.result)
                        expressionsInOperation.push(currentNode.data.pythoncode)
                    })
                      switch(binaryOp.value)
                        {

                            case '+':
                                result.value = numbersInOperation[0] + numbersInOperation[1]
                            break;
                            case '-':
                                result.value -= numbersInOperation[0] - numbersInOperation[1]
                            break;
                            case '*':
                                result.value = numbersInOperation[0] * numbersInOperation[1]
                            break;
                            case '/':
                                result.value = numbersInOperation[0] / numbersInOperation[1]
                            break;

                        }
                        
                        nodeData.value.data.result = result.value
                        nodeData.value.data.pythoncode = `${expressionsInOperation[0]} ${binaryOp.value} ${expressionsInOperation[1]}`
                        df.updateNodeDataFromId(nodeId.value,nodeData.value.data)
            }
                
            

            return {
                result,
                root,
                binaryOp,
                nodeId
            }
        }
        
    }
</script>