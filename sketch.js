
let state = 0;
let apiKey = "AIzaSyCGsxjJ4Hc-kLvOrOMLmBpVxJOqegXsgeI";

//아래는 state==0에 대한 변수들
let initialized = false;

let logoImg;
let homeImg;
let searchImg;
let backImg;
let userImg;
let eyesImg;

let btn1;
let btn2;
let btn3;
let circleBtn;

let now, year, month, day, hour, minute;
let temperature = "정보없음"; // 온도는 임의로 표시

let weatherApiKey = "c2381380c28c92af7a6fe595fa94efee";
let lat = 37.5665; // 위도
let lon = 126.9780; // 경도

let responseText = "로딩 중...";
let quests = [];

let popupVisible = false;
let overlayDiv;
let talkBubbleImg;

let pdfInput;
let encodedPDF = null;
let pdfAdded = false;

let summarizedText = null;

let t = 0;

let recognition;



//아래는 state==1,2에 대한 변수들

let home2Img;
let tivo_speak;
let tivo_listen;

let textBoxText = "";
let geminiResponseText = "";

let speechRecognition;
let hasSpoken = false;

let lastSpeechTime = 0;
let speechTimeout = null;
let speechHistory = [];

let eyeH = 40.21;
let targetEyeH = 40.21;
let blinkTimer = 0;
let blinkInterval = 120; 

let bodyScale = 1;
let bodyScaleDir = 1;
let bodyNoiseOffset = 0;

let eyeOffsetY = 0;
let eyeDir = 1;
let eyeScaleOffset = 0;

let bodyScaleVal = 1;

let circles = [
  { baseX: 952, baseY: 370, size: 260, color: '#E8ADFF', alpha: 0.3, speed: 0.06, offset: 0, ampX: 30, ampY: 20, angleOffset: 0 },
  { baseX: 952, baseY: 370, size: 260, color: '#FF6D40', alpha: 0.3, speed: 0.05, offset: 100, ampX: 35, ampY: 25, angleOffset: Math.PI / 2 },
  { baseX: 952, baseY: 370, size: 260, color: '#FFF8BD', alpha: 0.3, speed: 0.06, offset: 50, ampX: 28, ampY: 28, angleOffset: Math.PI },
  { baseX: 952, baseY: 370, size: 260, color: '#E2FFFF', alpha: 0.3, speed: 0.05, offset: 150, ampX: 40, ampY: 15, angleOffset: Math.PI / 4 },
  { baseX: 952, baseY: 370, size: 260, color: '#FFFFFF', alpha: 0.3, speed: 0.07, offset: 80, ampX: 25, ampY: 35, angleOffset: Math.PI / 3 },
];

let myFrameCount = 0;


let bgLayer;


let isInPopupMode = false;



//state 3 관련
 // 스마트폰 화면 중앙에 그리기
  let phoneWidth = 375;
  let phoneHeight = 812;
  let phoneX = 1920 / 2;
  let phoneY = 1080 / 2;
  
  // 상태바 이미지 위치 계산 (폰의 상단 기준)
  let stateBarX = phoneX - phoneWidth / 2;
  let stateBarY = phoneY - phoneHeight / 2;


function preload() {
  // 이미지 로드
  logoImg = loadImage('Logo.png');
  homeImg = loadImage('home.png');
  backImg = loadImage('back.png');
  searchImg = loadImage('search.png');
  userImg = loadImage('user.png');
  home2Img = loadImage('home2.png')
  tivo_listen = loadImage('tivo_listen.png');
  tivo_speak= loadImage('tivo_speak2.png');
  tivo_eyes =loadImage('eyes.png')
  
  PhoneState = loadImage('Phone_state.png');
  PhoneCCTV = loadImage('Phone_CCTV.png');
  PhoneCall = loadImage('Phone_Call.png');
  PhoneCamera = loadImage('Phone_Camera.png');
  PhoneAccount = loadImage('Phone_account.png');
  PhoneHistory = loadImage('Phone_History.png');
  PhoneFrame = loadImage('Phone_frame.png');
}

  
function setup() {
  createCanvas(1920, 1080);
  getWeather();
  textFont('Pretendard-Medium');
  textSize(30);
  textAlign(CENTER, CENTER);

  if (!("webkitSpeechRecognition" in window)) {
    console.log("이 브라우저에서는 음성 인식을 지원하지 않습니다.");
    noLoop();
  } else {
    speechRecognition = new webkitSpeechRecognition();
    speechRecognition.lang = "ko-KR";
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.onresult = speechResult;
    speechRecognition.onerror = speechError;
    speechRecognition.onend = speechEnd;

    //speechRecognition.start(); 원활한 발표 진행을 위해 주석처리 했습니다
  }
  TIVO_setup();
  //noLoop();

}
 
