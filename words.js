// 초등학교 저학년 영어 단어 데이터베이스
// 각 단어는 철자와 정답 뜻만 포함 (오답은 자동 생성)

const WORD_DATABASE = [
    // 동물 (Animals)
    { word: 'CAT', meaning: '고양이', category: 'animal' },
    { word: 'DOG', meaning: '개', category: 'animal' },
    { word: 'FISH', meaning: '물고기', category: 'animal' },
    { word: 'BIRD', meaning: '새', category: 'animal' },
    { word: 'FROG', meaning: '개구리', category: 'animal' },
    { word: 'BEAR', meaning: '곰', category: 'animal' },
    { word: 'DUCK', meaning: '오리', category: 'animal' },
    { word: 'PIG', meaning: '돼지', category: 'animal' },
    { word: 'COW', meaning: '소', category: 'animal' },
    { word: 'HEN', meaning: '암탉', category: 'animal' },
    { word: 'BEE', meaning: '벌', category: 'animal' },
    { word: 'ANT', meaning: '개미', category: 'animal' },
    { word: 'FOX', meaning: '여우', category: 'animal' },
    { word: 'LION', meaning: '사자', category: 'animal' },
    { word: 'TIGER', meaning: '호랑이', category: 'animal' },
    { word: 'MOUSE', meaning: '쥐', category: 'animal' },
    { word: 'RABBIT', meaning: '토끼', category: 'animal' },
    { word: 'HORSE', meaning: '말', category: 'animal' },
    { word: 'SHEEP', meaning: '양', category: 'animal' },
    { word: 'GOAT', meaning: '염소', category: 'animal' },

    // 자연 (Nature)
    { word: 'TREE', meaning: '나무', category: 'nature' },
    { word: 'STAR', meaning: '별', category: 'nature' },
    { word: 'MOON', meaning: '달', category: 'nature' },
    { word: 'SUN', meaning: '해', category: 'nature' },
    { word: 'RAIN', meaning: '비', category: 'nature' },
    { word: 'SNOW', meaning: '눈', category: 'nature' },
    { word: 'WIND', meaning: '바람', category: 'nature' },
    { word: 'CLOUD', meaning: '구름', category: 'nature' },
    { word: 'SKY', meaning: '하늘', category: 'nature' },
    { word: 'SEA', meaning: '바다', category: 'nature' },
    { word: 'RIVER', meaning: '강', category: 'nature' },
    { word: 'LAKE', meaning: '호수', category: 'nature' },
    { word: 'HILL', meaning: '언덕', category: 'nature' },
    { word: 'ROCK', meaning: '바위', category: 'nature' },
    { word: 'SAND', meaning: '모래', category: 'nature' },

    // 색깔 (Colors)
    { word: 'RED', meaning: '빨간색', category: 'color' },
    { word: 'BLUE', meaning: '파란색', category: 'color' },
    { word: 'GREEN', meaning: '초록색', category: 'color' },
    { word: 'YELLOW', meaning: '노란색', category: 'color' },
    { word: 'BLACK', meaning: '검은색', category: 'color' },
    { word: 'WHITE', meaning: '하얀색', category: 'color' },
    { word: 'PINK', meaning: '분홍색', category: 'color' },
    { word: 'BROWN', meaning: '갈색', category: 'color' },
    { word: 'GRAY', meaning: '회색', category: 'color' },
    { word: 'ORANGE', meaning: '주황색', category: 'color' },

    // 음식 (Food)
    { word: 'CAKE', meaning: '케이크', category: 'food' },
    { word: 'MILK', meaning: '우유', category: 'food' },
    { word: 'APPLE', meaning: '사과', category: 'food' },
    { word: 'BREAD', meaning: '빵', category: 'food' },
    { word: 'WATER', meaning: '물', category: 'food' },
    { word: 'EGG', meaning: '달걀', category: 'food' },
    { word: 'RICE', meaning: '쌀', category: 'food' },
    { word: 'COOKIE', meaning: '쿠키', category: 'food' },
    { word: 'CANDY', meaning: '사탕', category: 'food' },
    { word: 'PIZZA', meaning: '피자', category: 'food' },
    { word: 'JUICE', meaning: '주스', category: 'food' },
    { word: 'TEA', meaning: '차', category: 'food' },
    { word: 'SOUP', meaning: '수프', category: 'food' },
    { word: 'MEAT', meaning: '고기', category: 'food' },
    { word: 'LEMON', meaning: '레몬', category: 'food' },
    { word: 'GRAPE', meaning: '포도', category: 'food' },
    { word: 'PEACH', meaning: '복숭아', category: 'food' },
    { word: 'MELON', meaning: '멜론', category: 'food' },

    // 일상 (Daily Life)
    { word: 'BOOK', meaning: '책', category: 'daily' },
    { word: 'BALL', meaning: '공', category: 'daily' },
    { word: 'DESK', meaning: '책상', category: 'daily' },
    { word: 'DOOR', meaning: '문', category: 'daily' },
    { word: 'CHAIR', meaning: '의자', category: 'daily' },
    { word: 'WINDOW', meaning: '창문', category: 'daily' },
    { word: 'CLOCK', meaning: '시계', category: 'daily' },
    { word: 'PEN', meaning: '펜', category: 'daily' },
    { word: 'BAG', meaning: '가방', category: 'daily' },
    { word: 'BOX', meaning: '상자', category: 'daily' },
    { word: 'CUP', meaning: '컵', category: 'daily' },
    { word: 'PLATE', meaning: '접시', category: 'daily' },
    { word: 'SPOON', meaning: '숟가락', category: 'daily' },
    { word: 'FORK', meaning: '포크', category: 'daily' },
    { word: 'KNIFE', meaning: '칼', category: 'daily' },
    { word: 'MIRROR', meaning: '거울', category: 'daily' },
    { word: 'PILLOW', meaning: '베개', category: 'daily' },
    { word: 'BLANKET', meaning: '담요', category: 'daily' },
    { word: 'LAMP', meaning: '램프', category: 'daily' },
    { word: 'PHONE', meaning: '전화기', category: 'daily' },

    // 감정/추상 (Feelings/Abstract)
    { word: 'LOVE', meaning: '사랑', category: 'feeling' },
    { word: 'HAPPY', meaning: '행복한', category: 'feeling' },
    { word: 'SAD', meaning: '슬픈', category: 'feeling' },
    { word: 'ANGRY', meaning: '화난', category: 'feeling' },
    { word: 'SMILE', meaning: '미소', category: 'feeling' },
    { word: 'CRY', meaning: '울다', category: 'feeling' },
    { word: 'LAUGH', meaning: '웃다', category: 'feeling' },
    { word: 'DREAM', meaning: '꿈', category: 'feeling' },
    { word: 'HOPE', meaning: '희망', category: 'feeling' },
    { word: 'WARM', meaning: '따뜻한', category: 'feeling' },

    // 사람/가족 (People/Family)
    { word: 'BABY', meaning: '아기', category: 'people' },
    { word: 'FRIEND', meaning: '친구', category: 'people' },
    { word: 'BOY', meaning: '소년', category: 'people' },
    { word: 'GIRL', meaning: '소녀', category: 'people' },
    { word: 'MAN', meaning: '남자', category: 'people' },
    { word: 'WOMAN', meaning: '여자', category: 'people' },
    { word: 'CHILD', meaning: '아이', category: 'people' },
    { word: 'FATHER', meaning: '아버지', category: 'people' },
    { word: 'MOTHER', meaning: '어머니', category: 'people' },
    { word: 'SISTER', meaning: '자매', category: 'people' },
    { word: 'BROTHER', meaning: '형제', category: 'people' },

    // 장소 (Places)
    { word: 'HOME', meaning: '집', category: 'place' },
    { word: 'PARK', meaning: '공원', category: 'place' },
    { word: 'SCHOOL', meaning: '학교', category: 'place' },
    { word: 'STORE', meaning: '가게', category: 'place' },
    { word: 'FARM', meaning: '농장', category: 'place' },
    { word: 'ZOO', meaning: '동물원', category: 'place' },
    { word: 'BEACH', meaning: '해변', category: 'place' },
    { word: 'GARDEN', meaning: '정원', category: 'place' },
    { word: 'CHURCH', meaning: '교회', category: 'place' },
    { word: 'LIBRARY', meaning: '도서관', category: 'place' },

    // 신체 (Body)
    { word: 'HAND', meaning: '손', category: 'body' },
    { word: 'EYES', meaning: '눈', category: 'body' },
    { word: 'NOSE', meaning: '코', category: 'body' },
    { word: 'EAR', meaning: '귀', category: 'body' },
    { word: 'MOUTH', meaning: '입', category: 'body' },
    { word: 'HEAD', meaning: '머리', category: 'body' },
    { word: 'HAIR', meaning: '머리카락', category: 'body' },
    { word: 'FOOT', meaning: '발', category: 'body' },
    { word: 'LEG', meaning: '다리', category: 'body' },
    { word: 'ARM', meaning: '팔', category: 'body' },
    { word: 'FINGER', meaning: '손가락', category: 'body' },
    { word: 'TOE', meaning: '발가락', category: 'body' },

    // 숫자/시간 (Numbers/Time)
    { word: 'ONE', meaning: '하나', category: 'number' },
    { word: 'TWO', meaning: '둘', category: 'number' },
    { word: 'THREE', meaning: '셋', category: 'number' },
    { word: 'FOUR', meaning: '넷', category: 'number' },
    { word: 'FIVE', meaning: '다섯', category: 'number' },
    { word: 'SIX', meaning: '여섯', category: 'number' },
    { word: 'SEVEN', meaning: '일곱', category: 'number' },
    { word: 'EIGHT', meaning: '여덟', category: 'number' },
    { word: 'NINE', meaning: '아홉', category: 'number' },
    { word: 'TEN', meaning: '열', category: 'number' },
    { word: 'DAY', meaning: '날', category: 'time' },
    { word: 'NIGHT', meaning: '밤', category: 'time' },
    { word: 'WEEK', meaning: '주', category: 'time' },
    { word: 'YEAR', meaning: '년', category: 'time' },
    { word: 'TODAY', meaning: '오늘', category: 'time' },

    // 동작 (Actions)
    { word: 'RUN', meaning: '달리다', category: 'action' },
    { word: 'WALK', meaning: '걷다', category: 'action' },
    { word: 'JUMP', meaning: '점프하다', category: 'action' },
    { word: 'SWIM', meaning: '수영하다', category: 'action' },
    { word: 'FLY', meaning: '날다', category: 'action' },
    { word: 'SING', meaning: '노래하다', category: 'action' },
    { word: 'DANCE', meaning: '춤추다', category: 'action' },
    { word: 'EAT', meaning: '먹다', category: 'action' },
    { word: 'DRINK', meaning: '마시다', category: 'action' },
    { word: 'SLEEP', meaning: '자다', category: 'action' },
    { word: 'PLAY', meaning: '놀다', category: 'action' },
    { word: 'READ', meaning: '읽다', category: 'action' },
    { word: 'WRITE', meaning: '쓰다', category: 'action' },
    { word: 'DRAW', meaning: '그리다', category: 'action' },

    // 사물 (Objects)
    { word: 'CAR', meaning: '자동차', category: 'object' },
    { word: 'BUS', meaning: '버스', category: 'object' },
    { word: 'BIKE', meaning: '자전거', category: 'object' },
    { word: 'TRAIN', meaning: '기차', category: 'object' },
    { word: 'BOAT', meaning: '배', category: 'object' },
    { word: 'PLANE', meaning: '비행기', category: 'object' },
    { word: 'TOY', meaning: '장난감', category: 'object' },
    { word: 'DOLL', meaning: '인형', category: 'object' },
    { word: 'ROBOT', meaning: '로봇', category: 'object' },
    { word: 'KITE', meaning: '연', category: 'object' },

    // 옷 (Clothes)
    { word: 'HAT', meaning: '모자', category: 'clothes' },
    { word: 'SHIRT', meaning: '셔츠', category: 'clothes' },
    { word: 'PANTS', meaning: '바지', category: 'clothes' },
    { word: 'SHOES', meaning: '신발', category: 'clothes' },
    { word: 'DRESS', meaning: '드레스', category: 'clothes' },
    { word: 'COAT', meaning: '코트', category: 'clothes' },
    { word: 'SOCKS', meaning: '양말', category: 'clothes' },
    { word: 'GLOVES', meaning: '장갑', category: 'clothes' },

    // 날씨 (Weather)
    { word: 'HOT', meaning: '뜨거운', category: 'weather' },
    { word: 'COLD', meaning: '추운', category: 'weather' },
    { word: 'COOL', meaning: '시원한', category: 'weather' },
    { word: 'SUNNY', meaning: '화창한', category: 'weather' },
    { word: 'RAINY', meaning: '비오는', category: 'weather' },
    { word: 'WINDY', meaning: '바람부는', category: 'weather' },
    { word: 'CLOUDY', meaning: '흐린', category: 'weather' },

    // 식물 (Plants)
    { word: 'FLOWER', meaning: '꽃', category: 'plant' },
    { word: 'GRASS', meaning: '풀', category: 'plant' },
    { word: 'LEAF', meaning: '잎', category: 'plant' },
    { word: 'SEED', meaning: '씨앗', category: 'plant' },
    { word: 'ROOT', meaning: '뿌리', category: 'plant' },
    { word: 'ROSE', meaning: '장미', category: 'plant' },

    // 모양 (Shapes)
    { word: 'CIRCLE', meaning: '원', category: 'shape' },
    { word: 'SQUARE', meaning: '사각형', category: 'shape' },
    { word: 'STAR', meaning: '별모양', category: 'shape' },
    { word: 'HEART', meaning: '하트', category: 'shape' },

    // 방향/위치 (Direction/Position)
    { word: 'UP', meaning: '위', category: 'direction' },
    { word: 'DOWN', meaning: '아래', category: 'direction' },
    { word: 'LEFT', meaning: '왼쪽', category: 'direction' },
    { word: 'RIGHT', meaning: '오른쪽', category: 'direction' },
    { word: 'IN', meaning: '안', category: 'direction' },
    { word: 'OUT', meaning: '밖', category: 'direction' },
    { word: 'FRONT', meaning: '앞', category: 'direction' },
    { word: 'BACK', meaning: '뒤', category: 'direction' },

    // 크기/상태 (Size/State)
    { word: 'BIG', meaning: '큰', category: 'size' },
    { word: 'SMALL', meaning: '작은', category: 'size' },
    { word: 'TALL', meaning: '큰', category: 'size' },
    { word: 'SHORT', meaning: '짧은', category: 'size' },
    { word: 'LONG', meaning: '긴', category: 'size' },
    { word: 'NEW', meaning: '새로운', category: 'state' },
    { word: 'OLD', meaning: '오래된', category: 'state' },
    { word: 'CLEAN', meaning: '깨끗한', category: 'state' },
    { word: 'DIRTY', meaning: '더러운', category: 'state' },
    { word: 'FULL', meaning: '가득한', category: 'state' },
    { word: 'EMPTY', meaning: '빈', category: 'state' }
];

