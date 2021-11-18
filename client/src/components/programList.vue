<template>
   <ul 
    class="program-list">
        <li class="item"
        v-for="diagram in listDiagrams"
        :key="diagram.uid"                       
        >
        <div>{{diagram.name}}</div>
        <div><el-button @click="handleClickLoad(diagram.uid)" type="primary">Load</el-button></div>
        </li>
    </ul>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    props: {
        listDiagrams: {
            type: Array
        }
    },
    setup(props, {emit}){
        
        return{
            handleClickLoad
        }
        function handleClickLoad(uid)
        {
            emit('on-load-diagram',uid)
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