function mousePressed() {
  if (mouseX > 1800 && mouseX < 1920 && mouseY > 1000 && mouseY < 1080) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function draw() {
  if(state == 0){
    TIVO_Main();
    btn1.show();
    btn2.show();
    btn3.show();
    circleBtn.show();
    
    if ((mouseX > 0) && (mouseX < 150) &&
    (mouseY >920 ) && (mouseY < 1080)) {
   btn1.hide();
    btn2.hide();
    btn3.hide();
    circleBtn.hide();
    state =3;
    } 
    
  }else if (state == 1) {
    TIVO_Listen();
    btn1.hide();
    btn2.hide();
    btn3.hide();
    circleBtn.hide();
    
    
  } else if (state == 2) {
    //image(home2Img, 103, 78, 93.54, 93.47);
    TIVO_Speak();
    btn1.hide();
    btn2.hide();
    btn3.hide();
    circleBtn.hide();
    
  }else if(state ==3){
    Phone_main();
    btn1.hide();
    btn2.hide();
    btn3.hide();
    circleBtn.hide();
    
    try {
      speechRecognition.stop();
      console.log("🎤 음성 인식 중지됨");
    } catch (e) {
      console.warn("음성 인식 중지 중 오류", e);
    }
    
    if ((mouseX > 0) && (mouseX < 150) &&
    (mouseY >0 ) && (mouseY < 150)) {
    state =0;
    } 
    //여기 아래 누르면 히스토리
    if ((mouseX > stateBarX+199) && (mouseX < stateBarX+1348) &&
    (mouseY >stateBarY+181 ) && (mouseY < stateBarY+504)) {
    state =4;
  
    } 
  }else if(state == 4){
    Phone_history();
    

  }
}

function addHoverEffect(btn) {
  btn.elt.addEventListener('mouseover', () => {
    btn.style('transform', 'scale(1.04)');
    btn.style('box-shadow', '0 10px 20px rgba(255, 255, 255, 0.2)');
  });

  btn.elt.addEventListener('mouseout', () => {
    btn.style('transform', 'scale(1)');
    btn.style('box-shadow', 'none');
  });
}


async function generateResponse01(question) {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  let requestBody = {
    contents: [{ role: "user", parts: [{ text: question }] }]
  };

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    let data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      responseText = data.candidates[0].content.parts[0].text;

      // 숫자 + 끝 마침표 제거
      responseText = responseText.replace(/\*/g, '')
      quests = responseText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/^\d+[\.\)]?\s*/, "").replace(/\.$/, ""))
        .slice(0, 2); 
    } else {
      quests = ["추천을 받아오지 못했어요."];
    }
  } catch (error) {
    quests = ["에러 발생: " + error.message];
  }
}

async function handleFile(file) {
  // 🔽 정확하게 MIME 타입을 검사하려면 이렇게!
  if (file.file && file.file.type === "application/pdf") {
    let reader = new FileReader();
    reader.onload = async function (e) {
      const typedarray = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str).join(' ');
        fullText += strings + '\n';
      }

      summarizePDFText(fullText);
    };
    reader.readAsArrayBuffer(file.file); // 🔽 file.file 사용해야 정상작동!
  } else {
    console.log("PDF만 업로드할 수 있습니다.");
  }
}


