import { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import NodeCard from './NodeCard';

const NodeComponent = memo((props: NodeProps) => {
  return <NodeCard nodeId={props.id}>AppNode</NodeCard>;
});

export default NodeComponent;
NodeComponent.displayName = 'NodeComponent';

