<template>
    <div id="drawflow"></div>
    <button @click="createNumberNode">Create number node</button>
    <button @click="createOperationNode">Create operation node</button>
    <button @click="createAssignNode">Create assign node</button>
    <button @click="executeNodes">Execute nodes</button>
 
    
</template>


<script>
import{shallowRef,onMounted, h, render, getCurrentInstance, readonly} from 'vue'
import numberNode from './numberNode.vue'
import operationNode from './operationNode.vue'
import assignNode from './assignNode.vue'


import DrawFlow from 'drawflow'
//eslint-disable-next-line
import styleDrawflow from "drawflow/dist/drawflow.min.css";

export default {
    name:'drawflow',

    setup()
    {
        const listNodes = readonly([
            {
                item:'numberNode',
                input:0,
                output:1
            },
         
            {
                item:'operationNode',
                input:1,
                output:1
            },
            {
                item:'assignNode',
                input:1,
                output:1
            }
        ])
        const editor = shallowRef({})
        // const executeCode = ref(false)
        const Vue = { version: 3, h, render };
        const internalInstance = getCurrentInstance();
        
        internalInstance.appContext.app._context.config.globalProperties.$df = editor; //Declaring draw flow editor as a global variable df to use on all components.
        
        function addNodeToDrawFlow(name, pos_x, pos_y) {


            const nodeSelected = listNodes.find((ele) => ele.item == name);
            console.log(nodeSelected)
            editor.value.addNode(
                name,
                nodeSelected.input,
                nodeSelected.output,
                pos_x,
                pos_y,
                name,
                {},
                name,
                "vue"
            );
        }

        const createNumberNode = () => {
                addNodeToDrawFlow("numberNode",0,0)
            
        }

        const createOperationNode = () => {
            addNodeToDrawFlow("operationNode",0,0)
        }
        const createAssignNode = () => {
            addNodeToDrawFlow("assignNode",0,0)
        }

  
        onMounted(() => {
          
            const id = document.getElementById('drawflow')
            editor.value = new DrawFlow(  
                id,
                Vue,
                internalInstance.appContext.app._context)

            editor.value.start()

            editor.value.registerNode("numberNode",numberNode,{},{})
            editor.value.registerNode("operationNode",operationNode,{},{})
            editor.value.registerNode("assignNode",assignNode,{},{})

        
            editor.value.on("connectionCreated", function(info) {
            const nodeInfo = editor.value.getNodeFromId(info.output_id);
            if(nodeInfo.outputs[info.output_class].connections.length > 1) {
                const removeConnectionInfo = nodeInfo.outputs[info.output_class].connections[0];
                editor.value.removeSingleConnection(info.output_id, removeConnectionInfo.node, info.output_class, removeConnectionInfo.output);
            }
            });

            
            


        })

        return {
            createNumberNode,
            createOperationNode,
            createAssignNode
        }
    }
}
</script>

<style>
    body{
        height:100vh;
    }
   
    #drawflow{
        border:1px solid black;
        width:100%;
        height:60vh;
        text-align: initial;
    }
</style>
