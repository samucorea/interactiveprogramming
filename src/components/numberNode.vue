<template>
    <div ref="el">
      <p>Number</p>
      <input @keydown="handleClick" v-model="number" />
    </div>
</template>


<script>
    import { ref } from "@vue/reactivity"



    export default {
        name: 'numberNode',
        setup() {
            const number = ref(0)
            
            const handleClick = () =>{
                console.log('hola')
            }
           


            return {
                number,
                handleClick
            }
           
        }
    }
</script>

<style scoped>

</style>