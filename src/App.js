import "./styles.css";
import React, { useState, useRef, useMemo } from "react";
import * as PIXI from "pixi.js";
import {
  Stage,
  withFilters,
  Container,
  Sprite,
  useTick,
} from "@inlet/react-pixi";

const BgConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  options: { backgroundColor: 0x4284d2 },
};

// const MovingMan = ({ x, y, ...props }) => {
//   let index = 1;

//   const isDragging = useRef(false);
//   const offset = useRef({ x: 0, y: 0 });
//   const [position, setPosition] = useState({ x: x || 0, y: y || 0 });
//   const [alpha, setAlpha] = useState(1);
//   const [zIndex, setZIndex] = useState(index);

//   function onStart(e) {
//     isDragging.current = true;
//     offset.current = {
//       x: e.data.global.x - position.x,
//       y: e.data.global.y - position.y,
//     };

//     // console.log(offset.current);

//     // setAlpha(0.5); //! alpha값이 변경되면 이미지가 흐릿해짐!
//     setZIndex(index++);
//   }

//   function onEnd() {
//     isDragging.current = false;
//     // setAlpha(1);
//   }

//   function onMove(e) {
//     /*
//     x / y축에서 범위 밖으로 나가려고 하면 고정값을 반환시켜야 할듯.

//     e.data.global 을 활용해 데이터를
//     case1. x축 값이 경계값 도달했을 때
//     case2. y축 값이 경계값 도달했을 때
//     case3. 두 축 모두 경계값에 도달했을 때
//     > 응 경우의수면 반대로해야됨 바보야

//     !그런데 이거 실시간으로 연산시키면 부하 엄청 걸리지 않나?
//     !범위 벗어나는지를 확인할 방법을 찾아야 함
//     */
//     if (isDragging.current) {
//       setPosition({
//         x: e.data.global.x - offset.current.x,
//         y: e.data.global.y - offset.current.y,
//       });
//     }
//   }

//   return (
//     <Sprite
//       {...props}
//       alpha={alpha}
//       position={position}
//       image="sector_0.png"
//       width={1720}
//       height={1738}
//       zIndex={zIndex}
//       interactive={true}
//       pointerdown={onStart}
//       pointerup={onEnd}
//       pointerupoutside={onEnd}
//       pointermove={onMove}
//     />
//   );
// };

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
            {/* 컨테이너 크기는 눈어림으로 맞췄으니 코드 파헤쳐서 정확한 크기찾기 */}
            <Sprite
              anchor={[0.5, 0.5]}
              position={[295, -610]} // 컨테이너가 아니라 여기 해도 위치가 제대로 잡히는듯?
              width={43} // 내눈
              height={54}
              image="locked.png"
              zIndex={1} // 클릭하면 이벤트 발생 OK 근데 한번 클릭하면 포인터가 붙어버리 함수로 값 조절하기!
              interactive={true} // 클릭이벤트 받겠다는 뜻
              pointerup={() => alert("TEST")}

              // 마우스 버튼을 눌렀다 "떼는" 순간 발생
              // 여기서 pointerdown 이벤트에 함수 주면 동작자체는 동일한데 포인터가 붙어버리는 문제 발생
            />
          </Container>

          {/* <Sprite
            anchor={0.5}
            position={[185, -610]}
            width={110}
            height={110}
            image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/j42.jpg"
          />
          <Sprite
            anchor={0.5}
            position={[185, -500]} //
            width={110}
            height={110}
            image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/j42.jpg"
          /> */}
        </MovingBox>
      </Stage>
    </>
  );
};
export default App;

/*

Step1: 지도 이미지 띄우기
  - Stripe를 사용하면 EZ O

Step2: 지도 위에 아무 이미지나 띄워
  - Stripe의 순서를 활용해 구현할 수 있음.
  - Container에 담아서 한번에 관리할 수도 있을 듯 O

Step3: 지도를 움직이기
  - 지도 범위가 끝이 있어야 함 (canvas 밖으로 나가면 안됨)
  - 지도 이미지 위의 이미지도 따라 움직여야 함.
  
  > 1차 시도: 예제 복사해서 내 화면에서 똑같이 움직이게 구현 성공.
  > 2차 시도: 지도 이미지를 움직일 수 있음
      문제점: 이동 가능한 최대범위가 안정해져서 지도가 canvas 밖으로 나가서 돌아오지 못할 수 있음;


Step4: 박스의 클릭영역 할당
  - Stripe안의 Stripe는 제대로 인식이 안되던데 어떻게 구현해야 할까;
  - 화면상의 클릭이벤트는 window에서 클릭된 좌표를 받아와서 보여줌
    그말은 뭐다? 같은 위치면 canvas에서 움직이건 말건 똑같은 좌표가 나옴

*/

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

/*
# 내가 만들어야 하는 것
  1. 지도를 클릭으로 움직일 수 있어야 함
  2. 배경을 클릭해도 이동 가능.
  3. 그림 위에 돋보기 대고 보듯이 캔버스 위를 이동하는 방식으로 구현해야 함.
  4. 화면이 확대 가능해야 함.(이건 대체;)

# 뷰 구성이 어떻게 되어야 할까
  - HTML바닥( 100vw * 100vh ) > 창크기(돋보기 역할)
  - 모달, Pastures, Search 등등 기능 컴포넌트들 > position: absolute로 고정배치
  - 지도 외부의 Sprite ? > 일단 지도이미지만으로는 여백이 너무 크기 때문에 말이 안됨.
  - 지도 이미지 sector_01.png ( 1720px * 1738px ) > 이미지크기(도화지 역할)

# 문제: 어떻게 이미지 크기만큼만 이동 가능하게 만들 수 있을까?
  어흑 마이깟
*/

