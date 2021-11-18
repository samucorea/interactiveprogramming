<template>
  <div ref="root">
    <div>Node {{ nodeId }}</div>
    <div>Operation node</div>
    <div class="selectorOp">
      <el-select
        @change="handleChange"
        df-binaryop
        size="small"
        v-model="binaryOp"
      >
        <el-option value="+">Sum</el-option>
        <el-option value="-">Substract</el-option>
        <el-option value="*">Multiply</el-option>
        <el-option value="/">Divide</el-option>
      </el-select>
    </div>
    <span>{{ result }}</span>
  </div>
</template>

<script>
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
} from "@vue/runtime-core";

export default {
  setup() {
    const root = ref(null);
    const nodeId = ref(0);
    const binaryOp = ref("+");
    const nodeData = ref({});

    let result = ref(0);
    let df = getCurrentInstance().appContext.config.globalProperties.$df.value;

    onMounted(async () => {
      await nextTick();

      nodeId.value = root.value.parentElement.parentElement.id.slice(5);
      nodeData.value = df.getNodeFromId(nodeId.value);

      result.value = nodeData.value.data.result;
      binaryOp.value = nodeData.value.data.binaryop;
    });

    function handleChange() {
      nodeData.value.data.binaryop = binaryOp.value;
      df.updateNodeDataFromId(nodeId.value, nodeData.value.data);
    }

    return {
      result,
      root,
      binaryOp,
      nodeId,
      handleChange,
    };
  },
};
</script>

<style scoped>
.selectorOp {
  margin-bottom: 10px;
}
</style>
