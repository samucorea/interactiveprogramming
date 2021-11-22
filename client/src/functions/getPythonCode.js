import convertToCode from "./convertToCodeFunctions";

function extractCodeFromConditionalNode(df, element, prefix) {
  let mainBlockCode = getPythonCode(
    df,
    `conditional-main-block-${element.id}`,
    prefix + "    "
  );

  let elseBlockCode = getPythonCode(
    df,
    `conditional-else-block-${element.id}`,
    prefix + "    "
  );

  if (mainBlockCode === "") {
    mainBlockCode = prefix + "    pass\n";
  }

  if (elseBlockCode !== "") {
    elseBlockCode = prefix + "else:\n" + elseBlockCode;
  }

  return prefix + element.data.pythoncode + mainBlockCode + elseBlockCode;
}

function extractCodeFromLoopNode(df, element, prefix) {
  const loopBlock = getPythonCode(df, `loop-${element.id}`, prefix + "    ");

  return prefix + element.data.pythoncode + loopBlock;
}

export default function getPythonCode(df, moduleSelected, prefix = "") {
  let code = "";
  const modules = df.drawflow.drawflow;
  const nodes = modules[moduleSelected].data;

  if (nodes.length === 0) {
    return code;
  }
  const nodesarr = [];
  Object.keys(nodes).forEach((id) => {
    nodesarr.push(nodes[id]);
  });

  const orderedNodes = nodesarr.sort((a, b) => {
    return a.pos_x > b.pos_x;
  });

  orderedNodes.forEach((node) => {
    convertToCode(node.name, node, df);
  });

  const filteredNodes = orderedNodes.filter((node) => {
    return (
      node.name === "OperationNode" ||
      node.name === "AssignNode" ||
      node.name === "ConditionalNode" ||
      node.name === "LoopNode" ||
      node.name === "PrintNode"
    );
  });

  for (let i = filteredNodes.length - 1; i >= 0; i--) {
    if (filteredNodes.length === 0) {
      break;
    }
    const node = filteredNodes.pop();
    let newCode = "";
    removeConnectedNodes(filteredNodes, node);
    switch (node.name) {
      case "ConditionalNode":
        newCode = extractCodeFromConditionalNode(df, node, prefix);
        break;
      case "LoopNode":
        newCode = extractCodeFromLoopNode(df, node, prefix);
        break;
      default:
        newCode = prefix + node.data.pythoncode;
        break;
    }

    code = newCode + code;
  }
  return code;
}

function removeConnectedNodes(nodes, nodeSelected) {
  if (nodes.length === 0) {
    return;
  }
  const inputs = nodeSelected.inputs;
  Object.keys(inputs).forEach((input) => {
    const connectedNode = nodes.find(
      (node) => node.id === parseInt(inputs[input].connections[0].node)
    );
    if (connectedNode !== undefined) {
      removeConnectedNodes(nodes, connectedNode);
      nodes.splice(nodes.indexOf(connectedNode), 1);
    }
  });
}