/*

const presaleContract = "";
const Lands = []; // 값이 너무 많아서 일단 삭제

// let socket = io({ transports: ['websocket'] });
// socket.on('sold', function (farmId) {
//     $(`[data-farm-id=${farmId}] .buy-btn`).parent().html(`<a class="sold-btn" target="_blank" onclick="OnClickOccupied(${farmId})">OCCUPIED</a>`)
// });
// socket.on('log', function (data) {
//     console.log(data)
// });

let valid_redeem = "";
let valid_reedeem_info = null;

const isMobile = mobileCheck(); // mobile 여부에 따라 구름 효과 처리

const vw = document.documentElement.clientWidth;
const vh = document.documentElement.clientHeight;

const canvasParent = document.getElementById("map-canv");

const CANVAS_SETTING = {
  width: vw,
  height: vh,
  resizeTo: canvasParent,
  resolution: 1, //window.devicePixelRatio,
  backgroundColor: 0x4284d2,
};

const BACKGROUND_SIZE = { width: 1720, height: 1738 }; // 배경 이미지 크기
const CLICK_ACTION_THRESHOLD = CANVAS_SETTING.width / 80; // 이 부분은 테스트하면서 확인
const SECTOR_SIZE = 56 * 2; // 눈어림 110이었으니 거의 비슷했던걸로...

const UNLOCKED_SECTOR = {
  "3_9": 0,
  "4_9": 0,
  "4_10": 0,
  "5_7": 0,
  "5_8": 0,
  "5_9": 0,
  "5_10": 0,
  "6_7": 0,
  "6_8": 0,
  "6_9": 0,
  "6_10": 0,
  "7_7": 0,
  "7_8": 0,
  "7_9": 0,
  "7_10": 0,
  "8_8": 0,
  "8_9": 0,
  "8_10": 0,
}; // 4th phase (final)

const FIRST_FOCUS_SECTOR = "6_9"; // 모달창 끄면 포커싱 잡히는 값

var items = window.sector_0_data.map((e) => {
  // sector_0_data 의 각 값에 대해 처리하는것
  // Lands.fi >> Lands 데이터는 파일처리가 너무오래걸려서 삭제했었는데 다시 확인해봐야 함
  return {
    id: e[0],
    x: e[1],
    y: e[2],
    sold: false,
    size:
      e[0] <= 1111 + 5000 ? "5X5" : e[0] <= 1111 + 5000 + 3000 ? "6X6" : "7X7",
    sheepLimit: e[0] <= 1111 + 5000 ? 3 : e[0] <= 1111 + 5000 + 3000 ? 4 : 5,
    tokenId: Lands.find((v) => v.id == e[0]).tokenId,
  };
});

const app = new PIXI.Application(CANVAS_SETTING); // PIXI 캔버스 생성 > React에서는 Stage 로 구현
canvasParent.appendChild(app.view); // 따라하려면 useRef로 할 수 있을 것 같다

const viewport = new pixi_viewport.Viewport({
  // 이 부분은 다시 구글링해보기; ReactPixi 문서에 없는데? >> Container 인가?
  screenWidth: vw,
  screenHeight: vh,
  worldWidth: vw,
  worldHeight: vh,
  interaction: app.renderer.plugins.interaction,
});

viewport
  .drag()
  .pinch()
  .wheel()
  // .decelerate()
  .clamp({
    left: -BACKGROUND_SIZE.width,
    right: BACKGROUND_SIZE.width * 2,
    top: -BACKGROUND_SIZE.height,
    bottom: BACKGROUND_SIZE.height * 2,
  })
  .clampZoom({
    minWidth: 120,
    minHeight: 120,
    maxWidth: vw,
    maxHeight: vh,
  });

viewport.on("drag-start", (event) => {
  removePopup();
});
viewport.on("clicked", (event) => {
  let sectorId = "";
  let farmInfo = null;
  let sector = null;
  let spot = null;
  for (let k in sectorDict) {
    let s = sectorDict[k];
    if (s.getBounds().contains(event.screen.x, event.screen.y)) {
      sector = s;
      sectorId = k;
      break;
    }
  }

  if (sectorId != "") {
    let spots = sectorSpotDict[sectorId];
    for (i in spots) {
      let s = spots[i];
      if (s.getBounds().contains(event.screen.x, event.screen.y)) {
        spot = s;
        farmInfo = spot.farmInfo;
        break;
      }
    }
  }

  if (
    !!spot &&
    (spot.parent == app.blinkingItem ||
      (app.blinkingItem != null && app.blinkingItem.parent == spot.parent))
  ) {
    onClickSpot(spot);
  } else if (!!sector) {
    onClickSector(sector);
  }
});

//.decelerate()
// add the viewport to the stage
app.stage.addChild(viewport);

// Attach background
const background = viewport.addChild(PIXI.Sprite.from("img/maps/sector_0.png")); // Sprite로 배경 추가
if (isMobile == false) {
  // 모바일 여부에 따라 >> userAgent 로 구분 가능
  app.cloudsVfx = makeShader(); // 구름 배경 효과 (움직임)
  app.cloudsVfx.scale.set(
    (BACKGROUND_SIZE.width * 3) / app.cloudsVfx.originalWidth,
    (BACKGROUND_SIZE.height * 3) / app.cloudsVfx.originalHeight
  );

  app.cloudsVfx.x = -BACKGROUND_SIZE.width;
  app.cloudsVfx.y = -BACKGROUND_SIZE.height;
}

const uiLayer = new PIXI.Container(); // UI면 다른 버튼들도 PIXI에 엮여있는건가?
app.stage.addChild(uiLayer);

// Attach spots
let buttons = new PIXI.Container();
let spotDict = {};
let sectorSpotDict = {};
let sectorDict = {};
let cnt = 0;

items.forEach((e, i, a) => {
  // 각 데이터, index, array 일듯
  let farmInfo = e;
  let spot_x = farmInfo.x * 5.6 + 71;
  let spot_y = farmInfo.y * 5.6 + 92;
  let sector = makeSector(spot_x, spot_y, buttons); // 각각의 칸 생성해 반환
  if (sector.sectorId in sectorSpotDict === false)
    // 아니 누가 == 를 쓰냐고;
    sectorSpotDict[sector.sectorId] = [];

  let spot = makeSpot(farmInfo, spot_x, spot_y, sector, sector.sectorId); // 칸 내부 작은 사각형 생성
  sector.addChild(spot);
  spotDict[farmInfo.id] = spot;
  sectorSpotDict[sector.sectorId].push(spot);
});

background.addChild(buttons); // 아까 생성했던 Sector 저장된 변수를 배경에 추가

if (app.cloudsVfx) background.addChild(app.cloudsVfx);
// 구름 효과가 존재하면(모바일이면 없음) > 배경에 구름효과도 추가

//! 이 부분은 잘 모르겠음
let elapsed = 0.0; // 굳이 0.0 으로 준거보면 이유가 있을텐데.
app.ticker.add((delta) => {
  elapsed += delta;
  if (!!app.cloudsVfx)
    // 구름효과가 true면
    app.cloudsVfx.updateTexture(app, elapsed); // 구름효과에 updateTexture? 실행?

  if (!!lastPopup) {
    // 섹터 안의 spot 에 값이 할당됨
    let b = lastPopup.followTarget.getBounds(); // lastPopup은 어디서 온거지?
    lastPopup.x = b.x + b.width / 2;
    lastPopup.y = b.y + b.height / 2;
  }

  if (app.blinkingItem) {
    if (blinkingGizmo.width < 20)
      blinkingGizmo.scale.set(1.0 + 2.0 * ((Math.sin(elapsed * 0.1) + 1) / 2));
    else {
      blinkingGizmo.scale.set(1.0 + 0.1 * ((Math.sin(elapsed * 0.1) + 1) / 2));
      blinkingGizmo.alpha = 1 - Math.abs(Math.sin(elapsed * 0.05));
    }
  }
});

function makeSector(spot_x, spot_y, parent) {
  let sectorId =
    Math.floor(spot_x / SECTOR_SIZE) + "_" + Math.floor(spot_y / SECTOR_SIZE);
  let sector = null;
  if (sectorId in sectorDict === false) {
    // 아직 안 만들어진 Sector만 처리, 여기도 == 써놨네

    sector = new PIXI.Container();

    let lockedCover = new PIXI.Graphics();
    if (sectorId in UNLOCKED_SECTOR)
      // id가 잠금풀린 섹터에 해당되면? > 배경색 달라짐
      lockedCover.beginFill(0x555555, 0.1);
    else lockedCover.beginFill(0x555555, 0.5);
    lockedCover.lineStyle(3, 0x000000, 0.25);
    lockedCover.drawRect(
      -SECTOR_SIZE / 2,
      -SECTOR_SIZE / 2,
      SECTOR_SIZE,
      SECTOR_SIZE
    );
    lockedCover.endFill();

    sector.addChild(lockedCover);

    sector.sectorId = sectorId;
    sectorDict[sectorId] = sector;
    sector.x = Math.floor(spot_x / SECTOR_SIZE) * SECTOR_SIZE;
    sector.y = Math.floor(spot_y / SECTOR_SIZE) * SECTOR_SIZE;

    sector.interactive = true; // 이벤트 처리 활성
    sector.buttonMode = true; // 이건 모르겠다;;

    if (sectorId in UNLOCKED_SECTOR == false) {
      locked = PIXI.Sprite.from("img/maps/locked.png"); // 그 자물쇠 이미지
      locked.anchor.set(0.5, 0.5);
      sector.addChild(locked);
    }

    parent.addChild(sector); // buttons에 섹터(칸 하나) 추가
  } else {
    sector = sectorDict[sectorId];
  }

  return sector; // 이걸로 한 칸을 만들어서 반환
}

function makeSpot(farmInfo, spot_x, spot_y, parent, sectorId) {
  // 이거 그 박스 안에 작은 사각형으로 색깔 칠해주는 부분인듯
  let spot = new PIXI.Graphics();
  const rectSize = 5;
  if (farmInfo.size == "5X5")
    spot.beginFill(0x774466, 0.5); // 이 색깔이 Map에 나온적이 있던가??? > 있음
  else if (farmInfo.size == "6X6") spot.beginFill(0x665588, 0.5);
  else if (farmInfo.size == "7X7") spot.beginFill(0x3355bb, 0.5);

  spot.drawRect(-rectSize / 2, -rectSize / 2, rectSize, rectSize);
  spot.endFill();

  spot.farmInfo = farmInfo;
  spot.parentSectorId = sectorId;
  spot.visible = false; // 유저 클릭으로 활성화되었을 때만 보이게 기본값은 False
  spot.x = spot_x - parent.x - SECTOR_SIZE / 2;
  spot.y = spot_y - parent.y - SECTOR_SIZE / 2;
  spot.buttonMode = true;
  spot.interactive = true;

  return spot; // 생성된 데이터 반환
}

function onClickSector(sector) {
  removePopup(); // 원래 팝업이 있으면 제거
  setBlinkingTarget(sector); // 깜빡이는 이벤트 추가
  viewport.snap(sector.x, sector.y, {
    time: 300,
    removeOnComplete: true,
    removeOnInterrupt: true,
  });
  // snap이 실행되어야 효과가 실제로 보이는듯
}

function onClickSpot(spot) {
  setBlinkingTarget(spot);
  viewport.snap(spot.parent.x + spot.x, spot.parent.y + spot.y, {
    time: 300,
    removeOnComplete: true,
    removeOnInterrupt: true,
  });
}

let lastPopup = null;
function removePopup() {
  if (lastPopup != null) {
    // lastPopup 이 빈 상태가 아니면
    lastPopup.parent.removeChild(lastPopup);
    lastPopup = null;
  }
}

function showInfoPopup(spot) {
  let farmInfo = spot.farmInfo; // Spot 생성할 때 인자로 넘긴 데이터

  removePopup(); // 이전의 팝업은 제거하고 다시 생성

  // Make Popup
  let popup = new PIXI.Container();
  let popupBg = PIXI.Sprite.from("img/maps/selected_spot_info.png");

  // Detail Button
  let moreBtn = PIXI.Sprite.from("img/maps/more_btn.png");
  moreBtn.anchor.set(0.5, 0.5);
  moreBtn.y = -70;
  moreBtn.buttonMode = true;
  moreBtn.interactive = true;
  moreBtn.on("pointerup", () => {
    OnClickDetail(farmInfo.id);
  });

  // set title text
  let popupTitleText = new PIXI.Text("[2321] 333.333", {
    fontFamily: "Arial",
    fontSize: 15,
    fill: 0xffffff,
    align: "center",
  });
  popupTitleText.anchor.set(0.5, 0.5);
  popupTitleText.y = -225;
  popupTitleText.text = `NZ, Stewart Island, X:${farmInfo.x} Y:${farmInfo.y}`;

  // set max sheep count text
  // ID따라서 양의 최대 값에 제한이 있는 듯
  let maxSheepNum = 3;
  if (farmInfo.id <= 6111) maxSheepNum = 3;
  else if (farmInfo.id <= 9111) maxSheepNum = 4;
  else if (farmInfo.id <= 11111) maxSheepNum = 5;
  else maxSheepNum = "-";

  let popupSheepText = new PIXI.Text("555555", {
    fontFamily: "Arial",
    fontSize: 18,
    fill: 0xffffff,
    align: "center",
  });
  // 저 '555555' 는 어떤 목적인지 인자 찾아봐야 할듯.
  popupSheepText.anchor.set(0.5, 0.5);
  popupSheepText.y = -118;
  popupSheepText.x = 20;
  popupSheepText.text = "" + maxSheepNum;

  // set farm size text
  let popupSizeText = new PIXI.Text("555555", {
    fontFamily: "Arial",
    fontSize: 18,
    fill: 0xffffff,
    align: "center",
  });
  popupSizeText.anchor.set(0.5, 0.5);
  popupSizeText.y = -165;
  popupSizeText.x = 20;
  popupSizeText.text = farmInfo.size;

  //attach
  popupBg.anchor.set(0.5, 1);
  popupBg.addChild(moreBtn);
  popupBg.addChild(popupTitleText);
  popupBg.addChild(popupSheepText);
  popupBg.addChild(popupSizeText);
  popup.addChild(popupBg);

  popup.x = spot.getBounds().x;
  popup.y = spot.getBounds().y;
  popup.followTarget = spot;
  uiLayer.addChild(popup);

  lastPopup = popup;

  // show selected row
  updateSelectedRow(farmInfo.id);
}

var blinkingGizmo = new PIXI.Graphics(); // Sector 클릭했을때 깜빡이는 그래픽효과
blinkingGizmo.zOrder = 10000;
blinkingGizmo.interactive = false; // 효과는 이벤트 주면 다른박스 선택 안되니 당연히 False
blinkingGizmo.buttonMode = false;

function setBlinkingTarget(target) {
  blinkingGizmo.clear();

  if ("farmInfo" in target) {
    showInfoPopup(target);
    updateSelectedRow(target.farmInfo.id);
  }

  for (let sectorId in sectorDict) {
    // last item was sector
    let sector = sectorDict[sectorId];
    sector.parent.setChildIndex(sector, 0); // 이전에 보고 있던 Sector의 index를 내려줌
    let spots = sectorSpotDict[sectorId];
    spots.forEach((e) => {
      e.visible = false;
    }); // Sector 안의 Spot도 다 숨겨주기
    // console.log("hide last spots");
  }

  if (target != null) {
    // null일때 밑의 함수가 실행되면 오류 발생
    app.blinkingItem = target;
    let bound = app.blinkingItem.getLocalBounds();
    blinkingGizmo.lineStyle({
      width: 3,
      color: 0xffdd00,
      alpha: 1.0,
      join: PIXI.LINE_JOIN.ROUND,
    });
    blinkingGizmo.drawRect(bound.x, bound.y, bound.width, bound.height);
    app.blinkingItem.addChild(blinkingGizmo);

    if ("farmInfo" in target) {
      // on select spot
      let sectorId = target.parentSectorId;
      let spots = sectorSpotDict[sectorId];
      spots.forEach((e) => {
        e.visible = true;
      });
    } else if ("sectorId" in target) {
      // on select sector
      let spots = sectorSpotDict[target.sectorId];
      spots.forEach((e) => {
        e.visible = true;
      });
      let sector = sectorDict[target.sectorId];
      sector.parent.setChildIndex(sector, sector.parent.children.length - 1); // sectorDict[target.sectorId].zOrder = 100;
    }
  }

  if (target != null) {
    if ("farmInfo" in target) {
      let sector = sectorDict[target.parentSectorId];
      showFarmInfosInSector(sector);
    } else if ("sectorId" in target) {
      let sector = sectorDict[target.sectorId];
      showFarmInfosInSector(sector);
    }
  } else {
    showFarmInfosInSector(null);
  }
}

var lastInspectorShowSector = null;
function showFarmInfosInSector(sector, cb) {
  if (sector != null) {
    $("#sector-inspector").show();

    if (lastInspectorShowSector != sector) {
      $("#pastures-list").scrollTop(0);
      $("#pastures-list").empty();

      fetch(window.location.origin + `/map/sector/${sector.sectorId}`) // Fetch sold states
        .then((resp) => resp.json())
        .then((data) => {
          window.soldStateDict = {};
          data.forEach((e) => {
            window.soldStateDict[e.id] = e.sold; //0=false 1=true
          });

          updateInfoInSector(sector.sectorId);

          if (app.blinkingItem != null && "farmInfo" in app.blinkingItem)
            updateSelectedRow(app.blinkingItem.farmInfo.id);

          cb && cb();
        });
    }
    lastInspectorShowSector = sector;
  } else {
    $("#sector-inspector").hide();
  }
}

function updateInfoInSector(sectorId) {
  $("#pastures-list").empty();

  let spots = sectorSpotDict[sectorId];
  let soldCnt = 0;
  for (let i in spots) {
    let spot = spots[i];
    let farmInfo = spot.farmInfo;
    let farmId = farmInfo.id;
    let size = farmInfo.size;
    let sheepLimit = farmInfo.sheepLimit;
    let sold = window.soldStateDict[farmId];

    if (sold) {
      soldCnt++;
      $("#pastures-list").append(`
                    <div class="row" onclick="onClickGoButton(event)" data-farm-id="${farmId}">
                        <span style="pointer-events: none;">
                            <span class="sector-id">${farmId}</span>
                            <span class="property"><img src="img/maps/size.png">${size}</span>
                            <span class="property"><img src="img/maps/sheep.png">${sheepLimit}</span>
                        </span>
                        <span class="sold-btn-parent">
                            <a class="sold-btn" target="_blank" onclick="OnClickOccupied(${farmId})">OCCUPIED</a>
                        </span>
                    </div>`);
    } else {
      $("#pastures-list").append(`
                    <div class="row" onclick="onClickGoButton(event)" data-farm-id="${farmId}">
                        <span style="pointer-events: none;">
                            <span class="sector-id">${farmId}</span>
                            <span class="property"><img src="img/maps/size.png">${size}</span>
                            <span class="property"><img src="img/maps/sheep.png">${sheepLimit}</span>
                        </span>
                        <span>                                            
                            ${
                              spot.parentSectorId in UNLOCKED_SECTOR
                                ? `<button class="buy-btn"  onclick="OnClickPurchase(${farmId})">PURCHASE</button>`
                                : '<button disabled class="sold-btn">LOCKED</button>'
                            }
                        </span>
                        
                    </div>
                `);
    }
  }
  $("#remain-amount").html(
    `Remains ${spots.length - soldCnt} / ${spots.length} `
  );
}

function onClickGoButton(event) {
  let data = $(event.target).data();
  if (data.farmId in spotDict) {
    removePopup();
    onClickSpot(spotDict[data.farmId]);
  }
}

function updateSelectedRow(farmId) {
  $(`div.row[data-farm-id!="${farmId}"]`).removeClass("selected");
  $(`div.row[data-farm-id="${farmId}"]`).addClass("selected");
  if ($(`div.row[data-farm-id=${farmId}]`).length > 0) {
    let row_position = $(`div.row[data-farm-id=${farmId}]`).offset().top;
    let listTop = $("#pastures-list").offset().top;
    let listBottom =
      $("#pastures-list").offset().top + $("#pastures-list").height();
    if (row_position < listTop || row_position > listBottom) {
      $("#pastures-list").animate(
        {
          scrollTop: row_position - $("div.row").offset().top,
        },
        300
      );
    }
  }
}

function onClickLandSearch() {
  let searchLandId = $("#land-id-input").val(); // Pasture ID 를 가져오는듯 > useRef 로 처리?
  if (searchLandId in spotDict) {
    // Spot 모아놓은 값에서 찾는 ID값이 존재하면?
    removePopup(); // 원래 팝업 없애고
    onClickSpot(spotDict[searchLandId]); // 찾는값 있으니까 바로 팝업 띄워주기
  }
}

function onClickWelcomeModalOk() {
  // useState로 모달 보여주기 / 끄기 하면 될듯
  $("#welcom-modal-background").hide();
  onClickSector(sectorDict[FIRST_FOCUS_SECTOR]);
}

function onClickClose(selector) {
  $(selector).hide();

  if (selector == "#bill-paper") {
    $("#klip-qr-code-frame").hide();

    if (!!window.klipPollingId) {
      clearInterval(window.klipPollingId); // 주기적으로 값이 바뀌는건가?
      delete window.klipPollingId;
      delete window.lastKlipRequestKey;
    }
  }
}

function OnClickDetail(farmId) {
  // 팝업 detail 버튼 클릭했을때 모달 보여주는 함수 > 모달 컴포넌트로 따로 만들 수 있을 듯.
  let spot = spotDict[farmId];
  let farmInfo = spot.farmInfo;
  let unlocked = spot.parentSectorId in UNLOCKED_SECTOR;

  $("#purchase-detail").show();
  $("#purchase-detail #farm-detail-size").html(farmInfo.size);
  $("#purchase-detail #farm-detail-sheeps").html(farmInfo.sheepLimit);
  $("#purchase-detail .pasture-number").html("No. " + farmInfo.id);
  $("#purchase-detail .im").css(
    "background",
    `center url("https://cdn.sheepfarm.io/nft/img/land_${farmInfo.id}.png")`
  );
  $("#purchase-detail").data("farm-id", farmId);

  // 왜 이렇게 분리되어 있는거지
  if (farmInfo.size == "5X5") {
    $("#purchase-detail #small-size-pasture-desc").show();
    $("#purchase-detail #middle-size-pasture-desc").hide();
    $("#purchase-detail #large-size-pasture-desc").hide();
  } else if (farmInfo.size == "6X6") {
    $("#purchase-detail #small-size-pasture-desc").hide();
    $("#purchase-detail #middle-size-pasture-desc").show();
    $("#purchase-detail #large-size-pasture-desc").hide();
  } else if (farmInfo.size == "7X7") {
    $("#purchase-detail #small-size-pasture-desc").hide();
    $("#purchase-detail #middle-size-pasture-desc").hide();
    $("#purchase-detail #large-size-pasture-desc").show();
  }

  // $("#purchase-detail .im").css("background-position", ";");
  let sold = window.soldStateDict[farmId];

  if (sold) {
    $("#purchase-detail #occupied-btn").show();
    $("#purchase-detail #purchase-btn").hide();
    $("#purchase-detail #locked-btn").hide();

    $("#purchase-detail .pasture-number").html(
      "No. " + farmInfo.id + "<br>Owner : Loading.."
    );

    fetch("/map/ownerOf/" + farmInfo.tokenId)
      .then((response) => response.json())
      .then((resp) => {
        let loginAddress = myWalletAddress();
        var _farmId = $("#purchase-detail").data("farm-id");
        if (_farmId == farmId) {
          if (!resp.owner) {
            $("#purchase-detail .pasture-number").html("No. " + farmInfo.id);
          } else {
            $("#purchase-detail .pasture-number").html(
              "No. " +
                farmInfo.id +
                "<div style='font-size:13px;font-weight:500'>Owner " +
                (loginAddress == resp.owner ? "(You)" : "") +
                "<br>" +
                resp.owner +
                "</div>"
            );
          }
        }
      });
  } else if (unlocked == false) {
    $("#purchase-detail #occupied-btn").hide();
    $("#purchase-detail #purchase-btn").hide();
    $("#purchase-detail #locked-btn").show();
  } else {
    $("#purchase-detail #occupied-btn").hide();
    $("#purchase-detail #purchase-btn").show();
    $("#purchase-detail #locked-btn").hide();
  }
}

function farmPrice(farmInfo) {
  if (farmInfo.size == "5X5") return 165;
  else if (farmInfo.size == "6X6") return 280;
  else if (farmInfo.size == "7X7") return 394;
  return 999999999;
}

// --------------------여기서부터는 결제/지갑연결 함수인데 당장 구현은 하지도 못하니 패스--------------------
function OnClickPurchase(farmId) {
  let spot = null;
  if (farmId == null) {
    let data = $("#purchase-detail").data();
    spot = spotDict[data.farmId];
  } else spot = spotDict[farmId];

  let farmInfo = spot.farmInfo;
  let price = farmPrice(farmInfo);
  let discount = 0;

  refreshFarmState(spot.parentSectorId, farmId).then((data) => {
    if (!!data.sold) {
      alert("Sorry, this pasture is sold.");
      return;
    }

    valid_redeem = "";
    valid_reedeem_info = null;

    $(".purchase-buttons").show();
    $("#busy-indicator").hide();
    document.getElementById("kilp_purchase_qr").innerHTML = "";

    $("#purchase-detail").hide();
    $("#bill-paper #heading").html(
      `New Zealand, Stewart Island, No. ${farmInfo.id}`
    );
    $("#bill-paper #im").css(
      "background",
      `center url("https://cdn.sheepfarm.io/nft/img/land_${farmInfo.id}.png")`
    );

    updatePriceInfo(price, discount);
    $("#bill-paper .wallet-balance-text").html("-");

    updatePurchaseButtons();
    $("#bill-paper").data("farm-id", farmId);
    $("#bill-paper #kilp-purchase-parent").hide();
    $("#bill-paper #error-messages").html("");
    $("#bill-paper").show();
  });
}

function updatePriceInfo(price, discount) {
  $("#bill-paper #price-text").html(`${price} KLAY`);
  $("#bill-paper #discount-text").html(`-${discount} KLAY`);

  var discountPrice = ethers.utils.formatEther(
    ethers.utils
      .parseEther(price.toString())
      .sub(ethers.utils.parseEther(discount.toString()))
  );
  $("#bill-paper #total-text").html(`${discountPrice} KLAY`);
}

function OnClickOccupied(farmId) {
  let spot = spotDict[farmId];
  let tokenId = spot.farmInfo.tokenId;
  window.open(
    `https://opensea.io/assets/klaytn/0xa9f07b1260bb9eebcbaba66700b00fe08b61e1e6/${tokenId}`
  );
}

function isKaikasInstalled() {
  return (
    window.klaytn && window.klaytn.isKaikas && window.caver && window.caver.klay
  );
}

function isMetamaskInstalled() {
  return window.ethereum && window.ethereum.isMetaMask;
}

async function onClickConnectMetamask() {
  let metamaskInstalled = isMetamaskInstalled();
  if (metamaskInstalled) {
    $(".wallet-balance-text").html("-");
    $(".wallet-select").hide();
    $(".purchase-buttons").hide();

    if (window.ethereum.networkVersion != "8217") {
      $("#bill-paper #error-messages").html(
        "Invalid Klaytn network. Select the correct network and try again. <a href='https://docs.klaytn.com/bapp/tutorials/connecting-metamask'>[Klaytn tutorial]</a>"
      );
      return;
    }

    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((address) => {
        window.metamaskWalletAddress = address;
        updatePurchaseButtons();
      });
  } else {
    window.open(
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en",
      "_blank"
    );
  }
}

function onClickConnectKaikas() {
  let kaikasInstalled = isKaikasInstalled();
  if (kaikasInstalled) {
    $(".wallet-balance-text").html("-");
    $(".wallet-select").hide();
    $(".purchase-buttons").hide();

    if (klaytn.networkVersion != 8217) {
      $("#bill-paper #error-messages").html(
        "Invalid Klaytn network. Select the correct network and try again."
      );
      return;
    }

    window.klaytn.enable().then(function (addrs) {
      window.kaikasWalletAddress = addrs;
      updatePurchaseButtons();
    });
  } else {
    window.open(
      "https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi",
      "_blank"
    );
  }
}

function onClickConnectKlip() {
  if (!!window.klipPollingId)
    // it checking..
    return;

  var headers = new Headers();
  headers.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    bapp: { name: "Sheepfarm in Meta-land" },
    callback: {},
    type: "auth",
  });
  fetch("https://a2a-api.klipwallet.com/v2/a2a/prepare", {
    method: "POST",
    headers: headers,
    body: raw,
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((result) => {
      let request_key = result.request_key;
      startKlipRequest(request_key).then((resp) => {
        window.klipWalletAddress = resp.result.klaytn_address;
        updatePurchaseButtons();
      });
    })
    .catch((error) => console.log("error", error));
}

function updatePurchaseButtons() {
  $(".wallet-select").hide();
  $(".purchase-buttons").hide();

  $("#row-wallet-balance").show();

  let deferred = null;
  if (!!window.kaikasWalletAddress)
    deferred = caver.klay.getBalance(window.kaikasWalletAddress[0]);
  else if (!!window.metamaskWalletAddress)
    deferred = window.ethereum.request({
      method: "eth_getBalance",
      params: [window.metamaskWalletAddress[0], "latest"],
    });

  if (!!deferred) {
    // Kaikas or Metamask
    deferred.then((balance) => {
      balance = ethers.utils.formatEther(balance);
      $(".wallet-balance-text").html(balance + " KLAY");

      let data = $("#bill-paper").data();
      let spot = spotDict[data.farmId];
      let farmInfo = spot.farmInfo;
      let price = farmPrice(farmInfo);

      if (balance < price) {
        $("#bill-paper #error-messages").html("Not enough balance.");
        $("#bill-paper #proceed-btn").addClass("disabled");
      }
      $(".wallet-select").hide();
      $(".purchase-buttons").show();
    });
  } else if (window.klipWalletAddress) {
    // update balance
    $("#row-wallet-balance").hide();
    $(".wallet-select").hide();
    $(".purchase-buttons").show();
  } else {
    $(".wallet-select").show();
    $(".purchase-buttons").hide();
  }
}

function myWalletAddress() {
  if (!!window.metamaskWalletAddress) {
    return window.metamaskWalletAddress[0];
  } else if (!!window.kaikasWalletAddress) {
    return window.kaikasWalletAddress[0];
  } else if (!!window.klipWalletAddress) {
    return window.klipWalletAddress;
  }
  return "";
}

async function onClickPaymentProceed() {
  let data = $("#bill-paper").data();
  let spot = spotDict[data.farmId];
  let farmInfo = spot.farmInfo;
  let farmId = farmInfo.id;
  let tokenId = farmInfo.tokenId;
  let price = farmPrice(farmInfo);
  let farmSize = farmInfo.size; // '5X5', '6X6', '7X7'

  if (valid_reedeem_info) {
    var discount = ethers.utils
      .formatEther(
        ethers.utils
          .parseEther(price.toString())
          .div(100)
          .mul(valid_reedeem_info.discount)
      )
      .toString();
    price = ethers.utils.formatEther(
      ethers.utils
        .parseEther(price.toString())
        .sub(ethers.utils.parseEther(discount.toString()))
    );
  }

  if (valid_redeem != $("#input-code").val()) {
    alert("Please apply your code first.");
    return;
  }

  $(".purchase-buttons").hide();
  document.getElementById("kilp_purchase_qr").innerHTML = "";

  if (!!window.metamaskWalletAddress) {
    // with metamask
    $("#busy-indicator").show();

    try {
      await purchase_Metamask(
        price,
        farmSize.split("X")[0],
        tokenId,
        valid_redeem,
        window.metamaskWalletAddress[0]
      );
      window.soldStateDict[farmId] = 1;
      onPurchaseComplete(farmId);
    } catch (err) {
      $(".purchase-buttons").show();
      $("#busy-indicator").hide();
      console.log(err);
      // alert(err.message);
      if (
        err.code == 4001 ||
        err.message.indexOf("User denied") >= 0 ||
        err.message.indexOf("User rejected")
      ) {
        alert("user canceled");
      } else {
        onPurchaseFailed(farmId);
      }
    }
  } else if (!!window.kaikasWalletAddress) {
    // with kaikas
    $("#busy-indicator").show();

    try {
      await purchase_Kaikas(
        price,
        farmSize.split("X")[0],
        tokenId,
        valid_redeem,
        window.kaikasWalletAddress[0]
      );
      window.soldStateDict[farmId] = 1;
      onPurchaseComplete(farmId);
    } catch (err) {
      $(".purchase-buttons").show();
      $("#busy-indicator").hide();
      if (err.message.indexOf("User denied") >= 0) {
        alert("user canceled");
      } else {
        onPurchaseFailed(farmId);
      }
    }
  }
  if (!!window.klipWalletAddress) {
    try {
      await purchase_klip(
        document.getElementById("kilp_purchase_qr"),
        price,
        farmSize.split("X")[0],
        tokenId,
        valid_redeem
      );
      window.soldStateDict[farmId] = 1;
      onPurchaseComplete(farmId);
    } catch (err) {
      if (err.message.indexOf("User denied") >= 0) {
        alert("user canceled");
        $("#bill-paper").hide();
      } else {
        $(".purchase-buttons").show();
        $("#busy-indicator").hide();

        onPurchaseFailed(farmId);
      }
    }
  }
}

function getRedeemInfo(redeemString) {
  const result = { discount: 0 };

  if (!redeemString) {
    return result;
  }

  const maps = [
    ["0x10cad49399891ec8f8041bc8b851635589f52b76c157ad87e17bf4662746b8bd", 5],
    ["0xe88286b5abeb0e4bb36849d8683e697cd9cf532f1ad92fd5abc469ef57644be7", 5],
    ["0x3450480a900a4862a52ec2f4032ad2422b18e29b68324d7eaa5c35ab5d4acf14", 5],
    ["0xb2c4bed3f145aa63dad50dd559994955adae286a5981be48048e9600fbefc7ba", 6],
    ["0xc88bd455c7e889d6829b762f36eae38c059f2c000972873ca31b784e1991488b", 6],
    ["0x10f9be0b037694c44c4eef6b063c5ea361c3d04be1e7a02e70fc83d178eaab4e", 6],
    ["0x9dec3313c58b770de0d3f332940834d130eecd90801411c52a45a288736cfa2d", 6],
    ["0x189286377b61c6597a7212cb27fa5d70689c8126f9695dcc6f1b51e305806b6e", 6],
    ["0xfd63796c85edab2631df656c527723af21f605b859e7c087f64ea8b558babb98", 6],
    ["0x389598ee80cc3b13d1a203fead75fd830be1e152cf29e0cfb2d34d0f28463f9d", 6],
    ["0x9d7d8fd68c7df282a56be1373666f0c740a10656ddd6b0bd0bd35f450c3220d9", 6],
    ["0x4b5dc16c4a66e56273ee94cdde5286ca761885d14b0d604acde7c50a89aaf420", 6],
    ["0x1e1a39b425ab1c114fb66adcceea6b15c4be79192809204fc09c77b95571ca90", 6],
    ["0x65f23a3f2f8427a7d49d70639e250f6492cc76ea06f7a0705074b9869b00632b", 6],
    ["0x4b744e9584d7ea301f190e5d679c21cff1ea776d5f69661f2d4451895b8181f4", 6],
    ["0xcc78942f090f70f7520ce4a60412cc2f24730ad462db16e47278a9b69f31aedc", 6],
    ["0x77da1906e7dd40d3f46c7a2b5926c8118b7d152b17f55cd9a55e07e604307000", 6],
    ["0xfb48dabd054f6c743556124d045ac44066fd952e81f231e353a63bd6e5cbbada", 6],
    ["0x3df760152077b3e7c495664ddb96859bb1a2f37591619a0d51776ce9875e38fb", 6],
    ["0x77868942c9fef0fbb8d72ba9d9afc05028f2c1e5967ea84ac83a283c2d93c12d", 6],
    ["0x1d919938634ff6aeb8582215d958cc6be91ba1a8cd5f253aa362937dd1e7f7b5", 6],
    ["0xa9cebc089bfbc973c4e1b03475b20db66e16048fb2b096c2b65f1a75eb73e1da", 6],
    ["0xe0f3e46369aac06795d2b8fef2dd9d19688734fcab30d578d13436ba296caad1", 6],
    ["0x9d73b55d835ecc1587c98bb3a29b52fa255db58275ea4ed7e2af9dc2df689cc4", 6],
    ["0x72e72529d1744e4989bf06359241eef757f3218531f48189e87706ff834ba2b8", 6],
    ["0x95f71bf1719442bf2e310cb649457897a7b1f2d3da854d03f4fcc4899f582b40", 6],
    ["0x33d09e7f75d023fb33607c89b769cbbbb5e81753072b117f83b398f1cbe48fea", 6],
  ];

  const redeemHash = ethers.utils.solidityKeccak256(["string"], [redeemString]);
  const matched = maps.find(([hash]) => redeemHash === hash);

  if (matched) {
    result.discount = matched[1];
  }

  return result;
}

async function onClickCheckRedeem() {
  let redeem = $("#input-code").val().toUpperCase().replace(/ /g, "");
  let data = $("#bill-paper").data();
  let spot = spotDict[data.farmId];
  let farmInfo = spot.farmInfo;

  let redeemInfo = null;
        redeemInfo = getRedeemInfo(redeem);

        if (redeemInfo.discount == 0) return alert("Invalid code.");
      
        let price = farmPrice(farmInfo);
        let discount = ethers.utils
          .formatEther(
            ethers.utils
              .parseEther(price.toString())
              .div(100)
              .mul(redeemInfo.discount)
          )
          .toString();
        updatePriceInfo(price, discount);
      
        valid_redeem = redeem;
        valid_reedeem_info = redeemInfo;
      }
      
      async function purchase_klip(qrElement, price, landSize, tokenId, redeem) {
        const amount = ethers.utils.parseEther(price.toString()).toString();
        const transaction = {
          to: presaleContract,
          value: amount,
          abi: JSON.stringify(abi.presaleLand.find((x) => x.name === "purchase")),
          params: JSON.stringify([landSize, tokenId, redeem]),
        };
      
        let res = await runExecuteContract_Klip(qrElement, transaction);
        if (res.result && res.result.status === "success") {
        } else if (res.status === "canceled") {
          throw new Error("User denied");
        } else {
          throw new Error("error");
        }
      }
      
      function runExecuteContract_Klip(qrElement, transaction) {
        var data = {
          bapp: {
            name: "SheepFarm in Metaland",
          },
          type: "execute_contract",
          transaction: transaction,
        };
        return new Promise((resolve, reject) => {
          $.ajax({
            url: "https://a2a-api.klipwallet.com/v2/a2a/prepare",
            method: "post",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "JSON",
            success: async function (res) {
              let url =
                "https://klipwallet.com/?target=/a2a?request_key=" + res.request_key;
              let device = get_device_state();
              if (device.isMobile) {
                window.openDeepLink = function () {
                  daumtools.web2app({
                    // open deep link
                    urlScheme: `kakaotalk://klipwallet/open?url=${url}`, // iphone : custom scheme
                    intentURI: `intent://klipwallet/open?url=${url}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`, // android : intent URI
                    appName: "Kakaotalk", // application Name (ex. facebook, twitter, daum)
                    storeURL: device.isIos
                      ? "itms-apps://itunes.apple.com/app/id362057947"
                      : "market://details?id=com.kakao.talk", // app store URL
                  });
                };
                window.openDeepLink();
                $("#klip-purchase-btn").show();
              } else {
                $("#bill-paper #kilp-purchase-parent").show();
                $("#klip-purchase-btn").hide();
                var qrcode = new QRCode(qrElement, { width: 160, height: 160 });
                qrcode.makeCode(url);
                $("#kilp_purchase_qr img")
                  .css("margin", "auto")
                  .css("margin-top", "10px");
                $("#kilp_purchase_qr").append(
                  `<div id="usage"> Scan QR code with camera app or KakaoTalk code scan </div>`
                );
              }
      
              try {
                while (1) {
                  await new Promise((r) => setTimeout(r, 1000));
                  let resp = await checkKlipResult_Klip(res.request_key);
                  if (resp != null) {
                    console.log(resp);
                    resolve(resp);
                    break;
                  }
                }
              } catch (err) {
                console.log(err);
                reject(err);
              }
            },
            error: function () {},
          });
        });
      }
      
      function checkKlipResult_Klip(requestKey) {
        return new Promise((resolve, reject) => {
          $.ajax({
            url:
              "https://a2a-api.klipwallet.com/v2/a2a/result?request_key=" +
              requestKey,
            method: "get",
            dataType: "JSON",
            success: function (res) {
              console.log(res.status);
              if (res.status === "completed") {
                resolve(res);
              } else if (res.status === "canceled") {
                resolve(res);
              } else {
                resolve(null);
              }
            },
            error: function () {
              console.log("111");
              reject("error");
            },
          });
        });
      }
      
      function getPresaleContract_Metamask() {
        return new new Web3(window.ethereum).eth.Contract(
          abi.presaleLand,
          presaleContract
        );
      }
      
      function getPresaleContract_Kaikas() {
        return new window.caver.klay.Contract(abi.presaleLand, presaleContract);
      }
      
      function checkRedeem_Metamask(redeem, fromkaikasAddress) {
        let redeemHash = ethers.utils.solidityKeccak256(["string"], [redeem]); // 중요
        let contract = getPresaleContract_Metamask();
        let callOpt = { from: fromkaikasAddress };
      
        return new Promise((resolve, reject) => {
          contract.methods
            .redeems(redeemHash)
            .call(callOpt)
            .then(async (redeemInfo) => {
              resolve(redeemInfo);
            })
            .catch((e) => {
              reject(e);
            });
        });
      }
      
      function checkRedeem_Kaikas(redeem, fromkaikasAddress) {
        let redeemHash = ethers.utils.solidityKeccak256(["string"], [redeem]); // 중요
        let contract = getPresaleContract_Kaikas();
        let callOpt = { from: fromkaikasAddress };
      
        return new Promise((resolve, reject) => {
          contract.methods
            .redeems(redeemHash)
            .call(callOpt)
            .then(async (redeemInfo) => {
              resolve(redeemInfo);
            })
            .catch((e) => {
              reject(e);
            });
        });
      }
      
      function purchase_Metamask(price, landSize, tokenId, redeem, kaikasAddress) {
        const amount = ethers.utils.parseEther(price.toString()).toString();
        const contract = getPresaleContract_Metamask();
      
        return new Promise((resolve, reject) => {
          contract.methods
            .purchase(landSize, tokenId, redeem)
            .send({ from: kaikasAddress, gas: 200000, value: amount })
            .then((receipt) => {
              resolve(receipt);
            })
            .catch((e) => {
              reject(e);
            });
        });
      }
      
      function purchase_Kaikas(price, landSize, tokenId, redeem, kaikasAddress) {
        const amount = ethers.utils.parseEther(price.toString()).toString();
        const contract = getPresaleContract_Kaikas();
      
        return new Promise((resolve, reject) => {
          contract.methods
            .purchase(landSize, tokenId, redeem)
            .send({ from: kaikasAddress, gas: 200000, value: amount })
            .then((receipt) => {
              resolve(receipt);
            })
            .catch((e) => {
              reject(e);
            });
        });
      }
      
      async function checkRedeem_API(redeem) {
        let redeemHash = ethers.utils.solidityKeccak256(["string"], [redeem]); // 중요
      
        let resp = await fetch(
          window.location.origin + `/map/presale/redeem/${redeemHash}`,
          { method: "POST" }
        );
        let json = await resp.json();
      
        return json;
      }
      
      function refreshFarmState(sectorId, farmId) {
        return fetch(
          window.location.origin + `/map/sector/${sectorId}/farm/${farmId}/refresh`,
          { method: "POST" }
        ).then((resp) => resp.json());
      }
      
      function onPurchaseComplete(farmId) {
        $("#bill-paper").hide();
      
        let spot = spotDict[farmId];
        let sectorId = spot.parentSectorId;
        let sector = sectorDict[sectorId];
      
        return refreshFarmState(sectorId, farmId).then((data) => {
          // Fetch sold states
          alert("Thanks! Your payment has been processed.");
          lastInspectorShowSector = null; //refresh pasture-list
          showFarmInfosInSector(sector, function () {
            OnClickDetail(farmId);
          });
        });
      }
      
      function onPurchaseFailed(farmId) {
        $("#bill-paper").hide();
      
        let spot = spotDict[farmId];
        let sectorId = spot.parentSectorId;
        let sector = sectorDict[sectorId];
      
        return fetch(
          window.location.origin + `/map/sector/${sectorId}/farm/${farmId}/refresh`,
          { method: "POST" }
        ) // Fetch sold states
          .then((resp) => resp.json())
          .then((data) => {
            if (data.ok == 1) {
              alert(" already soldout !!");
      
              lastInspectorShowSector = null; //refresh pasture-list
              showFarmInfosInSector(sector, function () {
                OnClickDetail(farmId);
              });
            }
          });
      }
      
      function startKlipRequest(request_key) {
        if (!!window.klipPollingId) {
          clearInterval(window.klipPollingId);
          delete window.klipPollingId;
        }
      
        window.lastKlipRequestKey = request_key;
      
        let device = get_device_state();
      
        if (device.isMobile) {
          daumtools.web2app({
            // open deep link
            urlScheme: `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`, // iphone : custom scheme
            intentURI: `intent://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`, // android : intent URI
            appName: "Kakaotalk", // application Name (ex. facebook, twitter, daum)
            storeURL: device.isIos
              ? "itms-apps://itunes.apple.com/app/id362057947"
              : "market://details?id=com.kakao.talk", // app store URL
          });
        } else {
          // desktop, make qrcode
          let qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
          $("#klip-qr-code").html("");
          new QRCode(document.getElementById("klip-qr-code"), qrcode, {
            width: 160,
            height: 160,
          });
          $("#klip-qr-code-frame").css("display", "flex").css("height", "100%"); // show
        }
      
        return new Promise((resolve, reject) => {
          //start polling
          if (window.klipPollingId) clearInterval(window.klipPollingId);
      
          window.klipPollingId = setInterval(() => {
            // keep polling
            var headers = new Headers();
            headers.append("Content-Type", "application/json");
            fetch(
              `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${window.lastKlipRequestKey}`,
              {
                method: "GET",
                headers: headers,
                redirect: "follow",
              }
            )
              .then((response) => response.json())
              .then((resp) => {
                let isExpired = resp.expiration_time < Date.now() / 1000;
                if (isExpired || "err" in resp) {
                  console.log("got error");
                  clearInterval(window.klipPollingId);
                  delete window.klipPollingId;
                  delete window.lastKlipRequestKey;
                  reject(resp);
                } else if (resp.status == "completed") {
                  $("#klip-qr-code-frame").hide();
                  clearInterval(window.klipPollingId);
                  delete window.klipPollingId;
                  delete window.lastKlipRequestKey;
                  resolve(resp);
                }
              });
          }, 1000); // end interval
        });
      }
      
      $("#land-id-input").keyup(function (e) {
        if (e.keyCode == 13) {
          onClickLandSearch();
        }
      });
      
      $("#input-code").keyup(function (e) {
        e.target.value = e.target.value.toUpperCase();
      });
      

*/
