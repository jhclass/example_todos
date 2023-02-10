import {atom,selector} from 'recoil';



export interface ITodo {
    id:number,
    text:string,
}

interface IToDoState{ // 이렇게 작성하지 않으면 타입스크립트는 todoState가 주어진것만 허용할것이다. 나중에 사용자들이 글을 입력할 수도 있기에 type의 범위를 확장할 필요가 있다.
   [key:string]:ITodo[], 
}

const sessionStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = sessionStorage.getItem(key);
    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue: any, _: any, isReset: any) => {
      const confirm = newValue.length === 0;
      confirm
        ? sessionStorage.removeItem(key)
        : sessionStorage.setItem(key, JSON.stringify(newValue));
    });
  };

//console.log('aa',sessionStorage.getItem('names'));
//console.log('aa',sessionStorage.getItem('boards'));
export const toDoState = atom<IToDoState>({
    key:"toDo",
    default: {
        "To Do":[],
        doing:[],
        done:[],
    },
    effects: [sessionStorageEffect("toDo")],
    
});
