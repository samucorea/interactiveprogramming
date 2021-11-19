<template>
  <div ref="root">
    <div>Node {{ nodeId }}</div>
    <div>Variable</div>
    <el-input
      @change="handleChange"
      df-pythoncode
      size="small"
      v-model="variableName"
      type="text"
    />
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  getCurrentInstance,
  nextTick,
} from "vue";

export default defineComponent({
  setup() {
    const root = ref(null);
    const nodeId = ref(0);
    const nodeData = ref({});
    const internalInstance = getCurrentInstance();
    const variableName = ref("");
    const df =
      internalInstance.appContext.app._context.config.globalProperties.$df
        .value;

    onMounted(async () => {
      await nextTick();

      nodeId.value = root.value.parentElement.parentElement.id.slice(5);
      nodeData.value = df.getNodeFromId(nodeId.value);

      variableName.value = nodeData.value.data.name;
    });

    function handleChange() {
      nodeData.value.data.name = variableName.value;

      df.updateNodeDataFromId(nodeId.value, nodeData.value.data);
    }

    return {
      variableName,
      root,
      nodeId,
      handleChange,
    };
  },
});
</script>
