import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import styled from 'styled-components';

const Card = styled.div<{isDragging:boolean}>`
background-color:${(props)=>props.isDragging?"tomato":props.theme.cardColor};
padding:10px 10px;
border-radius:5px;
margin-bottom:5px;
box-shadow:${props=>props.isDragging?"0px 2px 5px rgba(0,0,0,0.3)":"none"}
`;


interface IDragabbleCardProps {
    toDoId:number,
    toDoText:string,
    index:number,
    
 
}
function DraggableCard({ toDoId, toDoText, index}:IDragabbleCardProps){
    console.log(toDoId,index);
    return(
        <Draggable draggableId={toDoId+""} index={index}>{(magic,snapshot)=>
            (
            <Card 
            isDragging={snapshot.isDragging}
            ref={magic.innerRef}
            {...magic.draggableProps}
            {...magic.dragHandleProps}
            >
            
            {toDoText}</Card>
            )}
        </Draggable>
    );
}

export default React.memo(DraggableCard);