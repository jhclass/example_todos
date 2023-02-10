import { FormEvent, useState, useEffect } from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import {DragDropContext,  DropResult} from 'react-beautiful-dnd';
import {toDoState} from './atoms'
import {atom,useRecoilState } from 'recoil';

import Board from './Components/Board'
import {useForm} from 'react-hook-form';

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@500&display=swap');
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
body {
  
  
  font-family: 'Noto Sans KR', sans-serif;
}
a {text-decoration:none;}
*{box-sizing:border-box;}
`;

const Wrapper = styled.div`
display:flex;
max-width:680px;
width:100%;
margin:0 auto;
justify-content: center;
align-items:center;
height:100vh;

`;

const Boards = styled.div`
display:grid;
width:100%;
gap:10px;
grid-template-columns: repeat(3,1fr);
`;

interface IAddForm {
  addBoard:string;

 }
const AddBoards = atom({
  key:"addBoard",
  default:Array(0)
});
function App() {
  const {register,handleSubmit,setValue} = useForm<IAddForm>();
  const [toDos,setTodos] = useRecoilState(toDoState);
  const [addB,setAddB] = useRecoilState(AddBoards);
  const onDragEnd = (info:DropResult)=>{

//  const oldIndex:any = toDos.splice(source.index,1);
  //toDos.splice(oldIndex,0,destination.index);

 const {destination,draggableId,source} = info;
  if(!destination) return; // 이 한줄이 없으면 아래 빨간줄 쫙쫙!
  if(destination?.droppableId === source.droppableId) {
    // 같은 보드에서 움직였다면.
    setTodos((oldToDos)=>{

      const boardCopy = [...oldToDos[source.droppableId]];
      const taskObj = boardCopy[source.index];
      boardCopy.splice(source.index,1);
      boardCopy.splice(destination?.index,0,taskObj);
      console.log('a',taskObj);
      return {
        ...oldToDos,
        [source.droppableId]:boardCopy
      };
    });
  }
  if(destination?.droppableId !== source.droppableId){
    //다른보드로 이동
    //setTodos((allBoards)=>{console.log('aa',allBoards);return allBoards}) allBoards 내용확인
    setTodos((allBoards)=>{
      const sourceBoard = [...allBoards[source.droppableId]];
      const taskObj = sourceBoard[source.index];
      const destinationBoard = [...allBoards[destination.droppableId]];
      sourceBoard.splice(source.index,1); //현재위치에서 지우고
      destinationBoard.splice(destination?.index,0,taskObj); //새로운 위치로 넣는다.
      return {
        ...allBoards,
        [source.droppableId]:sourceBoard,
        [destination?.droppableId]:destinationBoard
      }
    });
  }
   console.log('finished',info);
 };
  const addV = async({addBoard}:IAddForm)=>{
    console.log(addBoard);
    const realData = addBoard;
    console.log(realData);
    setAddB(name=>[...name,realData]);
    setTodos((allBoards)=>{
      return {
        ...allBoards,
        [realData]:[],
              
      }//
    });
    
    setValue("addBoard","");
  }
  useEffect(()=>{
    window.sessionStorage.setItem('names',JSON.stringify(addB))
    window.sessionStorage.setItem('boards',JSON.stringify(toDos))
    console.log('aa',window.sessionStorage.getItem('names'));
    console.log('aa',window.sessionStorage.getItem('boards'));
  },[addB,toDos]);
 
  //console.log('aaaa',addB);
  return (
      <div>
      <form onSubmit={handleSubmit(addV)}>
        <input {...register("addBoard",{required:true})} type="text" placeholder='보드추가'/>
      </form>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {Object.keys(toDos).map(boardId=><Board boardId={boardId} key={boardId} toDos={toDos[boardId]}/>)}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </div>
    
  );

}

export default App;
