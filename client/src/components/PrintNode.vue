<template>
  <div ref="root">
    <div>Node {{ nodeId }}</div>
    <div>Print</div>
  </div>
</template>

<script>
import {
  ref,
  defineComponent,
  onMounted,
  nextTick,
  getCurrentInstance,
} from "vue";

export default defineComponent({
  setup() {
    const root = ref(null);
    const nodeId = ref(0);
    const nodeData = ref({});
    const df =
      getCurrentInstance().appContext.app._context.config.globalProperties.$df
        .value;
    onMounted(async () => {
      await nextTick();
      nodeId.value = root.value.parentElement.parentElement.id.slice(5);
      nodeData.value = df.getNodeFromId(nodeId.value);
    });

    return {
      root,
      nodeId,
    };
  },
});
</script>
