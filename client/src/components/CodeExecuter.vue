<template>
  <div class="code-section">
    <code>
      {{ code }}
    </code>
    <div>
      <el-button @click="executeCode" type="primary">Execute code</el-button>
    </div>
    <div v-loading="loadingCode">
      <code>
        <h4>Output:</h4>
        <div>{{ codeResponse ? codeResponse : "(empty)" }}</div>
      </code>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  props: {
    code: {
      type: String,
    },
  },

  setup(props) {
    const loadingCode = ref(false);
    const codeResponse = ref("");

    function executeCode() {
      loadingCode.value = true;

      fetch("http://localhost:9000/diagrams/execute", {
        method: "POST",
        body: props.code,
      })
        .then((response) => response.text())
        .then((text) => {
          if (text.startsWith("Traceback")) {
            codeResponse.value =
              "Oops! Something went wrong with your code. Check for use of variables before declaration";
          } else {
            codeResponse.value = text;
          }
          loadingCode.value = false;
        });
    }

    return {
      loadingCode,
      codeResponse,
      executeCode,
    };
  },
});
</script>

<style>
.code-section {
  text-align: justify;
  white-space: pre-wrap;
  font-size: 16px;
}
</style>
