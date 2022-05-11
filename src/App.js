import "./styles.css";
import React, { useState, useRef } from "react";
import * as PIXI from "pixi.js";
import { Stage, Container, Sprite } from "@inlet/react-pixi";

const BgConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  options: { backgroundColor: 0x4284d2 },
};

const MovingBox = ({ x, y, ...props }) => {
  let index = 1;

  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({
    x: x || window.innerWidth / 2,
    y: y || window.innerHeight / 2,
  });
  const [zIndex, setZIndex] = useState(index);

  function onStart(e) {
    isDragging.current = true;
    offset.current = {
      x: e.data.global.x - position.x,
      y: e.data.global.y - position.y,
    };

    setZIndex(index++);
  }

  function onEnd() {
    isDragging.current = false;
  }

  function onMove(e) {
    if (isDragging.current) {
      setPosition({
        x: e.data.global.x - offset.current.x,
        y: e.data.global.y - offset.current.y,
      });
    }
  }

  return (
    <Container
      {...props}
      position={position}
      zIndex={zIndex}
      interactive={true}
      pointerdown={onStart}
      pointerup={onEnd}
      pointerupoutside={onEnd}
      pointermove={onMove}
    />
  );
};

const App = () => {
  return (
    <>
      <Stage {...BgConfig}>
        <MovingBox onClick={() => alert("!!!")}>
          <Sprite anchor={0.5} x={150} y={150} image="sector_0.png" />

          <Container width={110} height={110}>
            {/* 컨테이너 크기는 눈어림이므로 정확한 크기를 찾기 */}
            <Sprite
              anchor={[0.5, 0.5]}
              position={[295, -610]} // 위치를 여기서 잡아도 잘 출력됨
              width={43} // 내눈
              height={54}
              image="locked.png"
              zIndex={1}
              interactive={true} // 클릭이벤트 받겠다는 뜻
              pointerup={() => alert("TEST")}
              // 마우스 버튼을 눌렀다 "떼는" 순간 발생
              // 여기서 pointerdown 이벤트에 함수 주면 동작자체는 동일한데 포인터가 붙어버리는 문제 발생
              //! 문제점: 컨테이너에는 클릭이벤트가 없으므로 나중에 open된 박스가 있다고 할때 박스 선택 안될것
            />
          </Container>
        </MovingBox>
      </Stage>
    </>
  );
};
export default App;

/*
Stage: canvas 역할인듯 / 인자로 전달받은 width, height, 
Container:  position으로 받은 x, y을 기준으로 상대위치를 설정할 수 있음
*/

/* 
  <Sprite
    image="sector_0.png"
    scale={{ x: 1, y: 1 }} // 배율 > 가로세로 크기 배율
    anchor={0} // 생성시 배치하는 위치에 관여함
    position={{ x: 0, y: 0 }} // 생성시 위치 px단위로 조절
  /> 
*/
