## <To-Do 보드>

1. 보드를 생성할 수 있어야 합니다.
2. 보드를 수정할 수 있어야 합니다.
3. 보드를 삭제할 수 있어야 합니다.
4. 보드의 순서를 변경할 수 있어야 합니다.

## <To-Do 할일>

1. 할 일은, 하나의 텍스트 박스를 가집니다.
2. 보드 안에서, 할 일을 생성할 수 있어야 합니다.
3. 보드 안에서, 할 일을 삭제할 수 있어야 합니다.
4. 보드 안에서, 할 일의 내용을 수정할 수 있어야 합니다.
5. 할 일의 위치를 변경할 수 있어야 한다. (보드간의 할 일 위치, 보드 내에서의 할 일 위치)

# 파일 구조

```
├─ README.md
├─ app
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components
│  ├─ Board
│  │  ├─ BoardContainer.tsx
│  │  ├─ BoardList.tsx
│  │  ├─ CreateBoardForm.tsx
│  │  └─ SortableBoardItem.tsx
│  ├─ SaveButton.tsx
│  └─ Task
│     ├─ AddTaskForm.tsx
│     ├─ TaskItem.tsx
│     └─ TaskList.tsx
├─ package-lock.json
├─ package.json
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ tailwind.config.ts
├─ tsconfig.json
├─ types
│  └─ index.ts
└─ utils
   └─ storage.ts
```
