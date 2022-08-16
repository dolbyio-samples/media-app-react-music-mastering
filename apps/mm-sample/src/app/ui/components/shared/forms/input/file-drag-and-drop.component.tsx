import type { FC } from 'react';

import type { DropTargetMonitor } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

export interface FileDragAndDropProps {
  onDrop: (item: { files: any[] }) => void;
  children: React.ReactNode;
}

const FileDragAndDrop: FC<FileDragAndDropProps> = (props) => {
  const { onDrop, children } = props;
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: any[] }) {
        if (onDrop) {
          onDrop(item);
        }
      },
      canDrop(item: any) {
        // console.log('canDrop', item.files, item.items);
        return true;
      },
      hover(item: any) {
        // console.log('hover', item.files, item.items);
      },
      collect: (monitor: DropTargetMonitor) => {
        const item = monitor.getItem() as any;
        if (item) {
          // console.log('collect', item.files, item.items);
        }

        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [props]
  );

  return <div ref={drop}>{children}</div>;
};

export default FileDragAndDrop;
