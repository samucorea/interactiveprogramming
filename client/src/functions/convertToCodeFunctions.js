import showError from "./showError";
import { readonly } from "vue";

export default function convertToCode(nodeName, node, df) {
  switch (nodeName) {
    case "NumberNode":
      numberNodeToCode(node, df);
      break;

    case "OperationNode":
      operationNodeToCode(node, df);
      break;

    case "AssignNode":
      assignNodeToCode(node, df);
      break;

    case "ConditionalNode":
      conditionalNodeToCode(node, df);
      break;

    case "LoopNode":
      loopNodeToCode(node, df);
      break;

    case "PrintNode":
      printNodeToCode(node, df);
  }
}

function numberNodeToCode(node, df) {
  if (isNaN(node.data.result) || node.data.result === null) {
    node.data.result = 0;
    df.updateNodeDataFromId(node.id, node.data);
    showError(`Please, specify a number at the number Node ${node.id}`);
  } else {
    return node.data.result.toString();
  }
}

function operationNodeToCode(node, df) {
  let result = 0;
  const data = node.data;
  const numbersInOperation = [];
  const expressionsInOperation = [];
  const inputs = node.inputs;

  try {
    Object.keys(inputs).forEach((key) => {
      const input = inputs[key];
      const connection = input.connections[0];

      const currentNode = df.getNodeFromId(connection.node);

      numbersInOperation.push(currentNode.data.result);
      expressionsInOperation.push(currentNode.data.pythoncode);
    });
  } catch {
    showError(
      `All operation node inputs should be connected at Node ${node.id}`
    );
  }

  if (!data.binaryop) {
    showError(`Please, specify a binary operator in operation node ${node.id}`);
  }
  switch (data.binaryop) {
    case "+":
      result = numbersInOperation[0] + numbersInOperation[1];
      break;
    case "-":
      result = numbersInOperation[0] - numbersInOperation[1];
      break;
    case "*":
      result = numbersInOperation[0] * numbersInOperation[1];
      break;
    case "/":
      result = numbersInOperation[0] / numbersInOperation[1];
      break;
  }

  data.result = result;
  data.pythoncode = `${expressionsInOperation[0]} ${data.binaryop} ${expressionsInOperation[1]}`;
  df.updateNodeDataFromId(node.id, data);
}

function assignNodeToCode(node, df) {
  const data = node.data;
  if (!isNaN(data.name) || data.name === undefined) {
    showError(
      `A variable name can't be a number. Please specify a set of characters, not only numbers at Node ${node.id}`
    );
    return;
  }

  try {
    const connectedNode = df.getNodeFromId(
      node.inputs.input_1.connections[0].node
    );

    data.value = connectedNode.data.result;
    data.pythoncode = `${data.name} = ${connectedNode.data.pythoncode}\n`;

    df.updateNodeDataFromId(node.id, data);
  } catch {
    showError(
      `Please, connect the assignNode input to another node at Node ${node.id}`
    );
  }
}

function conditionalNodeToCode(node, df) {
  const logicDict = readonly({
    "Greater than": ">",
    "Lesser than": "<",
    "Equal than": "==",
  });
  const data = node.data;
  const comparisonValues = [];
  const comparisonItemExpressions = [];

  try {
    Object.keys(node.inputs).forEach((key) => {
      const nodeConnectedId = node.inputs[key].connections[0].node;
      const nodeConnected = df.getNodeFromId(nodeConnectedId);

      comparisonItemExpressions.push(nodeConnected.data.pythoncode);
      comparisonValues.push(nodeConnected.data.result);
    });
  } catch {
    showError(
      `All conditional node inputs should be connected at Node ${node.id}`
    );
    return;
  }

  if (data.logicOperator === undefined) {
    showError(
      `Logic operator should be specified in conditional node  at Node ${node.id}`
    );
    return;
  }

  data.pythoncode = `if ${comparisonItemExpressions[0]} ${
    logicDict[data.logicOperator]
  } ${comparisonItemExpressions[1]}:\n`;

  df.updateNodeDataFromId(node.id, data);
}

function loopNodeToCode(node, df) {
  const data = node.data;

  if (isNaN(parseInt(data.to))) {
    data.to = 0;

    showError(
      `Please, specify to what number the loop node should execute at input at Node ${node.id}`
    );
  }

  if (isNaN(parseInt(data.from))) {
    data.from = 0;
  }

  data.pythoncode = `for i in range(${data.from},${data.to}):\n`;

  df.updateNodeDataFromId(node.id, data);
}

function printNodeToCode(node, df) {
  const data = node.data;
  const connection = node.inputs.input_1.connections[0];
  if (connection) {
    const connectedNode = df.getNodeFromId(connection.node);

    data.pythoncode = `print(${connectedNode.data.pythoncode})\n`;
  } else {
    showError(`Print node should have input connected at Node ${nodeId.value}`);
    data.pythoncode = `print()\n`;
  }
  df.updateNodeDataFromId(node.id, data);
}

function useVariableNodeToCode(node, df) {
  const data = node.data;
  if (data.name === undefined) {
    showError(`Please, specify the variable to use at Node ${node.id}`);
  } else if (!isNaN(data.name)) {
    showError(
      `A variable cannot be a number. Please, specify a set of characters.`
    );
  }

  data.pythoncode = data.name;
  df.updateNodeDataFromId(node.id, data);
}
