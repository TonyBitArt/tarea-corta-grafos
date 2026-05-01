import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const CircleNode = memo(({ data, isConnectable }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fillColor = data?.fillColor ?? '#fff';
  const textColor = data?.textColor ?? '#111827';

  const handleStyle = {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '12px',
    height: '12px',
    minWidth: '12px',
    minHeight: '12px',
    opacity: isHovered ? 1 : 0,
    background: isHovered ? '#3b82f6' : 'transparent',
    border: isHovered ? '2px solid #1a192b' : 'none',
    transition: 'opacity 0.2s ease, background 0.2s ease',
    pointerEvents: isHovered ? 'auto' : 'none',
  };

  return (
    <div
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: fillColor,
        border: '2px solid #1a192b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        position: 'relative',
        color: textColor,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={handleStyle}
        isConnectable={isConnectable !== false}
      />
      
      <div>{data.label}</div>
      
      <Handle
        type="source"
        position={Position.Top}
        style={handleStyle}
        isConnectable={isConnectable !== false}
      />
    </div>
  );
});

export default CircleNode;
