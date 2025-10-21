// 스테이지별 배경 테마 (초등학교 2학년 친숙한 장소)
const stageBackgrounds = {
    1: {
        name: '아파트 (우리 집)',
        sky: {
            top: '#FFE5B4',
            middle: '#FFD4A3',
            bottom: '#FFC993'
        },
        ground: '#D2B48C',
        decorations: 'apartment',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']  // 초2 수준
    },
    2: {
        name: '학교 교실',
        sky: {
            top: '#E6F3FF',
            middle: '#D4E9FF',
            bottom: '#C2DFFF'
        },
        ground: '#A0826D',
        decorations: 'classroom',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    },
    3: {
        name: '도서관',
        sky: {
            top: '#F5E6D3',
            middle: '#EBD9C3',
            bottom: '#E1CCB3'
        },
        ground: '#8B7355',
        decorations: 'library',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    },
    4: {
        name: '문구점 (팬시점)',
        sky: {
            top: '#FFE4F0',
            middle: '#FFD4E8',
            bottom: '#FFC4E0'
        },
        ground: '#E6B8D0',
        decorations: 'stationery',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    },
    5: {
        name: '놀이터',
        sky: {
            top: '#87CEEB',
            middle: '#6FB9E8',
            bottom: '#57A4E5'
        },
        ground: '#F4A460',
        decorations: 'playground',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']  // 보스 스테이지
    },
    6: {
        name: '마트 (슈퍼마켓)',
        sky: {
            top: '#FFF8DC',
            middle: '#FFEBCD',
            bottom: '#FFE4B5'
        },
        ground: '#D3D3D3',
        decorations: 'supermarket',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    },
    7: {
        name: '공원',
        sky: {
            top: '#B0E57C',
            middle: '#9FD970',
            bottom: '#8ECD64'
        },
        ground: '#90EE90',
        decorations: 'park',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
    },
    8: {
        name: '병원',
        sky: {
            top: '#E0F5FF',
            middle: '#D0EBFF',
            bottom: '#C0E1FF'
        },
        ground: '#DCDCDC',
        decorations: 'hospital',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
    },
    9: {
        name: '미술관',
        sky: {
            top: '#F0E6FA',
            middle: '#E6DCFA',
            bottom: '#DCD2FA'
        },
        ground: '#C9B8E0',
        decorations: 'artmuseum',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
    },
    10: {
        name: '동물원',
        sky: {
            top: '#FFE8A3',
            middle: '#FFE090',
            bottom: '#FFD87D'
        },
        ground: '#A8C68F',
        decorations: 'zoo',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']  // 보스 스테이지
    },
    11: {
        name: '수족관',
        sky: {
            top: '#4DD4FF',
            middle: '#3DC9FF',
            bottom: '#2DBEFF'
        },
        ground: '#5F9EA0',
        decorations: 'aquarium',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    },
    12: {
        name: '빵집 (베이커리)',
        sky: {
            top: '#FFF5E6',
            middle: '#FFEBD6',
            bottom: '#FFE1C6'
        },
        ground: '#D2B48C',
        decorations: 'bakery',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    },
    13: {
        name: '서점',
        sky: {
            top: '#E8DCC8',
            middle: '#DED2B8',
            bottom: '#D4C8A8'
        },
        ground: '#A0826D',
        decorations: 'bookstore',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    },
    14: {
        name: '운동장',
        sky: {
            top: '#87CEEB',
            middle: '#76C3EA',
            bottom: '#65B8E9'
        },
        ground: '#228B22',
        decorations: 'field',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    },
    15: {
        name: '음악실',
        sky: {
            top: '#FFE5F0',
            middle: '#FFDBE8',
            bottom: '#FFD1E0'
        },
        ground: '#C9A0DC',
        decorations: 'musicroom',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']  // 보스 스테이지
    },
    16: {
        name: '과학실',
        sky: {
            top: '#E0F8FF',
            middle: '#D0F0FF',
            bottom: '#C0E8FF'
        },
        ground: '#B0C4DE',
        decorations: 'sciencelab',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    },
    17: {
        name: '체육관',
        sky: {
            top: '#FFE8D0',
            middle: '#FFDEC0',
            bottom: '#FFD4B0'
        },
        ground: '#CD853F',
        decorations: 'gym',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    },
    18: {
        name: '박물관',
        sky: {
            top: '#F0E8D8',
            middle: '#E6DEC8',
            bottom: '#DCD4B8'
        },
        ground: '#A8998F',
        decorations: 'museum',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    },
    19: {
        name: '해변 (바다)',
        sky: {
            top: '#87CEEB',
            middle: '#6EC1E8',
            bottom: '#55B4E5'
        },
        ground: '#F4D03F',
        decorations: 'beach',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    },
    20: {
        name: '숲속 (산)',
        sky: {
            top: '#98D8C8',
            middle: '#88CEB8',
            bottom: '#78C4A8'
        },
        ground: '#6B8E23',
        decorations: 'forest',
        monsters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']  // 최종 보스 스테이지
    }
};