async function summarizePDFText(pdfText) {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  let prompt = `너는 치매 환자에게 오늘의 상태를 따뜻하고 친절하게 설명해주는 가족 혹은 의사야. 환자분이 이해하기 쉽도록 부드럽고 다정하게 설명해줘.
입력된 PDF에는 치매 환자의 상태와 복용 약에 대한 정보가 담겨 있어. 그 내용을 바탕으로 지금 시간을 파악하고 약 복용 여부, 현재 상태(예: 오늘은 약을 복용해야 하는 날인지, 외출이 없는지 등)를 3~4문장 이내로 아주 친절하게 말해줘.지금은${hour}시${nf(minute,2)}분이야.그리고 오늘은 ${year}년${month}월${day}야.:\n\n${pdfText}`;

  let requestBody = {
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await res.json();
    if (data.candidates && data.candidates.length > 0) {
      const summary = data.candidates[0].content.parts[0].text;
      summarizedText = summary;
    } else {
      summarizedText = "요약 결과를 가져오지 못했습니다.";
    }
  } catch (e) {
    console.error(e);
    summarizedText = "요약 중 오류가 발생했습니다.";
  }
}


  function showBubbleText(text) {
  bubbleText.html(text);
  bubbleText.show();

  let utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

async function getWeather() {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric&lang=kr`;

  try {
    let response = await fetch(url);
    let data = await response.json();
    temperature = data.main.temp.toFixed(1); 
  } catch (e) {
    console.error("날씨 정보를 가져오는 중 오류 발생:", e);
    temperature = "정보 없음";
  }
}

/*
function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'ko-KR'; // 한국어 인식
  recognition.continuous = true; // 계속 듣기
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    const last = event.results.length - 1;
    const transcript = event.results[last][0].transcript.trim();
    console.log('음성 인식 결과:', transcript);

    // "티보야" 라고 하면 페이지 이동
    if (transcript.includes("이보야")|| transcript.includes("티보야")) {
      speechSynthesis.cancel();
      TIVO_Listen();
    }
  };

  recognition.onerror = function(event) {
    console.error('음성 인식 오류:', event.error);
  };

  recognition.onend = function() {
    console.log('음성 인식이 종료됨, 다시 시작!');
    recognition.start(); // 끊겨도 자동 재시작
  };

  recognition.start();
}*/

function TIVO_Main(){
  
  background('#222428');
  let ctx = drawingContext;
  t += 0.02;
  
  
  btn1.mousePressed(() => {
  state = 1; // TIVO_Listen으로 전환
  speechRecognition.start();
});
  
  if (popupVisible) {
    let ctx = drawingContext; 
    
    ctx.filter = 'blur(50px)';  
    
    fill(0, 127);   // 반투명 검은색
    noStroke();
    rect(0, 0, width, height);
    
    ctx.filter = 'none';  
  }

  // Blur 적용
  ctx.filter = 'blur(250px)';

  //  오른쪽 원 Gradient
  let leftCenterX = 450 + sin(t * 1.1) * 60;
  let leftCenterY = 400 + cos(t * 0.9) * 50;

  let rightCenterX = 1584 + cos(t * 1.5) * 60;
  let rightCenterY = 423 + sin(t * 1.3) * 50;
  ctx.filter = 'blur(200px)';

  
  let gradientRight = ctx.createRadialGradient(
    rightCenterX, rightCenterY, 0, rightCenterX, rightCenterY, 500.5
  );
  gradientRight.addColorStop(0.2, '#FAA354BF');
  gradientRight.addColorStop(0.7, '#FFF8BDB7');
  gradientRight.addColorStop(0.9, '#EFC4FFB5');

  ctx.fillStyle = gradientRight;
  ctx.beginPath();
  ctx.ellipse(rightCenterX, rightCenterY + 200, 255, 389, 0, 0, TWO_PI);
  ctx.fill();
  
  let gradientLeft = ctx.createRadialGradient(
    leftCenterX, leftCenterY, 0, leftCenterX, leftCenterY, 315
  );
  gradientLeft.addColorStop(0.2, '#F68F32');
  gradientLeft.addColorStop(0.7, '#FFF8BD');
  gradientLeft.addColorStop(0.9, '#E8ADFFB5');

  ctx.fillStyle = gradientLeft;
  ctx.beginPath();
  ctx.ellipse(leftCenterX - 200, leftCenterY - 100, 200, 215, 0, 0, TWO_PI);
  ctx.fill();

  ctx.filter = 'none';

  
  image(logoImg, 80, 56, 223, 93.96);
  image(searchImg, 103, 374, 45,46);
  image(homeImg, 103, 520, 45, 50);
  image(backImg, 103, 680,44,36.5);
  
  
  //오른쪽 기능
  now = new Date();
  year = now.getFullYear();
  month = now.getMonth() + 1;
  day = now.getDate();
  hour = now.getHours();
  minute = now.getMinutes();

  textAlign(RIGHT, TOP);
 fill(255);
  textSize(120);
  textAlign(RIGHT, TOP);
 

  textFont('Pretendard-Bold');
  textSize(120);
  text(`${hour}:${nf(minute, 2)}`, 1840, 190);

  textSize(40);
  text(`${year}.${month}.${day}`, 1830, 320);
  text(`${temperature}°C`, 1830, 380);

  textSize(30);
  text('오늘 이런 건 어때요?', 1830, 500);

  textFont('Pretendard-Medium');
  textSize(35);
  for (let i = 0; i < quests.length; i++) {
    text(quests[i], 1835, 560 + i * 50);
  }
 
  
  
  
  
  
  
  
  
}

function TIVO_setup(){
    
    
   pdfInput = createFileInput(handleFile);
    pdfInput.attribute("accept", ".pdf");
    pdfInput.style("opacity", "0");
    pdfInput.style("position", "absolute");
    pdfInput.position(0,0);
    pdfInput.size(width,100);
    
  const canvasElem = document.querySelector('canvas');

  // overlayDiv 생성 및 스타일 지정
  overlayDiv = createDiv('');
  overlayDiv.style('position', 'absolute'); // fixed → 캔버스 기준으로 위치 지정하려면 absolute
  overlayDiv.position(0, 0);  // p5의 메서드
overlayDiv.style('width', width + 'px');
overlayDiv.style('height', height + 'px');
  overlayDiv.style('background', 'rgba(0, 0, 0, 0.7)');
  overlayDiv.style('backdrop-filter', 'blur(10px)');
  overlayDiv.style('-webkit-backdrop-filter', 'blur(10px)');
  overlayDiv.style('z-index', '10000');
  overlayDiv.hide();
    
   
    
    
  // 말풍선 이미지 생성 (p5.Element)
talkBubbleImg = createImg('talk2.png', 'talk bubble image');
talkBubbleImg.parent(overlayDiv);
talkBubbleImg.style('position', 'absolute');
talkBubbleImg.style('top', '330px');
talkBubbleImg.style('left', '178px');
talkBubbleImg.style('width', '1565px');
talkBubbleImg.style('height', '420.45px');
talkBubbleImg.hide();

// 말풍선 안 텍스트 설정
bubbleText = createDiv('');
bubbleText.parent(overlayDiv);
bubbleText.style('position', 'absolute');

// 말풍선 안의 정중앙 위치 계산
let bubbleLeft = 178;
let bubbleTop = 330;
let bubbleWidth = 1565;
let bubbleHeight = 420.45;

// 중앙 위치 계산 (중심점에서 padding 고려해 미세 조정 가능)
let centerX = bubbleLeft + bubbleWidth / 2;
let centerY = bubbleTop + bubbleHeight / 2.3;

bubbleText.style('left', `${centerX}px`);
bubbleText.style('top', `${centerY}px`);
bubbleText.style('transform', 'translate(-50%, -50%)');

// 스타일
bubbleText.style('width', '1500px');
bubbleText.style('height', 'auto');
bubbleText.style('font-size', '36px');
bubbleText.style('color', '#222222');
bubbleText.style('line-height', '1.5');
bubbleText.style('text-align', 'center');
bubbleText.style('font-family', 'Pretendard, sans-serif');
bubbleText.style('background', 'transparent');
bubbleText.style('padding', '30px');
bubbleText.hide();
    
    
btn1 = createButton('<div style="display: flex; flex-direction: column; align-items: center;"> <img src="talkpic.png" style="width: 226px; height: auto; margin-bottom: 20px;" /> <div style="font-size: 30px; font-weight: bold; color: white;">TIVO 만나러 가기</div>  <div style="font-size: 20px; color: #E3E3E3; text-align: center; margin-top: 16px;"> 궁금한 게 있거나 심심할 땐<br>티보를 불러보세요 </div> </div>');
btn1.position(251, 290);
btn1.size(353, 557);
// 배경 그라디언트 적용 
btn1.style('background', 'linear-gradient(135deg, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.3) 30%)');
// 테두리 (Stroke) 적용
btn1.style('border', '3px solid rgba(255,255,255,0.3)');
btn1.style('border-radius', '15px');
btn1.style('background-clip', 'padding-box');
// 라운드 처리
btn1.style('border-radius', '30px');
// 배경 블러 효과
btn1.style('backdrop-filter', 'blur(22px)');
btn1.style('-webkit-backdrop-filter', 'blur(22px)'); 
addHoverEffect(btn1);
    
btn2 = createButton(`<div style="display: flex; flex-direction: column; align-items: center;">
    <img src="Idea.png" style="width: 227px; height: auto; margin-bottom: 20px;" />
    <div style="font-size: 30px; font-weight: bold; color: white;">TIVO와 기억꺼내보기</div><div style="font-size: 20px; color: #E3E3E3; text-align: center; margin-top: 16px;">하루하루 기억을 꺼내보는 것을<br>티보랑 연습해보세요.</div> </div>`);
btn2.position(637, 290);
btn2.size(353, 557);
btn2.style('background', 'linear-gradient(135deg, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.3) 30%)');
btn2.style('border', '3px solid rgba(255,255,255,0.3)');
btn2.style('border-radius', '15px');
btn2.style('background-clip', 'padding-box');
btn2.style('border-radius', '30px');
btn2.style('backdrop-filter', 'blur(22px)');
btn2.style('-webkit-backdrop-filter', 'blur(22px)');
addHoverEffect(btn2);

btn3 = createButton(`
  <div style="display: flex; flex-direction: column; align-items: center;">
    <img src="call.png" style="width: 226px; height: auto; margin-bottom: 20px;" />
    <div style="font-size: 30px; font-weight: bold; color: white;">영상통화하기</div>
    <div style="font-size: 20px; color: #E3E3E3; text-align: center; margin-top: 16px;">
      가족과 얼굴 보며<br>이야기 나눌 수 있어요
    </div>
  </div>
`);
btn3.position(1022, 290);
btn3.size(353, 557);
btn3.style('background', 'linear-gradient(135deg, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.3) 30%)');
btn3.style('border', '3px solid rgba(255,255,255,0.3)');
btn3.style('border-radius', '30px');
btn3.style('background-clip', 'padding-box');
btn3.style('backdrop-filter', 'blur(22px)');
btn3.style('-webkit-backdrop-filter', 'blur(22px)');
addHoverEffect(btn3);
    

// 원형 버튼 생성
  circleBtn = createButton(`
    <img src="user.png" style="width: 80px; height: 80px;" />`);
  circleBtn.position(1557, 747);
  circleBtn.size(202, 202);
// 배경: 대각선 방향 그라디언트
  circleBtn.style('background', 'linear-gradient(135deg, #ff9630 90%, #D59052 10%)');
  circleBtn.style('border', 'none');
  circleBtn.style('border-radius', '50%');

  // 효과 설정 (Figma 기준으로 CSS 변환)
  circleBtn.style('box-shadow',
    `0px 7px 15px rgba(0, 0, 0, 0.25),/* Drop Shadow */ inset 3px 4px 4px rgba(255, 255, 255, 0.45),/* Inner Shadow 1 */ inset -4px -4px 19px rgba(0, 0, 0, 1)/* Inner Shadow 2 */`);

  // 호버 효과 
  circleBtn.style('transition', 'transform 0.2s ease, box-shadow 0.2s ease');
  circleBtn.elt.addEventListener('mouseover', () => {
    circleBtn.style('transform', 'scale(1.05)');
  });
  circleBtn.elt.addEventListener('mouseout', () => {
    circleBtn.style('transform', 'scale(1)');
  });
   
    circleBtn.mouseClicked(() => {
  popupVisible = !popupVisible;

  if (popupVisible) {
    isInPopupMode = true;

    try {
      speechRecognition.stop();
      console.log("🎤 음성 인식 중지됨");
    } catch (e) {
      console.warn("음성 인식 중지 중 오류", e);
    }

    overlayDiv.show();
    talkBubbleImg.show();
    bubbleText.html(summarizedText || "안녕하세요! 오늘 상태를 정리해드릴게요.");
    bubbleText.show();
    circleBtn.style("z-index", "10001");

    // ✅ 브라우저 TTS는 제거, 구글 TTS 함수만 사용
    speakText(summarizedText || "안녕하세요! 오늘 상태를 정리해드릴게요.");

  } else {
    isInPopupMode = false;

    /* 여기도 발표를 위해 주석처리 했습니다.
    try {
      speechRecognition.start();
      console.log("🎤 음성 인식 다시 시작됨");
    } catch (e) {
      console.warn("음성 인식 시작 중 오류", e);
    }
  */ 
    bubbleText.hide();
    overlayDiv.hide();
    talkBubbleImg.hide();
    circleBtn.style("z-index", "auto");
    speechSynthesis.cancel(); // 여긴 유지 가능
  }
});



   
    
    
    
    //오른쪽 글씨들 기능
  generateResponse01("혼자 사는 치매 환자에게 줄 퀘스트 중 가장 추천하는 것 두 개만 알려줘. 딱 할 퀘스트만 말하고 다른 이유나 부가적인 설명과 *은 절대로 말하지마. 또한 한 퀘스트 당 띄어쓰기 포함 20글자 이하로 구성되게 추천해줘. 단, 약 챙겨먹는 다는 퀘스트는 반드시 제거해줘");
    initialized = false;
}

function TIVO_Listen() {
  background('#222428');
  drawAnimatedCircles();
  image(tivo_listen, 822, 240, 260, 260);
   
  
  
  fill(222, 222, 223);
  textAlign(CENTER, CENTER);
  textSize(50);
  textFont('Pretendard-Semibold');
  text("귀 기울이고 있어요.", width / 2 + 7, height / 2 + 30);
  text("편하게 말씀해주세요...", width / 2 + 7, height / 2 + 100);

  fill(180);
  textSize(30);
  textFont('Pretendard-Medium');
  text("“오늘 할 일 알려줘”\n“나는 자연인이다 틀어줘”", width / 2, height / 2 + 200);

  if (hasSpoken && textBoxText.trim() !== "") {
  drawUserSpeechBubble(textBoxText);
  }
}

function drawAnimatedCircles() {
  circles.forEach(c => {
    let t = myFrameCount * c.speed + c.offset;
    let animX = c.baseX + sin(t + c.angleOffset) * c.ampX;
    let animY = c.baseY + cos(t + c.angleOffset) * c.ampY;

    drawingContext.filter = 'blur(20px)';
    noStroke();

    let cColor = color(c.color);
    cColor.setAlpha(255 * c.alpha);
    fill(cColor);

    ellipse(animX, animY, c.size, c.size);
    drawingContext.filter = 'none';
  });

  myFrameCount++;
}

function drawUserSpeechBubble(textContent) {
  let paddingX = 40;
  let paddingY = 20;
  let radius = 12;
  let rightMargin = 80;
  let topMargin = 60;
  let maxBoxWidth = 700;

  textSize(30);
  textFont('Pretendard-Medium');
  textAlign(LEFT, TOP);
  textLeading(45);

  // 줄바꿈 기준으로 나눔
  let wrappedText = wrapText(textContent, maxBoxWidth - paddingX * 2);
  let lines = wrappedText.length;
  let lineHeight = textAscent() + textDescent() + 15;
  let boxH = lines * lineHeight + paddingY * 2;

  // 실제 너비 계산
  let widestLine = Math.max(...wrappedText.map(line => textWidth(line)));
  let boxW = constrain(widestLine + paddingX * 2, 200, maxBoxWidth);

  let x = width - rightMargin - boxW;
  let y = topMargin;

  drawGradientRect(x, y, boxW, boxH, radius);

  fill(255);
  for (let i = 0; i < lines; i++) {
    text(wrappedText[i], x + paddingX, y + paddingY + i * lineHeight+10);
  }
}

function TIVO_Speak() {
  background('#222428');
   animateBody();     // 로봇 몸통 애니메이션
  animateGoggles(); 
 
  blinkTimer--;
  if (blinkTimer <= 0) {
    // 한 번 감겼으면 다시 뜨게 설정
    if (targetEyeH === 40.21) {
      targetEyeH = 0;        // 감기
      blinkTimer = 8;        // 감긴 상태 유지 프레임 수
    } else {
      targetEyeH = 40.21;    // 뜨기
      blinkTimer = int(random(40, 90)); // 👉 다음 깜빡임까지 대기 시간
    }
  }

  eyeH = lerp(eyeH, targetEyeH, 0.2);

  drawRotatedEye(915, 462.11, 10.49, eyeH, -4.35);    // 왼쪽
  drawRotatedEye(972.53, 457.73, 10.49, eyeH, -4.35); // 오른쪽
  

  if (geminiResponseText.trim() !== "") {
  let paddingX = 40;
  let paddingY = 20;
  let radius = 12;
  let maxWidth = 1564;

  textSize(40);
  textFont('sans-serif');
  textAlign(CENTER, CENTER);
  textLeading(45);

  let boxW = maxWidth + paddingX * 2;

  let lines = estimateLines(geminiResponseText, maxWidth);
let lineHeight = 60; // 원래 45보다 더 넉넉하게
let boxH = lines * lineHeight + paddingY * 3;
  let x = width / 2 - boxW / 2;
  let y = 700;


  drawGradientRect(x, y, boxW, boxH, radius);


  fill('#707174');
    noStroke();
  triangle(
    width / 2 - 20, y,
    width / 2 + 20, y,
    width / 2, y - 25
  );

  fill(255);
  textAlign(CENTER, CENTER);
  text(geminiResponseText, x + paddingX, y + paddingY, maxWidth, boxH - paddingY * 2);
}
  if (!hasSpoken || textBoxText.trim() === "") return;
  drawUserSpeechBubble(textBoxText);
}

function drawRotatedEye(x, y, w, h, angle) {
  push();
  translate(x, y);
  rotate(radians(angle));
  rectMode(CENTER);
  noStroke();
  fill(255);

  rect(0, 0, w, h, 4); 
  pop();
}

function animateBody() {
  bodyNoiseOffset += 0.02;

  // 전역 변수에 저장
  bodyScaleVal = map(noise(bodyNoiseOffset), 0, 1, 0.9, 1.42);

  push();
  translate(772.58 + 345.66 / 2, 308.7 + 327.93 / 2);
  scale(bodyScaleVal);
  imageMode(CENTER);
  image(tivo_speak, 0, 0, 345.66, 327.93);
  pop();
}

function animateGoggles() {
  // 눈 상하 흔들림
  eyeOffsetY += 0.1 * eyeDir;
  if (eyeOffsetY > 1.5 || eyeOffsetY < -1.5) eyeDir *= -1;

  // 눈 커졌다 작아졌다 (sin 애니메이션)
  eyeScaleOffset += 0.05; // 속도 조절
  let scaleAmount = 1 + sin(eyeScaleOffset) * 0.05; // 1 ± 0.05 → 95% ~ 105%

  push();
  translate(847 + 198.08 / 2, (408 + eyeOffsetY) + 113.66 / 2);
  scale(bodyScaleVal * scaleAmount); // ← 여기만 변경됨

  imageMode(CENTER);
  image(tivo_eyes, 0, 0, 198.08, 113.66);
  imageMode(CORNER);
  pop();
}




// 텍스트를 maxWidth 기준으로 자르고 줄 수를 반환하는 함수
function estimateLines(txt, maxWidth) {
  let lines = 1;
  let line = '';

  for (let i = 0; i < txt.length; i++) {
    let testLine = line + txt[i];
    if (textWidth(testLine) > maxWidth && line !== '') {
      lines++;
      line = txt[i];
    } else {
      line = testLine;
    }
  }

  return lines;
}

function drawGradientRect(x, y, w, h, r) {
  let pg = createGraphics(w, h);
  for (let i = 0; i < h; i++) {
    let inter = map(i, 0, h, 0, 1);
    let c = lerpColor(color('#77787B'), color('#424447'), inter);
    pg.stroke(c);
    pg.line(0, i, w, i);
  }

  let mask = createGraphics(w, h);
  mask.noStroke();
  mask.fill(255);
  mask.rect(0, 0, w, h, r);

  let pgImage = pg.get();
  pgImage.mask(mask.get());

  image(pgImage, x, y);
}


async function speechResult(event) {
  
  
  if (isInPopupMode|| state === 2) return;  // ✅ 팝업 모드일 땐 무시

  const transcript = event.results[event.results.length - 1][0].transcript.trim();
  console.log("🎙️ 인식된 말:", transcript);
  
  
  const results = event.results;
  const lastResult = results[results.length - 1];

  // 마지막 인식된 결과만 사용
  const lastTranscript = lastResult[0].transcript.trim();
  if (lastTranscript !== "") {
   
    
    
    
    if (
  lastTranscript.includes("종료할게") || 
  lastTranscript.includes("종료할게요") || 
  lastTranscript.includes("그만할게") || 
  lastTranscript.includes("그만할게요")
) {
  if (recognition){
    recognition.stop(); 
     speechRecognition.stop();
  } 
      

  speechSynthesis.cancel();            
  let byeText = "";
  speakText(byeText);

  // 상태 리셋은 음성 출력 끝날 때까지 기다렸다가 실행
  setTimeout(() => {
    state = 0;
    textBoxText = "";
    geminiResponseText = "";
    redraw();
    TIVO_Main();
  }, 2500);

  return;
}
   if (state == 2) {
      // 👇 이전 사용자 말/응답 모두 지움
      textBoxText = "";
      geminiResponseText = "";
      redraw();
    }

    state = 1;              // 듣기 모드로 전환
    textBoxText = lastTranscript;
    hasSpoken = true;
    redraw();

    // 기존 타이머 취소하고 새로 설정
    if (speechTimeout) clearTimeout(speechTimeout);

    if (lastResult.isFinal) {
      speechTimeout = setTimeout(async () => {
  state = 2;
  geminiResponseText = "로딩 중...";
  redraw(); // 로딩 화면

  let response = await generateResponse(textBoxText);
  geminiResponseText = response.trim();
  speechHistory.push({ role: "user", content: textBoxText });
  speechHistory.push({ role: "model", content: geminiResponseText });

  redraw(); // 최종 응답 표시
  speakText(geminiResponseText);
}, 2000);
    }
  }
}

function speechError(event) {
  console.log("음성 인식 오류:", event.error);
}

function speechEnd() {
  console.log("음성 인식 종료됨");
  // 자동 재시작 없이 종료 유지
}

async function generateResponse(question) {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

 let systemInstruction = 
  "너는 치매환자 노인 김수담(님이라 붙어서 말해줘)과 대화해주는 친절하고 똑똑한 음성 비서 TIVO야. 사용자의 요청에 3줄 이내로 간단히 답하고, 쓸데없는 설명은 생략해. 존댓말 유지하고, 딱 필요한 정보와 위로와 도움이 되는 말만 말해줘.이모티콘은 쓰지말아줘.";

  let requestBody = {
  contents: [
    { role: "user", parts: [{ text: systemInstruction }] },
    ...speechHistory.map(entry => ({
      role: entry.role,
      parts: [{ text: entry.content }]
    })),
    { role: "user", parts: [{ text: question }] }
  ],
  generationConfig: {
    maxOutputTokens: 512
  }
};
  
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errText = await response.text();
      throw new Error(`API 요청 실패: ${response.status} ${errText}`);
    }

    let data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "응답이 없습니다.";
    }
  } catch (error) {
    console.error("제미나이 API 호출 에러:", error);
    return "서버 오류가 발생했습니다.";
  }
}




async function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = () => {
    isSpeaking = false;
  };
 
  
  const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const requestBody = {
    audioConfig: {
      audioEncoding: "MP3",
      effectsProfileId: ["telephony-class-application"],
      pitch: 2,
      speakingRate: 1.30
    },
    input: {
      text: text
    },
    voice: {
      languageCode: "ko-KR",
      name: "ko-KR-Neural2-B"
    }
  };

  try {
    const response = await fetch(ttsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.audioContent) {
      const audioData = "data:audio/mp3;base64," + data.audioContent;
      const audio = new Audio(audioData);

      audio.onended = () => {
        if(state == 0){
          state =0;
        }else if(state ==2){
          console.log("🗣️ AI 말 끝남 → 다시 듣기 모드로 전환");
          state = 1;
          if (recognition) recognition.start();
        }
        
      };

      audio.play();
    } else {
      console.log("오디오 데이터가 없습니다.");
      isSpeaking = false;
    }
  } catch (error) {
    console.error("TTS 오류:", error);
    isSpeaking = false;
  }
}



function wrapText(txt, maxWidth) {
  let words = txt.split(' ');
  let lines = [];
  let line = '';

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    if (textWidth(testLine) > maxWidth && line !== '') {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }

  lines.push(line.trim());
  return lines;
}


function Phone_main(){
  
  
   bgLayer = createGraphics(width, height);
  
   // 스마트폰 화면 중앙에 그리기
  let phoneWidth = 375;
  let phoneHeight = 812;
  let phoneX = 1920 / 2;
  let phoneY = 1080 / 2;
  
  // 상태바 이미지 위치 계산 (폰의 상단 기준)
  let stateBarX = phoneX - phoneWidth / 2;
  let stateBarY = phoneY - phoneHeight / 2;
  imageMode(CENTER);
  //여기 아래에 있는건 폰 목업 이미지
  image(PhoneFrame,phoneX, phoneY, phoneWidth*1.1, phoneHeight*1.06);
  fill(0,0,0,130);
  rect(0,0,1920,1080);
  
  
  fill(0);
  rectMode(CENTER);
  imageMode(CORNER); // 이미지 기준은 좌상단
  textAlign(LEFT, BASELINE) //나중에 
  


  
  noStroke();
  rect(phoneX, phoneY, phoneWidth, phoneHeight,60);
  fill(255);
  
     
  noStroke();
  fill('#2B2720');
  rect(phoneX, phoneY, 366, 823, 45);
  
  
  
  
  bgLayer.clear();

// 애니메이션을 위한 시간 변수 t 사용
let x1 = width / 2 - 20 + sin(t) * 6;   // ← 왼쪽 위 원 (좌우 진동)
let y1 = height / 2 - 260 + cos(t) * 12; // ↑ 아래위 진동

let x2 = width / 2 + 20 + cos(t + PI) * 10;  // → 오른쪽 아래 원 (조금 다른 위상)
let y2 = height / 2 + 220 + sin(t + PI / 2) * 15;

drawRadialGradientWithBlur(bgLayer, x1, y1, 180, 100);
drawRadialGradientWithBlur(bgLayer, x2, y2, 200, 110);

image(bgLayer, 0, 0);

// 시간값을 조금씩 증가시켜 애니메이션 지속
t += 0.1;
  // 이미지 그리기 (375×44 이미지 기준)
  image(PhoneState, stateBarX, stateBarY+10, 375, 44);
  
  
  fill(255);
  textSize(20);
  textFont('Pretendard-Medium');
  text("안녕하세요", stateBarX+28, stateBarY+112);
  fill('#F68F32');
  text("임승진 보호자님", stateBarX+120, stateBarY+112);
  fill(255);
  textSize(24);
  text("오늘 기분은 어떠신가요?", stateBarX+28, stateBarY+145);

  rectMode(CORNER);
  fill(255, 255, 255, 100); //투명도 넣음
  stroke(0);
  strokeWeight(1);
  
  rectMode(CORNER);
fill(255, 255, 255, 100); // 투명도
strokeWeight(1);

// 첫 번째 박스
if ((mouseX > stateBarX+26) && (mouseX < stateBarX+26+149) &&
    (mouseY > stateBarY+180) && (mouseY < stateBarY+180+149)) {
  stroke(255); // 마우스 올라감
} else {
  stroke(0);
}
rect(stateBarX+26, stateBarY+180, 149, 149, 12);

// 두 번째 박스
if ((mouseX > stateBarX+26) && (mouseX < stateBarX+26+149) &&
    (mouseY > stateBarY+354) && (mouseY < stateBarY+354+149)) {
  stroke(255);
} else {
  stroke(0);
}
rect(stateBarX+26, stateBarY+354, 149, 149, 12);

// 세 번째 박스
if ((mouseX > stateBarX+26) && (mouseX < stateBarX+26+149) &&
    (mouseY > stateBarY+528) && (mouseY < stateBarY+528+149)) {
  stroke(255);
} else {
  stroke(0);
}
rect(stateBarX+26, stateBarY+528, 149, 149, 12);

// 네 번째 박스
if ((mouseX > stateBarX+200) && (mouseX < stateBarX+200+149) &&
    (mouseY > stateBarY+528) && (mouseY < stateBarY+528+149)) {
  stroke(255);
} else {
  stroke(0);
}
rect(stateBarX+200, stateBarY+528, 149, 149, 12);

  
  
  
  noStroke();
  textAlign(CENTER, CENTER); // 다시 원래대로 바꿀 것
  imageMode(CENTER);
  fill(225);
  textSize(16);
  textFont('Pretendard-Semi-bold');
  text("사진 공유", stateBarX+100, stateBarY+290);
  image(PhoneCamera,stateBarX+102, stateBarY+290-40, 48,45);
  
  text("실시간 통화", stateBarX+100, stateBarY+290+174);
  image(PhoneCall,stateBarX+100, stateBarY+290+174-45, 45,45);
  
  text("실시간 확인", stateBarX+100, stateBarY+290+174+174);
  image(PhoneCCTV,stateBarX+100, stateBarY+290+174+174-40, 60,42);
  
  text("계정 정보", stateBarX+100+174, stateBarY+290+174+174);
  image(PhoneAccount,stateBarX+100+174, stateBarY+290+174+174-45, 45,45 );
  
  //히스토리
  //fill('#F68F32');
  /*fill(0,0,0,0);
  stroke(0);
  rect(stateBarX+199,stateBarY+181,145,320,12);
  if ((mouseX >stateBarX+199 ) && (mouseX < stateBarX+199+145) &&
    (mouseY > stateBarY+181) && (mouseY < stateBarY+181+320)) {
    stroke(255);
  }*/
  
  imageMode(CORNER)
   // 히스토리 박스
  if ((mouseX > stateBarX+200) && (mouseX < stateBarX+200+149) &&
      (mouseY > stateBarY+180) && (mouseY < stateBarY+180+149+149+25)) {
    stroke(255); // 마우스 올라감
  } else {
    stroke(0);
  }
  fill(0,0,0,0);
  rect(stateBarX+199, stateBarY+181, 145, 149+149+25, 12);
  image(PhoneHistory,stateBarX+193, stateBarY+175, 157,335);
  
  fill(255);
  noStroke();
  text("히스토리", stateBarX+100+174, stateBarY+240);
  textSize(13);
  textFont('Pretendard-Light');
  text("지금까지 나눴던", stateBarX+100+174, stateBarY+275);
  text("대화를 볼 수 있어요", stateBarX+100+174, stateBarY+292);
  
  fill(200);
  textSize(13);
  textFont('Pretendard-Regular');
  text("로그아웃", stateBarX+166, stateBarY+730);
  
  
  
}

function drawRadialGradientWithBlur(pg, x, y, w, h) {
  let steps = 100;

  for (let i = steps; i > 0; i--) {
    let t = i / steps;
    let interColor;

    if (t > 0.73) {
      interColor = lerpColor(color('#FFF5D9'), color('#FE9571'), map(t, 0.73, 1.0, 0, 1));
    } else if (t > 0.45) {
      interColor = lerpColor(color('#16130E'), color('#FFF5D9'), map(t, 0.45, 0.73, 0, 1));
    } else {
      interColor = color('#EEAD4E');
    }

    pg.noStroke();
    pg.fill(interColor);
    pg.ellipse(x, y, w * t, h * t);
  }

  // 블러 필터 적용
  pg.filter(BLUR, 45); // 숫자가 높을수록 더 흐려짐
}

function Phone_history(){
  imageMode(CENTER);
  //여기 아래에 있는건 폰 목업 이미지
  image(PhoneFrame,phoneX, phoneY, phoneWidth*1.1, phoneHeight*1.06);
  fill(0,0,0,130);
  rect(0,0,1920,1080);
  imageMode(CORNER);
  image(PhoneState, stateBarX, stateBarY+10, 375, 44);
  
  displayChatHistory();
  if ((mouseX > 0) && (mouseX < 150) &&
    (mouseY > 0 ) && (mouseY < 200)) {
    state =0;
    } 
}

function displayChatHistory() {
  
 

  // 날짜 표시 영역
  let dateStr = `${year}년 ${month}월 ${day}일`;
  textSize(12);
  textAlign(CENTER, CENTER);

  let marginTop = phoneY - phoneHeight / 2 + 100; // 폰 상단에서 20px 아래
  let lineY = marginTop; // 선 y 위치

  // 왼쪽 선
  stroke(200);
  strokeWeight(1);
  line(phoneX - phoneWidth / 2 + 26, lineY, phoneX - textWidth(dateStr)/2 - 10, lineY);

  // 오른쪽 선
  line(phoneX + textWidth(dateStr)/2 + 10, lineY, phoneX + phoneWidth / 2 - 26, lineY);

  noStroke();
  fill(200);
  text(dateStr, phoneX, lineY);

  // ✏️ 텍스트 기본 설정
  textSize(16);
  textAlign(LEFT, TOP);
  textLeading(24);

  let paddingX = 30;
  let maxTextWidth = phoneWidth - 100;
  let startY = marginTop + 30; // 날짜에서 30px 아래부터 대화 시작
  let y = startY;

  for (let i = 0; i < speechHistory.length; i++) {
    let entry = speechHistory[i];
    let txt = entry.content;

    let wrappedText = wrapText(txt, maxTextWidth);
    let bubbleHeight = wrappedText.length * 24 + 20;

    let bubbleWidth = 0;
    for (let line of wrappedText) {
      bubbleWidth = max(bubbleWidth, textWidth(line));
    }
    bubbleWidth += 20;

    let bubbleX;
    if (entry.role === "user") {
      bubbleX = phoneX + phoneWidth / 2 - bubbleWidth - paddingX;
      fill('#F68F32');
    } else {
      bubbleX = phoneX - phoneWidth / 2 + paddingX;
      fill(240);
    }

    rect(bubbleX, y, bubbleWidth, bubbleHeight, 10);

    fill(0);
    for (let j = 0; j < wrappedText.length; j++) {
      text(wrappedText[j], bubbleX + 10, y + 13 + j * 24);
    }

    y += bubbleHeight + 20;
  }
}
    

// 텍스트 줄바꿈 처리 함수
function wrapText(txt, maxW) {
  let words = txt.split(' ');
  let lines = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    let testLine = currentLine + words[i] + ' ';
    if (textWidth(testLine) > maxW && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = words[i] + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}
