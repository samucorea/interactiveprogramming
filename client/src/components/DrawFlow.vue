<template>
    <el-container>
        <el-header height="100px" class="header">
         
        <h1>Interactive programming</h1>
         <h3>{{currentModule}}</h3>
        
        
        </el-header>
        <el-container class="container">
           
            <el-aside width="250px" >
                <div class="tools">

                    
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
                </div>
                   
                          
            </el-aside>
            <el-drawer 
                v-model="savedDiagramsDrawer"
                title="Saved diagrams"
                direction="ltr"
                >
            <ul class="program-list">
                        <li>Program 1</li>
                        <li>Program 2</li>
                    </ul>    
            </el-drawer>
            <el-main class="main" style="overflow:hidden;">
                <div 
                id="drawflow"
                @drop="drop($event)"
                @dragover="allowDrop($event)"></div>
                
            </el-main>
            <el-drawer 
                v-model="codeDrawer"
                title="Code generated"
                direction="rtl"
                >
                   <el-container>
              
                <el-main>
                    <div>
                    <p style="text-align:justify;white-space:pre-wrap; font-size:16px;">
                        <code>
                             {{pythonCode}}
                        </code>
                        <div>
                            <el-button @click="executeCode" type="primary">Execute code</el-button>
                        </div>
                        <div>
                            <code>
                                <h4>Output:</h4>
                                <div>{{codeResponse ? codeResponse : "(empty)"}}</div>
                            </code>
                        </div>
                    </p>
                </div>
                </el-main>
            </el-container>
            </el-drawer>
            
  
        </el-container>

         <el-footer>
             <el-button @click="saveDiagram" type="primary">Save</el-button>
             <el-button type="info" @click="savedDiagramsDrawer = true">Open saved diagrams</el-button>
              <el-button v-if="currentModule !== 'Home'" type="success" @click="returnHomeModule">Return main block</el-button>
              <el-button type="primary" @click="exportNodes">Generate python code</el-button>
        </el-footer>

           
    </el-container>

  
   

    
    
 
    
</template>


<script>
import{shallowRef,onMounted, h, render, getCurrentInstance, readonly, ref} from 'vue'
import numberNode from './numberNode.vue'
import operationNode from './operationNode.vue'
import assignNode from './assignNode.vue'
import conditionalNode from './conditionalNode.vue'
import useVariable from './useVariable.vue'
import printNode from './printNode.vue'
import loopNode from './loopNode.vue'
import getPythonCode from './getPythonCode.js'

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
        const savedDiagramsDrawer = ref(false)
        const codeDrawer = ref(false)
        const Vue = { version: 3, h, render };
        const pythonCode = ref('')
        const internalInstance = getCurrentInstance();
        const currentModule = ref('Home')
        const codeResponse = ref('')
        
        internalInstance.appContext.app._context.config.globalProperties.$df = editor; //Declaring draw flow editor as a global variable df to use on all components.
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

    

      
        function returnHomeModule()
        {
            editor.value.changeModule('Home')
        }

    

        function exportNodes()
        {
            
                
                
                codeDrawer.value = true
                if(currentModule.value !== 'Home')
                {
                    editor.value.changeModule('Home')
                }
           
                const df = editor.value.export()
                pythonCode.value = getPythonCode(df.drawflow,'Home','',editor.value)
           
          
        }

        function executeCode()
        {
            fetch('http://localhost:9000/diagrams/execute',{
                method:'POST',
                body: pythonCode.value
            }).then(response => response.text())
            .then(text => {
                
                if(text.startsWith("Traceback"))
                {
                    
                    codeResponse.value = 'Oops! Something went wrong with your code. Check for use of variables before declaration'
                }
                else
                {
                    codeResponse.value = text
                }
                
            })
        }

        function saveDiagram()
        {
            const exportedJson = JSON.stringify(editor.value.export())
            fetch('http://localhost:9000/diagrams/',{
                method:'POST',
                body: JSON.stringify({
                    uid:"_:diagram",
                    exportedjson: exportedJson,
                    "dgraph.type": "Diagram"
                })
            })

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
            const nodeInfoOutput = editor.value.getNodeFromId(info.output_id);
            const nodeInfoInput = editor.value.getNodeFromId(info.input_id);

            if(nodeInfoOutput.outputs[info.output_class].connections.length > 1) {
                const removeConnectionInfo = nodeInfoOutput.outputs[info.output_class].connections[0];
                editor.value.removeSingleConnection(info.output_id, removeConnectionInfo.node, info.output_class, removeConnectionInfo.output);
            }
            else if(nodeInfoInput.inputs[info.input_class].connections.length > 1) {
                const removeConnectionInfo = nodeInfoInput.inputs[info.input_class].connections[0];
                editor.value.removeSingleConnection(removeConnectionInfo.node, info.input_id, removeConnectionInfo.input, info.input_class);
            }
            
            
        
            });

            editor.value.on('moduleChanged', name => {
                currentModule.value = name
            })


        })

        return {
            listNodes,
            drag,
            drop,
            allowDrop,
            returnHomeModule,
            exportNodes,
            savedDiagramsDrawer,
            pythonCode,
            codeDrawer,
            currentModule,
            executeCode,
            codeResponse,
            saveDiagram
         
        }
    }
}
</script>

<style>
    /* html{
        overflow:hidden;
    }
    body{
        overflow:hidden;
    } */
  

    ul{
        list-style: none;
        padding:0;
        text-align: left;
    }

    .tools{
        display:flex;
    }

    ul.program-list > li {
        cursor:pointer;
        padding:1em;
    }

    .container{
        min-height:calc(95vh - 100px);
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
        padding:2rem;
        margin:1rem;
        text-align: center;
    }
</style>
