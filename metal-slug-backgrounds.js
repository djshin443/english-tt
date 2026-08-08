// ============================================================
// 메탈슬러그풍 픽셀 배경 엔진
// backgrounds.js의 drawStageBackground를 오버라이드하여 20개 스테이지
// 전체를 도트 스프라이트 방식(픽셀 밴드 하늘 + 디더링 + 3중 패럴랙스
// 실루엣/소품 레이어 + 픽셀 타일 지면)으로 다시 그린다.
// game.js / metal-slug-style.js 뒤에 로드되어야 한다.
// ============================================================
(function () {
    'use strict';

    // ---- 공용 도트 소품 스프라이트 ----
    const PROPS = {
        // 부서진 빌딩 (도시)
        ruinTower: {
            sprite: [
                [0,0,1,1,0,0,1,1,1,0,0,0],
                [0,1,2,2,1,1,2,2,2,1,0,0],
                [1,2,3,2,2,2,2,3,2,2,1,0],
                [1,2,2,2,3,2,2,2,2,2,1,0],
                [1,2,3,2,2,2,3,2,2,3,2,1],
                [1,2,2,2,3,2,2,2,3,2,2,1],
                [1,2,3,2,2,2,3,2,2,3,2,1],
                [1,2,2,2,3,2,2,2,3,2,2,1],
                [1,2,3,2,2,2,3,2,2,3,2,1],
                [1,2,2,2,2,2,2,2,2,2,2,1]
            ],
            colorMap: { 0: null, 1: '#2A2E3A', 2: '#3C4252', 3: '#5A6478' }
        },
        // 픽셀 나무
        tree: {
            sprite: [
                [0,0,0,1,1,1,0,0,0],
                [0,1,1,2,2,2,1,1,0],
                [1,2,2,3,2,2,2,2,1],
                [1,2,3,2,2,3,2,2,1],
                [0,1,2,2,2,2,2,1,0],
                [0,0,1,1,4,1,1,0,0],
                [0,0,0,0,4,0,0,0,0],
                [0,0,0,4,4,4,0,0,0]
            ],
            colorMap: { 0: null, 1: '#1E3D1A', 2: '#2E5C24', 3: '#4A8236', 4: '#4A3018' }
        },
        // 모래주머니 바리케이드
        sandbag: {
            sprite: [
                [0,1,1,1,0,1,1,1,0],
                [1,2,2,2,1,2,2,2,1],
                [1,2,3,2,2,2,3,2,1],
                [0,1,1,1,1,1,1,1,0],
                [1,2,2,2,1,2,2,2,1],
                [1,2,3,2,2,2,3,2,1],
                [0,1,1,1,0,1,1,1,0]
            ],
            colorMap: { 0: null, 1: '#4A3B22', 2: '#7A6238', 3: '#9A8250' }
        },
        // 나무 상자 (보급품)
        crate: {
            sprite: [
                [1,1,1,1,1,1,1,1],
                [1,2,2,3,3,2,2,1],
                [1,2,3,2,2,3,2,1],
                [1,3,2,2,2,2,3,1],
                [1,3,2,2,2,2,3,1],
                [1,2,3,2,2,3,2,1],
                [1,2,2,3,3,2,2,1],
                [1,1,1,1,1,1,1,1]
            ],
            colorMap: { 0: null, 1: '#3A2A14', 2: '#6B4A24', 3: '#8A6234' }
        },
        // 가로등 (전장 조명)
        lamp: {
            sprite: [
                [0,1,1,1,0],
                [1,2,2,2,1],
                [1,2,2,2,1],
                [0,1,3,1,0],
                [0,0,3,0,0],
                [0,0,3,0,0],
                [0,0,3,0,0],
                [0,0,3,0,0],
                [0,0,3,0,0],
                [0,3,3,3,0]
            ],
            colorMap: { 0: null, 1: '#5A4A1E', 2: '#FFDD66', 3: '#33383F' }
        },
        // 울타리
        fence: {
            sprite: [
                [1,0,0,1,0,0,1,0,0,1],
                [1,1,1,1,1,1,1,1,1,1],
                [1,0,0,1,0,0,1,0,0,1],
                [1,1,1,1,1,1,1,1,1,1],
                [1,0,0,1,0,0,1,0,0,1]
            ],
            colorMap: { 0: null, 1: '#4A3828' }
        },
        // 야자수 (해변)
        palm: {
            sprite: [
                [0,2,2,0,0,0,2,2,0],
                [2,2,0,2,2,2,0,2,2],
                [0,0,0,0,1,0,0,0,0],
                [0,0,0,1,1,0,0,0,0],
                [0,0,0,1,1,0,0,0,0],
                [0,0,1,1,0,0,0,0,0],
                [0,0,1,1,0,0,0,0,0],
                [0,1,1,0,0,0,0,0,0]
            ],
            colorMap: { 0: null, 1: '#6B4A24', 2: '#2E7C34' }
        },
        // 산호/수초 (수족관)
        coral: {
            sprite: [
                [0,1,0,0,2,0,0,1,0],
                [0,1,0,2,2,2,0,1,0],
                [1,1,1,0,2,0,1,1,1],
                [0,1,0,0,2,0,0,1,0],
                [1,1,1,2,2,2,1,1,1]
            ],
            colorMap: { 0: null, 1: '#C85A78', 2: '#3AA890' }
        },
        // 책장 (도서관/서점)
        shelf: {
            sprite: [
                [1,1,1,1,1,1,1,1,1,1],
                [1,2,3,4,2,3,4,2,3,1],
                [1,1,1,1,1,1,1,1,1,1],
                [1,3,4,2,3,4,2,3,4,1],
                [1,1,1,1,1,1,1,1,1,1],
                [1,4,2,3,4,2,3,4,2,1],
                [1,1,1,1,1,1,1,1,1,1]
            ],
            colorMap: { 0: null, 1: '#3A2A18', 2: '#A84A3A', 3: '#3A6A8A', 4: '#C8A040' }
        },
        // 텐트 진지 (군 기지 느낌)
        tent: {
            sprite: [
                [0,0,0,0,1,1,0,0,0,0],
                [0,0,0,1,2,2,1,0,0,0],
                [0,0,1,2,2,2,2,1,0,0],
                [0,1,2,2,3,3,2,2,1,0],
                [1,2,2,3,2,2,3,2,2,1],
                [1,2,3,2,2,2,2,3,2,1]
            ],
            colorMap: { 0: null, 1: '#2A3A1E', 2: '#44582E', 3: '#5E7440' }
        }
    };

    // ---- 스테이지별 메탈슬러그풍 팔레트/구성 ----
    // sky: 위→아래 픽셀 밴드, far/mid: 소품 키, ground: [풀/윗줄, 흙, 흙어두움]
    const MS_THEMES = {
        apartment:   { sky: ['#1A2038', '#2E3A5C', '#5C4A6E', '#A85A50', '#D8814E'], far: 'ruinTower', mid: 'sandbag',  ground: ['#5FA33C', '#6B4A2B', '#4A3018'] },
        classroom:   { sky: ['#28303A', '#3A4A58', '#5C7080', '#8C9AA0', '#B8C4C0'], far: 'shelf',     mid: 'crate',    ground: ['#8A7A5A', '#6B5A3A', '#4A3A22'] },
        library:     { sky: ['#241E14', '#3A3222', '#584A32', '#786244', '#988258'], far: 'shelf',     mid: 'lamp',     ground: ['#6B5A3A', '#584832', '#3A2E1E'] },
        stationery:  { sky: ['#2A1E30', '#48304E', '#6E4468', '#985A78', '#C87888'], far: 'ruinTower', mid: 'crate',    ground: ['#8A5A6A', '#6B4452', '#4A2E38'] },
        slimecafe:   { sky: ['#160E20', '#2A1838', '#482450', '#703060', '#983C60'], far: 'ruinTower', mid: 'sandbag',  ground: ['#5A3A5A', '#44284A', '#301A34'] },
        supermarket: { sky: ['#2A2418', '#48402A', '#6E6040', '#988458', '#C8B078'], far: 'shelf',     mid: 'crate',    ground: ['#7A6A4A', '#5E5038', '#423824'] },
        park:        { sky: ['#12241E', '#1E3C2E', '#2E5C40', '#4E8452', '#78A860'], far: 'tree',      mid: 'fence',    ground: ['#4E8434', '#5E4428', '#42301C'] },
        hospital:    { sky: ['#1E2A34', '#30424E', '#4A6270', '#6E8A94', '#98B4B8'], far: 'ruinTower', mid: 'sandbag',  ground: ['#7A8488', '#5A6468', '#3E464A'] },
        artmuseum:   { sky: ['#221E30', '#38304E', '#544870', '#786296', '#A084BC'], far: 'lamp',      mid: 'crate',    ground: ['#7A6E8A', '#5C526B', '#40384C'] },
        aquarium:    { sky: ['#04182A', '#083048', '#0E4A68', '#186A8C', '#2490B0'], far: 'coral',     mid: 'coral',    ground: ['#C8B070', '#9A8250', '#6B5A34'] },
        bakery:      { sky: ['#2A1C10', '#48321C', '#6E4C2A', '#986C3C', '#C89050'], far: 'lamp',      mid: 'crate',    ground: ['#9A7A4A', '#7A5E36', '#584224'] },
        bookstore:   { sky: ['#201A24', '#362C3C', '#524258', '#725C78', '#967C98'], far: 'shelf',     mid: 'lamp',     ground: ['#6B5A4A', '#544636', '#3A3024'] },
        field:       { sky: ['#101E30', '#1C344E', '#2E526E', '#48748C', '#6E9AA8'], far: 'tent',      mid: 'sandbag',  ground: ['#4E8434', '#6B4A2B', '#4A3018'] },
        sciencelab:  { sky: ['#0E2024', '#1A3A40', '#2A585E', '#3E7A7C', '#5AA096'], far: 'ruinTower', mid: 'crate',    ground: ['#5A7A6E', '#446054', '#2E443A'] },
        gym:         { sky: ['#2A1810', '#482C1C', '#6E442A', '#985E3C', '#C87E50'], far: 'ruinTower', mid: 'crate',    ground: ['#9A6A3A', '#7A522C', '#583A1E'] },
        museum:      { sky: ['#241E16', '#3C3426', '#5A4E3A', '#7C6C50', '#A08E6A'], far: 'ruinTower', mid: 'lamp',     ground: ['#8A7A62', '#6B5E48', '#4A4032'] },
        beach:       { sky: ['#0C1C34', '#183456', '#2E5478', '#5C7C94', '#98A8A0'], far: 'palm',      mid: 'crate',    ground: ['#D8C080', '#B09858', '#887038'] },
        fallback:    { sky: ['#1A2038', '#2E3A5C', '#5C4A6E', '#A85A50', '#D8814E'], far: 'ruinTower', mid: 'sandbag',  ground: ['#5FA33C', '#6B4A2B', '#4A3018'] }
    };

    // 결정적(프레임 간 고정) 의사난수 - 지면 자갈/별 배치용
    function hash2(ix, iy) {
        return ((ix * 73856093) ^ (iy * 19349663)) >>> 0;
    }

    // ---- drawStageBackground 오버라이드 ----
    const render = (typeof window.renderSpriteMS === 'function') ? window.renderSpriteMS : null;

    window.drawStageBackground = function (ctx, canvas, stage, scrollX) {
        const stageInfo = (typeof stageBackgrounds !== 'undefined' && stageBackgrounds[stage]) || {};
        const theme = MS_THEMES[stageInfo.decorations] || MS_THEMES.fallback;
        const w = canvas.width;
        const h = canvas.height;

        // ---- 1) 하늘: 픽셀 밴드 + 밴드 경계 디더링 ----
        const skyH = h - 50;
        const bandH = Math.ceil(skyH / theme.sky.length);
        const dp = 6; // 디더 도트 크기
        theme.sky.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.fillRect(0, i * bandH, w, bandH + 1);
        });
        // 밴드 경계에 체커 디더 한 줄 (도트 그라데이션 느낌)
        for (let i = 1; i < theme.sky.length; i++) {
            ctx.fillStyle = theme.sky[i - 1];
            const by = i * bandH;
            for (let x = 0; x < w; x += dp * 2) {
                ctx.fillRect(x + ((i % 2) ? dp : 0), by, dp, dp);
            }
        }
        // 별/입자 (위쪽 밴드에만, 고정 배치)
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let i = 0; i < 24; i++) {
            const sx = (hash2(i, 7) % w);
            const sy = (hash2(i, 13) % Math.max(1, bandH * 2));
            if ((hash2(i, 3) % 3) === 0) ctx.fillRect(sx, sy, 3, 3);
        }

        // ---- 2) 원경 실루엣 레이어 (패럴랙스 0.25) ----
        if (render && PROPS[theme.far]) {
            const prop = PROPS[theme.far];
            const farScale = Math.max(5, Math.floor(h / 40));
            const pw = prop.sprite[0].length * farScale;
            const gapF = pw + Math.floor(w / 4);
            const offF = (scrollX * 0.25) % gapF;
            // 실루엣: 어두운 단색 버전
            const silMap = {};
            Object.keys(prop.colorMap).forEach(k => { silMap[k] = prop.colorMap[k] ? '#141824' : null; });
            for (let x = -gapF; x < w + gapF; x += gapF) {
                const px = x - offF;
                const ph = prop.sprite.length * farScale;
                render(ctx, prop.sprite, silMap, px, h - 50 - ph + farScale, farScale, false);
            }
        }

        // ---- 3) 중경 소품 레이어 (패럴랙스 0.6) ----
        if (render) {
            const midProp = PROPS[theme.mid];
            const farProp = PROPS[theme.far];
            const midScale = Math.max(4, Math.floor(h / 90));
            if (farProp) {
                const pw2 = farProp.sprite[0].length * midScale;
                const gapM2 = pw2 + Math.floor(w / 2.5);
                const offM2 = (scrollX * 0.45) % gapM2;
                for (let x = -gapM2; x < w + gapM2; x += gapM2) {
                    const ph = farProp.sprite.length * midScale;
                    render(ctx, farProp.sprite, farProp.colorMap, x - offM2 + 40, h - 50 - ph, midScale, false);
                }
            }
            if (midProp) {
                const pw3 = midProp.sprite[0].length * midScale;
                const gapM3 = pw3 + Math.floor(w / 3);
                const offM3 = (scrollX * 0.6) % gapM3;
                for (let x = -gapM3; x < w + gapM3; x += gapM3) {
                    const ph = midProp.sprite.length * midScale;
                    render(ctx, midProp.sprite, midProp.colorMap, x - offM3, h - 50 - ph, midScale, false);
                }
            }
        }

        // ---- 4) 지면: 픽셀 타일 + 자갈 ----
        const gp = 8;
        const groundTop = h - 50;
        const scrollTile = Math.floor(scrollX) % gp;
        for (let gy = groundTop; gy < h; gy += gp) {
            const iy = Math.floor((gy - groundTop) / gp);
            for (let gx = -gp; gx < w + gp; gx += gp) {
                const ix = Math.floor((gx + Math.floor(scrollX)) / gp);
                let color;
                if (iy === 0) {
                    color = (hash2(ix, 1) % 4 === 0) ? lighten(theme.ground[0]) : theme.ground[0];
                } else if (iy === 1) {
                    color = theme.ground[1];
                } else {
                    const r = hash2(ix, iy) % 9;
                    color = r === 0 ? lighten(theme.ground[2]) : (r === 1 ? theme.ground[2] : theme.ground[1]);
                }
                ctx.fillStyle = color;
                ctx.fillRect(gx - scrollTile, gy, gp, gp);
            }
        }
        // 지면 상단 어두운 경계선 (메탈슬러그식 라인)
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(0, groundTop, w, 3);
    };

    // 색상 밝기 보정 (자갈 하이라이트)
    function lighten(hex) {
        const n = parseInt(hex.slice(1), 16);
        const r = Math.min(255, ((n >> 16) & 255) + 28);
        const g = Math.min(255, ((n >> 8) & 255) + 28);
        const b = Math.min(255, (n & 255) + 28);
        return `rgb(${r},${g},${b})`;
    }
})();
