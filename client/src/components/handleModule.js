import shouldExecuteInConditionalBlock from './shouldExecuteInConditionalBlock'
export default function handleModule(moduleName, df) {
    const moduleNameParts = moduleName.split('-')
    if (moduleName !== 'Home') {
        const blockType = moduleNameParts[0]

        if (blockType === 'conditional') {
            const conditionalFlow = moduleNameParts[1]
            const conditionalNode = df.getNodeFromId(moduleNameParts[3])

            return shouldExecuteInConditionalBlock(conditionalFlow, conditionalNode)

        }


    }
    else {
        return true;
    }
}