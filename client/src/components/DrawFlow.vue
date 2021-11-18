<template>
    <el-container>
        <el-header height="100px" class="header">
         
        <h1>Interactive programming</h1>
         <h3>{{currentModule}}</h3>
        
        
        </el-header>
        <el-container  class="container">
           
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
                custom-class="drawer-diagrams"
                >
            <programList @on-load-diagram="handleLoadDiagram"  @on-delete-diagram="handleDeleteDiagram" :listDiagrams="listDiagrams"/>
            </el-drawer>
            <el-main class="main" style="overflow:hidden;">
                <div style="display:block;position:absolute;top:9%;">
                    <el-button @click="handleNewDiagram"  type="success">New</el-button>
                    <el-button  @click="saveDiagram" type="primary">Save</el-button>
                    
                </div>
                
                <div 
                id="drawflow"
                @drop="drop($event)"
                @dragover="allowDrop($event)"></div>
                 <div>
                 Current diagram open: {{currentDiagramOpen === null ? '(New Diagram)' : currentDiagramOpen.name}}
                </div>
                
            </el-main>
            <el-drawer 
                v-model="codeDrawer"
                title="Code generated"
                direction="rtl"
                >
            <el-container>
              
                <el-main>
                    <codeExecuter :code="codeString" />
                </el-main>
            </el-container>
            </el-drawer>
            
  
        </el-container>

         <el-footer style="display:flex;justify-content:center;align-items:center;">
            
             <div>
                 
             <el-button type="info" @click="savedDiagramsDrawer = true">Open saved diagrams</el-button>
              <el-button v-if="currentModule !== 'Home'" type="success" @click="returnHomeModule">Return main block</el-button>
              <el-button type="primary" @click="exportNodes">Generate python code</el-button>
             </div>
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
import getPythonCode from '../functions/getPythonCode'
import programList from './programList.vue'
import DrawFlow from 'drawflow'
//eslint-disable-next-line
import styleDrawflow from "drawflow/dist/drawflow.min.css";
import { ElMessage, ElMessageBox } from 'element-plus'
import showError from '../functions/showError'
import codeExecuter from './codeExecuter.vue'


