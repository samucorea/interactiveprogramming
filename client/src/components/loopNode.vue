<template>
  <div ref="root">
    <div>Node {{ nodeId }}</div>
    <div>From: <input df-from v-model="from" type="text" /></div>
    <div>To: <input df-to v-model="to" type="text" /></div>
    <button @click="handleClick">Enter loop code block</button>
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
    const from = ref(0);
    const to = ref(0);
    let blockName = "";
    const df =
      getCurrentInstance().appContext.app._context.config.globalProperties.$df
        .value;

    onMounted(async () => {
      await nextTick();

      nodeId.value = root.value.parentElement.parentElement.id.slice(5);
      nodeData.value = df.getNodeFromId(nodeId.value);
      blockName = `loop-${nodeId.value}`;

      from.value = nodeData.value.data.from;
      to.value = nodeData.value.data.to;

      if (df.drawflow.drawflow[blockName] === undefined) {
        df.addModule(blockName);
      }
    });
    function handleClick() {
      df.changeModule(blockName);
    }

    return {
      root,
      nodeId,
      from,
      to,
      handleClick,
    };
  },
});
</script>
