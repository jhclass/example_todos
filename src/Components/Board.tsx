import React,{useRef} from 'react';
import {useForm} from 'react-hook-form';
import { Droppable } from "react-beautiful-dnd"; 
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import {ITodo, toDoState} from "../atoms"
import { useSetRecoilState } from 'recoil';

const Wrapper = styled.div`
 background-color:${(props)=>props.theme.boardColor};
 padding:30px 10px 10px 10px;
 border-radius:5px;
 min-height:200px;
 display:flex;
 flex-direction:column;
 `;    
interface IBoardProps {
    toDos:ITodo[],
    boardId:string
}

const Title = styled.h2`
text-align:Center;
`;

interface IAreaProps {
    isDraggingFromThis:boolean,
    isDraggingOver: boolean,
}

//styled css를 써야 하는이유 바로 css에서 props를 사용할 수 있는 magic
const Area = styled.div<IAreaProps>`
background-color:${props=> props.isDraggingOver?"pink":props.isDraggingFromThis?"red":"blue"};
flex-grow: 1;
`;

interface IForm {
    toDo:string;
}

const Form = styled.form`
width:100%;
padding:20px;
`;

function Board({toDos,boardId}:IBoardProps){
    const setToDos = useSetRecoilState(toDoState);
    const inputRef = useRef<HTMLInputElement>(null);
    const {register,setValue,handleSubmit} = useForm<IForm>();
    const onValid = ({toDo}:IForm)=>{
        const newToDo = {
            id:Date.now(),
            text:toDo

        };
            console.log(toDo);
            setToDos(allBoards=>{
                return {
                  ...allBoards,
                  [boardId]:[...allBoards[boardId],newToDo],
                        
                }
            });
            setValue("toDo","");
    }
    
    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <Form onSubmit={handleSubmit(onValid)}>
                <input {...register("toDo",{required:true})} type="text" placeholder={`Add task on ${boardId}`}/>
            </Form>
       
            <Droppable droppableId={boardId}>
                {(magic, snapshot)=>
                <Area 
                isDraggingOver={snapshot.isDraggingOver} 
                isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                ref={magic.innerRef} {...magic.droppableProps}>{/**draggableId는 고유해야한다. draggableId와 key의 값은 동일해야한다 */}
                    {toDos.map((toDo,index)=>
                    <DraggableCard key={toDo.id} toDoId={toDo.id} index={index} toDoText={toDo.text}/>
                    )}
                
                    {magic.placeholder} {/*위치가 중요 Droppable과 Draggable의 사이! */}
                </Area>
                }
           
            </Droppable> 
        </Wrapper>
    );
}

export default Board;

