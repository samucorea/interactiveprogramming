<template>
    <div ref="root">
        <p>Add</p>
        {{sum}}
    </div>
</template>

<script>
import { getCurrentInstance, nextTick, onMounted, ref } from '@vue/runtime-core'
    export default{
        props:{
            execute: Boolean
        },
        setup()
        {

            const root = ref(null);
            const nodeId = ref(0)
            const nodeData = ref({})
            const nodesConnected = ref([])
            const numbersConnected = ref([])

            let sum = ref(0)
            let df = getCurrentInstance().appContext.config.globalProperties.$df.value

            const updateSum = () => {
                sum.value = 0
                const operationNode = df.getNodeFromId(nodeId.value)

               
                operationNode.inputs.input_1.connections.forEach(connection => {
                    const connectedNode = df.getNodeFromId(connection.node)
                    sum.value += parseInt(connectedNode.data.number)
                })
                     

            }

            // watch(sum,(sum,prevSum) => {
            //     console.log(prevSum)
            //     df.updateNodeDataFromId(nodeId.value,{sum, numbers: [...numbersConnected.value]})
            // })
            onMounted(async () => {
                await nextTick()
                
                nodeId.value = root.value.parentElement.parentElement.id.slice(5)
                nodeData.value = df.getNodeFromId(nodeId.value)

              

                  df.on('connectionCreated', function(connections) {
                    if(connections.input_id === nodeId.value)
                    {
                        const connectedNode = df.getNodeFromId(connections.output_id)
                       
                        nodesConnected.value.push(connectedNode.id)
                        console.log(nodesConnected.value)
                        numbersConnected.value.push(connectedNode.data.number)

                        
                        if(connectedNode.name === 'numberNode')
                        {
                            sum.value += parseInt(connectedNode.data.number)

                        }
                       
                    }
                })

                  df.on('connectionRemoved',function(connections) {
                       if(connections.input_id === nodeId.value)
                    {
                        const connectedNode = df.getNodeFromId(connections.output_id)
                        nodesConnected.value.splice(nodesConnected.value.indexOf(connections.output_id),1)
                        
                        if(connectedNode.name === 'numberNode')
                        {
                            sum.value -= parseInt(connectedNode.data.number)
                        
                        }
                       
                    }
                  })

                 df.on('nodeDataChanged',function(id) {
                     
                     
                     if(nodesConnected.value.includes(parseInt(id)))
                     {

                         updateSum()
                        
                        // const operationNode = df.getNodeFromId(nodeId.value)
                        // const changedNode = df.getNodeFromId(id)
                      
                        // operationNode.inputs.input_1.connections.forEach(connection => {
                        //         if (parseInt(connection.node) === changedNode.id)
                        //         {
                        //             updateSum()
                        //             return;
                        //         }
                        //     })
                        
                     }
                    

                     

                 })
            })

            return {
                sum,
                root,
                updateSum
            }
        }
        
    }
</script>