// 보스 캐릭터 데이터 (5, 10, 15, 20 스테이지)
const BOSS_DATA = [
    {
        stage: 5,
        name: '책 보스',
        type: 'boss5',
        health: 3,
        speed: 1.5,
        color: '#D2691E',
        difficulty: 1,
        preBattleDialogue: [
            { speaker: '책 보스', text: '흐흐흐! 나는 모든 지식을 담은 책이다!' },
            { speaker: '지율', text: '책이 움직여?! 진짜 신기하다!' },
            { speaker: '책 보스', text: '신기해할 시간에 공부나 해라! 내 페이지를 넘겨볼 수 있겠나?' },
            { speaker: '지율', text: '내가 매일 책 읽는다고! 한번 해볼게!' }
        ],
        postBattleDialogue: [
            { speaker: '책 보스', text: '으윽... 내 페이지가 찢어지는 것 같아...' },
            { speaker: '지율', text: '이겼다! 책도 이렇게 재미있을 줄 몰랐어!' },
            { speaker: '책 보스', text: '크윽... 넌 정말 열심히 공부하는구나... 인정한다!' },
            { speaker: '지율', text: '고마워 책 보스! 다음에 또 만나!' }
        ]
    },
    {
        stage: 10,
        name: '밥그릇 보스',
        type: 'boss10',
        health: 4,
        speed: 2,
        color: '#D2691E',
        difficulty: 2,
        preBattleDialogue: [
            { speaker: '밥그릇 보스', text: '배고프지? 크크크! 하지만 밥은 못 먹어!' },
            { speaker: '지율', text: '엥? 밥그릇이 말을 해?!' },
            { speaker: '밥그릇 보스', text: '밥은 잘 먹어야 공부도 잘하지! 근데 넌 나한테 이길 수 없어!' },
            { speaker: '지율', text: '나 밥 잘 먹는다고! 편식도 안 해! 한번 해보자!' }
        ],
        postBattleDialogue: [
            { speaker: '밥그릇 보스', text: '으악! 밥알이 다 떨어졌어...' },
            { speaker: '지율', text: '역시 밥심이 최고야! 이겼다!' },
            { speaker: '밥그릇 보스', text: '넌 정말 건강한 아이구나... 밥 잘 먹어서 기특해!' },
            { speaker: '지율', text: '당연하지! 잘 먹고 잘 놀아야지!' }
        ]
    },
    {
        stage: 15,
        name: '말벌 보스',
        type: 'boss15',
        health: 5,
        speed: 2.5,
        color: '#FFD700',
        difficulty: 3,
        preBattleDialogue: [
            { speaker: '말벌 보스', text: '윙윙윙! 내 독침을 조심해라!' },
            { speaker: '지율', text: '으아악! 말벌이다! 무서워!' },
            { speaker: '말벌 보스', text: '크크크! 겁먹었구나? 이제 슬슬 힘들어지지?' },
            { speaker: '지율', text: '무섭긴 하지만... 여기까지 왔는데 포기 못 해!' }
        ],
        postBattleDialogue: [
            { speaker: '말벌 보스', text: '윙... 윙... 날개가 다 찢어졌어...' },
            { speaker: '지율', text: '휴! 진짜 무서웠는데 이겼다!' },
            { speaker: '말벌 보스', text: '넌... 정말 용감한 아이야... 대단해...' },
            { speaker: '지율', text: '고마워! 이제 마지막 보스만 남았다!' }
        ]
    },
    {
        stage: 20,
        name: '알파벳 황제',
        type: 'boss20',
        health: 7,
        speed: 3,
        color: '#8B008B',
        difficulty: 4,
        preBattleDialogue: [
            { speaker: '알파벳 황제', text: '드디어 여기까지 왔구나! 나는 알파벳 황제다!' },
            { speaker: '지율', text: '와! 진짜 멋있다! 황금 왕관도 있어!' },
            { speaker: '알파벳 황제', text: '하지만 나를 이기는 건 불가능하지! A부터 Z까지 완벽하게 외웠나?' },
            { speaker: '지율', text: '물론이지! 여기까지 오면서 다 배웠어! 최선을 다할게!' }
        ],
        postBattleDialogue: [
            { speaker: '알파벳 황제', text: '으윽... 이럴 수가... 완벽한 나를 이기다니...' },
            { speaker: '지율', text: '해냈다!!! 드디어 최종 보스를 이겼어!' },
            { speaker: '알파벳 황제', text: '훌륭하다 지율! 넌 진정한 영어 마스터야! 축하한다!' },
            { speaker: '지율', text: '고마워요! 이제 영어가 재미있어졌어요!' }
        ]
    }
];

