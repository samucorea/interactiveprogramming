import convertToCode from "./convertToCodeFunctions";

export default function getPythonCode(
  modules,
  moduleSelected,
  prefix = "",
  df
) {
  let code = "";
  const nodes = modules[moduleSelected].data;

  if (nodes.length === 0) {
    return code;
  }
  const nodesarr = [];
  Object.keys(nodes).forEach((id) => {
    convertToCode(nodes[id].name, nodes[id], df);

    nodesarr.push(nodes[id]);
  });

  const filteredNodes = nodesarr.filter((node) => {
    return (
      node.name === "OperationNode" ||
      node.name === "AssignNode" ||
      node.name === "ConditionalNode" ||
      node.name === "LoopNode" ||
      node.name === "PrintNode"
    );
  });

  const orderedNodes = filteredNodes.sort((a, b) => {
    return a.pos_x > b.pos_x;
  });

  for (let i = orderedNodes.length - 1; i >= 0; i--) {
    if (orderedNodes.length === 0) {
      break;
    }
    const element = orderedNodes.pop();

    switch (element.name) {
      case "AssignNode":
        removeConnectedNodes(orderedNodes, element);

        code = prefix + element.data.pythoncode + code;
        break;
      case "ConditionalNode":
        let mainBlockCode = getPythonCode(
          modules,
          `conditional-main-block-${element.id}`,
          prefix + "    ",
          df
        );

        let elseBlockCode = getPythonCode(
          modules,
          `conditional-else-block-${element.id}`,
          prefix + "    ",
          df
        );

        if (mainBlockCode === "") {
          mainBlockCode = prefix + "    pass\n";
        }

        if (elseBlockCode !== "") {
          elseBlockCode = prefix + "else:\n" + elseBlockCode;
        }

        code = element.data.pythoncode + mainBlockCode + elseBlockCode + code;
        break;
      case "OperationNode":
        removeConnectedNodes(orderedNodes, element);
        code = prefix + element.data.pythoncode + "\n" + code;
        break;
      case "LoopNode":
        const loopBlock = getPythonCode(
          modules,
          `loop-${element.id}`,
          prefix + "    ",
          df
        );

        code = prefix + element.data.pythoncode + loopBlock + code;
        break;
      case "PrintNode":
        removeConnectedNodes(orderedNodes, element);
        code = prefix + element.data.pythoncode + code;
        break;
    }
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
