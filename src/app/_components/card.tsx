import {type FC} from 'react';
import {type SingleCard} from '~/trpc/shared';
import {Draggable, type DraggableStateSnapshot, type DraggableStyle} from '@hello-pangea/dnd';
import cx from 'clsx';
import classes from '~/styles/dbdlist.module.css';
import {Text} from '@mantine/core';

interface CardProps {
  card: SingleCard;
  index: number;
}

const Card: FC<CardProps> = ({card, index}) => {
  return (
    <Draggable draggableId={card.id ?? ''} index={index}>
      {(provided, snapshot) => {
        const itemClasses = cx(classes.item, {
          [classes.itemDragging ?? '']: snapshot.isDragging,
        });
        return (
          <div
            className={itemClasses}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={getStyle(provided.draggableProps.style ?? {}, snapshot)}
          >
            <Text className={classes.symbol}>{card.title}</Text>
          </div>
        );
      }}
    </Draggable>
  );
};

function getStyle(style: DraggableStyle, snapshot: DraggableStateSnapshot) {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    transitionDuration: `0.001s`,
  };
}

export default Card;
