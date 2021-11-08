<template>
    <el-container>
        <el-header class="header">
         
        <h1>Interactive programming</h1>
        
        
        </el-header>
        <el-container class="container">
            <el-aside width="250px" class="column">
                    <ul>
                        <li
                            v-for="n in listNodes"
                            :key="n"
                            draggable="true"
                            :data-node="n.item"
                            @dragstart="drag($event)"
                        >
                            <div class="node" :style="`background: lightblue;`">
                            {{ n.item }}
                            </div>
                        </li>
                        </ul>
                          
            </el-aside>
            <el-main class="main" style="overflow:hidden;">
                <div 
                id="drawflow"
                @drop="drop($event)"
                @dragover="allowDrop($event)"></div>
            </el-main>
           
           
         
           
  
        </el-container>

         <el-footer>
              <el-button @click="executeNodes">Execute nodes</el-button>
              <el-button @click="exportNodes">Export nodes</el-button>
            </el-footer>
    </el-container>
   

    
    
 
    
</template>


<script>
import{shallowRef,onMounted, h, render, getCurrentInstance, readonly} from 'vue'
import numberNode from './numberNode.vue'
import operationNode from './operationNode.vue'
import assignNode from './assignNode.vue'
import conditionalNode from './conditionalNode.vue'
import useVariable from './useVariable.vue'
import printNode from './printNode.vue'
import loopNode from './loopNode.vue'

import DrawFlow from 'drawflow'
//eslint-disable-next-line
import styleDrawflow from "drawflow/dist/drawflow.min.css";
import useEmitter from './useEmitter.js'

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
                input:2,
                output:1
            },
            {
                item:'assignNode',
                input:1,
                output:0
            },
            {
                item:'conditionalNode',
                input:2,
                output:0
            },
            {
                item:'useVariableNode',
                input:0,
                output:1
            },
            {
                item:'printNode',
                input:1,
                output:0
            },
            {
                item:'loopNode',
                input:0,
                output:0
            }
        ])
        const editor = shallowRef({})
        // const executeCode = ref(false)
        const Vue = { version: 3, h, render };
        const internalInstance = getCurrentInstance();
        const emitter = useEmitter()
        
        internalInstance.appContext.app._context.config.globalProperties.$df = editor; //Declaring draw flow editor as a global variable df to use on all components.
        internalInstance.appContext.app._context.config.globalProperties.$variables = {'Home': {}}
        function addNodeToDrawFlow(name, pos_x, pos_y) {
            
             pos_x =
                pos_x *
                (editor.value.precanvas.clientWidth /
                    (editor.value.precanvas.clientWidth * editor.value.zoom)) -
                editor.value.precanvas.getBoundingClientRect().x *
                (editor.value.precanvas.clientWidth /
                    (editor.value.precanvas.clientWidth * editor.value.zoom));
            pos_y =
                pos_y *
                (editor.value.precanvas.clientHeight /
                    (editor.value.precanvas.clientHeight * editor.value.zoom)) -
                editor.value.precanvas.getBoundingClientRect().y *
                (editor.value.precanvas.clientHeight /
                    (editor.value.precanvas.clientHeight * editor.value.zoom));

            const nodeSelected = listNodes.find((ele) => ele.item == name);
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

        function drag(ev)
        {
            ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
        }

        function drop(ev)
        {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("node");
            addNodeToDrawFlow(data, ev.clientX, ev.clientY);
        }

        function allowDrop(ev)
        {
            ev.preventDefault()
        }

    

        function executeNodes() {
            emitter.emit('execute-nodes')
            
        }
        function returnHomeModule()
        {
            editor.value.changeModule('Home')
        }

    

        function exportNodes()
        {
            console.log(editor.value.export())
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
            editor.value.registerNode("conditionalNode", conditionalNode,{},{})
            editor.value.registerNode("useVariableNode", useVariable,{},{})
            editor.value.registerNode("printNode", printNode,{},{})
            editor.value.registerNode("loopNode",loopNode,{},{})

        
            editor.value.on("connectionCreated", function(info) {
            const nodeInfo = editor.value.getNodeFromId(info.output_id);
            if(nodeInfo.outputs[info.output_class].connections.length > 1) {
                const removeConnectionInfo = nodeInfo.outputs[info.output_class].connections[0];
                editor.value.removeSingleConnection(info.output_id, removeConnectionInfo.node, info.output_class, removeConnectionInfo.output);
            }
            });

            
            


        })

        return {
            listNodes,
            drag,
            drop,
            allowDrop,
            createNumberNode,
            returnHomeModule,
            executeNodes,
            exportNodes,
         
        }
    }
}
</script>

<style>
    html{
        overflow:hidden;
    }
    body{
        overflow:hidden;
    }
  

    ul{
        list-style: none;
    }

    .container{
        min-height:calc(90vh - 100px);
    }
    .main{
        overflow:hidden;
    }
   
    #drawflow{
        border:1px solid black;
        height:100%;
        width:100%;
        text-align: initial;
        overflow:hidden;
    }

    .node{
        padding:1rem;
        margin:1rem;
    }
</style>
