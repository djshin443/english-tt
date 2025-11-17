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

// 보스 캐릭터 데이터 (5, 10, 15, 20 스테이지) - 난이도 쉽게 & 코믹하게!
const BOSS_DATA = [
    {
        stage: 5,
        name: '스펠링 장군',
        type: 'boss5',
        health: 2,  // 3 -> 2로 쉽게!
        speed: 1.2,  // 1.5 -> 1.2로 느리게!
        color: '#D2691E',
        difficulty: 1,
        preBattleDialogue: [
            { speaker: '스펠링 장군', text: '크하하하! 나는 영어 제국의 스펠링 장군이다!' },
            { speaker: '지율', text: '헉! 책이 말을 해?!' },
            { speaker: '세은', text: '진짜 신기하다! 근데 왜 이렇게 웃기게 생겼어?!' },
            { speaker: '스펠링 장군', text: '뭐?! 웃기다고?! 나는 무섭다고! C-A-T, CAT! 고양이다!' },
            { speaker: '하린', text: '푸하핫! 그건 우리도 알아! 너무 쉬운데?' },
            { speaker: '지율', text: '맞아! 우리 셋 다 영어 잘하거든!' },
            { speaker: '스펠링 장군', text: '뭐? 감히 나를 무시해?! 탁구공으로 내 책장을 넘겨봐라!' },
            { speaker: '세은', text: '오케이! 우리 셋이 같이 할게!' },
            { speaker: '하린', text: '준비됐어?! 레쓰고!' }
        ],
        postBattleDialogue: [
            { speaker: '스펠링 장군', text: '아야야야! 내 책장이 다 구겨졌어! 엄마한테 혼나겠다!' },
            { speaker: '지율', text: '푸핫! 엄마한테 혼나? 보스 주제에?!' },
            { speaker: '스펠링 장군', text: '...사실 난 도서관에서 온 책이거든... 반납 기한도 지나서...' },
            { speaker: '세은', text: '헐! 도서관 책을 여기까지 가져왔어?' },
            { speaker: '하린', text: '연체료 엄청 나오겠다! 빨리 돌려줘야 해!' },
            { speaker: '지율', text: '빨리 도서관 가! 파이팅!' }
        ]
    },
    {
        stage: 10,
        name: '문법 마법사',
        type: 'boss10',
        health: 3,  // 4 -> 3으로 쉽게!
        speed: 1.5,  // 2 -> 1.5로 느리게!
        color: '#9932CC',
        difficulty: 2,
        preBattleDialogue: [
            { speaker: '문법 마법사', text: '후훗! I AM 문법 마법사! 내 마법을 맛봐라!' },
            { speaker: '세은', text: '어? 그건 I AM이 아니라 I\'M 아니야? 줄여서?' },
            { speaker: '문법 마법사', text: '뭐?! 그, 그거야 내가 격식을 차린 거지! 아무튼!' },
            { speaker: '하린', text: '근데 마법사 옷 엄청 크다! 치마에 걸려서 넘어지겠는데?!' },
            { speaker: '문법 마법사', text: '이, 이건 마법 로브라고! 멋있다고! 어쨌든 덤벼라!' },
            { speaker: '지율', text: '알았어 마법사님! 그런데 지팡이가 연필이네?' },
            { speaker: '세은', text: '진짜 귀엽다! 히히!' }
        ],
        postBattleDialogue: [
            { speaker: '문법 마법사', text: '크아악! 내 마법이 다 풀렸어! 주어 동사 목적어가 엉망이야!' },
            { speaker: '지율', text: '하하! 탁구가 문법보다 재밌는데?!' },
            { speaker: '문법 마법사', text: '으흑... 사실 나 영어 시험에서 80점 맞아서 마법사 된 거야...' },
            { speaker: '하린', text: '80점이면 잘한 거잖아!' },
            { speaker: '세은', text: '맞아! 너무 속상해하지 마!' },
            { speaker: '지율', text: '우리랑 같이 공부하자! 힘내!' },
            { speaker: '문법 마법사', text: '고마워 얘들아... 너희 모두 착한 아이들이구나!' }
        ]
    },
    {
        stage: 15,
        name: '발음 괴물',
        type: 'boss15',
        health: 3,  // 5 -> 3으로 쉽게!
        speed: 1.8,  // 2.5 -> 1.8로 느리게!
        color: '#FFD700',
        difficulty: 3,
        preBattleDialogue: [
            { speaker: '발음 괴물', text: '쓰리! 띵크! 띵크! 나는 발음이 완벽해! 완벽하다고!' },
            { speaker: '하린', text: '어? 그건 "씽크"라고 발음하는 건데... 혀를 내밀어야 해!' },
            { speaker: '발음 괴물', text: '뭐?! 내가 틀렸다고?! 나 발음 괴물인데?! 띵크가 맞아 띵크!' },
            { speaker: '세은', text: '아니야! 선생님이 TH는 혀를 내밀고 "쓰~"하래!' },
            { speaker: '지율', text: '맞아! Think는 "씽크"야! 우리가 알려줄게!' },
            { speaker: '발음 괴물', text: '...아 진짜? 내가 계속 틀리게 발음했네! 부끄러워! 어쨌든 싸운다!' },
            { speaker: '하린', text: '왜 화내! 우리도 처음엔 틀렸었어! 그래도 해보자 레쓰고!' }
        ],
        postBattleDialogue: [
            { speaker: '발음 괴물', text: '윙윙윙... 아니 하핫... 나 진짜 발음 연습 좀 해야겠다...' },
            { speaker: '지율', text: '괜찮아! 나도 처음엔 "애플"을 "에이뿔"이라고 했어!' },
            { speaker: '세은', text: '나도! "쓰리"를 "뜨리"라고 했었어! 하하!' },
            { speaker: '발음 괴물', text: '진짜?! 하하하 그럼 나만 못하는 게 아니네!' },
            { speaker: '하린', text: '응! 천천히 연습하면 돼! 유튜브에 발음 강의 많아!' },
            { speaker: '발음 괴물', text: '오 좋은 정보! 고마워 얘들아! 너희 진짜 착하다! 마지막 보스 조심해!' }
        ]
    },
    {
        stage: 20,
        name: 'ABC 대마왕',
        type: 'boss20',
        health: 4,  // 7 -> 4로 쉽게!
        speed: 2,  // 3 -> 2로 느리게!
        color: '#FFB6C1',  // 귀여운 핑크색
        difficulty: 4,
        preBattleDialogue: [
            { speaker: 'ABC 대마왕', text: '안녕~ 나는 ABC 대마왕이야! 영어 친구들아 모여라~! 헤헤!' },
            { speaker: '지율', text: '우와! 너무 귀여워요!' },
            { speaker: '세은', text: '진짜 대마왕이에요? 전혀 안 무서운데?' },
            { speaker: 'ABC 대마왕', text: '귀... 귀엽다니?! 나 무서운 대마왕이야! 으르렁~! (><)' },
            { speaker: '하린', text: '망토에 있는 ABC 무지개색이네요! 너무 예뻐요!' },
            { speaker: 'ABC 대마왕', text: '헤헤... 이거 내가 좋아하는 색으로 칠했어! 아! 아니야, 무서워해야지!' },
            { speaker: '세은', text: '영어 제국이 뭐예요? 재밌는 곳이에요?' },
            { speaker: 'ABC 대마왕', text: '응! 모두가 영어로 노래하고 춤추는 곳이야! 탁구도 할 수 있어!' },
            { speaker: '지율', text: '우와! 완전 재밌겠다!' },
            { speaker: '하린', text: '우리도 가고 싶어요!' },
            { speaker: 'ABC 대마왕', text: '정말?! 그럼 먼저 시험 통과해야 해! 준비됐니? 파이팅~!' }
        ],
        postBattleDialogue: [
            { speaker: 'ABC 대마왕', text: '우왕! 너희 셋 진짜 잘한다! 내 왕관 떨어졌어! 헤헤!' },
            { speaker: '지율', text: '하하! 우리 탁구 레슨 받으러 가는 중이었어요!' },
            { speaker: '세은', text: '매일매일 연습하거든요!' },
            { speaker: 'ABC 대마왕', text: '오오! 탁구 레슨이라니! 나... 사실 탁구 선수가 꿈이었어...' },
            { speaker: '하린', text: '진짜요?! 그럼 우리랑 같이 연습해요!' },
            { speaker: '지율', text: '맞아! 우리 선생님한테 소개시켜 줄게요!' },
            { speaker: 'ABC 대마왕', text: '헐! 진심?! 나 사실 악당 하기 싫었어! 탁구가 좋아!' },
            { speaker: '세은', text: '좋아요! 그럼 이제부터 악당 그만하고 같이 탁구 치러 가요!' },
            { speaker: 'ABC 대마왕', text: '그래! 나 이제부터 탁구 코치 할래! 얘들아 내가 가르쳐줄게!' },
            { speaker: '하린', text: '와! 좋아요! 우리가 영어도 가르쳐 줄게요!' }
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

// 오프닝 시퀀스 대화 - 귀엽고 코믹하게!
const OPENING_DIALOGUE = [
    { speaker: '지율', text: '휴~ 오늘 영어 학원 수업 끝! 이제 탁구 레슨 가야지!' },
    { speaker: '세은', text: '오늘 수업 완전 재밌었어! 지율아, 탁구 레슨 같이 가자!' },
    { speaker: '하린', text: '나도! 나도! 오늘 선생님이 새로운 스매싱 기술 가르쳐 준대!' },
    { speaker: '지율', text: '헤헤~ 우리 셋이 함께 연습하면 더 재밌을 거야!' },
    { speaker: '???', text: '반짝반짝✨ 팡팡! (하늘에서 무지개 빛!)' },
    { speaker: '세은', text: '우와! 무지개다! 진짜 예쁘다!' },
    { speaker: '하린', text: '어? 저기 알파벳이 떠다닌다! A, B, C...!' },
    { speaker: '지율', text: '뭐야 뭐야? 무슨 일이야?' },
    { speaker: 'ABC 대마왕', text: '안녕 안녕~! 나는 영어 나라의 ABC 대마왕이야! 헤헤!' },
    { speaker: 'ABC 대마왕', text: '지구에 영어 놀이터 만들러 왔어! 모두 영어로 친구 되자!' },
    { speaker: '세은', text: '헐! 말하는 대마왕? 근데 왜 이렇게 귀여워?' },
    { speaker: '지율', text: '영어 놀이터는 좋은데... 탁구는 칠 수 있어요?' },
    { speaker: 'ABC 대마왕', text: '탁구? 그건 안 돼! 영어만 해야 해! ...근데 탁구가 뭐야? 재밌어?' },
    { speaker: '하린', text: '엄청 재밌어요! 우리 세 명 다 탁구 배우는 중이에요!' },
    { speaker: '세은', text: '맞아요! 공을 퐁퐁 치면서 노는 거예요! 진짜 신나요!' },
    { speaker: '지율', text: '좋아! 우리가 영어도 배우고 탁구도 가르쳐 줄게요!' },
    { speaker: '하린', text: '같이 놀아요! 우리 셋이서 다 보여줄게요!' }
];

// 엔딩 시퀀스 대화 - 금메달 & 인터뷰!
const ENDING_DIALOGUE = [
    { speaker: '나레이션', text: '그로부터 1년 후...' },
    { speaker: '나레이션', text: '국제 청소년 탁구 대회 단체전 결승전!' },
    { speaker: '심판', text: '금메달! 대한민국 지율, 세은, 하린 선수!' },
    { speaker: 'ABC 대마왕', text: '애들아! 잘했어! 내가 가르친 보람이 있네!' },
    { speaker: '지율', text: '코치님! 감사해요! 우리 셋이 열심히 연습했어요!' },
    { speaker: '세은', text: '매일매일 영어도 배우고 탁구도 연습했어요!' },
    { speaker: '하린', text: '힘들었지만 재밌었어요! 히히!' },
    { speaker: '외국 기자', text: 'Congratulations! How do you feel?' },
    { speaker: '지율', text: 'I\'m so happy! Thank you everyone!' },
    { speaker: '세은', text: 'We practiced very hard together!' },
    { speaker: '하린', text: 'Ping pong is the best! Hehe!' },
    { speaker: '외국 기자', text: 'Who is your coach?' },
    { speaker: '지율', text: 'He is ABC! The best coach in the world!' },
    { speaker: '세은', text: 'He taught us English and ping pong!' },
    { speaker: 'ABC 대마왕', text: '흐흐... 나 이제 악당 아니고 최고의 코치야!' },
    { speaker: '하린', text: 'Coach ABC is really kind and funny!' },
    { speaker: 'ABC 대마왕', text: '얘들아! 다음 대회도 함께 가자!' },
    { speaker: '지율', text: '네! 코치님! Let\'s go!' },
    { speaker: '세은', text: 'Fighting! We can do it!' },
    { speaker: '하린', text: 'Hahaha! I love ping pong!' },
    { speaker: '나레이션', text: '대회가 끝난 후...' },
    { speaker: '나레이션', text: '세 친구는 캠핑장으로 여행을 떠났습니다.' },
    { speaker: '지율', text: '와! 캠프파이어다! 불 보니까 완전 따뜻해!' },
    { speaker: '세은', text: '오늘 하루 진짜 재밌었어! 금메달도 땄고!' },
    { speaker: '하린', text: '우리 셋이 함께여서 더 행복했어! 히히!' },
    { speaker: 'ABC 대마왕', text: '얘들아, 마시멜로 구울 거야? 내가 영어로 캠핑송 불러줄게!' },
    { speaker: '지율', text: '좋아요! 코치님! 불 주위에서 노래 부르면 완전 낭만적일 거 같아요!' },
    { speaker: '세은', text: '근데 저기... 하늘에 또 뭔가 떠다니는데...?' },
    { speaker: '하린', text: '어? 저건... 이상한 숫자들이야! 101, 777, FF...!' },
    { speaker: '나레이션', text: '순간, 하늘에서 금빛 빛줄기가 내려오더니...' },
    { speaker: '나레이션', text: '아름다운 천사가 캠프파이어 앞에 나타났습니다!' },
    { speaker: 'SUNZERO', text: '안녕, 지율아. 나는 너의 수호천사 SUNZERO야.' },
    { speaker: '지율', text: '헉! 수호천사?! 진짜 천사다! 날개도 있어!' },
    { speaker: 'SUNZERO', text: '너희 셋의 노력을 지켜봤어. 영어도 배우고 탁구도 열심히 했지.' },
    { speaker: '세은', text: '우와... 정말 예뻐요! 빛이 나요!' },
    { speaker: 'SUNZERO', text: '이제 새로운 모험이 기다리고 있어...' },
    { speaker: '하린', text: '새로운 모험? 뭐예요 어떤 모험 신난다!!!' },
    { speaker: 'SUNZERO', text: '후훗... 글쎄~ 그건 직접 가봐야 알 수 있지.' },
    { speaker: 'ABC 대마왕', text: '설마... 수호천사님?! 전설로만 들었는데!' },
    { speaker: 'SUNZERO', text: '오늘은 푹 쉬렴. 다음 모험에서 또 만나자! 안녕~' },
    { speaker: '나레이션', text: '천사는 금빛 빛과 함께 사라졌습니다...' },
    { speaker: '나레이션', text: '이렇게 지율, 세은, 하린은 영어도 잘하고 탁구도 잘하는 선수가 되었답니다!' },
    { speaker: '나레이션', text: '세 친구의 다음 모험은 곧 계속됩니다...' },
    { speaker: '나레이션', text: 'To be continued in SUNZERO...' },
    { speaker: '나레이션', text: '- THE END -' }
];

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

