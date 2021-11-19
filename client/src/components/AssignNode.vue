<template>
  <div ref="root">
    <div>Node {{ nodeId }}</div>
    <div style="margin-bottom: 10px">Assign</div>
    <div style="margin-bottom: 10px">
      <el-input
        @change="handleChange"
        df-name
        v-model="assignName"
        placeholder="variable name..."
        type="text"
      />
    </div>
    <div>{{ assignValue }}</div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { getCurrentInstance, nextTick, onMounted } from "@vue/runtime-core";

export default {
  setup() {
    const root = ref(null);
    const nodeId = ref(0);
    const nodeData = ref({});
    const assignName = ref("");
    const assignValue = ref(0);
    const internalInstance = getCurrentInstance();

    let df = internalInstance.appContext.config.globalProperties.$df.value;

    onMounted(async () => {
      await nextTick();
      nodeId.value = root.value.parentElement.parentElement.id.slice(5);
      nodeData.value = df.getNodeFromId(nodeId.value);

      assignName.value = nodeData.value.data.name;
      assignValue.value = nodeData.value.data.value;
    });
    function handleChange() {
      nodeData.value.data.name = assignName.value;
      nodeData.value.data.value = assignValue.value;

      df.updateNodeDataFromId(nodeId.value, nodeData.value.data);
    }
    return {
      assignName,
      assignValue,
      root,
      nodeId,
      handleChange,
    };
  },
};
</script>
