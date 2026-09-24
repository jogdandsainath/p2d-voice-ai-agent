import { Workflow, WorkflowNode, ValidationError } from '@p2d/shared';

export class WorkflowCompiler {
  static validate(workflow: Workflow): void {
    if (!workflow.nodes || workflow.nodes.length === 0) {
      throw new ValidationError('Workflow must contain at least one Trigger node');
    }

    const triggerNodes = workflow.nodes.filter(n => n.type === 'Trigger');
    if (triggerNodes.length === 0) {
      throw new ValidationError('Workflow requires a Trigger node');
    }

    // Verify edge references
    const nodeIds = new Set(workflow.nodes.map(n => n.id));
    for (const edge of workflow.edges) {
      if (!nodeIds.has(edge.source)) {
        throw new ValidationError(`Edge references unknown source node: ${edge.source}`);
      }
      if (!nodeIds.has(edge.target)) {
        throw new ValidationError(`Edge references unknown target node: ${edge.target}`);
      }
    }
  }

  static getTriggerNode(workflow: Workflow): WorkflowNode {
    this.validate(workflow);
    return workflow.nodes.find(n => n.type === 'Trigger')!;
  }

  static getNextNodes(workflow: Workflow, currentNodeId: string, conditionResult?: boolean): WorkflowNode[] {
    const outgoingEdges = workflow.edges.filter(e => e.source === currentNodeId);
    const targetNodeIds: string[] = [];

    for (const edge of outgoingEdges) {
      if (edge.conditionValue !== undefined) {
        const expectedBool = String(edge.conditionValue).toLowerCase() === 'true';
        if (conditionResult === expectedBool) {
          targetNodeIds.push(edge.target);
        }
      } else {
        targetNodeIds.push(edge.target);
      }
    }

    return workflow.nodes.filter(n => targetNodeIds.includes(n.id));
  }
}
