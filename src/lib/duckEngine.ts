// Keyword-based Socratic question engine for the duck therapist

interface KeywordRule {
  keywords: string[];
  questions: string[];
}

const rules: KeywordRule[] = [
  {
    keywords: ["변수", "variable", "var", "let", "const"],
    questions: [
      "끄덕끄덕... 그래서 그 변수는 어디서 초기화했나요? 🤔",
      "꽥! 혹시 그 변수의 스코프를 확인해 보셨나요?",
      "음음... 그 변수가 예상한 타입이 맞는지 확인해 보셨어요?",
    ],
  },
  {
    keywords: ["null", "undefined", "NaN", "에러", "error"],
    questions: [
      "끄덕끄덕... 그 값이 null이 되는 경로를 추적해 보셨나요?",
      "꽥꽥! 혹시 그 값이 비동기로 나중에 설정되는 건 아닌가요?",
      "음... 에러 메시지를 천천히 다시 읽어보시겠어요? 단서가 숨어있을 수 있어요.",
    ],
  },
  {
    keywords: ["함수", "function", "호출", "call", "return"],
    questions: [
      "끄덕끄덕... 그 함수가 실제로 호출되고 있는 건 맞나요? console.log로 확인해 보셨어요?",
      "꽥! return 값이 예상대로인지 확인해 보셨나요?",
      "혹시 그 함수에 전달되는 인자가 올바른지 한번 출력해 보시겠어요?",
    ],
  },
  {
    keywords: ["렌더", "render", "화면", "UI", "컴포넌트", "component"],
    questions: [
      "끄덕끄덕... state가 변경될 때 리렌더링이 제대로 트리거되고 있나요?",
      "꽥! 혹시 key prop을 빼먹은 건 아닌가요?",
      "음음... 조건부 렌더링 로직을 한번 다시 살펴보시겠어요?",
    ],
  },
  {
    keywords: ["API", "fetch", "요청", "request", "서버", "server", "응답", "response"],
    questions: [
      "끄덕끄덕... 네트워크 탭에서 실제 요청과 응답을 확인해 보셨나요?",
      "꽥! 혹시 CORS 문제는 아닌가요?",
      "음... 요청 URL과 파라미터가 올바른지 다시 확인해 보시겠어요?",
    ],
  },
  {
    keywords: ["상태", "state", "useState", "setState", "redux", "store"],
    questions: [
      "끄덕끄덕... state 업데이트가 비동기라는 걸 고려하셨나요?",
      "꽥꽥! 이전 state를 기반으로 업데이트해야 하는 건 아닌가요?",
      "혹시 state를 직접 변경(mutate)하고 있지는 않나요?",
    ],
  },
  {
    keywords: ["루프", "loop", "반복", "for", "while", "map", "무한"],
    questions: [
      "끄덕끄덕... 혹시 무한 루프에 빠진 건 아닌가요? 종료 조건을 확인해 보세요!",
      "꽥! 인덱스가 off-by-one 에러는 아닌지 확인해 보셨어요?",
      "음... 반복문 안에서 배열을 수정하고 있지는 않나요?",
    ],
  },
  {
    keywords: ["CSS", "스타일", "style", "레이아웃", "layout", "디자인"],
    questions: [
      "끄덕끄덕... 개발자 도구에서 실제 적용된 스타일을 확인해 보셨나요?",
      "꽥! z-index나 position 속성이 예상대로 설정되어 있나요?",
      "혹시 부모 요소의 overflow 속성 때문은 아닌가요?",
    ],
  },
  {
    keywords: ["비동기", "async", "await", "promise", "then", "callback"],
    questions: [
      "끄덕끄덕... await를 빼먹은 곳은 없나요?",
      "꽥꽥! Promise가 reject될 때의 에러 처리는 되어있나요?",
      "음... 비동기 작업의 실행 순서를 한번 정리해 보시겠어요?",
    ],
  },
  {
    keywords: ["타입", "type", "typescript", "interface", "타입스크립트"],
    questions: [
      "끄덕끄덕... 타입 정의와 실제 데이터 구조가 일치하나요?",
      "꽥! 혹시 타입 단언(as)으로 에러를 숨기고 있지는 않나요?",
      "음음... 제네릭 타입이 올바르게 추론되고 있는지 확인해 보세요.",
    ],
  },
];

