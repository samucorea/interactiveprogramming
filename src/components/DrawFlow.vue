<template>
    <div id="drawflow"></div>
    <button @click="createNumberNode">Create</button>
 
    
</template>


<script>
import{shallowRef,onMounted, h, render, getCurrentInstance} from 'vue'
import numberNode from './numberNode.vue'
import textNode from './textNode.vue'


import DrawFlow from 'drawflow'
//eslint-disable-next-line
import styleDrawflow from "drawflow/dist/drawflow.min.css";

export default {
    name:'drawflow',

    setup()
    {
        const listNodes = [
            {
                item:'numberNode',
                input:1,
                output:1
            },
            {
                item:'textNode',
                input:1,
                output:1
            }
        ]
        const editor = shallowRef({})
        const Vue = { version: 3, h, render };
        const internalInstance = getCurrentInstance();
        
        internalInstance.appContext.app._context.config.globalProperties.$df = editor; //Declaring draw flow editor as a global variable df to use on all components.
        
        function addNodeToDrawFlow(name, pos_x, pos_y) {


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
        onMounted(() => {
            const id = document.getElementById('drawflow')
            editor.value = new DrawFlow(  
                id,
                Vue,
                internalInstance.appContext.app._context)

            editor.value.start()

            editor.value.registerNode("numberNode",numberNode,{},{})
            editor.value.registerNode("textNode",textNode,{},{})

            
            


        })

        return {
            createNumberNode
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
        height:50vh;
        text-align: initial;
    }
</style>