// 랜덤하게 20개 단어 선택 (중복 없이)
function getRandomWords(count = 20) {
    const shuffled = [...WORD_DATABASE].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 특정 난이도의 단어 가져오기
function getWordsByDifficulty(difficulty) {
    return WORD_DATABASE.filter(w => w.difficulty === difficulty);
}

// 카테고리별 단어 가져오기
function getWordsByCategory(category) {
    return WORD_DATABASE.filter(w => w.category === category);
}

// 보스 데이터 가져오기
function getBossData(stage) {
    return BOSS_DATA.find(boss => boss.stage === stage);
}

// 보스 스테이지인지 확인
function isBossStage(stage) {
    return stage === 5 || stage === 10 || stage === 15 || stage === 20;
}

// 퀴즈를 위한 오답 생성 (다른 단어의 뜻에서 랜덤하게)
function getQuizChoices(correctWord) {
    const correctMeaning = correctWord.meaning;

    // 모든 단어에서 현재 단어와 다른 뜻들 가져오기
    const allOtherMeanings = WORD_DATABASE
        .filter(w => w.meaning !== correctMeaning)
        .map(w => w.meaning);

    // 랜덤하게 3개 선택
    const shuffled = [...allOtherMeanings].sort(() => Math.random() - 0.5);
    const wrongMeanings = shuffled.slice(0, 3);

    return {
        correctMeaning: correctMeaning,
        wrongMeanings: wrongMeanings
    };
}
