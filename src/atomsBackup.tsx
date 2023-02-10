import {atom,selector} from 'recoil';



export enum Categories {
    "TO_DO"="TO_DO",
    "DOING"="DOING",
    "DONE"="DONE",
}


export interface IToDo {
    text:string;
    category: Categories;
    id:number;
}

export const categoryState = atom<Categories>({
        key:"category",
        default:Categories.TO_DO,
});


export const toDoState = atom<IToDo[]>({
    key: "toDo",
    default:[],

});
export const toDoSelector = selector({
    key:"toDoSelector",
    get:({get})=>{
        const toDos = get(toDoState)
        const category = get(categoryState);
        if(category === Categories.TO_DO)  return toDos.filter((toDo)=>toDo.category===Categories.TO_DO);
        if(category === Categories.DOING)  return toDos.filter((toDo)=>toDo.category===Categories.DOING);
        if(category === Categories.DONE)  return toDos.filter((toDo)=>toDo.category===Categories.DONE);

      
    }
},);