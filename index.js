
const wheelImg = new Image();
wheelImg.src = './img/wheel.png'; 

let theWheel; 

wheelImg.onload = function() {
  console.log("이미지 로딩 성공 ✅");
  console.log(wheelImg); // 이미지 객체 직접 확인

  theWheel = new Winwheel({
    'numSegments'  : 6,
    'rotationAngle': -30, // 시계 반대 방향으로 30도
    'segments'     : [
        {'fillStyle' : '#7de6ef', 'text' : '5% 할인쿠폰'},
        {'fillStyle' : '#89f26e', 'text' : '스타벅스 커피'},
        {'fillStyle' : '#eae56f', 'text' : '10% 할인쿠폰'},
        {'fillStyle' : '#e7706f', 'text' : '15% 할인쿠폰'},
        {'fillStyle' : '#89f26e', 'text' : '한번 더'},
        {'fillStyle' : '#eae56f', 'text' : '3일 무료체험'}
    ],
    'animation' : {
        'type'     : 'spinToStop',
        'duration' : 5,
        'spins'    : 8,
        'callbackFinished' : function(indicatedSegment) {
            alert("당첨: " + indicatedSegment.text);
        }
    },
    'drawMode': 'image',
    'wheelImage': wheelImg
  });
  theWheel.wheelImage = wheelImg
  theWheel.draw();
};
// ❗ theWheel 선언 이후에 함수 정의!

let attempts = 3;

function spinWheel() {
  if (attempts <= 0) {
    alert('남은 기회가 없습니다.');
    return;
  }

  const spinBtn = document.getElementById("spinBtn");
  spinBtn.disabled = true; // ❌ 회전 중엔 누르지 못하게

  function getCurrentTimestamp() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  }


  function generateTimestampCode() {
    const time = Date.now().toString(36).toUpperCase();  // 밀리초 기준 타임스탬프
    const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${time}-${rand}`; // 예: 'LMN8G9-XF3'
  }

  function getCodeLabel(text) {
    if (text.includes("쿠폰")) return "쿠폰번호";
    if (text.includes("무료체험")) return "코드";
    if (text.includes("커피")) return "기프티콘번호";
    return null; // 꽝, 다시돌리기 등은 제외
  }


  theWheel.stopAnimation(false);
  theWheel.rotationAngle = 0;

  const options = [
    { label: '5% 할인쿠폰',  chance: 30 },
    { label: '커피 기프티콘', chance: 10 },
    { label: '10% 할인쿠폰', chance: 20 },
    { label: '15% 할인쿠폰', chance: 5 },
    { label: '한번 더',  chance: 5 },
    { label: '3일 무료체험', chance: 30 }
  ];

  const rand = Math.random() * 100;
  let sum = 0, selectedIndex = 0;
  for (let i = 0; i < options.length; i++) {
    sum += options[i].chance;
    if (rand <= sum) {
      selectedIndex = i;
      break;
    }
  }

  // 항목 각도 계산
  const segmentAngle = 360 / options.length;

  // 랜덤 오차 범위 ±28도
  const randomOffset = (Math.random() * 56) - 28;

  // 선택된 항목의 중앙 + 랜덤 오차
  const stopAngle = (selectedIndex * segmentAngle) + (segmentAngle / 2) + randomOffset;

  const prizeImages = {
    "5% 할인쿠폰": "./img/5per-discount.png",
    "10% 할인쿠폰": "./img/10per-discount.png",
    "15% 할인쿠폰": "./img/15per-discount.png",
    "3일 무료체험": "./img/free-trial.png",
    "스타벅스 커피": "./img/coffee.png"
  };

  theWheel.animation = {
    type: 'spinToStop',
    duration: 5,
    spins: 8,
    stopAngle: stopAngle,
    callbackFinished: function(indicatedSegment) {

      const prizeText = indicatedSegment.text;
      const imagePath = prizeImages[prizeText] || "./img/default.png"; // 없으면 기본 이미지

      if (prizeText === "한번 더") {
        Swal.fire({
          title: '한번 더 돌려주세요',
          confirmButtonText: '닫기'
        });
      } else if (prizeText === "15% 할인쿠폰") {
        Swal.fire({
          title: '당첨!',
          text: `${prizeText}에 당첨되셨습니다 🎉`,
          imageUrl: imagePath,
          imageWidth: 200,
          confirmButtonText: '닫기',
          didOpen: () => {
            const colors = ['#bb0000', '#ffffff', '#00bb00', '#0000bb', '#f5a623', '#00ffff'];
            const duration = 500; // 0.5초
            const end = Date.now() + duration;

            let count = 0;
            const maxBursts = 20; // 몇 번만 딱 뿌리자

            (function burst() {
              confetti({
                particleCount: 50,
                spread: 90,
                origin: { x: Math.random(), y: Math.random() * 0.5 }
              });

              count++;
              if (count < maxBursts) {
                setTimeout(burst, 25); // 25ms 간격으로 반복 (총 20회면 약 0.5초)
              }
            })();
          }
        });
      } else if (prizeText === "10% 할인쿠폰") {
        Swal.fire({
          title: '당첨!',
          text: `${prizeText}에 당첨되셨습니다 🎉`,
          imageUrl: imagePath,
          imageWidth: 200,
          confirmButtonText: '닫기',
          didOpen: () => {
            confetti({
              particleCount: 100,
              angle: 60,
              spread: 55,
              origin: { x: 0 }
            });
            confetti({
              particleCount: 100,
              angle: 120,
              spread: 55,
              origin: { x: 1 }
            });
          }
        });
      } else {
        Swal.fire({
          title: '당첨!',
          text: `${prizeText}에 당첨되셨습니다 🎉`,
          imageUrl: imagePath,
          imageWidth: 200,
          confirmButtonText: '닫기',
          didOpen: () => {
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.6 }
            });
          }
        });
      }


      // 회전 끝나면 버튼 다시 활성화
      spinBtn.disabled = false;

      if (indicatedSegment.text === "한번 더") {
        // 기회 유지
      } else {
        attempts -= 1;

        const record = document.createElement("h4");
        const timestamp = getCurrentTimestamp();
        const codeLabel = getCodeLabel(indicatedSegment.text);
        let recordText = `${indicatedSegment.text} 당첨 (${timestamp})`;

        if (codeLabel) {
          const code = generateTimestampCode();
          recordText += ` [${codeLabel}: ${code}]`;
        }

        record.innerText = recordText;

        const log = document.querySelector(".log");
        log.appendChild(record);
      }

      const remain = document.getElementById("remaining_attempts");
      remain.innerText = `남은기회 ${attempts}번`;
    }
  };

  theWheel.startAnimation();

}

//////////////////// 룰렛 이후 팝업 
