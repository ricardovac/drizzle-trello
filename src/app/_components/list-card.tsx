import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import cx from 'clsx';
import classes from '~/styles/dbdlist.module.css';
import { type Card } from '~/utils/types';

interface ListCardProps {
  card: Card;
}

export default function ListCard({ card }: ListCardProps) {
  const [state, handlers] = useListState(card);
  const items = state.map((item, index) => (
    <Draggable key={item.id} index={index} draggableId={item.id ?? ''}>
      {(provided, snapshot) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const itemClasses = cx(classes.item, { [classes.itemDragging]: snapshot.isDragging });
        return (
          <div
            className={itemClasses}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Text className={classes.symbol}>{item.title}</Text>
          </div>
        );
      }}
    </Draggable>
  ));

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index ?? 0 })
      }
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
