<template>
   <ul 
    class="program-list">
        <li class="item"
        v-for="diagram in listDiagrams"
        :key="diagram.uid"
         @mouseenter="shown = diagram.uid" 
         @mouseleave="shown = diagram.uid"                     
        >
        <div>{{diagram.name}}</div>
        <div>
            <transition name="fade">
                <div>
                    <el-button v-if="shown === diagram.uid" @click="handleClickLoad(diagram.uid)" type="primary">Load</el-button>
                <el-button v-if="shown === diagram.uid" @click="handleClickDelete(diagram)" type="danger">Delete</el-button>
                </div>
            </transition>

        
        </div>
        </li>
    </ul>
</template>

<script>
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
    props: {
        listDiagrams: {
            type: Array
        }
    },
    setup(props, {emit}){
        
        const shown = ref('')
       
        function handleClickLoad(uid)
        {
            emit('on-load-diagram',uid)
        }

        function handleClickDelete(diagram)
        {
            emit('on-delete-diagram',diagram)
        }

         return{
            handleClickLoad,
            handleClickDelete,
            shown
        }
    }
    
    
})
</script>

<style scoped>


    .item{
        display:flex;
        align-items: center;
        justify-content: space-between;
        padding: 1em 0;
      
    }
</style>