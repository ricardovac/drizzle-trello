import {Droppable} from '@hello-pangea/dnd';
import {type FC} from 'react';
import Card from './card';
import {type Cards} from "~/trpc/shared";

interface ListAreaProps {
  listId: string;
  cards: Cards;
}

const ListArea: FC<ListAreaProps> = ({listId, cards}) => {
  return (
    <Droppable droppableId={listId}>
      {(provided, _) => (
        <div {...provided.droppableProps} ref={provided.innerRef} style={{minHeight: '10px'}}>
          {cards.map((card, i) => (
            <Card card={card} key={card.id} index={i}/>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default ListArea;
