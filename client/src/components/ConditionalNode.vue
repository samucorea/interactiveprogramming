<template>
  <div ref="root">
    <div>Node {{ nodeId }}</div>
    <div>Conditional node</div>
    <div style="selectorLogicOp">
      <el-select @change="handleOptionChange" v-model="logicOperator">
        <el-option value="Greater than">Greater than</el-option>
        <el-option value="Lesser than">Lesser than</el-option>
        <el-option value="Equal than">Equal than</el-option>
      </el-select>
    </div>
    <el-button class="conditional-btn" @click="handleClickMain"
      >Enter main code block</el-button
    >
    <el-button class="conditional-btn" @click="handleClickElse"
      >Enter else code block</el-button
    >
    <div>{{ conditionMet }}</div>
  </div>
</template>

<script>
import {
  defineComponent,
  nextTick,
  onMounted,
  ref,
  getCurrentInstance,
} from "vue";

export default defineComponent({
  setup() {
    const root = ref(null);

    const nodeId = ref(0);
    const nodeData = ref({});
    const conditionMet = ref(null);
    const logicOperator = ref("");

    let df = getCurrentInstance().appContext.config.globalProperties.$df.value;

    onMounted(async () => {
      await nextTick();
      nodeId.value = root.value.parentElement.parentElement.id.slice(5);
      nodeData.value = df.getNodeFromId(nodeId.value);
      logicOperator.value = nodeData.value.data.logicOperator;

      if (
        df.drawflow.drawflow[`conditional-main-block-${nodeId.value}`] ===
        undefined
      ) {
        df.addModule(`conditional-main-block-${nodeId.value}`);
      }
      if (
        df.drawflow.drawflow[`conditional-else-block-${nodeId.value}`] ===
        undefined
      ) {
        df.addModule(`conditional-else-block-${nodeId.value}`);
      }
    });

    function handleClickMain() {
      df.changeModule(`conditional-main-block-${nodeId.value}`);
    }
    function handleClickElse() {
      df.changeModule(`conditional-else-block-${nodeId.value}`);
    }

    function handleOptionChange() {
      nodeData.value.data.logicOperator = logicOperator.value;
      df.updateNodeDataFromId(nodeId.value, nodeData.value.data);
    }

    return {
      root,
      handleClickMain,
      conditionMet,
      logicOperator,
      handleClickElse,
      handleOptionChange,
      nodeId,
    };
  },
});
</script>

<style scoped>
.selectorLogicOp {
  margin-bottom: 10px;
}

.conditional-btn {
  margin-left: 0 !important;
  padding: 1em;
  font-size: 0.8rem;
  width: 100%;
  margin-top: 1em;
}
</style>