const genericQuestions = [
  "끄덕끄덕... 그 부분을 저한테 처음부터 차근차근 설명해 주시겠어요?",
  "꽥! 혹시 '당연히 이건 맞겠지'라고 가정한 부분이 있나요?",
  "음음... 가장 마지막으로 정상 작동했을 때와 지금의 차이점은 뭔가요?",
  "끄덕끄덕... console.log를 중간중간 넣어서 흐름을 추적해 보셨나요?",
  "꽥꽥! 혹시 오타는 아닌가요? 변수 이름을 다시 한번 확인해 보세요!",
  "음... 잠깐 쉬었다 오시는 건 어떨까요? 가끔 쉬면 답이 보여요 🛁",
  "끄덕끄덕... 그 코드가 정확히 뭘 하고 있는지 한 줄씩 설명해 주시겠어요?",
  "꽥! Stack Overflow에서 비슷한 사례를 검색해 보셨나요?",
];

const followUpQuestions = [
  "그렇군요... 그래서 그 다음엔 어떤 일이 일어나나요?",
  "끄덕끄덕... 좀 더 자세히 말씀해 주시겠어요?",
  "꽥! 그 부분은 언제부터 그랬나요?",
  "음음... 혹시 다른 접근 방법을 시도해 보셨나요?",
  "끄덕끄덕... 에러 메시지가 정확히 뭐라고 나오나요?",
];

const completionMessages = [
  "🎉 꽥꽥! 답을 찾으신 것 같군요! 역시 설명하다 보면 답이 보이죠?",
  "🛁 훌륭해요! 오리 상담사로서 자랑스럽습니다. 꽥!",
  "✨ 끄덕끄덕... 당신은 훌륭한 디버거예요. 오늘의 상담은 성공적이었습니다!",
];

const prescriptions = [
  "처방: 하루에 console.log 3번, 식후 30분에 복용하세요.",
  "처방: 변수명을 소리내어 읽기, 1일 2회 권장합니다.",
  "처방: 코드 리뷰 전 러버덕에게 먼저 설명하기. 매일 1회.",
  "처방: 에러 메시지를 끝까지 읽기. 복용 횟수 제한 없음.",
  "처방: git diff를 보며 심호흡하기. 커밋 전 필수.",
  "처방: 15분 이상 막히면 산책하기. 오리도 같이 산책합니다.",
  "처방: '이건 절대 문제없어'라는 생각이 드는 코드부터 의심하기.",
  "처방: TypeScript strict 모드 켜기. 처음엔 아프지만 나중엔 편해요.",
];

export function generateDuckResponse(
  message: string,
  messageCount: number
): { response: string; isNodding: boolean; shouldQuack: boolean } {
  const lowerMessage = message.toLowerCase();

  // Check if user seems to have found the answer
  const solvedKeywords = ["찾았", "알겠", "해결", "됐다", "고쳤", "fixed", "solved", "got it", "found it", "감사"];
  if (solvedKeywords.some((k) => lowerMessage.includes(k))) {
    return {
      response: completionMessages[Math.floor(Math.random() * completionMessages.length)],
      isNodding: true,
      shouldQuack: true,
    };
  }

  // Match keywords
  const matchedRules = rules.filter((rule) =>
    rule.keywords.some((keyword) => lowerMessage.includes(keyword.toLowerCase()))
  );

  let response: string;

  if (matchedRules.length > 0) {
    const rule = matchedRules[Math.floor(Math.random() * matchedRules.length)];
    response = rule.questions[Math.floor(Math.random() * rule.questions.length)];
  } else if (messageCount > 0 && messageCount % 3 === 0) {
    response = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
  } else {
    response = genericQuestions[Math.floor(Math.random() * genericQuestions.length)];
  }

  return {
    response,
    isNodding: true,
    shouldQuack: Math.random() > 0.5,
  };
}

export function getRandomPrescription(): string {
  return prescriptions[Math.floor(Math.random() * prescriptions.length)];
}

export function generateSessionId(): string {
  return `DUCK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}
