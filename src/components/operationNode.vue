<template>
    <div ref="root">
        <p>Add</p>
        {{sum}}
    </div>
</template>

<script>
import { getCurrentInstance, nextTick, onMounted, ref } from '@vue/runtime-core'
    export default{
        setup()
        {

            const root = ref(null);
            const nodeId = ref(0)

            let sum = ref(0)
            let df = getCurrentInstance().appContext.config.globalProperties.$df.value

            const updateSum = () => {
                sum.value = 0
                const operationNode = df.getNodeFromId(nodeId.value)

                for(let key of Object.keys(operationNode.inputs))
                     {
                         operationNode.inputs[key].connections.forEach(connection => {
                             const connectedNode = df.getNodeFromId(connection.node)
                             sum.value += parseInt(connectedNode.data.number)
                         })
                     }

            }
            onMounted(async () => {
                await nextTick()
                
                nodeId.value = root.value.parentElement.parentElement.id.slice(5)

                  df.on('connectionCreated', function(connections) {
                    if(connections.input_id === nodeId.value)
                    {
                        const connectedNode = df.getNodeFromId(connections.output_id)
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
                        if(connectedNode.name === 'numberNode')
                        {
                            sum.value -= parseInt(connectedNode.data.number)
                        
                        }
                       
                    }
                  })

                 df.on('nodeDataChanged',function(id) {
               
                     const operationNode = df.getNodeFromId(nodeId.value)
                     const changedNode = df.getNodeFromId(id)

                     console.log(changedNode)

                     for(let key of Object.keys(operationNode.inputs))
                     {
                         operationNode.inputs[key].connections.forEach(connection => {
                             if (parseInt(connection.node) === changedNode.id)
                             {
                                 updateSum()
                                 return;
                             }
                         })
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