export default {
    name: "drawflow",
    setup() {
        const listNodes = readonly([
            {
                item: "numberNode",
                input: 0,
                output: 1
            },
            {
                item: "operationNode",
                input: 2,
                output: 1
            },
            {
                item: "assignNode",
                input: 1,
                output: 0
            },
            {
                item: "conditionalNode",
                input: 2,
                output: 0
            },
            {
                item: "useVariableNode",
                input: 0,
                output: 1
            },
            {
                item: "printNode",
                input: 1,
                output: 0
            },
            {
                item: "loopNode",
                input: 0,
                output: 0
            }
        ]);
        const listDiagrams = ref([]);
        const editor = shallowRef({});
        const savedDiagramsDrawer = ref(false);
        const codeDrawer = ref(false);
        const Vue = { version: 3, h, render };
        const codeString = ref("");
        const internalInstance = getCurrentInstance();
        const currentModule = ref("Home");
        const currentDiagramOpen = ref(null)
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
            editor.value.addNode(name, nodeSelected.input, nodeSelected.output, pos_x, pos_y, name, {}, name, "vue");
        }
        
        function drag(ev) {
            ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
        }

        function drop(ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("node");
            addNodeToDrawFlow(data, ev.clientX, ev.clientY);
        }

        function allowDrop(ev) {
            ev.preventDefault();
        }

        function returnHomeModule() {
            editor.value.changeModule("Home");
        }

        function exportNodes() {
            codeDrawer.value = true;
            if (currentModule.value !== "Home") {
                editor.value.changeModule("Home");
            }
            const df = editor.value.export();
            codeString.value = getPythonCode(df.drawflow, "Home", "", editor.value);
        }

        function saveDiagram() {
           const exportedJson = JSON.stringify(editor.value.export());
            if(currentDiagramOpen.value === null)
            {
                const newDiagram = {
                    uid: "_:diagram",
                    name:  '',
                    exportedjson: exportedJson,
                    "dgraph.type": "Diagram"
                }

                ElMessageBox.prompt('Insert name for saved program.','New program', {
                    confirmButtonText: 'Save',
                    cancelButtonText: 'Cancel',
                    customStyle: "font-family:'Helvetica Neue', Helvetica;",
                    inputPattern: /^.{1,50}$/,
                    inputErrorMessage: "You must write a name of at least 1 character"

                    })
                    .then(({value}) => {

                        newDiagram.name = value

                        if(listDiagrams.value.some(diagram => diagram.name === value))
                        {
                            ElMessage.info("There's already a program with that name. Try another name.")
                            return
                        }

                        fetch("http://localhost:9000/diagrams/", {
                        method: "POST",
                        headers:{
                            'Content-Type' :'application/json'
                        },
                        body: JSON.stringify(newDiagram)

                    }).then(response => response.json())
                     .then(query => {
                         ElMessage.success('Program saved successfully!')

                         newDiagram.uid = query.uids.diagram

                        const currentListDiagrams = listDiagrams.value
                        currentListDiagrams.push(newDiagram)
                        listDiagrams.value = currentListDiagrams

                        currentDiagramOpen.value = newDiagram
                     })
                     .catch(err => {
                        showError("Something went wrong when saving program.")
                    });
                })
                    
            }
            else
            {
                fetch("http://localhost:9000/diagrams/", {
                method: "PUT",
                headers:{
                    'Content-Type' :'application/json'
                },
                body: JSON.stringify({
                    uid: currentDiagramOpen.value.uid ,
                    name: currentDiagramOpen.value.name,
                    exportedjson: exportedJson,
                    "dgraph.type": "Diagram"
                })
            }).then(response => {
                ElMessage.success('Program saved successfully!')
                
            }).catch(err => {
                showError("Something went wrong when saving program.")
            });
            }
            
          
            
            
        }


        function handleNewDiagram()
        {
            currentDiagramOpen.value = null
            editor.value.clear()
        }


        function handleLoadDiagram(uid)
        {
            fetch(`http://localhost:9000/diagrams/${uid}`)
            .then(response => response.json())
            .then(query => {
                
                if(query.getById.length !== 0)
                {
                    const diagramFound = query.getById[0]
                    const drawflow = JSON.parse(diagramFound.exportedjson)

                    savedDiagramsDrawer.value = false
                    currentDiagramOpen.value = diagramFound
                    editor.value.import(drawflow)
                }
            })
        }

        function handleDeleteDiagram(diagramToDel)
        {

            ElMessageBox.confirm(
                'Program will be permanently deleted. Continue?',
                'Warning',
                {
                    confirmButtonText: "Delete",
                    cancelButtonText: "Cancel",
                    type: 'warning',
                    customStyle: "font-family:'Helvetica Neue', Helvetica;"
                }

            )
            .then(() => {
                fetch('http://localhost:9000/diagrams', {
                    method: 'DELETE',
                    headers:{
                        'Content-Type' :'application/json'
                    },
                    body: JSON.stringify(diagramToDel)

                })
                .then(() => {
                    ElMessage.info('Program was successfully deleted.')
                    if(currentDiagramOpen.value !== null && currentDiagramOpen.value.uid === diagramToDel.uid)
                    {
                        currentDiagramOpen.value = null
                        editor.value.clear()
                    }

                    const currentListDiagrams = listDiagrams.value
                    listDiagrams.value = currentListDiagrams.filter(diagram => diagram.uid !== diagramToDel.uid)
                    savedDiagramsDrawer.value = false
                })
                .catch((err) => {
                    console.log(err)
                    ElMessage.warning('There was a problem deleting your program.')
                })
            })
        }
        onMounted(() => {
            const id = document.getElementById("drawflow");
            editor.value = new DrawFlow(id, Vue, internalInstance.appContext.app._context);
            editor.value.start();
            editor.value.registerNode("numberNode", numberNode, {}, {});
            editor.value.registerNode("operationNode", operationNode, {}, {});
            editor.value.registerNode("assignNode", assignNode, {}, {});
            editor.value.registerNode("conditionalNode", conditionalNode, {}, {});
            editor.value.registerNode("useVariableNode", useVariable, {}, {});
            editor.value.registerNode("printNode", printNode, {}, {});
            editor.value.registerNode("loopNode", loopNode, {}, {});


            editor.value.on("connectionCreated", function (info) {
                const nodeInfoOutput = editor.value.getNodeFromId(info.output_id);
                const nodeInfoInput = editor.value.getNodeFromId(info.input_id);
                if (nodeInfoOutput.outputs[info.output_class].connections.length > 1) {
                    const removeConnectionInfo = nodeInfoOutput.outputs[info.output_class].connections[0];
                    editor.value.removeSingleConnection(info.output_id, removeConnectionInfo.node, info.output_class, removeConnectionInfo.output);
                }
                else if (nodeInfoInput.inputs[info.input_class].connections.length > 1) {
                    const removeConnectionInfo = nodeInfoInput.inputs[info.input_class].connections[0];
                    editor.value.removeSingleConnection(removeConnectionInfo.node, info.input_id, removeConnectionInfo.input, info.input_class);
                }
            });


            editor.value.on("moduleChanged", name => {
                currentModule.value = name;
            });


            fetch("http://localhost:9000/diagrams")
                .then(response => response.json())
                .then(query => {
                const diagrams = query.find_diagrams;
                listDiagrams.value = diagrams;
            });
        });


        return {
            listNodes,
            drag,
            drop,
            allowDrop,
            returnHomeModule,
            exportNodes,
            savedDiagramsDrawer,
            codeString,
            codeDrawer,
            currentModule,
            saveDiagram,
            listDiagrams,
            savedDiagramsDrawer,
            programList,
            handleLoadDiagram,
            currentDiagramOpen,
            handleNewDiagram,
            handleDeleteDiagram,
            editor
        };
    },
    components: {
        programList,
        codeExecuter
    }
}
</script>

<style>
  
    h1,h3{
        text-align:center;
    }
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
        min-height:75vh;
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

    .drawer-diagrams{
        overflow-y: auto;
    }
</style>