// 배경 장식 그리기 함수들
const backgroundDecorations = {
    // 1. 아파트 (우리 집)
    apartment: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 먼 배경 건물들 (작고 흐릿하게)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 4; i++) {
                const farX = 50 + i * 200 - scroll * 0.3 + (repeat * canvas.width * 2);
                const farHeight = 150 + (i * 20);

                // 먼 건물 그라데이션
                const farGrad = ctx.createLinearGradient(farX, canvas.height - 50 - farHeight, farX, canvas.height - 50);
                farGrad.addColorStop(0, 'rgba(200, 180, 160, 0.4)');
                farGrad.addColorStop(1, 'rgba(180, 160, 140, 0.4)');
                ctx.fillStyle = farGrad;

                // 부드러운 모서리
                ctx.beginPath();
                ctx.moveTo(farX, canvas.height - 50);
                ctx.lineTo(farX, canvas.height - 50 - farHeight + 20);
                ctx.quadraticCurveTo(farX, canvas.height - 50 - farHeight, farX + 20, canvas.height - 50 - farHeight);
                ctx.lineTo(farX + 80, canvas.height - 50 - farHeight);
                ctx.quadraticCurveTo(farX + 100, canvas.height - 50 - farHeight, farX + 100, canvas.height - 50 - farHeight + 20);
                ctx.lineTo(farX + 100, canvas.height - 50);
                ctx.closePath();
                ctx.fill();
            }
        }

        // 메인 아파트 건물들
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 2; i++) {
                const buildingX = 100 + i * 350 - scroll + (repeat * canvas.width * 2);
                const buildingHeight = 280 + (i % 2) * 40;

                // 건물 그라데이션 (입체감)
                const buildingGrad = ctx.createLinearGradient(buildingX, 0, buildingX + 180, 0);
                buildingGrad.addColorStop(0, '#FFE4D6');
                buildingGrad.addColorStop(0.5, '#FFD4C4');
                buildingGrad.addColorStop(1, '#E8C4B4');
                ctx.fillStyle = buildingGrad;

                // 부드러운 건물 모양
                ctx.beginPath();
                ctx.moveTo(buildingX, canvas.height - 50);
                ctx.lineTo(buildingX, canvas.height - 50 - buildingHeight + 30);
                ctx.quadraticCurveTo(buildingX, canvas.height - 50 - buildingHeight, buildingX + 30, canvas.height - 50 - buildingHeight);
                ctx.lineTo(buildingX + 150, canvas.height - 50 - buildingHeight);
                ctx.quadraticCurveTo(buildingX + 180, canvas.height - 50 - buildingHeight, buildingX + 180, canvas.height - 50 - buildingHeight + 30);
                ctx.lineTo(buildingX + 180, canvas.height - 50);
                ctx.closePath();
                ctx.fill();

                // 부드러운 외곽선
                ctx.strokeStyle = 'rgba(200, 150, 120, 0.3)';
                ctx.lineWidth = 3;
                ctx.stroke();

                // 예쁜 창문들 (그라데이션 효과)
                for (let row = 0; row < Math.floor(buildingHeight / 45); row++) {
                    for (let col = 0; col < 3; col++) {
                        const winX = buildingX + 30 + col * 55;
                        const winY = canvas.height - buildingHeight + 20 + row * 45;

                        // 창문 그라데이션
                        const isLit = (i + row + col) % 3 !== 0;
                        const winGrad = ctx.createRadialGradient(winX + 15, winY + 15, 0, winX + 15, winY + 15, 20);
                        if (isLit) {
                            winGrad.addColorStop(0, '#FFF4E0');
                            winGrad.addColorStop(1, '#FFD700');
                        } else {
                            winGrad.addColorStop(0, '#B8E6FF');
                            winGrad.addColorStop(1, '#87CEEB');
                        }
                        ctx.fillStyle = winGrad;

                        // 둥근 창문
                        ctx.beginPath();
                        ctx.roundRect(winX, winY, 30, 30, 5);
                        ctx.fill();

                        // 창틀
                        ctx.strokeStyle = 'rgba(139, 69, 19, 0.4)';
                        ctx.lineWidth = 2;
                        ctx.stroke();

                        // 반짝임
                        if (isLit) {
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                            ctx.beginPath();
                            ctx.arc(winX + 8, winY + 8, 3, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }

                // 지붕 (더 입체적으로)
                ctx.fillStyle = '#D2691E';
                ctx.beginPath();
                ctx.moveTo(buildingX - 10, canvas.height - 50 - buildingHeight);
                ctx.lineTo(buildingX + 90, canvas.height - 50 - buildingHeight - 25);
                ctx.lineTo(buildingX + 190, canvas.height - 50 - buildingHeight);
                ctx.closePath();
                ctx.fill();

                // 지붕 하이라이트
                ctx.fillStyle = 'rgba(255, 140, 0, 0.3)';
                ctx.beginPath();
                ctx.moveTo(buildingX - 10, canvas.height - 50 - buildingHeight);
                ctx.lineTo(buildingX + 90, canvas.height - 50 - buildingHeight - 25);
                ctx.lineTo(buildingX + 90, canvas.height - 50 - buildingHeight - 20);
                ctx.lineTo(buildingX - 10, canvas.height - 50 - buildingHeight + 5);
                ctx.closePath();
                ctx.fill();
            }
        }

        // 나무들 추가
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 5; i++) {
                const treeX = 50 + i * 160 - scroll * 1.2 + (repeat * canvas.width * 2);
                drawCuteTree(ctx, treeX, canvas.height - 50);
            }
        }

        drawSunAndClouds(ctx, canvas, scrollX);
    },

    // 2. 학교 교실
    classroom: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 칠판들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const boardX = 300 - scroll * 0.3 + (repeat * canvas.width * 2);
            const boardY = 80;

            // 칠판 (입체감 있게)
            const boardGrad = ctx.createLinearGradient(boardX, boardY, boardX + 250, boardY);
            boardGrad.addColorStop(0, '#2F4F2F');
            boardGrad.addColorStop(0.5, '#3A5F3A');
            boardGrad.addColorStop(1, '#2F4F2F');
            ctx.fillStyle = boardGrad;
            ctx.beginPath();
            ctx.roundRect(boardX, boardY, 250, 150, 10);
            ctx.fill();

            // 칠판 테두리
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 8;
            ctx.stroke();

            // 칠판 하이라이트
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(boardX + 5, boardY + 5, 240, 140, 8);
            ctx.stroke();

            // 칠판 글씨 (분필 느낌)
            ctx.save();
            ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
            ctx.shadowBlur = 3;
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 32px Arial';
            ctx.fillText('ABC', boardX + 125, 140);
            ctx.font = 'bold 24px Arial';
            ctx.fillText('영어 공부!', boardX + 125, 180);
            ctx.restore();
        }

        // 책상들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 3; i++) {
                const deskX = 80 + i * 180 - scroll * 1.2 + (repeat * canvas.width * 2);
                const deskY = canvas.height - 110;

                // 책상 상판 (그라데이션)
                const deskGrad = ctx.createLinearGradient(deskX, deskY, deskX, deskY + 60);
                deskGrad.addColorStop(0, '#D2691E');
                deskGrad.addColorStop(1, '#A0522D');
                ctx.fillStyle = deskGrad;
                ctx.beginPath();
                ctx.roundRect(deskX, deskY, 100, 15, 5);
                ctx.fill();

                // 책상 다리
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(deskX + 10, deskY + 15, 12, 45);
                ctx.fillRect(deskX + 78, deskY + 15, 12, 45);

                // 책상 위 책
                ctx.fillStyle = '#FF6B6B';
                ctx.beginPath();
                ctx.roundRect(deskX + 20, deskY - 8, 30, 8, 2);
                ctx.fill();

                // 연필
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(deskX + 60, deskY);
                ctx.lineTo(deskX + 80, deskY);
                ctx.stroke();

                // 연필 끝
                ctx.fillStyle = '#FF6347';
                ctx.beginPath();
                ctx.arc(deskX + 60, deskY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 학용품들 바닥에
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 4; i++) {
                const itemX = 100 + i * 150 - scroll * 1.5 + (repeat * canvas.width * 2);
                drawCuteFlower(ctx, itemX, canvas.height - 50, ['#FF69B4', '#87CEEB', '#FFD700', '#98FB98'][i % 4]);
            }
        }

        // 창문들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 2; i++) {
                const windowX = 150 + i * 350 - scroll * 0.3 + (repeat * canvas.width * 2);
                const windowY = 80;

                // 창문 틀 (나무)
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 8;
                ctx.fillStyle = '#87CEEB';
                ctx.beginPath();
                ctx.roundRect(windowX, windowY, 120, 100, 5);
                ctx.fill();
                ctx.stroke();

                // 십자 창틀
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(windowX + 60, windowY);
                ctx.lineTo(windowX + 60, windowY + 100);
                ctx.moveTo(windowX, windowY + 50);
                ctx.lineTo(windowX + 120, windowY + 50);
                ctx.stroke();

                // 창문 밖 태양
                const gradient = ctx.createRadialGradient(windowX + 60, windowY + 40, 0, windowX + 60, windowY + 40, 20);
                gradient.addColorStop(0, '#FFD700');
                gradient.addColorStop(1, 'rgba(255, 215, 0, 0.3)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(windowX + 60, windowY + 40, 20, 0, Math.PI * 2);
                ctx.fill();

                // 구름 몇 개
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.beginPath();
                ctx.arc(windowX + 30, windowY + 70, 12, 0, Math.PI * 2);
                ctx.arc(windowX + 42, windowY + 70, 10, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    },

    // 3. 도서관
    library: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 책장들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 3; i++) {
                const shelfX = 50 + i * 220 - scroll + (repeat * canvas.width * 2);

                // 책장 틀 (입체감)
                const shelfGrad = ctx.createLinearGradient(shelfX, 0, shelfX + 150, 0);
                shelfGrad.addColorStop(0, '#8B4513');
                shelfGrad.addColorStop(0.5, '#A0522D');
                shelfGrad.addColorStop(1, '#8B4513');
                ctx.fillStyle = shelfGrad;
                ctx.beginPath();
                ctx.roundRect(shelfX, canvas.height - 220, 150, 170, 8);
                ctx.fill();

                // 책장 외곽선
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 4;
                ctx.stroke();

                // 책들 (다채롭고 입체적)
                const bookColors = [
                    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
                    '#98D8C8', '#FFD93D', '#A8E6CF', '#DDA0DD'
                ];

                for (let row = 0; row < 5; row++) {
                    for (let col = 0; col < 4; col++) {
                        const bookX = shelfX + 10 + col * 34;
                        const bookY = canvas.height - 205 + row * 32;
                        const bookColor = bookColors[(row * 4 + col + i) % bookColors.length];

                        // 책 그라데이션
                        const bookGrad = ctx.createLinearGradient(bookX, bookY, bookX + 30, bookY);
                        bookGrad.addColorStop(0, bookColor);
                        bookGrad.addColorStop(1, shadeColor(bookColor, -20));
                        ctx.fillStyle = bookGrad;

                        ctx.beginPath();
                        ctx.roundRect(bookX, bookY, 30, 28, 3);
                        ctx.fill();

                        // 책등 라인
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(bookX + 5, bookY);
                        ctx.lineTo(bookX + 5, bookY + 28);
                        ctx.stroke();

                        // 하이라이트
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                        ctx.fillRect(bookX + 2, bookY + 2, 8, 24);
                    }
                }

                // 책장 선반들
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 3;
                for (let s = 0; s < 6; s++) {
                    ctx.beginPath();
                    ctx.moveTo(shelfX, canvas.height - 215 + s * 32);
                    ctx.lineTo(shelfX + 150, canvas.height - 215 + s * 32);
                    ctx.stroke();
                }
            }
        }

        // 독서등들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 2; i++) {
                const lampX = 250 + i * 400 - scroll * 0.4 + (repeat * canvas.width * 2);
                const lampY = 80;

                // 전등갓
                const lampGrad = ctx.createLinearGradient(lampX - 40, lampY, lampX + 40, lampY);
                lampGrad.addColorStop(0, '#D4AF37');
                lampGrad.addColorStop(0.5, '#FFD700');
                lampGrad.addColorStop(1, '#D4AF37');
                ctx.fillStyle = lampGrad;
                ctx.beginPath();
                ctx.moveTo(lampX, lampY - 10);
                ctx.quadraticCurveTo(lampX - 40, lampY, lampX - 35, lampY + 30);
                ctx.lineTo(lampX + 35, lampY + 30);
                ctx.quadraticCurveTo(lampX + 40, lampY, lampX, lampY - 10);
                ctx.closePath();
                ctx.fill();

                // 전등 줄
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(lampX, 0);
                ctx.lineTo(lampX, lampY - 10);
                ctx.stroke();

                // 빛 효과 (부드럽게)
                const lightGrad = ctx.createRadialGradient(lampX, lampY + 30, 0, lampX, lampY + 30, 100);
                lightGrad.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
                lightGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)');
                lightGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
                ctx.fillStyle = lightGrad;
                ctx.beginPath();
                ctx.arc(lampX, lampY + 30, 100, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 바닥에 독서 쿠션들
        for (let repeat = -1; repeat <= 1; repeat++) {
            const cushionColors = ['#FF6B9D', '#4ECDC4', '#A8E6CF'];
            for (let i = 0; i < 3; i++) {
                const cushionX = 100 + i * 200 - scroll * 1.3 + (repeat * canvas.width * 2);
                const cushionGrad = ctx.createRadialGradient(cushionX, canvas.height - 70, 0, cushionX, canvas.height - 70, 25);
                cushionGrad.addColorStop(0, cushionColors[i]);
                cushionGrad.addColorStop(1, shadeColor(cushionColors[i], -30));
                ctx.fillStyle = cushionGrad;
                ctx.beginPath();
                ctx.roundRect(cushionX - 25, canvas.height - 85, 50, 35, 8);
                ctx.fill();
            }
        }
    },

    // 4. 문구점 (팬시점)
    stationery: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 예쁜 진열대 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 2; i++) {
                const displayX = 80 + i * 350 - scroll + (repeat * canvas.width * 2);

                // 진열대
                const displayGrad = ctx.createLinearGradient(displayX, canvas.height - 180, displayX, canvas.height - 50);
                displayGrad.addColorStop(0, '#FFB6D9');
                displayGrad.addColorStop(1, '#FF8DC7');
                ctx.fillStyle = displayGrad;
                ctx.beginPath();
                ctx.roundRect(displayX, canvas.height - 180, 180, 130, 15);
                ctx.fill();

                // 테두리
                ctx.strokeStyle = '#FF69B4';
                ctx.lineWidth = 5;
                ctx.stroke();

                // 문구류들 (귀엽게)
                // 연필들
                for (let p = 0; p < 3; p++) {
                    const pencilX = displayX + 20 + p * 30;
                    const pencilY = canvas.height - 160;
                    const pencilColors = ['#FFD700', '#87CEEB', '#FF6B9D'];

                    // 연필 몸통
                    const pencilGrad = ctx.createLinearGradient(pencilX, pencilY, pencilX + 15, pencilY);
                    pencilGrad.addColorStop(0, pencilColors[p]);
                    pencilGrad.addColorStop(1, shadeColor(pencilColors[p], -20));
                    ctx.fillStyle = pencilGrad;
                    ctx.beginPath();
                    ctx.roundRect(pencilX, pencilY, 15, 80, 3);
                    ctx.fill();

                    // 지우개 부분
                    ctx.fillStyle = '#FF6347';
                    ctx.beginPath();
                    ctx.roundRect(pencilX, pencilY, 15, 15, 3);
                    ctx.fill();

                    // 금속 띠
                    ctx.fillStyle = '#C0C0C0';
                    ctx.fillRect(pencilX, pencilY + 15, 15, 5);

                    // 연필심
                    ctx.fillStyle = '#8B4513';
                    ctx.beginPath();
                    ctx.moveTo(pencilX + 7.5, pencilY + 80);
                    ctx.lineTo(pencilX + 3, pencilY + 75);
                    ctx.lineTo(pencilX + 12, pencilY + 75);
                    ctx.closePath();
                    ctx.fill();
                }

                // 노트
                const noteX = displayX + 110;
                const noteY = canvas.height - 155;
                const noteGrad = ctx.createLinearGradient(noteX, noteY, noteX + 50, noteY);
                noteGrad.addColorStop(0, '#FFE5EC');
                noteGrad.addColorStop(1, '#FFD1DC');
                ctx.fillStyle = noteGrad;
                ctx.beginPath();
                ctx.roundRect(noteX, noteY, 50, 60, 5);
                ctx.fill();

                // 노트 링
                ctx.strokeStyle = '#C0C0C0';
                ctx.lineWidth = 2;
                for (let r = 0; r < 5; r++) {
                    ctx.beginPath();
                    ctx.arc(noteX + 10 + r * 10, noteY - 3, 3, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // 노트 라인들
                ctx.strokeStyle = 'rgba(135, 206, 250, 0.3)';
                ctx.lineWidth = 1;
                for (let l = 0; l < 8; l++) {
                    ctx.beginPath();
                    ctx.moveTo(noteX + 5, noteY + 10 + l * 6);
                    ctx.lineTo(noteX + 45, noteY + 10 + l * 6);
                    ctx.stroke();
                }

                // 하트 스티커
                const heartX = displayX + 130;
                const heartY = canvas.height - 80;
                ctx.fillStyle = '#FF1493';
                ctx.shadowColor = '#FF1493';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(heartX, heartY + 8);
                ctx.bezierCurveTo(heartX, heartY + 5, heartX - 5, heartY, heartX - 10, heartY);
                ctx.bezierCurveTo(heartX - 15, heartY, heartX - 15, heartY + 8, heartX - 15, heartY + 8);
                ctx.bezierCurveTo(heartX - 15, heartY + 15, heartX, heartY + 20, heartX, heartY + 25);
                ctx.bezierCurveTo(heartX, heartY + 20, heartX + 15, heartY + 15, heartX + 15, heartY + 8);
                ctx.bezierCurveTo(heartX + 15, heartY + 8, heartX + 15, heartY, heartX + 10, heartY);
                ctx.bezierCurveTo(heartX + 5, heartY, heartX, heartY + 5, heartX, heartY + 8);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // 반짝이는 별들 (애니메이션 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 8; i++) {
                const starX = 80 + i * 90 - scroll * 0.3 + (repeat * canvas.width * 2);
                const starY = 60 + Math.sin(i * 0.5) * 40;

                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 15;
                ctx.fillStyle = '#FFD700';
                drawStar(ctx, starX, starY, 5, 12, 5);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // 무지개 풍선들
        const balloonColors = ['#FF6B9D', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD'];
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 5; i++) {
                const balloonX = 100 + i * 150 - scroll * 1.2 + (repeat * canvas.width * 2);
                const balloonY = canvas.height - 90;

                // 풍선
                const balloonGrad = ctx.createRadialGradient(balloonX - 5, balloonY - 10, 5, balloonX, balloonY, 20);
                balloonGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                balloonGrad.addColorStop(0.3, balloonColors[i]);
                balloonGrad.addColorStop(1, shadeColor(balloonColors[i], -30));
                ctx.fillStyle = balloonGrad;
                ctx.beginPath();
                ctx.arc(balloonX, balloonY - 15, 18, 0, Math.PI * 2);
                ctx.fill();

                // 풍선 매듭
                ctx.fillStyle = shadeColor(balloonColors[i], -40);
                ctx.beginPath();
                ctx.moveTo(balloonX, balloonY - 15 + 18);
                ctx.quadraticCurveTo(balloonX - 3, balloonY + 8, balloonX, balloonY + 12);
                ctx.quadraticCurveTo(balloonX + 3, balloonY + 8, balloonX, balloonY - 15 + 18);
                ctx.fill();

                // 풍선 줄
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(balloonX, balloonY + 12);
                ctx.lineTo(balloonX, canvas.height - 50);
                ctx.stroke();
            }
        }
    },

    // 5. 놀이터
    playground: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 그네 (더 귀엽고 입체적)
        const swingX = 150;
        const swingY = canvas.height - 150;

        // 그네 기둥 (입체감)
        const poleGrad = ctx.createLinearGradient(0, 0, 10, 0);
        poleGrad.addColorStop(0, '#8B4513');
        poleGrad.addColorStop(0.5, '#A0522D');
        poleGrad.addColorStop(1, '#8B4513');
        ctx.fillStyle = poleGrad;
        ctx.beginPath();
        ctx.roundRect(swingX - 45, swingY, 15, 100, 5);
        ctx.roundRect(swingX + 30, swingY, 15, 100, 5);
        ctx.fill();

        // 그네 상단바
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.roundRect(swingX - 50, swingY, 100, 12, 6);
        ctx.fill();

        // 그네 체인
        ctx.strokeStyle = '#696969';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(swingX - 20, swingY + 12);
        ctx.lineTo(swingX - 20, swingY + 82);
        ctx.moveTo(swingX + 20, swingY + 12);
        ctx.lineTo(swingX + 20, swingY + 82);
        ctx.stroke();

        // 그네 좌석 (그라데이션)
        const seatGrad = ctx.createLinearGradient(swingX - 30, swingY + 82, swingX + 30, swingY + 82);
        seatGrad.addColorStop(0, '#FF6347');
        seatGrad.addColorStop(0.5, '#FF7F66');
        seatGrad.addColorStop(1, '#FF6347');
        ctx.fillStyle = seatGrad;
        ctx.beginPath();
        ctx.roundRect(swingX - 30, swingY + 82, 60, 12, 6);
        ctx.fill();

        // 미끄럼틀들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const slideX = 300 - scroll * 0.6 + (repeat * canvas.width * 2);
            const slideY = canvas.height - 50;

            // 미끄럼틀 계단
            for (let i = 0; i < 4; i++) {
                const stepGrad = ctx.createLinearGradient(slideX - 60, 0, slideX - 40, 0);
                stepGrad.addColorStop(0, '#FFD700');
                stepGrad.addColorStop(1, '#FFA500');
                ctx.fillStyle = stepGrad;
                ctx.beginPath();
                ctx.roundRect(slideX - 60, slideY - 30 - i * 25, 20, 8, 2);
                ctx.fill();
            }

            // 미끄럼틀 플랫폼
            const platformGrad = ctx.createLinearGradient(slideX - 70, 0, slideX - 20, 0);
            platformGrad.addColorStop(0, '#4169E1');
            platformGrad.addColorStop(1, '#5B9FED');
            ctx.fillStyle = platformGrad;
            ctx.beginPath();
            ctx.roundRect(slideX - 70, slideY - 130, 50, 10, 5);
            ctx.fill();

            // 미끄럼틀 슬라이드 부분 (곡선)
            const slideGrad = ctx.createLinearGradient(slideX - 20, slideY - 120, slideX + 60, slideY);
            slideGrad.addColorStop(0, '#FF6B9D');
            slideGrad.addColorStop(0.5, '#FF8DB3');
            slideGrad.addColorStop(1, '#FFB6D9');
            ctx.fillStyle = slideGrad;
            ctx.beginPath();
            ctx.moveTo(slideX - 20, slideY - 120);
            ctx.quadraticCurveTo(slideX + 20, slideY - 80, slideX + 40, slideY - 20);
            ctx.lineTo(slideX + 60, slideY - 20);
            ctx.quadraticCurveTo(slideX + 20, slideY - 70, slideX - 20, slideY - 110);
            ctx.closePath();
            ctx.fill();

            // 미끄럼틀 외곽선
            ctx.strokeStyle = '#FF1493';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(slideX - 20, slideY - 120);
            ctx.quadraticCurveTo(slideX + 20, slideY - 80, slideX + 40, slideY - 20);
            ctx.stroke();

            // 미끄럼틀 지지대
            ctx.strokeStyle = '#C0C0C0';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(slideX - 65, slideY - 120);
            ctx.lineTo(slideX - 65, slideY);
            ctx.moveTo(slideX + 55, slideY - 20);
            ctx.lineTo(slideX + 55, slideY);
            ctx.stroke();
        }

        // 시소 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const seesawX = 400 - scroll + (repeat * canvas.width * 2);
            const seesawY = canvas.height - 70;

            // 시소 받침대
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.moveTo(seesawX, seesawY);
            ctx.lineTo(seesawX - 20, seesawY + 30);
            ctx.lineTo(seesawX + 20, seesawY + 30);
            ctx.closePath();
            ctx.fill();

            // 시소 판
            const boardGrad = ctx.createLinearGradient(seesawX - 60, seesawY, seesawX + 60, seesawY);
            boardGrad.addColorStop(0, '#98FB98');
            boardGrad.addColorStop(0.5, '#7CFC7C');
            boardGrad.addColorStop(1, '#98FB98');
            ctx.fillStyle = boardGrad;
            ctx.save();
            ctx.translate(seesawX, seesawY);
            ctx.rotate(-0.1);
            ctx.beginPath();
            ctx.roundRect(-60, -5, 120, 10, 5);
            ctx.fill();
            ctx.restore();
        }

        // 나무들과 꽃들
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 4; i++) {
                const treeX = 80 + i * 180 - scroll * 1.2 + (repeat * canvas.width * 2);
                drawCuteTree(ctx, treeX, canvas.height - 50);
            }

            const flowerColors = ['#FF69B4', '#FFD700', '#87CEEB', '#FF6347'];
            for (let i = 0; i < 6; i++) {
                const flowerX = 50 + i * 130 - scroll * 1.5 + (repeat * canvas.width * 2);
                drawCuteFlower(ctx, flowerX, canvas.height - 50, flowerColors[i % 4]);
            }
        }

        drawSunAndClouds(ctx, canvas, scrollX);
    },

    // 6. 마트 (슈퍼마켓)
    supermarket: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 진열대들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 3; i++) {
                const shelfX = 80 + i * 220 - scroll + (repeat * canvas.width * 2);

                // 진열대 틀 (입체감)
                const shelfGrad = ctx.createLinearGradient(shelfX, canvas.height - 200, shelfX, canvas.height - 50);
                shelfGrad.addColorStop(0, '#E0E0E0');
                shelfGrad.addColorStop(0.5, '#C0C0C0');
                shelfGrad.addColorStop(1, '#A0A0A0');
                ctx.fillStyle = shelfGrad;
                ctx.beginPath();
                ctx.roundRect(shelfX, canvas.height - 200, 160, 150, 8);
                ctx.fill();

                // 진열대 외곽선
                ctx.strokeStyle = '#808080';
                ctx.lineWidth = 4;
                ctx.stroke();

                // 선반들
                ctx.strokeStyle = '#808080';
                ctx.lineWidth = 3;
                for (let s = 0; s < 4; s++) {
                    ctx.beginPath();
                    ctx.moveTo(shelfX, canvas.height - 190 + s * 38);
                    ctx.lineTo(shelfX + 160, canvas.height - 190 + s * 38);
                    ctx.stroke();
                }

                // 상품들 (귀엽게)
                const products = [
                    { color: '#FF6B6B', type: 'can' },
                    { color: '#4ECDC4', type: 'box' },
                    { color: '#FFD93D', type: 'bottle' },
                    { color: '#6BCB77', type: 'can' },
                    { color: '#A8E6CF', type: 'box' }
                ];

                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 4; col++) {
                        const prodX = shelfX + 15 + col * 38;
                        const prodY = canvas.height - 185 + row * 38;
                        const prod = products[(row * 4 + col + i) % products.length];

                        if (prod.type === 'can') {
                            // 캔 (원통형)
                            const canGrad = ctx.createLinearGradient(prodX, prodY, prodX + 30, prodY);
                            canGrad.addColorStop(0, shadeColor(prod.color, -20));
                            canGrad.addColorStop(0.5, prod.color);
                            canGrad.addColorStop(1, shadeColor(prod.color, -20));
                            ctx.fillStyle = canGrad;
                            ctx.beginPath();
                            ctx.roundRect(prodX, prodY, 30, 35, 5);
                            ctx.fill();

                            // 캔 하이라이트
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                            ctx.fillRect(prodX + 20, prodY + 5, 5, 25);
                        } else if (prod.type === 'box') {
                            // 박스
                            const boxGrad = ctx.createLinearGradient(prodX, prodY, prodX + 30, prodY + 35);
                            boxGrad.addColorStop(0, prod.color);
                            boxGrad.addColorStop(1, shadeColor(prod.color, -30));
                            ctx.fillStyle = boxGrad;
                            ctx.beginPath();
                            ctx.roundRect(prodX, prodY, 30, 35, 3);
                            ctx.fill();

                            // 박스 테이프
                            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(prodX, prodY + 17);
                            ctx.lineTo(prodX + 30, prodY + 17);
                            ctx.stroke();
                        } else {
                            // 병 (상부가 좁은 형태)
                            const bottleGrad = ctx.createRadialGradient(prodX + 15, prodY + 17, 0, prodX + 15, prodY + 17, 20);
                            bottleGrad.addColorStop(0, prod.color);
                            bottleGrad.addColorStop(1, shadeColor(prod.color, -25));
                            ctx.fillStyle = bottleGrad;

                            // 병 몸통
                            ctx.beginPath();
                            ctx.roundRect(prodX + 5, prodY + 10, 20, 25, 5);
                            ctx.fill();

                            // 병 목
                            ctx.beginPath();
                            ctx.roundRect(prodX + 10, prodY, 10, 12, 3);
                            ctx.fill();

                            // 반짝임
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                            ctx.beginPath();
                            ctx.arc(prodX + 18, prodY + 15, 4, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }
        }

        // 쇼핑카트들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const cartX = 350 - scroll * 0.4 + (repeat * canvas.width * 2);
            const cartY = canvas.height - 110;

            // 카트 손잡이
            ctx.strokeStyle = '#CC0000';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(cartX + 10, cartY);
            ctx.lineTo(cartX + 10, cartY - 30);
            ctx.quadraticCurveTo(cartX + 10, cartY - 40, cartX + 20, cartY - 40);
            ctx.stroke();

            // 카트 바구니
            const cartGrad = ctx.createLinearGradient(cartX, cartY, cartX + 70, cartY + 60);
            cartGrad.addColorStop(0, '#FF4444');
            cartGrad.addColorStop(1, '#CC0000');
            ctx.fillStyle = cartGrad;
            ctx.beginPath();
            ctx.roundRect(cartX + 15, cartY, 70, 60, 8);
            ctx.fill();

            // 카트 격자무늬
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            for (let g = 0; g < 3; g++) {
                ctx.beginPath();
                ctx.moveTo(cartX + 15, cartY + 15 + g * 15);
                ctx.lineTo(cartX + 85, cartY + 15 + g * 15);
                ctx.stroke();
            }

            // 바퀴 (입체적)
            const wheelPositions = [
                { x: cartX + 25, y: cartY + 65 },
                { x: cartX + 75, y: cartY + 65 }
            ];

            wheelPositions.forEach(wheel => {
                // 바퀴 그라데이션
                const wheelGrad = ctx.createRadialGradient(wheel.x, wheel.y, 0, wheel.x, wheel.y, 10);
                wheelGrad.addColorStop(0, '#333333');
                wheelGrad.addColorStop(0.6, '#000000');
                wheelGrad.addColorStop(1, '#333333');
                ctx.fillStyle = wheelGrad;
                ctx.beginPath();
                ctx.arc(wheel.x, wheel.y, 10, 0, Math.PI * 2);
                ctx.fill();

                // 바퀴 중심
                ctx.fillStyle = '#666666';
                ctx.beginPath();
                ctx.arc(wheel.x, wheel.y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // 식품 아이콘들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const iconColors = ['#FF6B6B', '#FFD700', '#4ECDC4', '#98FB98'];
            for (let i = 0; i < 5; i++) {
                const iconX = 60 + i * 150 - scroll * 1.3 + (repeat * canvas.width * 2);
                const iconY = canvas.height - 65;

                // 과일 표현 (사과/오렌지/바나나 등)
                const fruitGrad = ctx.createRadialGradient(iconX - 3, iconY - 3, 5, iconX, iconY, 15);
                fruitGrad.addColorStop(0, iconColors[i % 4]);
                fruitGrad.addColorStop(1, shadeColor(iconColors[i % 4], -30));
                ctx.fillStyle = fruitGrad;
                ctx.beginPath();
                ctx.arc(iconX, iconY, 15, 0, Math.PI * 2);
                ctx.fill();

                // 하이라이트
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(iconX - 5, iconY - 5, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    },

    // 7. 공원
    park: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 산책로 (부드러운 곡선)
        ctx.fillStyle = '#D2B48C';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 80);
        for (let x = 0; x < canvas.width; x += 50) {
            ctx.lineTo(x, canvas.height - 80 + Math.sin((x - scroll) * 0.02) * 5);
        }
        ctx.lineTo(canvas.width, canvas.height - 50);
        ctx.lineTo(0, canvas.height - 50);
        ctx.closePath();
        ctx.fill();

        // 산책로 테두리
        ctx.strokeStyle = '#A0826D';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 80);
        for (let x = 0; x < canvas.width; x += 50) {
            ctx.lineTo(x, canvas.height - 80 + Math.sin((x - scroll) * 0.02) * 5);
        }
        ctx.stroke();

        // 나무들 (귀여운 버전)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 5; i++) {
                const treeX = 80 + i * 160 - scroll + (repeat * canvas.width * 2);
                drawCuteTree(ctx, treeX, canvas.height - 80);
            }
        }

        // 벤치들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const benchX = 350 - scroll * 0.5 + (repeat * canvas.width * 2);
            const benchY = canvas.height - 110;

            // 벤치 등받이
            const benchBackGrad = ctx.createLinearGradient(benchX, benchY - 30, benchX, benchY);
            benchBackGrad.addColorStop(0, '#A0522D');
            benchBackGrad.addColorStop(1, '#8B4513');
            ctx.fillStyle = benchBackGrad;
            ctx.beginPath();
            ctx.roundRect(benchX + 10, benchY - 30, 100, 10, 3);
            ctx.fill();

            // 벤치 좌석
            const benchSeatGrad = ctx.createLinearGradient(benchX, benchY, benchX, benchY + 15);
            benchSeatGrad.addColorStop(0, '#D2691E');
            benchSeatGrad.addColorStop(1, '#A0522D');
            ctx.fillStyle = benchSeatGrad;
            ctx.beginPath();
            ctx.roundRect(benchX, benchY, 120, 15, 5);
            ctx.fill();

            // 벤치 다리
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.roundRect(benchX + 10, benchY + 15, 12, 35, 3);
            ctx.roundRect(benchX + 98, benchY + 15, 12, 35, 3);
            ctx.fill();
        }

        // 꽃들 (귀여운 버전)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const flowerColors = ['#FF69B4', '#FFD700', '#FF6347', '#87CEEB', '#9370DB'];
            for (let i = 0; i < 6; i++) {
                const flowerX = 60 + i * 120 - scroll * 1.3 + (repeat * canvas.width * 2);
                drawCuteFlower(ctx, flowerX, canvas.height - 80, flowerColors[i % flowerColors.length]);
            }
        }

        // 덤불들
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 4; i++) {
                const bushX = 100 + i * 200 - scroll * 0.8 + (repeat * canvas.width * 2);
                drawCuteBush(ctx, bushX, canvas.height - 80);
            }
        }

        drawSunAndClouds(ctx, canvas, scrollX);
    },

    // 8. 병원
    hospital: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 병원 건물 (더 입체적)
        const buildingX = canvas.width / 2 - 120;
        const buildingY = canvas.height - 270;

        // 건물 그라데이션
        const buildingGrad = ctx.createLinearGradient(buildingX, buildingY, buildingX + 240, buildingY);
        buildingGrad.addColorStop(0, '#F0F0F0');
        buildingGrad.addColorStop(0.5, '#FFFFFF');
        buildingGrad.addColorStop(1, '#E8E8E8');
        ctx.fillStyle = buildingGrad;
        ctx.beginPath();
        ctx.roundRect(buildingX, buildingY, 240, 220, 12);
        ctx.fill();

        // 건물 외곽선
        ctx.strokeStyle = '#B0B0B0';
        ctx.lineWidth = 5;
        ctx.stroke();

        // 십자가 표시 (입체감)
        const crossGrad = ctx.createRadialGradient(buildingX + 120, buildingY + 35, 0, buildingX + 120, buildingY + 35, 40);
        crossGrad.addColorStop(0, '#FF0000');
        crossGrad.addColorStop(1, '#CC0000');
        ctx.fillStyle = crossGrad;
        ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
        ctx.shadowBlur = 10;

        // 가로 부분
        ctx.beginPath();
        ctx.roundRect(buildingX + 85, buildingY + 25, 70, 22, 5);
        ctx.fill();

        // 세로 부분
        ctx.beginPath();
        ctx.roundRect(buildingX + 109, buildingY + 5, 22, 70, 5);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 창문들 (그라데이션 효과)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                const winX = buildingX + 20 + col * 55;
                const winY = buildingY + 90 + row * 50;

                const winGrad = ctx.createLinearGradient(winX, winY, winX + 40, winY + 40);
                winGrad.addColorStop(0, '#B8E6FF');
                winGrad.addColorStop(1, '#87CEEB');
                ctx.fillStyle = winGrad;
                ctx.beginPath();
                ctx.roundRect(winX, winY, 40, 40, 5);
                ctx.fill();

                // 창틀
                ctx.strokeStyle = '#A0A0A0';
                ctx.lineWidth = 2;
                ctx.stroke();

                // 십자 창틀
                ctx.beginPath();
                ctx.moveTo(winX + 20, winY);
                ctx.lineTo(winX + 20, winY + 40);
                ctx.moveTo(winX, winY + 20);
                ctx.lineTo(winX + 40, winY + 20);
                ctx.stroke();
            }
        }

        // 구급차 (스크롤, 더 입체적)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const ambX = 150 - scroll + (repeat * canvas.width * 2);
            const ambY = canvas.height - 120;

            // 구급차 본체
            const ambGrad = ctx.createLinearGradient(ambX, ambY, ambX + 120, ambY + 70);
            ambGrad.addColorStop(0, '#FFFFFF');
            ambGrad.addColorStop(1, '#E8E8E8');
            ctx.fillStyle = ambGrad;
            ctx.beginPath();
            ctx.roundRect(ambX, ambY, 120, 70, 8);
            ctx.fill();

            // 구급차 외곽선
            ctx.strokeStyle = '#C0C0C0';
            ctx.lineWidth = 3;
            ctx.stroke();

            // 구급차 창문
            const winGrad = ctx.createLinearGradient(ambX + 70, ambY + 10, ambX + 105, ambY + 30);
            winGrad.addColorStop(0, '#B8E6FF');
            winGrad.addColorStop(1, '#87CEEB');
            ctx.fillStyle = winGrad;
            ctx.beginPath();
            ctx.roundRect(ambX + 70, ambY + 10, 35, 25, 4);
            ctx.fill();

            // 십자가 마크 (옆면)
            ctx.fillStyle = '#FF0000';
            ctx.shadowColor = 'rgba(255, 0, 0, 0.4)';
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.roundRect(ambX + 30, ambY + 25, 30, 10, 2);
            ctx.fill();
            ctx.beginPath();
            ctx.roundRect(ambX + 40, ambY + 15, 10, 30, 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 경광등
            ctx.fillStyle = '#FF4444';
            ctx.shadowColor = '#FF0000';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(ambX + 85, ambY + 5, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 바퀴 (입체적)
            const wheels = [
                { x: ambX + 25, y: ambY + 75 },
                { x: ambX + 95, y: ambY + 75 }
            ];

            wheels.forEach(wheel => {
                const wheelGrad = ctx.createRadialGradient(wheel.x, wheel.y, 0, wheel.x, wheel.y, 14);
                wheelGrad.addColorStop(0, '#333333');
                wheelGrad.addColorStop(0.6, '#000000');
                wheelGrad.addColorStop(1, '#666666');
                ctx.fillStyle = wheelGrad;
                ctx.beginPath();
                ctx.arc(wheel.x, wheel.y, 14, 0, Math.PI * 2);
                ctx.fill();

                // 휠 림
                ctx.strokeStyle = '#999999';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(wheel.x, wheel.y, 8, 0, Math.PI * 2);
                ctx.stroke();
            });
        }

        // 의료 아이콘들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const iconX = 80 - scroll * 1.3 + (repeat * canvas.width * 2);

            // 하트 펄스
            ctx.strokeStyle = '#FF69B4';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#FF69B4';
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.moveTo(iconX, canvas.height - 70);
            ctx.lineTo(iconX + 20, canvas.height - 70);
            ctx.lineTo(iconX + 30, canvas.height - 80);
            ctx.lineTo(iconX + 40, canvas.height - 60);
            ctx.lineTo(iconX + 50, canvas.height - 70);
            ctx.lineTo(iconX + 70, canvas.height - 70);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    },

    // 9. 미술관
    artmuseum: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.4 % (canvas.width * 2);

        // 액자들 (스크롤, 더 예쁘게)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const frames = [
                { x: 100, y: 100, w: 110, h: 90, colors: ['#FF6B6B', '#FF8585', '#FFA0A0'] },
                { x: 280, y: 120, w: 130, h: 110, colors: ['#4ECDC4', '#6ED9D9', '#8EE5E5'] },
                { x: 480, y: 90, w: 100, h: 100, colors: ['#FFD93D', '#FFE05D', '#FFE77D'] },
                { x: 640, y: 110, w: 120, h: 95, colors: ['#A8E6CF', '#B8ECDA', '#C8F2E5'] }
            ];

            frames.forEach(frame => {
                const frameX = frame.x - scroll + (repeat * canvas.width * 2);

                // 액자 틀 (입체감)
                const frameGrad = ctx.createLinearGradient(frameX - 15, frame.y - 15, frameX + frame.w + 15, frame.y + frame.h + 15);
                frameGrad.addColorStop(0, '#8B4513');
                frameGrad.addColorStop(0.5, '#A0522D');
                frameGrad.addColorStop(1, '#654321');
                ctx.fillStyle = frameGrad;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.roundRect(frameX - 15, frame.y - 15, frame.w + 30, frame.h + 30, 8);
                ctx.fill();
                ctx.shadowBlur = 0;

                // 내부 틀
                ctx.fillStyle = '#D4AF37';
                ctx.beginPath();
                ctx.roundRect(frameX - 10, frame.y - 10, frame.w + 20, frame.h + 20, 6);
                ctx.fill();

                // 그림 (그라데이션)
                const paintGrad = ctx.createLinearGradient(frameX, frame.y, frameX + frame.w, frame.y + frame.h);
                paintGrad.addColorStop(0, frame.colors[0]);
                paintGrad.addColorStop(0.5, frame.colors[1]);
                paintGrad.addColorStop(1, frame.colors[2]);
                ctx.fillStyle = paintGrad;
                ctx.beginPath();
                ctx.roundRect(frameX, frame.y, frame.w, frame.h, 4);
                ctx.fill();

                // 추상화 패턴
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(frameX + 20 + i * 30, frame.y + frame.h / 2, 15, 0, Math.PI * 2);
                    ctx.fill();
                }

                // 유리 반사 효과
                const glassGrad = ctx.createLinearGradient(frameX, frame.y, frameX + frame.w / 2, frame.y + frame.h / 2);
                glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = glassGrad;
                ctx.fillRect(frameX, frame.y, frame.w / 2, frame.h / 2);
            });
        }

        // 조명 (더 입체적)
        const lightPositions = [150, 320, 490, 660];
        lightPositions.forEach(lightX => {
            // 조명 기구
            const lampGrad = ctx.createRadialGradient(lightX, 50, 0, lightX, 50, 20);
            lampGrad.addColorStop(0, '#FFD700');
            lampGrad.addColorStop(0.5, '#FFA500');
            lampGrad.addColorStop(1, '#D4AF37');
            ctx.fillStyle = lampGrad;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(lightX, 50, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 빛 효과 (부드럽게)
            const lightGrad = ctx.createRadialGradient(lightX, 50, 0, lightX, 50, 80);
            lightGrad.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
            lightGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)');
            lightGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = lightGrad;
            ctx.beginPath();
            ctx.arc(lightX, 50, 80, 0, Math.PI * 2);
            ctx.fill();

            // 빛줄기
            ctx.fillStyle = 'rgba(255, 235, 150, 0.15)';
            ctx.beginPath();
            ctx.moveTo(lightX - 15, 50);
            ctx.lineTo(lightX - 40, canvas.height - 50);
            ctx.lineTo(lightX + 40, canvas.height - 50);
            ctx.lineTo(lightX + 15, 50);
            ctx.closePath();
            ctx.fill();
        });

        // 팔레트와 붓 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const paletteX = 200 - scroll * 1.2 + (repeat * canvas.width * 2);
            const paletteY = canvas.height - 85;

            // 팔레트
            ctx.fillStyle = '#D2B48C';
            ctx.beginPath();
            ctx.ellipse(paletteX, paletteY, 40, 30, 0, 0, Math.PI * 2);
            ctx.fill();

            // 물감 방울들
            const paintColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i;
                const paintX = paletteX + Math.cos(angle) * 20;
                const paintY = paletteY + Math.sin(angle) * 15;

                ctx.fillStyle = paintColors[i];
                ctx.shadowColor = paintColors[i];
                ctx.shadowBlur = 5;
                ctx.beginPath();
                ctx.arc(paintX, paintY, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    },

    // 10. 동물원
    zoo: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 우리들 (스크롤, 더 입체적)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 3; i++) {
                const cageX = 80 + i * 240 - scroll + (repeat * canvas.width * 2);

                // 우리 바닥
                ctx.fillStyle = '#DEB887';
                ctx.beginPath();
                ctx.roundRect(cageX - 10, canvas.height - 160, 140, 110, 8);
                ctx.fill();

                // 우리 뒤편
                const backGrad = ctx.createLinearGradient(cageX, canvas.height - 160, cageX, canvas.height - 50);
                backGrad.addColorStop(0, '#654321');
                backGrad.addColorStop(1, '#8B4513');
                ctx.fillStyle = backGrad;
                ctx.fillRect(cageX - 5, canvas.height - 155, 130, 5);

                // 우리 창살 (입체감)
                for (let j = 0; j < 7; j++) {
                    const barX = cageX + j * 20;

                    // 창살 그라데이션
                    const barGrad = ctx.createLinearGradient(barX, 0, barX + 5, 0);
                    barGrad.addColorStop(0, '#8B4513');
                    barGrad.addColorStop(0.5, '#A0522D');
                    barGrad.addColorStop(1, '#654321');
                    ctx.fillStyle = barGrad;
                    ctx.beginPath();
                    ctx.roundRect(barX, canvas.height - 150, 5, 100, 2);
                    ctx.fill();

                    // 하이라이트
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.fillRect(barX, canvas.height - 150, 2, 100);
                }

                // 상단 가로대
                ctx.fillStyle = '#8B4513';
                ctx.beginPath();
                ctx.roundRect(cageX, canvas.height - 155, 120, 8, 4);
                ctx.fill();

                // 동물들 (귀엽고 입체적)
                if (i === 0) {
                    // 사자 (더 귀엽게)
                    const lionX = cageX + 60;
                    const lionY = canvas.height - 100;

                    // 몸통
                    const bodyGrad = ctx.createRadialGradient(lionX, lionY, 0, lionX, lionY, 30);
                    bodyGrad.addColorStop(0, '#FFD700');
                    bodyGrad.addColorStop(1, '#FFA500');
                    ctx.fillStyle = bodyGrad;
                    ctx.beginPath();
                    ctx.arc(lionX, lionY, 28, 0, Math.PI * 2);
                    ctx.fill();

                    // 갈기
                    ctx.fillStyle = '#FF8C00';
                    for (let m = 0; m < 12; m++) {
                        const angle = (Math.PI * 2 / 12) * m;
                        const maneX = lionX + Math.cos(angle) * 35;
                        const maneY = lionY + Math.sin(angle) * 35;
                        ctx.beginPath();
                        ctx.arc(maneX, maneY, 10, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // 얼굴
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(lionX, lionY, 22, 0, Math.PI * 2);
                    ctx.fill();

                    // 눈
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.arc(lionX - 8, lionY - 5, 3, 0, Math.PI * 2);
                    ctx.arc(lionX + 8, lionY - 5, 3, 0, Math.PI * 2);
                    ctx.fill();

                    // 코
                    ctx.fillStyle = '#8B4513';
                    ctx.beginPath();
                    ctx.arc(lionX, lionY + 5, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (i === 1) {
                    // 판다 (더 귀엽게)
                    const pandaX = cageX + 60;
                    const pandaY = canvas.height - 100;

                    // 얼굴
                    const faceGrad = ctx.createRadialGradient(pandaX, pandaY, 0, pandaX, pandaY, 28);
                    faceGrad.addColorStop(0, '#FFFFFF');
                    faceGrad.addColorStop(1, '#F0F0F0');
                    ctx.fillStyle = faceGrad;
                    ctx.beginPath();
                    ctx.arc(pandaX, pandaY, 28, 0, Math.PI * 2);
                    ctx.fill();

                    // 귀
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.arc(pandaX - 20, pandaY - 20, 10, 0, Math.PI * 2);
                    ctx.arc(pandaX + 20, pandaY - 20, 10, 0, Math.PI * 2);
                    ctx.fill();

                    // 눈 주위
                    ctx.beginPath();
                    ctx.ellipse(pandaX - 10, pandaY - 5, 8, 12, 0, 0, Math.PI * 2);
                    ctx.ellipse(pandaX + 10, pandaY - 5, 8, 12, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // 눈
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(pandaX - 10, pandaY - 5, 4, 0, Math.PI * 2);
                    ctx.arc(pandaX + 10, pandaY - 5, 4, 0, Math.PI * 2);
                    ctx.fill();

                    // 코
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.arc(pandaX, pandaY + 5, 5, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // 원숭이 (더 귀엽게)
                    const monkeyX = cageX + 60;
                    const monkeyY = canvas.height - 100;

                    // 얼굴
                    const monkeyGrad = ctx.createRadialGradient(monkeyX, monkeyY, 0, monkeyX, monkeyY, 28);
                    monkeyGrad.addColorStop(0, '#D2691E');
                    monkeyGrad.addColorStop(1, '#8B4513');
                    ctx.fillStyle = monkeyGrad;
                    ctx.beginPath();
                    ctx.arc(monkeyX, monkeyY, 28, 0, Math.PI * 2);
                    ctx.fill();

                    // 귀
                    ctx.fillStyle = '#A0522D';
                    ctx.beginPath();
                    ctx.arc(monkeyX - 25, monkeyY, 12, 0, Math.PI * 2);
                    ctx.arc(monkeyX + 25, monkeyY, 12, 0, Math.PI * 2);
                    ctx.fill();

                    // 얼굴 안쪽
                    ctx.fillStyle = '#F4A460';
                    ctx.beginPath();
                    ctx.ellipse(monkeyX, monkeyY + 5, 18, 15, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // 눈
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.arc(monkeyX - 8, monkeyY - 3, 4, 0, Math.PI * 2);
                    ctx.arc(monkeyX + 8, monkeyY - 3, 4, 0, Math.PI * 2);
                    ctx.fill();

                    // 입
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(monkeyX, monkeyY + 8, 8, 0, Math.PI);
                    ctx.stroke();
                }
            }
        }

        // 나무들
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 4; i++) {
                const treeX = 100 + i * 200 - scroll * 1.2 + (repeat * canvas.width * 2);
                drawCuteTree(ctx, treeX, canvas.height - 50);
            }
        }

        drawSunAndClouds(ctx, canvas, scrollX);
    },

    // 11. 수족관
    aquarium: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.3 % (canvas.width * 2);

        // 물고기들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const fishes = [
                { x: 100, y: 120, color: '#FF6347', size: 22 },
                { x: 280, y: 180, color: '#FFD700', size: 26 },
                { x: 460, y: 140, color: '#4169E1', size: 24 },
                { x: 640, y: 200, color: '#FF69B4', size: 20 },
                { x: 180, y: 260, color: '#00CED1', size: 25 }
            ];

            fishes.forEach(fish => {
                const fishX = fish.x - scroll + (repeat * canvas.width * 2);

                // 물고기 몸 (그라데이션)
                const bodyGrad = ctx.createRadialGradient(fishX + fish.size * 0.3, fish.y - fish.size * 0.2, 0, fishX, fish.y, fish.size);
                bodyGrad.addColorStop(0, fish.color);
                bodyGrad.addColorStop(0.6, shadeColor(fish.color, -15));
                bodyGrad.addColorStop(1, shadeColor(fish.color, -30));
                ctx.fillStyle = bodyGrad;
                ctx.shadowColor = fish.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.ellipse(fishX, fish.y, fish.size, fish.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // 꼬리 (더 부드럽게)
                ctx.fillStyle = shadeColor(fish.color, -20);
                ctx.beginPath();
                ctx.moveTo(fishX - fish.size, fish.y);
                ctx.quadraticCurveTo(fishX - fish.size * 1.3, fish.y - fish.size * 0.6, fishX - fish.size * 1.4, fish.y - fish.size * 0.4);
                ctx.quadraticCurveTo(fishX - fish.size * 1.2, fish.y, fishX - fish.size * 1.4, fish.y + fish.size * 0.4);
                ctx.quadraticCurveTo(fishX - fish.size * 1.3, fish.y + fish.size * 0.6, fishX - fish.size, fish.y);
                ctx.fill();

                // 지느러미
                ctx.fillStyle = shadeColor(fish.color, -10);
                ctx.beginPath();
                ctx.ellipse(fishX + fish.size * 0.3, fish.y + fish.size * 0.4, fish.size * 0.3, fish.size * 0.2, -0.5, 0, Math.PI * 2);
                ctx.fill();

                // 눈 (흰자)
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(fishX + fish.size * 0.5, fish.y - fish.size * 0.2, 6, 0, Math.PI * 2);
                ctx.fill();

                // 눈동자
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(fishX + fish.size * 0.5, fish.y - fish.size * 0.2, 3, 0, Math.PI * 2);
                ctx.fill();

                // 하이라이트
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(fishX + fish.size * 0.3, fish.y - fish.size * 0.3, fish.size * 0.2, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // 물방울들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 15; i++) {
                const bubbleX = 60 + i * 55 - scroll * 0.7 + (repeat * canvas.width * 2);
                const bubbleY = 80 + (i % 3) * 80;
                const bubbleSize = 4 + (i % 3) * 3;

                const bubbleGrad = ctx.createRadialGradient(bubbleX - 2, bubbleY - 2, 0, bubbleX, bubbleY, bubbleSize);
                bubbleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                bubbleGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');
                bubbleGrad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
                ctx.fillStyle = bubbleGrad;
                ctx.beginPath();
                ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
                ctx.fill();

                // 하이라이트
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(bubbleX - bubbleSize * 0.3, bubbleY - bubbleSize * 0.3, bubbleSize * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 해초 (스크롤, 더 입체적)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 6; i++) {
                const seaweedX = 100 + i * 140 - scroll * 1.1 + (repeat * canvas.width * 2);

                // 해초 그라데이션
                const seaweedGrad = ctx.createLinearGradient(seaweedX, canvas.height - 50, seaweedX, canvas.height - 200);
                seaweedGrad.addColorStop(0, '#228B22');
                seaweedGrad.addColorStop(0.5, '#2E8B57');
                seaweedGrad.addColorStop(1, '#3CB371');
                ctx.strokeStyle = seaweedGrad;
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(seaweedX, canvas.height - 50);
                ctx.bezierCurveTo(
                    seaweedX + 15, canvas.height - 100,
                    seaweedX - 10, canvas.height - 150,
                    seaweedX + 5, canvas.height - 190
                );
                ctx.stroke();

                // 두 번째 줄기
                ctx.beginPath();
                ctx.moveTo(seaweedX + 8, canvas.height - 50);
                ctx.bezierCurveTo(
                    seaweedX - 5, canvas.height - 90,
                    seaweedX + 20, canvas.height - 140,
                    seaweedX + 10, canvas.height - 180
                );
                ctx.stroke();

                // 하이라이트
                ctx.strokeStyle = 'rgba(144, 238, 144, 0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(seaweedX + 2, canvas.height - 50);
                ctx.bezierCurveTo(
                    seaweedX + 17, canvas.height - 100,
                    seaweedX - 8, canvas.height - 150,
                    seaweedX + 7, canvas.height - 190
                );
                ctx.stroke();
            }
        }

        // 산호 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const coralColors = ['#FF6B9D', '#FFB347', '#DDA0DD'];
            for (let i = 0; i < 4; i++) {
                const coralX = 150 + i * 180 - scroll * 0.9 + (repeat * canvas.width * 2);
                const coralY = canvas.height - 70;

                const coralGrad = ctx.createRadialGradient(coralX, coralY - 20, 0, coralX, coralY - 20, 25);
                coralGrad.addColorStop(0, coralColors[i % 3]);
                coralGrad.addColorStop(1, shadeColor(coralColors[i % 3], -30));
                ctx.fillStyle = coralGrad;

                // 여러 가지로 산호 표현
                for (let j = 0; j < 5; j++) {
                    ctx.beginPath();
                    ctx.ellipse(coralX - 15 + j * 8, coralY - 10 - j * 5, 6, 12, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    },

    // 12. 빵집 (베이커리)
    bakery: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 진열대 (더 입체적)
        const displayY = canvas.height - 195;
        const displayGrad = ctx.createLinearGradient(0, displayY, 0, canvas.height - 50);
        displayGrad.addColorStop(0, '#D2691E');
        displayGrad.addColorStop(0.5, '#CD853F');
        displayGrad.addColorStop(1, '#A0522D');
        ctx.fillStyle = displayGrad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(30, displayY, canvas.width - 60, 145, 12);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 진열대 외곽선
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 5;
        ctx.stroke();

        // 진열대 선반
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(40, displayY + 15 + i * 40);
            ctx.lineTo(canvas.width - 40, displayY + 15 + i * 40);
            ctx.stroke();
        }

        // 빵들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const breads = [
                { x: 100, y: canvas.height - 165, type: 'round', color: '#DEB887' },
                { x: 220, y: canvas.height - 155, type: 'long', color: '#F4A460' },
                { x: 360, y: canvas.height - 170, type: 'croissant', color: '#FFD700' },
                { x: 500, y: canvas.height - 160, type: 'round', color: '#CD853F' },
                { x: 640, y: canvas.height - 165, type: 'donut', color: '#FF69B4' }
            ];

            breads.forEach(bread => {
                const breadX = bread.x - scroll + (repeat * canvas.width * 2);

                if (bread.type === 'round') {
                    // 둥근 빵 (그라데이션)
                    const breadGrad = ctx.createRadialGradient(breadX - 5, bread.y - 8, 5, breadX, bread.y, 28);
                    breadGrad.addColorStop(0, bread.color);
                    breadGrad.addColorStop(0.6, shadeColor(bread.color, -15));
                    breadGrad.addColorStop(1, shadeColor(bread.color, -30));
                    ctx.fillStyle = breadGrad;
                    ctx.shadowColor = 'rgba(139, 69, 19, 0.4)';
                    ctx.shadowBlur = 5;
                    ctx.beginPath();
                    ctx.arc(breadX, bread.y, 26, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // 빵 표면 무늬
                    ctx.strokeStyle = shadeColor(bread.color, -40);
                    ctx.lineWidth = 1.5;
                    for (let i = 0; i < 3; i++) {
                        const angle = (Math.PI * 2 / 3) * i;
                        ctx.beginPath();
                        ctx.moveTo(breadX, bread.y);
                        ctx.lineTo(breadX + Math.cos(angle) * 18, bread.y + Math.sin(angle) * 18);
                        ctx.stroke();
                    }
                } else if (bread.type === 'long') {
                    // 바게트
                    const baguetteGrad = ctx.createLinearGradient(breadX - 35, bread.y, breadX + 35, bread.y);
                    baguetteGrad.addColorStop(0, shadeColor(bread.color, -20));
                    baguetteGrad.addColorStop(0.5, bread.color);
                    baguetteGrad.addColorStop(1, shadeColor(bread.color, -20));
                    ctx.fillStyle = baguetteGrad;
                    ctx.shadowColor = 'rgba(139, 69, 19, 0.4)';
                    ctx.shadowBlur = 5;
                    ctx.beginPath();
                    ctx.roundRect(breadX - 35, bread.y - 12, 70, 24, 12);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // 바게트 금
                    ctx.strokeStyle = shadeColor(bread.color, -40);
                    ctx.lineWidth = 2;
                    for (let i = 0; i < 4; i++) {
                        ctx.beginPath();
                        ctx.moveTo(breadX - 25 + i * 15, bread.y - 10);
                        ctx.lineTo(breadX - 20 + i * 15, bread.y + 10);
                        ctx.stroke();
                    }
                } else if (bread.type === 'croissant') {
                    // 크루아상 (더 입체적)
                    const croissantGrad = ctx.createRadialGradient(breadX - 5, bread.y - 5, 0, breadX, bread.y, 20);
                    croissantGrad.addColorStop(0, bread.color);
                    croissantGrad.addColorStop(1, shadeColor(bread.color, -25));
                    ctx.fillStyle = croissantGrad;
                    ctx.shadowColor = 'rgba(139, 69, 19, 0.4)';
                    ctx.shadowBlur = 5;

                    // 크루아상 모양
                    ctx.beginPath();
                    ctx.arc(breadX - 18, bread.y + 2, 16, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(breadX + 18, bread.y + 2, 16, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(breadX, bread.y - 8, 18, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // 결 표현
                    ctx.strokeStyle = shadeColor(bread.color, -35);
                    ctx.lineWidth = 1.5;
                    for (let i = 0; i < 5; i++) {
                        ctx.beginPath();
                        ctx.arc(breadX - 12 + i * 6, bread.y, 10, -0.3, 0.3);
                        ctx.stroke();
                    }
                } else if (bread.type === 'donut') {
                    // 도넛 (입체감)
                    const donutGrad = ctx.createRadialGradient(breadX - 5, bread.y - 5, 0, breadX, bread.y, 28);
                    donutGrad.addColorStop(0, bread.color);
                    donutGrad.addColorStop(1, shadeColor(bread.color, -30));
                    ctx.fillStyle = donutGrad;
                    ctx.shadowColor = 'rgba(139, 69, 19, 0.4)';
                    ctx.shadowBlur = 5;
                    ctx.beginPath();
                    ctx.arc(breadX, bread.y, 26, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // 도넛 구멍
                    const holeGrad = ctx.createRadialGradient(breadX, bread.y, 0, breadX, bread.y, 12);
                    holeGrad.addColorStop(0, '#F5F5DC');
                    holeGrad.addColorStop(1, '#E8DCC8');
                    ctx.fillStyle = holeGrad;
                    ctx.beginPath();
                    ctx.arc(breadX, bread.y, 11, 0, Math.PI * 2);
                    ctx.fill();

                    // 슈가 파우더
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    for (let i = 0; i < 8; i++) {
                        const angle = (Math.PI * 2 / 8) * i;
                        ctx.beginPath();
                        ctx.arc(breadX + Math.cos(angle) * 16, bread.y + Math.sin(angle) * 16, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            });
        }

        // 오븐들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const ovenX = 400 - scroll * 0.4 + (repeat * canvas.width * 2);
            const ovenY = canvas.height - 260;

            // 오븐 본체
            const ovenGrad = ctx.createLinearGradient(ovenX, ovenY, ovenX + 170, ovenY);
            ovenGrad.addColorStop(0, '#C0C0C0');
            ovenGrad.addColorStop(0.5, '#D3D3D3');
            ovenGrad.addColorStop(1, '#A9A9A9');
            ctx.fillStyle = ovenGrad;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.roundRect(ovenX, ovenY, 170, 210, 10);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 오븐 문 (유리)
            const glassGrad = ctx.createLinearGradient(ovenX + 20, ovenY + 40, ovenX + 150, ovenY + 120);
            glassGrad.addColorStop(0, '#FFE5B4');
            glassGrad.addColorStop(0.5, '#FFD700');
            glassGrad.addColorStop(1, '#FFA500');
            ctx.fillStyle = glassGrad;
            ctx.shadowColor = 'rgba(255, 165, 0, 0.5)';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.roundRect(ovenX + 20, ovenY + 40, 130, 90, 8);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 오븐 문 테두리
            ctx.strokeStyle = '#696969';
            ctx.lineWidth = 4;
            ctx.stroke();

            // 오븐 버튼들
            const buttonColors = ['#FF0000', '#00FF00', '#0000FF'];
            for (let i = 0; i < 3; i++) {
                const buttonGrad = ctx.createRadialGradient(ovenX + 40 + i * 45, ovenY + 155, 0, ovenX + 40 + i * 45, ovenY + 155, 12);
                buttonGrad.addColorStop(0, buttonColors[i]);
                buttonGrad.addColorStop(1, shadeColor(buttonColors[i], -40));
                ctx.fillStyle = buttonGrad;
                ctx.beginPath();
                ctx.arc(ovenX + 40 + i * 45, ovenY + 155, 12, 0, Math.PI * 2);
                ctx.fill();

                // 버튼 하이라이트
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(ovenX + 37 + i * 45, ovenY + 152, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            // 오븐 손잡이
            ctx.fillStyle = '#696969';
            ctx.beginPath();
            ctx.roundRect(ovenX + 55, ovenY + 180, 60, 15, 7);
            ctx.fill();
        }
    },

    // 13. 서점
    bookstore: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 책장들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 4; i++) {
                const shelfX = 30 + i * 200 - scroll + (repeat * canvas.width * 2);

                // 책장 틀 (입체감)
                const shelfGrad = ctx.createLinearGradient(shelfX, canvas.height - 210, shelfX, canvas.height - 50);
                shelfGrad.addColorStop(0, '#A0826D');
                shelfGrad.addColorStop(0.5, '#8B7355');
                shelfGrad.addColorStop(1, '#765432');
                ctx.fillStyle = shelfGrad;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.roundRect(shelfX, canvas.height - 210, 155, 160, 8);
                ctx.fill();
                ctx.shadowBlur = 0;

                // 책장 외곽선
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 4;
                ctx.stroke();

                // 책들 (더 입체적)
                const bookColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#DDA0DD', '#FFD93D', '#A8E6CF'];
                for (let row = 0; row < 5; row++) {
                    for (let col = 0; col < 5; col++) {
                        const bookX = shelfX + 10 + col * 29;
                        const bookY = canvas.height - 195 + row * 30;
                        const bookColor = bookColors[(row * 5 + col + i) % bookColors.length];

                        // 책 그라데이션
                        const bookGrad = ctx.createLinearGradient(bookX, bookY, bookX + 26, bookY);
                        bookGrad.addColorStop(0, shadeColor(bookColor, -20));
                        bookGrad.addColorStop(0.5, bookColor);
                        bookGrad.addColorStop(1, shadeColor(bookColor, -25));
                        ctx.fillStyle = bookGrad;

                        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                        ctx.shadowBlur = 3;
                        ctx.beginPath();
                        ctx.roundRect(bookX, bookY, 26, 28, 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;

                        // 책등 라인
                        ctx.strokeStyle = shadeColor(bookColor, -40);
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(bookX + 4, bookY);
                        ctx.lineTo(bookX + 4, bookY + 28);
                        ctx.stroke();

                        // 하이라이트
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        ctx.fillRect(bookX + 1, bookY + 1, 6, 26);

                        // 책 타이틀 라인
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                        ctx.lineWidth = 1;
                        for (let t = 0; t < 2; t++) {
                            ctx.beginPath();
                            ctx.moveTo(bookX + 6, bookY + 8 + t * 10);
                            ctx.lineTo(bookX + 24, bookY + 8 + t * 10);
                            ctx.stroke();
                        }
                    }
                }

                // 선반들
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 3;
                for (let s = 0; s < 6; s++) {
                    ctx.beginPath();
                    ctx.moveTo(shelfX, canvas.height - 205 + s * 30);
                    ctx.lineTo(shelfX + 155, canvas.height - 205 + s * 30);
                    ctx.stroke();
                }
            }
        }

        // 베스트셀러 표시판들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const signX = 350 - scroll * 0.3 + (repeat * canvas.width * 2);
            const signY = 80;

            // 표시판 배경
            const signGrad = ctx.createLinearGradient(signX, signY, signX + 150, signY + 60);
            signGrad.addColorStop(0, '#FFD700');
            signGrad.addColorStop(1, '#FFA500');
            ctx.fillStyle = signGrad;
            ctx.shadowColor = 'rgba(255, 165, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.roundRect(signX, signY, 150, 60, 10);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 표시판 외곽선
            ctx.strokeStyle = '#FF8C00';
            ctx.lineWidth = 4;
            ctx.stroke();

            // 베스트셀러 텍스트
            ctx.fillStyle = '#8B4513';
            ctx.font = 'bold 28px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('📚 BEST', signX + 75, signY + 40);
        }
        ctx.textAlign = 'left';

        // 책들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const iconColors = ['#FF6B9D', '#87CEEB', '#FFD700', '#98FB98'];
            for (let i = 0; i < 5; i++) {
                const bookX = 80 + i * 150 - scroll * 1.3 + (repeat * canvas.width * 2);
                const bookY = canvas.height - 70;

                // 책 세워진 형태
                const iconGrad = ctx.createLinearGradient(bookX, bookY, bookX + 20, bookY);
                iconGrad.addColorStop(0, iconColors[i % 4]);
                iconGrad.addColorStop(1, shadeColor(iconColors[i % 4], -30));
                ctx.fillStyle = iconGrad;
                ctx.beginPath();
                ctx.roundRect(bookX, bookY, 20, 35, 3);
                ctx.fill();

                // 책 페이지 효과
                ctx.fillStyle = '#F5F5DC';
                ctx.fillRect(bookX + 18, bookY + 2, 3, 31);
            }
        }
    },

    // 14. 운동장
    field: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 축구 골대 (더 입체적)
        const goalX = 120;
        const goalY = canvas.height - 165;

        // 골대 프레임 (입체감)
        const frameGrad = ctx.createLinearGradient(goalX, goalY, goalX + 90, goalY);
        frameGrad.addColorStop(0, '#E0E0E0');
        frameGrad.addColorStop(0.5, '#FFFFFF');
        frameGrad.addColorStop(1, '#D0D0D0');
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 6;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.roundRect(goalX, goalY, 90, 115, 5);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 골대 상단 (3D)
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.moveTo(goalX, goalY);
        ctx.lineTo(goalX + 20, goalY - 30);
        ctx.lineTo(goalX + 110, goalY - 30);
        ctx.lineTo(goalX + 90, goalY);
        ctx.closePath();
        ctx.fill();

        // 골망 (그물 무늬)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(goalX + i * 10, goalY);
            ctx.lineTo(goalX + 20 + i * 10, goalY - 30);
            ctx.lineTo(goalX + 20 + i * 10, goalY + 85);
            ctx.stroke();
        }
        for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.moveTo(goalX, goalY + i * 10);
            ctx.lineTo(goalX + 90, goalY + i * 10);
            ctx.stroke();
        }

        // 축구공 (더 입체적)
        const ballX = canvas.width / 2;
        const ballY = canvas.height - 110;

        // 공 그라데이션
        const ballGrad = ctx.createRadialGradient(ballX - 8, ballY - 8, 5, ballX, ballY, 28);
        ballGrad.addColorStop(0, '#FFFFFF');
        ballGrad.addColorStop(0.7, '#E8E8E8');
        ballGrad.addColorStop(1, '#C0C0C0');
        ctx.fillStyle = ballGrad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 공 외곽선
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 오각형 무늬들
        ctx.fillStyle = '#000000';
        const pentagons = [
            { x: 0, y: 0 },
            { x: 15, y: -10 },
            { x: -15, y: -10 },
            { x: 10, y: 12 },
            { x: -10, y: 12 }
        ];

        pentagons.forEach(pentagon => {
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                const px = ballX + pentagon.x + Math.cos(angle) * 6;
                const py = ballY + pentagon.y + Math.sin(angle) * 6;
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
            ctx.fill();
        });

        // 트랙 라인들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            // 점선 트랙
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 4;
            ctx.setLineDash([25, 15]);
            ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
            ctx.shadowBlur = 3;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(0 - scroll + (repeat * canvas.width * 2), canvas.height - 210 + i * 40);
                ctx.lineTo(canvas.width - scroll + (repeat * canvas.width * 2), canvas.height - 210 + i * 40);
                ctx.stroke();
            }
            ctx.setLineDash([]);
            ctx.shadowBlur = 0;
        }

        // 깃발들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const flagColors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#98FB98'];
            for (let i = 0; i < 5; i++) {
                const flagX = 150 + i * 150 - scroll * 1.2 + (repeat * canvas.width * 2);
                const flagY = canvas.height - 80;

                // 깃대
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(flagX, flagY);
                ctx.lineTo(flagX, flagY - 50);
                ctx.stroke();

                // 깃발
                const flagGrad = ctx.createLinearGradient(flagX, flagY - 50, flagX + 30, flagY - 30);
                flagGrad.addColorStop(0, flagColors[i % 4]);
                flagGrad.addColorStop(1, shadeColor(flagColors[i % 4], -30));
                ctx.fillStyle = flagGrad;
                ctx.shadowColor = flagColors[i % 4];
                ctx.shadowBlur = 5;
                ctx.beginPath();
                ctx.moveTo(flagX, flagY - 50);
                ctx.lineTo(flagX + 30, flagY - 40);
                ctx.lineTo(flagX, flagY - 30);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        drawSunAndClouds(ctx, canvas, scrollX);
    },

    // 15. 음악실
    musicroom: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 피아노 (더 입체적)
        const pianoX = 120;
        const pianoY = canvas.height - 165;

        // 피아노 본체
        const pianoGrad = ctx.createLinearGradient(pianoX, pianoY, pianoX + 230, pianoY + 115);
        pianoGrad.addColorStop(0, '#1A1A1A');
        pianoGrad.addColorStop(0.5, '#000000');
        pianoGrad.addColorStop(1, '#0A0A0A');
        ctx.fillStyle = pianoGrad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(pianoX, pianoY, 230, 115, 8);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 피아노 광택
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(pianoX + 5, pianoY + 5, 220, 40);

        // 흰 건반 (더 입체적)
        for (let i = 0; i < 7; i++) {
            const keyX = pianoX + 10 + i * 30;
            const keyY = pianoY + 30;

            const keyGrad = ctx.createLinearGradient(keyX, keyY, keyX + 28, keyY + 75);
            keyGrad.addColorStop(0, '#FFFFFF');
            keyGrad.addColorStop(0.7, '#F5F5F5');
            keyGrad.addColorStop(1, '#E0E0E0');
            ctx.fillStyle = keyGrad;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 3;
            ctx.beginPath();
            ctx.roundRect(keyX, keyY, 28, 75, 3);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 건반 외곽선
            ctx.strokeStyle = '#CCCCCC';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // 검은 건반 (더 입체적)
        for (let i = 0; i < 6; i++) {
            if (i !== 2) {  // E와 F 사이는 검은 건반 없음
                const blackKeyX = pianoX + 28 + i * 30;
                const blackKeyY = pianoY + 30;

                const blackKeyGrad = ctx.createLinearGradient(blackKeyX, blackKeyY, blackKeyX + 16, blackKeyY + 45);
                blackKeyGrad.addColorStop(0, '#2A2A2A');
                blackKeyGrad.addColorStop(0.5, '#000000');
                blackKeyGrad.addColorStop(1, '#1A1A1A');
                ctx.fillStyle = blackKeyGrad;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.roundRect(blackKeyX, blackKeyY, 16, 45, 3);
                ctx.fill();
                ctx.shadowBlur = 0;

                // 하이라이트
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(blackKeyX + 2, blackKeyY + 2, 4, 40);
            }
        }

        // 음표들이 떠다니는 효과 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const notes = ['♪', '♫', '♬', '♩', '♭'];
            const noteColors = ['#FF69B4', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD'];

            for (let i = 0; i < 10; i++) {
                const noteX = 380 + i * 70 - scroll * 0.8 + (repeat * canvas.width * 2);
                const noteY = 90 + Math.sin(i * 0.7) * 50;

                ctx.fillStyle = noteColors[i % noteColors.length];
                ctx.shadowColor = noteColors[i % noteColors.length];
                ctx.shadowBlur = 8;
                ctx.font = 'bold 45px Arial';
                ctx.fillText(notes[i % notes.length], noteX, noteY);
                ctx.shadowBlur = 0;
            }
        }

        // 마이크들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const micX = 350 - scroll * 0.4 + (repeat * canvas.width * 2);
            const micY = canvas.height - 165;

            // 마이크 스탠드
            const standGrad = ctx.createLinearGradient(micX, micY, micX + 15, micY + 115);
            standGrad.addColorStop(0, '#A0A0A0');
            standGrad.addColorStop(0.5, '#C0C0C0');
            standGrad.addColorStop(1, '#808080');
            ctx.fillStyle = standGrad;
            ctx.beginPath();
            ctx.roundRect(micX, micY, 15, 115, 7);
            ctx.fill();

            // 마이크 헤드
            const micHeadGrad = ctx.createRadialGradient(micX + 7, micY - 20, 0, micX + 7, micY - 20, 25);
            micHeadGrad.addColorStop(0, '#E0E0E0');
            micHeadGrad.addColorStop(0.5, '#C0C0C0');
            micHeadGrad.addColorStop(1, '#A0A0A0');
            ctx.fillStyle = micHeadGrad;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(micX + 7, micY - 20, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 마이크 그릴 무늬
            ctx.strokeStyle = '#888888';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(micX + 7, micY - 20, 10 + i * 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        // 악보 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 3; i++) {
                const sheetX = 100 + i * 220 - scroll * 1.1 + (repeat * canvas.width * 2);
                const sheetY = canvas.height - 85;

                // 악보지
                const sheetGrad = ctx.createLinearGradient(sheetX, sheetY, sheetX + 60, sheetY + 45);
                sheetGrad.addColorStop(0, '#FFFFFF');
                sheetGrad.addColorStop(1, '#F5F5DC');
                ctx.fillStyle = sheetGrad;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                ctx.shadowBlur = 5;
                ctx.beginPath();
                ctx.roundRect(sheetX, sheetY, 60, 45, 3);
                ctx.fill();
                ctx.shadowBlur = 0;

                // 오선지
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1;
                for (let j = 0; j < 5; j++) {
                    ctx.beginPath();
                    ctx.moveTo(sheetX + 5, sheetY + 10 + j * 6);
                    ctx.lineTo(sheetX + 55, sheetY + 10 + j * 6);
                    ctx.stroke();
                }

                // 음표
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 16px Arial';
                ctx.fillText('♪', sheetX + 15, sheetY + 20);
                ctx.fillText('♫', sheetX + 35, sheetY + 25);
            }
        }
    },

    // 16. 과학실
    sciencelab: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 실험 테이블 (더 입체적)
        const tableY = canvas.height - 165;
        const tableGrad = ctx.createLinearGradient(0, tableY, 0, canvas.height - 50);
        tableGrad.addColorStop(0, '#B0B0B0');
        tableGrad.addColorStop(0.5, '#A9A9A9');
        tableGrad.addColorStop(1, '#909090');
        ctx.fillStyle = tableGrad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(30, tableY, canvas.width - 60, 115, 8);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 테이블 외곽선
        ctx.strokeStyle = '#696969';
        ctx.lineWidth = 4;
        ctx.stroke();

        // 비커들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const beakers = [
                { x: 140, color: '#FF6B6B', height: 85 },
                { x: 290, color: '#4ECDC4', height: 75 },
                { x: 440, color: '#FFD93D', height: 90 },
                { x: 590, color: '#6BCB77', height: 80 }
            ];

            beakers.forEach(beaker => {
                const beakerX = beaker.x - scroll + (repeat * canvas.width * 2);

                // 비커 본체 (유리 효과)
                ctx.strokeStyle = 'rgba(160, 160, 160, 0.8)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(beakerX - 28, tableY + 15);
                ctx.lineTo(beakerX - 22, tableY + 85);
                ctx.lineTo(beakerX + 22, tableY + 85);
                ctx.lineTo(beakerX + 28, tableY + 15);
                ctx.stroke();

                // 액체 (그라데이션)
                const liquidGrad = ctx.createLinearGradient(beakerX - 20, tableY + beaker.height, beakerX + 20, tableY + 85);
                liquidGrad.addColorStop(0, beaker.color);
                liquidGrad.addColorStop(1, shadeColor(beaker.color, -30));
                ctx.fillStyle = liquidGrad;
                ctx.globalAlpha = 0.7;
                ctx.shadowColor = beaker.color;
                ctx.shadowBlur = 10;
                ctx.fillRect(beakerX - 20, tableY + beaker.height, 40, 85 - beaker.height);
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1.0;

                // 유리 반사 효과
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(beakerX - 18, tableY + beaker.height, 8, 20);

                // 눈금선
                ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
                ctx.lineWidth = 1;
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.moveTo(beakerX - 20, tableY + 30 + i * 12);
                    ctx.lineTo(beakerX - 15, tableY + 30 + i * 12);
                    ctx.stroke();
                }

                // 기포들
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                for (let i = 0; i < 4; i++) {
                    const bubbleSize = 2 + Math.random() * 3;
                    ctx.beginPath();
                    ctx.arc(beakerX - 10 + Math.random() * 20, tableY + beaker.height + 10 + i * 15, bubbleSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        }

        // 현미경들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const microscopeX = 400 - scroll * 0.3 + (repeat * canvas.width * 2);
            const microscopeY = tableY + 25;

            // 현미경 베이스
            const baseGrad = ctx.createRadialGradient(microscopeX, microscopeY + 75, 0, microscopeX, microscopeY + 75, 30);
            baseGrad.addColorStop(0, '#808080');
            baseGrad.addColorStop(1, '#505050');
            ctx.fillStyle = baseGrad;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(microscopeX, microscopeY + 75, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 현미경 암
            const armGrad = ctx.createLinearGradient(microscopeX - 10, microscopeY, microscopeX + 10, microscopeY + 60);
            armGrad.addColorStop(0, '#696969');
            armGrad.addColorStop(1, '#505050');
            ctx.fillStyle = armGrad;
            ctx.beginPath();
            ctx.roundRect(microscopeX - 12, microscopeY, 24, 55, 5);
            ctx.fill();

            // 현미경 렌즈
            const lensGrad = ctx.createRadialGradient(microscopeX, microscopeY - 5, 0, microscopeX, microscopeY - 5, 18);
            lensGrad.addColorStop(0, '#87CEEB');
            lensGrad.addColorStop(0.5, '#4682B4');
            lensGrad.addColorStop(1, '#36648B');
            ctx.fillStyle = lensGrad;
            ctx.shadowColor = 'rgba(70, 130, 180, 0.5)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(microscopeX, microscopeY - 5, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 하이라이트
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(microscopeX - 6, microscopeY - 10, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // 분자 구조 그림 (더 예쁘게)
        const moleculeX = 120;
        const moleculeY = 90;
        const atoms = [
            { x: moleculeX, y: moleculeY, color: '#FF6347' },
            { x: moleculeX + 60, y: moleculeY + 25, color: '#4169E1' },
            { x: moleculeX + 120, y: moleculeY, color: '#32CD32' },
            { x: moleculeX + 90, y: moleculeY - 40, color: '#FFD700' }
        ];

        // 분자 결합선
        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        for (let i = 0; i < atoms.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(atoms[i].x, atoms[i].y);
            ctx.lineTo(atoms[i + 1].x, atoms[i + 1].y);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(atoms[3].x, atoms[3].y);
        ctx.lineTo(atoms[0].x, atoms[0].y);
        ctx.stroke();

        // 원자들
        atoms.forEach(atom => {
            const atomGrad = ctx.createRadialGradient(atom.x - 3, atom.y - 3, 0, atom.x, atom.y, 15);
            atomGrad.addColorStop(0, atom.color);
            atomGrad.addColorStop(1, shadeColor(atom.color, -30));
            ctx.fillStyle = atomGrad;
            ctx.shadowColor = atom.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(atom.x, atom.y, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 하이라이트
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(atom.x - 5, atom.y - 5, 5, 0, Math.PI * 2);
            ctx.fill();
        });

        // 플라스크들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const flaskColors = ['#9370DB', '#20B2AA'];
            for (let i = 0; i < 2; i++) {
                const flaskX = 200 + i * 250 - scroll * 1.2 + (repeat * canvas.width * 2);
                const flaskY = canvas.height - 90;

                // 플라스크 몸통
                const flaskGrad = ctx.createRadialGradient(flaskX, flaskY - 10, 0, flaskX, flaskY, 22);
                flaskGrad.addColorStop(0, flaskColors[i]);
                flaskGrad.addColorStop(1, shadeColor(flaskColors[i], -30));
                ctx.fillStyle = flaskGrad;
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(flaskX, flaskY, 20, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                // 플라스크 목
                ctx.strokeStyle = 'rgba(160, 160, 160, 0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(flaskX - 5, flaskY - 20);
                ctx.lineTo(flaskX - 5, flaskY - 35);
                ctx.lineTo(flaskX + 5, flaskY - 35);
                ctx.lineTo(flaskX + 5, flaskY - 20);
                ctx.stroke();
            }
        }
    },

    // 17. 체육관
    gym: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 농구대들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const hoopX = 350 - scroll * 0.4 + (repeat * canvas.width * 2);
            const hoopY = canvas.height - 215;

            // 농구대 폴
            const poleGrad = ctx.createLinearGradient(hoopX - 10, hoopY, hoopX + 10, hoopY + 165);
            poleGrad.addColorStop(0, '#FF6347');
            poleGrad.addColorStop(0.5, '#FF4500');
            poleGrad.addColorStop(1, '#DC143C');
            ctx.fillStyle = poleGrad;
            ctx.shadowColor = 'rgba(255, 69, 0, 0.4)';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.roundRect(hoopX - 12, hoopY, 24, 165, 8);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 백보드
            const backboardGrad = ctx.createLinearGradient(hoopX - 60, hoopY, hoopX + 60, hoopY);
            backboardGrad.addColorStop(0, '#FFFFFF');
            backboardGrad.addColorStop(0.5, '#F0F0F0');
            backboardGrad.addColorStop(1, '#E0E0E0');
            ctx.fillStyle = backboardGrad;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.roundRect(hoopX - 60, hoopY - 5, 120, 6, 3);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 백보드 사각형
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 3;
            ctx.strokeRect(hoopX - 30, hoopY + 10, 60, 40);

            // 농구 골대 링
            ctx.strokeStyle = '#FF6347';
            ctx.lineWidth = 4;
            ctx.shadowColor = 'rgba(255, 69, 0, 0.5)';
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.arc(hoopX, hoopY, 32, Math.PI, 0);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // 골대 그물
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.moveTo(hoopX - 32 + i * 8, hoopY);
                ctx.lineTo(hoopX - 28 + i * 7, hoopY + 25);
                ctx.stroke();
            }
        }

        // 농구공 (더 입체적)
        const ballX = canvas.width / 2;
        const ballY = canvas.height - 165;

        // 공 그라데이션
        const ballGrad = ctx.createRadialGradient(ballX - 10, ballY - 10, 5, ballX, ballY, 32);
        ballGrad.addColorStop(0, '#FF8C00');
        ballGrad.addColorStop(0.6, '#FF7F00');
        ballGrad.addColorStop(1, '#D2691E');
        ctx.fillStyle = ballGrad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 농구공 외곽선
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 농구공 곡선들
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 30, 0, Math.PI * 2);
        ctx.stroke();

        // 세로 곡선
        ctx.beginPath();
        ctx.moveTo(ballX - 30, ballY);
        ctx.bezierCurveTo(ballX - 10, ballY - 18, ballX + 10, ballY + 18, ballX + 30, ballY);
        ctx.stroke();

        // 가로 곡선
        ctx.beginPath();
        ctx.moveTo(ballX, ballY - 30);
        ctx.bezierCurveTo(ballX + 15, ballY - 12, ballX - 15, ballY + 12, ballX, ballY + 30);
        ctx.stroke();

        // 매트들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const matColors = ['#4169E1', '#FF6B9D', '#32CD32'];
            for (let i = 0; i < 3; i++) {
                const matX = 120 + i * 200 - scroll + (repeat * canvas.width * 2);
                const matY = canvas.height - 95;

                // 매트 그라데이션
                const matGrad = ctx.createLinearGradient(matX, matY, matX + 160, matY + 45);
                matGrad.addColorStop(0, matColors[i]);
                matGrad.addColorStop(1, shadeColor(matColors[i], -30));
                ctx.fillStyle = matGrad;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 5;
                ctx.beginPath();
                ctx.roundRect(matX, matY, 160, 45, 5);
                ctx.fill();
                ctx.shadowBlur = 0;

                // 매트 외곽선
                ctx.strokeStyle = shadeColor(matColors[i], -40);
                ctx.lineWidth = 4;
                ctx.stroke();

                // 매트 패턴
                ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
                ctx.lineWidth = 2;
                for (let p = 0; p < 4; p++) {
                    ctx.beginPath();
                    ctx.moveTo(matX + 10 + p * 40, matY);
                    ctx.lineTo(matX + 10 + p * 40, matY + 45);
                    ctx.stroke();
                }
            }
        }

        // 트로피들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 4; i++) {
                const trophyX = 150 + i * 160 - scroll * 1.3 + (repeat * canvas.width * 2);
                const trophyY = canvas.height - 75;

                // 트로피 컵
                const trophyGrad = ctx.createLinearGradient(trophyX, trophyY - 25, trophyX, trophyY);
                trophyGrad.addColorStop(0, '#FFD700');
                trophyGrad.addColorStop(1, '#FFA500');
                ctx.fillStyle = trophyGrad;
                ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.moveTo(trophyX - 12, trophyY - 25);
                ctx.lineTo(trophyX - 8, trophyY);
                ctx.lineTo(trophyX + 8, trophyY);
                ctx.lineTo(trophyX + 12, trophyY - 25);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;

                // 트로피 손잡이
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(trophyX - 12, trophyY - 15, 5, -Math.PI / 2, Math.PI / 2);
                ctx.arc(trophyX + 12, trophyY - 15, 5, Math.PI / 2, -Math.PI / 2);
                ctx.stroke();

                // 트로피 받침
                ctx.fillStyle = '#D4AF37';
                ctx.fillRect(trophyX - 10, trophyY, 20, 3);
                ctx.fillRect(trophyX - 6, trophyY + 3, 12, 5);
            }
        }
    },

    // 18. 박물관
    museum: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.4 % (canvas.width * 2);

        // 전시물 받침대들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 3; i++) {
                const pedestalX = 140 + i * 250 - scroll + (repeat * canvas.width * 2);

                // 받침대 (입체감)
                const pedestalGrad = ctx.createLinearGradient(pedestalX, canvas.height - 165, pedestalX, canvas.height - 50);
                pedestalGrad.addColorStop(0, '#A0826D');
                pedestalGrad.addColorStop(0.5, '#8B7355');
                pedestalGrad.addColorStop(1, '#654321');
                ctx.fillStyle = pedestalGrad;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.roundRect(pedestalX, canvas.height - 165, 90, 115, 8);
                ctx.fill();
                ctx.shadowBlur = 0;

                // 받침대 외곽선
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 4;
                ctx.stroke();

                // 상단 평판
                const topGrad = ctx.createLinearGradient(pedestalX - 5, canvas.height - 165, pedestalX + 95, canvas.height - 165);
                topGrad.addColorStop(0, '#B8956A');
                topGrad.addColorStop(1, '#A0826D');
                ctx.fillStyle = topGrad;
                ctx.beginPath();
                ctx.roundRect(pedestalX - 5, canvas.height - 170, 100, 10, 5);
                ctx.fill();

                // 전시물들
                if (i === 0) {
                    // 항아리 (더 입체적)
                    const vaseX = pedestalX + 45;
                    const vaseY = canvas.height - 165;

                    const vaseGrad = ctx.createLinearGradient(vaseX - 30, vaseY - 40, vaseX + 30, vaseY);
                    vaseGrad.addColorStop(0, '#CD853F');
                    vaseGrad.addColorStop(0.5, '#8B4513');
                    vaseGrad.addColorStop(1, '#654321');
                    ctx.fillStyle = vaseGrad;
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                    ctx.shadowBlur = 6;

                    // 항아리 하단
                    ctx.beginPath();
                    ctx.ellipse(vaseX, vaseY, 28, 16, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // 항아리 몸체
                    ctx.fillRect(vaseX - 26, vaseY - 42, 52, 42);

                    // 항아리 상단
                    ctx.beginPath();
                    ctx.ellipse(vaseX, vaseY - 42, 22, 12, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // 항아리 목
                    ctx.fillRect(vaseX - 10, vaseY - 55, 20, 15);
                    ctx.beginPath();
                    ctx.ellipse(vaseX, vaseY - 55, 11, 6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // 항아리 무늬
                    ctx.strokeStyle = 'rgba(218, 165, 32, 0.6)';
                    ctx.lineWidth = 2;
                    for (let p = 0; p < 3; p++) {
                        ctx.beginPath();
                        ctx.moveTo(vaseX - 24, vaseY - 35 + p * 12);
                        ctx.lineTo(vaseX + 24, vaseY - 35 + p * 12);
                        ctx.stroke();
                    }
                } else if (i === 1) {
                    // 왕관 (더 입체적)
                    const crownX = pedestalX + 45;
                    const crownY = canvas.height - 165;

                    const crownGrad = ctx.createRadialGradient(crownX, crownY - 25, 0, crownX, crownY - 25, 30);
                    crownGrad.addColorStop(0, '#FFD700');
                    crownGrad.addColorStop(0.6, '#FFA500');
                    crownGrad.addColorStop(1, '#DAA520');
                    ctx.fillStyle = crownGrad;
                    ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
                    ctx.shadowBlur = 12;

                    ctx.beginPath();
                    ctx.moveTo(crownX - 25, crownY - 10);
                    ctx.lineTo(crownX - 20, crownY - 35);
                    ctx.lineTo(crownX - 12, crownY - 15);
                    ctx.lineTo(crownX - 4, crownY - 40);
                    ctx.lineTo(crownX + 4, crownY - 15);
                    ctx.lineTo(crownX + 12, crownY - 40);
                    ctx.lineTo(crownX + 20, crownY - 15);
                    ctx.lineTo(crownX + 25, crownY - 35);
                    ctx.lineTo(crownX + 25, crownY - 10);
                    ctx.closePath();
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // 보석들
                    const gemColors = ['#FF0000', '#00FF00', '#0000FF'];
                    for (let g = 0; g < 3; g++) {
                        ctx.fillStyle = gemColors[g];
                        ctx.shadowColor = gemColors[g];
                        ctx.shadowBlur = 6;
                        ctx.beginPath();
                        ctx.arc(crownX - 12 + g * 12, crownY - 20, 4, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                } else {
                    // 보석 (더 입체적)
                    const gemX = pedestalX + 45;
                    const gemY = canvas.height - 165;

                    const gemGrad = ctx.createRadialGradient(gemX, gemY - 30, 0, gemX, gemY - 25, 25);
                    gemGrad.addColorStop(0, '#87CEEB');
                    gemGrad.addColorStop(0.4, '#4169E1');
                    gemGrad.addColorStop(1, '#1E3A8A');
                    ctx.fillStyle = gemGrad;
                    ctx.shadowColor = 'rgba(65, 105, 225, 0.6)';
                    ctx.shadowBlur = 15;

                    ctx.beginPath();
                    ctx.moveTo(gemX, gemY - 45);
                    ctx.lineTo(gemX + 18, gemY - 30);
                    ctx.lineTo(gemX + 15, gemY - 15);
                    ctx.lineTo(gemX - 15, gemY - 15);
                    ctx.lineTo(gemX - 18, gemY - 30);
                    ctx.closePath();
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // 반짝임 효과
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.beginPath();
                    ctx.arc(gemX - 5, gemY - 35, 4, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.beginPath();
                    ctx.arc(gemX + 8, gemY - 28, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // 조명 (더 입체적)
        const lightPositions = [180, 430, 680];
        lightPositions.forEach(lightX => {
            // 조명 기구
            const lampGrad = ctx.createRadialGradient(lightX, 60, 0, lightX, 60, 15);
            lampGrad.addColorStop(0, '#FFD700');
            lampGrad.addColorStop(0.5, '#FFA500');
            lampGrad.addColorStop(1, '#DAA520');
            ctx.fillStyle = lampGrad;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(lightX, 60, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 빛 효과
            const lightGrad = ctx.createRadialGradient(lightX, 60, 0, lightX, 60, 70);
            lightGrad.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
            lightGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)');
            lightGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = lightGrad;
            ctx.beginPath();
            ctx.arc(lightX, 60, 70, 0, Math.PI * 2);
            ctx.fill();

            // 빛줄기
            ctx.fillStyle = 'rgba(255, 235, 150, 0.1)';
            ctx.beginPath();
            ctx.moveTo(lightX - 12, 60);
            ctx.lineTo(lightX - 30, canvas.height - 50);
            ctx.lineTo(lightX + 30, canvas.height - 50);
            ctx.lineTo(lightX + 12, 60);
            ctx.closePath();
            ctx.fill();
        });

        // 밧줄 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 4; i++) {
                const ropeX = 100 + i * 200 - scroll * 0.9 + (repeat * canvas.width * 2);

                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(ropeX, canvas.height - 85);
                ctx.lineTo(ropeX, canvas.height - 60);
                ctx.stroke();

                // 밧줄 기둥
                ctx.fillStyle = '#654321';
                ctx.beginPath();
                ctx.roundRect(ropeX - 5, canvas.height - 90, 10, 90, 3);
                ctx.fill();
            }
        }
    },

    // 19. 해변 (바다)
    beach: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 파도 (더 입체적, 스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 5; i++) {
                const waveY = canvas.height - 160 + i * 22;
                const waveColors = ['#87CEEB', '#6EB5D0', '#5A9CB5', '#46839A', '#326A7F'];

                ctx.strokeStyle = waveColors[i];
                ctx.lineWidth = 4;
                ctx.beginPath();

                for (let x = -scroll + (repeat * canvas.width * 2); x < canvas.width - scroll + (repeat * canvas.width * 2) + 200; x += 50) {
                    ctx.bezierCurveTo(
                        x + 12, waveY - 12,
                        x + 38, waveY + 12,
                        x + 50, waveY
                    );
                }
                ctx.stroke();

                // 파도 거품
                if (i < 3) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    for (let x = -scroll + (repeat * canvas.width * 2); x < canvas.width - scroll + (repeat * canvas.width * 2) + 200; x += 80) {
                        ctx.beginPath();
                        ctx.arc(x + 25, waveY, 5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }

        // 야자수 (더 입체적)
        const palmX = 130;
        const palmY = canvas.height - 50;

        // 야자수 기둥
        const trunkGrad = ctx.createLinearGradient(palmX - 10, palmY, palmX + 10, palmY - 150);
        trunkGrad.addColorStop(0, '#8B4513');
        trunkGrad.addColorStop(0.5, '#A0522D');
        trunkGrad.addColorStop(1, '#D2691E');
        ctx.strokeStyle = trunkGrad;
        ctx.lineWidth = 12;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(palmX, palmY);
        ctx.quadraticCurveTo(palmX + 15, palmY - 80, palmX + 20, palmY - 150);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 야자수 질감
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.4)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(palmX - 5, palmY - 20 - i * 18);
            ctx.lineTo(palmX + 10, palmY - 15 - i * 18);
            ctx.stroke();
        }

        // 야자수 잎 (더 예쁘게)
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            ctx.save();
            ctx.translate(palmX + 20, palmY - 150);
            ctx.rotate(angle);

            const leafGrad = ctx.createLinearGradient(0, -50, 0, 0);
            leafGrad.addColorStop(0, '#32CD32');
            leafGrad.addColorStop(0.5, '#228B22');
            leafGrad.addColorStop(1, '#006400');
            ctx.fillStyle = leafGrad;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 4;

            ctx.beginPath();
            ctx.ellipse(0, -35, 18, 45, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 잎맥
            ctx.strokeStyle = 'rgba(0, 100, 0, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.lineTo(0, -60);
            ctx.stroke();

            ctx.restore();
        }

        // 조개껍질들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const shells = [
                { x: 220, y: canvas.height - 72, size: 18, color: '#FFB6C1' },
                { x: 380, y: canvas.height - 78, size: 22, color: '#FFA07A' },
                { x: 540, y: canvas.height - 70, size: 20, color: '#DDA0DD' },
                { x: 700, y: canvas.height - 75, size: 16, color: '#FFD4E5' }
            ];

            shells.forEach(shell => {
                const shellX = shell.x - scroll + (repeat * canvas.width * 2);

                // 조개 본체
                const shellGrad = ctx.createRadialGradient(shellX - 3, shell.y - 3, 0, shellX, shell.y, shell.size);
                shellGrad.addColorStop(0, shell.color);
                shellGrad.addColorStop(1, shadeColor(shell.color, -30));
                ctx.fillStyle = shellGrad;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.arc(shellX, shell.y, shell.size, 0, Math.PI);
                ctx.fill();
                ctx.shadowBlur = 0;

                // 조개 무늬
                ctx.strokeStyle = shadeColor(shell.color, -40);
                ctx.lineWidth = 1.5;
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.moveTo(shellX, shell.y);
                    const endAngle = Math.PI * (i / 4);
                    ctx.lineTo(shellX - Math.cos(endAngle) * shell.size, shell.y - Math.sin(endAngle) * shell.size);
                    ctx.stroke();
                }

                // 하이라이트
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(shellX - shell.size * 0.3, shell.y - shell.size * 0.4, shell.size * 0.3, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // 해변 아이템들 (스크롤)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 5; i++) {
                const itemX = 150 + i * 140 - scroll * 1.2 + (repeat * canvas.width * 2);

                // 불가사리
                if (i % 2 === 0) {
                    const starGrad = ctx.createRadialGradient(itemX, canvas.height - 68, 0, itemX, canvas.height - 68, 15);
                    starGrad.addColorStop(0, '#FF6347');
                    starGrad.addColorStop(1, '#DC143C');
                    ctx.fillStyle = starGrad;
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                    ctx.shadowBlur = 4;
                    drawStar(ctx, itemX, canvas.height - 68, 5, 14, 6);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        }

        // 태양들 (스크롤 효과)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const sunX = 400 - scroll * 0.2 + (repeat * canvas.width * 2);
            const sunY = 90;

            const sunGrad = ctx.createRadialGradient(sunX - 15, sunY - 15, 10, sunX, sunY, 65);
            sunGrad.addColorStop(0, '#FFF8DC');
            sunGrad.addColorStop(0.3, '#FFD700');
            sunGrad.addColorStop(0.6, '#FFA500');
            sunGrad.addColorStop(1, 'rgba(255, 165, 0, 0)');
            ctx.fillStyle = sunGrad;
            ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(sunX, sunY, 65, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 태양 광선
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.lineWidth = 4;
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI * 2 / 12) * i;
                ctx.beginPath();
                ctx.moveTo(sunX + Math.cos(angle) * 70, sunY + Math.sin(angle) * 70);
                ctx.lineTo(sunX + Math.cos(angle) * 95, sunY + Math.sin(angle) * 95);
                ctx.stroke();
            }
        }
    },

    // 20. 숲속 (산)
    forest: function(ctx, canvas, scrollX) {
        const scroll = scrollX * 0.5 % (canvas.width * 2);

        // 산 (더 입체적)
        // 먼 산
        const farMountainGrad = ctx.createLinearGradient(0, canvas.height - 270, 0, canvas.height - 50);
        farMountainGrad.addColorStop(0, '#7A9F64');
        farMountainGrad.addColorStop(1, '#6B8E23');
        ctx.fillStyle = farMountainGrad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 50);
        ctx.lineTo(220, canvas.height - 270);
        ctx.lineTo(450, canvas.height - 50);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 가까운 산
        const nearMountainGrad = ctx.createLinearGradient(0, canvas.height - 220, 0, canvas.height - 50);
        nearMountainGrad.addColorStop(0, '#659F4D');
        nearMountainGrad.addColorStop(1, '#556B2F');
        ctx.fillStyle = nearMountainGrad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(320, canvas.height - 50);
        ctx.lineTo(540, canvas.height - 220);
        ctx.lineTo(750, canvas.height - 50);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 나무들 (스크롤, 더 입체적)
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 10; i++) {
                const treeX = 60 + i * 80 - scroll * 1.2 + (repeat * canvas.width * 2);
                const treeHeight = 110 + (i % 3) * 25;

                // 나무 기둥 (그라데이션)
                const trunkGrad = ctx.createLinearGradient(treeX - 10, canvas.height - 50, treeX + 10, canvas.height - 50);
                trunkGrad.addColorStop(0, '#654321');
                trunkGrad.addColorStop(0.5, '#8B4513');
                trunkGrad.addColorStop(1, '#654321');
                ctx.fillStyle = trunkGrad;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.roundRect(treeX - 10, canvas.height - 50 - treeHeight, 20, treeHeight, 5);
                ctx.fill();
                ctx.shadowBlur = 0;

                // 나무 질감
                ctx.strokeStyle = 'rgba(101, 67, 33, 0.5)';
                ctx.lineWidth = 2;
                for (let t = 0; t < 5; t++) {
                    ctx.beginPath();
                    ctx.moveTo(treeX - 8, canvas.height - 60 - t * 20);
                    ctx.lineTo(treeX + 5, canvas.height - 55 - t * 20);
                    ctx.stroke();
                }

                // 나뭇잎 (3층, 더 입체적)
                for (let layer = 0; layer < 3; layer++) {
                    const layerY = canvas.height - 50 - treeHeight - 25 - layer * 30;
                    const layerSize = 38 - layer * 6;
                    const leafColors = [
                        { top: '#2E8B57', mid: '#228B22', bottom: '#006400' },
                        { top: '#3CB371', mid: '#2E8B57', bottom: '#228B22' },
                        { top: '#66BB6A', mid: '#4CAF50', bottom: '#2E8B57' }
                    ];

                    const leafGrad = ctx.createLinearGradient(treeX - layerSize, layerY - 45, treeX + layerSize, layerY);
                    leafGrad.addColorStop(0, leafColors[layer].top);
                    leafGrad.addColorStop(0.5, leafColors[layer].mid);
                    leafGrad.addColorStop(1, leafColors[layer].bottom);
                    ctx.fillStyle = leafGrad;
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                    ctx.shadowBlur = 5;

                    ctx.beginPath();
                    ctx.moveTo(treeX, layerY - 45);
                    ctx.lineTo(treeX - layerSize, layerY);
                    ctx.lineTo(treeX + layerSize, layerY);
                    ctx.closePath();
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // 하이라이트
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                    ctx.beginPath();
                    ctx.moveTo(treeX - 10, layerY - 35);
                    ctx.lineTo(treeX - layerSize * 0.5, layerY - 10);
                    ctx.lineTo(treeX - layerSize * 0.7, layerY);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }

        // 덤불들
        for (let repeat = -1; repeat <= 1; repeat++) {
            for (let i = 0; i < 6; i++) {
                const bushX = 100 + i * 130 - scroll * 0.9 + (repeat * canvas.width * 2);
                drawCuteBush(ctx, bushX, canvas.height - 50);
            }
        }

        // 새들 (더 입체적)
        for (let i = 0; i < 6; i++) {
            const birdX = 120 + i * 120;
            const birdY = 70 + Math.sin(i * 0.7) * 50;

            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 3;
            ctx.beginPath();
            ctx.moveTo(birdX - 18, birdY);
            ctx.quadraticCurveTo(birdX - 10, birdY - 10, birdX, birdY);
            ctx.quadraticCurveTo(birdX + 10, birdY - 10, birdX + 18, birdY);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // 버섯들 (스크롤, 더 입체적)
        for (let repeat = -1; repeat <= 1; repeat++) {
            const mushrooms = [
                { x: 180, y: canvas.height - 72, color: '#FF6347' },
                { x: 350, y: canvas.height - 78, color: '#FFA500' },
                { x: 520, y: canvas.height - 75, color: '#FF4500' },
                { x: 690, y: canvas.height - 70, color: '#DC143C' }
            ];

            mushrooms.forEach(mushroom => {
                const mushroomX = mushroom.x - scroll * 1.4 + (repeat * canvas.width * 2);

                // 버섯 대 (그라데이션)
                const stemGrad = ctx.createLinearGradient(mushroomX - 8, mushroom.y - 25, mushroomX + 8, mushroom.y);
                stemGrad.addColorStop(0, '#F5DEB3');
                stemGrad.addColorStop(1, '#D2B48C');
                ctx.fillStyle = stemGrad;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.roundRect(mushroomX - 7, mushroom.y - 25, 14, 25, 5);
                ctx.fill();
                ctx.shadowBlur = 0;

                // 버섯 갓 (그라데이션)
                const capGrad = ctx.createRadialGradient(mushroomX - 5, mushroom.y - 30, 0, mushroomX, mushroom.y - 25, 23);
                capGrad.addColorStop(0, mushroom.color);
                capGrad.addColorStop(1, shadeColor(mushroom.color, -30));
                ctx.fillStyle = capGrad;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 5;
                ctx.beginPath();
                ctx.ellipse(mushroomX, mushroom.y - 27, 22, 16, 0, Math.PI, 0);
                ctx.fill();
                ctx.shadowBlur = 0;

                // 버섯 점들
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                const spots = [
                    { x: -10, y: -30, size: 4 },
                    { x: 10, y: -30, size: 4 },
                    { x: 0, y: -32, size: 3 },
                    { x: -5, y: -28, size: 3 },
                    { x: 5, y: -28, size: 3 }
                ];
                spots.forEach(spot => {
                    ctx.beginPath();
                    ctx.arc(mushroomX + spot.x, mushroom.y + spot.y, spot.size, 0, Math.PI * 2);
                    ctx.fill();
                });

                // 버섯 하이라이트
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.beginPath();
                ctx.arc(mushroomX - 8, mushroom.y - 32, 6, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // 꽃들
        for (let repeat = -1; repeat <= 1; repeat++) {
            const flowerColors = ['#FF69B4', '#FFD700', '#9370DB', '#FF6347'];
            for (let i = 0; i < 7; i++) {
                const flowerX = 80 + i * 110 - scroll * 1.5 + (repeat * canvas.width * 2);
                drawCuteFlower(ctx, flowerX, canvas.height - 50, flowerColors[i % 4]);
            }
        }
    }
};

// Ensure drawSunAndClouds is available (already defined in the utility functions section)

// 유틸리티 함수들
// 귀여운 나무 그리기
function drawCuteTree(ctx, x, y) {
    // 나무 기둥 (그라데이션)
    const trunkGrad = ctx.createLinearGradient(x - 8, 0, x + 8, 0);
    trunkGrad.addColorStop(0, '#6B4423');
    trunkGrad.addColorStop(0.5, '#8B5A3C');
    trunkGrad.addColorStop(1, '#6B4423');
    ctx.fillStyle = trunkGrad;
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 60, 16, 60, 4);
    ctx.fill();

    // 나뭇잎 (3단계 층)
    const leafColors = [
        { main: '#4CAF50', light: '#66BB6A' },
        { main: '#66BB6A', light: '#81C784' },
        { main: '#81C784', light: '#A5D6A7' }
    ];

    for (let i = 0; i < 3; i++) {
        const leafY = y - 60 - i * 25;
        const leafSize = 40 - i * 8;

        // 그라데이션 나뭇잎
        const leafGrad = ctx.createRadialGradient(x, leafY, 0, x, leafY, leafSize);
        leafGrad.addColorStop(0, leafColors[i].light);
        leafGrad.addColorStop(1, leafColors[i].main);
        ctx.fillStyle = leafGrad;

        ctx.beginPath();
        ctx.arc(x, leafY, leafSize, 0, Math.PI * 2);
        ctx.fill();

        // 하이라이트
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x - leafSize * 0.3, leafY - leafSize * 0.3, leafSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 귀여운 부시 (덤불) 그리기
function drawCuteBush(ctx, x, y) {
    const bushGrad = ctx.createRadialGradient(x, y - 15, 0, x, y - 15, 30);
    bushGrad.addColorStop(0, '#7CB342');
    bushGrad.addColorStop(1, '#558B2F');
    ctx.fillStyle = bushGrad;

    // 여러 원으로 덤불 표현
    ctx.beginPath();
    ctx.arc(x - 15, y - 10, 20, 0, Math.PI * 2);
    ctx.arc(x, y - 20, 25, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 10, 20, 0, Math.PI * 2);
    ctx.fill();

    // 하이라이트
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(x - 5, y - 25, 8, 0, Math.PI * 2);
    ctx.fill();
}

// 귀여운 꽃 그리기
function drawCuteFlower(ctx, x, y, color) {
    // 줄기
    ctx.strokeStyle = '#7CB342';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 15);
    ctx.stroke();

    // 꽃잎 (5개)
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i;
        const petalX = x + Math.cos(angle) * 8;
        const petalY = y - 15 + Math.sin(angle) * 8;

        const petalGrad = ctx.createRadialGradient(petalX, petalY, 0, petalX, petalY, 6);
        petalGrad.addColorStop(0, color);
        petalGrad.addColorStop(1, shadeColor(color, -20));
        ctx.fillStyle = petalGrad;

        ctx.beginPath();
        ctx.arc(petalX, petalY, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // 꽃 중심
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.arc(x, y - 15, 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
}

function drawSunAndClouds(ctx, canvas, scrollX) {
    // 태양들 (느리게 스크롤)
    const sunScroll = (scrollX * 0.2) % (canvas.width * 2);  // 매우 느리게
    const suns = [
        { x: 200, y: 80 },
        { x: 700, y: 100 }
    ];

    for (let repeat = -1; repeat <= 1; repeat++) {
        suns.forEach(sun => {
            const sunX = sun.x - sunScroll + (repeat * canvas.width * 2);
            const gradient = ctx.createRadialGradient(sunX, sun.y, 0, sunX, sun.y, 50);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(0.5, '#FFA500');
            gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(sunX, sun.y, 50, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // 구름들 (느리게 스크롤)
    const cloudScroll = (scrollX * 0.3) % (canvas.width * 2);  // 배경보다 느리게
    const clouds = [
        { x: 150, y: 100 },
        { x: 400, y: 80 },
        { x: 600, y: 120 }
    ];

    // 구름을 반복해서 그리기
    for (let repeat = -1; repeat <= 1; repeat++) {
        clouds.forEach(cloud => {
            const cloudX = cloud.x - cloudScroll + (repeat * canvas.width * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(cloudX, cloud.y, 30, 0, Math.PI * 2);
            ctx.arc(cloudX + 25, cloud.y, 35, 0, Math.PI * 2);
            ctx.arc(cloudX + 50, cloud.y, 30, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

function drawWindowWithSun(ctx, canvas, scrollX) {
    // 창문 (고정 위치)
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(canvas.width - 250, 100, 150, 120);
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 8;
    ctx.strokeRect(canvas.width - 250, 100, 150, 120);

    // 십자 창틀
    ctx.beginPath();
    ctx.moveTo(canvas.width - 175, 100);
    ctx.lineTo(canvas.width - 175, 220);
    ctx.moveTo(canvas.width - 250, 160);
    ctx.lineTo(canvas.width - 100, 160);
    ctx.stroke();

    // 창문 밖 태양 (고정)
    const gradient = ctx.createRadialGradient(canvas.width - 150, 140, 0, canvas.width - 150, 140, 30);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0.3)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(canvas.width - 150, 140, 30, 0, Math.PI * 2);
    ctx.fill();
}

// 현재 스테이지에 맞는 배경 그리기 (스크롤 효과 포함)
function drawStageBackground(ctx, canvas, stage, scrollX) {
    const bgData = stageBackgrounds[stage];

    if (!bgData) {
        // 기본 배경
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#E6F3FF');
        gradient.addColorStop(0.5, '#B8E0FF');
        gradient.addColorStop(1, '#8FD3FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
    }

    // 하늘 그라데이션
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, bgData.sky.top);
    gradient.addColorStop(0.5, bgData.sky.middle);
    gradient.addColorStop(1, bgData.sky.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 장식 요소 그리기 (스크롤 X 좌표 전달)
    if (bgData.decorations && backgroundDecorations[bgData.decorations]) {
        backgroundDecorations[bgData.decorations](ctx, canvas, scrollX || 0);
    }

    // 지면 (스크롤 효과를 위해 반복)
    const groundGradient = ctx.createLinearGradient(0, canvas.height - 50, 0, canvas.height);
    groundGradient.addColorStop(0, bgData.ground);
    groundGradient.addColorStop(1, shadeColor(bgData.ground, -20));
    ctx.fillStyle = groundGradient;

    // 지면을 여러 번 그려서 무한 스크롤 효과
    const scroll = (scrollX || 0) % canvas.width;
    ctx.fillRect(-scroll, canvas.height - 50, canvas.width * 2, 50);
}

// 색상을 밝게/어둡게 하는 유틸리티 함수
function shadeColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}
