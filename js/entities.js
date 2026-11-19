// entities.js - Render dan Logika Entitas Game (Player, Hewan, Pabrik, Truk, Partikel, Serigala)

// Polyfill ctx.roundRect untuk kompatibilitas lintas peramban
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        const radius = typeof r === 'number' ? r : 4;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + w - radius, y);
        this.quadraticCurveTo(x + w, y, x + w, y + radius);
        this.lineTo(x + w, y + h - radius);
        this.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        this.lineTo(x + radius, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
        return this;
    };
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, color = "#FFF", count = 6, speed = 80, size = 4, life = 0.6) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = (Math.random() * 0.7 + 0.3) * speed;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd - 20,
                color,
                size: Math.random() * size + 2,
                alpha: 1,
                life,
                maxLife: life
            });
        }
    }

    emitDust(x, y) {
        for (let i = 0; i < 2; i++) {
            this.particles.push({
                x: x + (Math.random() * 8 - 4),
                y: y + (Math.random() * 4 - 2),
                vx: (Math.random() - 0.5) * 25,
                vy: -Math.random() * 15 - 5,
                color: "rgba(220, 210, 190, 0.65)",
                size: Math.random() * 4 + 3,
                alpha: 0.7,
                life: 0.35,
                maxLife: 0.35
            });
        }
    }

    emitLoveHeart(x, y) {
        this.particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 30,
            vy: -40,
            isHeart: true,
            size: 13,
            alpha: 1,
            life: 0.85,
            maxLife: 0.85
        });
    }

    emitCoinShower(x, y, count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = -Math.PI / 2 + (Math.random() * 1.2 - 0.6);
            const spd = Math.random() * 180 + 100;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                gravity: 250,
                color: "#FFD700",
                isCoin: true,
                size: 7,
                alpha: 1,
                life: 1.2,
                maxLife: 1.2
            });
        }
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.gravity) p.vy += p.gravity * dt;
            p.life -= dt;
            p.alpha = Math.max(0, p.life / p.maxLife);
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            if (p.isHeart) {
                ctx.font = `${p.size}px Arial`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("❤️", p.x, p.y);
            } else if (p.isCoin) {
                ctx.fillStyle = "#FFD700";
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#B78103";
                ctx.lineWidth = 1.5;
                ctx.stroke();
                // Simbol $
                ctx.fillStyle = "#B78103";
                ctx.font = "bold 8px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("$", p.x, p.y);
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });
    }
}

class FloatingTextManager {
    constructor() {
        this.texts = [];
    }

    add(x, y, text, color = "#FFF", size = 16, life = 1.2) {
        this.texts.push({
            x, y,
            text,
            color,
            size,
            alpha: 1,
            life,
            maxLife: life,
            vy: -40
        });
    }

    update(dt) {
        for (let i = this.texts.length - 1; i >= 0; i--) {
            const t = this.texts[i];
            t.y += t.vy * dt;
            t.life -= dt;
            t.alpha = Math.max(0, t.life / t.maxLife);
            if (t.life <= 0) {
                this.texts.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.texts.forEach(t => {
            ctx.save();
            ctx.globalAlpha = t.alpha;
            ctx.fillStyle = t.color;
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 3;
            ctx.font = `bold ${t.size}px 'Segoe UI', Tahoma, sans-serif`;
            ctx.textAlign = "center";
            ctx.strokeText(t.text, t.x, t.y);
            ctx.fillText(t.text, t.x, t.y);
            ctx.restore();
        });
    }
}

class PlayerEntity {
    constructor(state) {
        this.state = state;
        this.radius = 16;
        this.walkFrame = 0;
        this.idleTime = 0;
        this.isMoving = false;
        this.facing = "down"; // 'left' | 'right' | 'up' | 'down'
        this.lean = 0;
        this.targetLean = 0;
        this.blinkTimer = 3.0;
        this.isBlinking = false;
        this.dustTimer = 0;
        this.joyTimer = 0;
        this.sweatTimer = 0;
    }

    onHarvest() {
        this.joyTimer = 0.45; // Ekspresi senang saat memanen
    }

    update(dt, inputDir, particles) {
        const speed = this.state.getPlayerSpeed();
        this.isMoving = (inputDir.x !== 0 || inputDir.y !== 0);

        // Timer Kedipan Mata Alami
        this.blinkTimer -= dt;
        if (this.blinkTimer <= 0) {
            this.isBlinking = true;
            if (this.blinkTimer < -0.12) {
                this.isBlinking = false;
                this.blinkTimer = 2.5 + Math.random() * 2.5;
            }
        }

        // Timer Reaksi & Keringat
        if (this.joyTimer > 0) this.joyTimer -= dt;
        this.sweatTimer += dt;

        if (this.isMoving) {
            this.idleTime = 0;
            const len = Math.hypot(inputDir.x, inputDir.y);
            const nx = inputDir.x / len;
            const ny = inputDir.y / len;

            this.state.player.x += nx * speed * dt;
            this.state.player.y += ny * speed * dt;

            // Batas arena permainan
            this.state.player.x = Math.max(40, Math.min(1240, this.state.player.x));
            this.state.player.y = Math.max(60, Math.min(740, this.state.player.y));

            // Arah pandang
            if (Math.abs(inputDir.x) > Math.abs(inputDir.y)) {
                this.facing = inputDir.x > 0 ? "right" : "left";
                this.targetLean = nx * 0.12;
            } else {
                this.facing = inputDir.y > 0 ? "down" : "up";
                this.targetLean = ny * 0.05;
            }

            this.walkFrame += dt * (speed / 20);

            // Partikel Jejak Debu Langkah Kaki saat Berlari
            if (particles) {
                this.dustTimer += dt;
                if (this.dustTimer > 0.12) {
                    this.dustTimer = 0;
                    particles.emitDust(this.state.player.x, this.state.player.y + 14);
                }
            }
        } else {
            this.idleTime += dt;
            this.targetLean = 0;
            this.dustTimer = 0;
        }

        // Animasi kemiringan tubuh halus (Inertia Lean)
        this.lean += (this.targetLean - this.lean) * Math.min(1, dt * 14);
    }

    draw(ctx) {
        const px = this.state.player.x;
        const py = this.state.player.y;

        // Bobbing gerak tubuh & pernapasan (Breathing & Walk Bounce)
        const walkBob = this.isMoving ? Math.sin(this.walkFrame * 2) * 3 : 0;
        const breathBob = !this.isMoving ? Math.sin(this.idleTime * 2.8) * 1.2 : 0;
        const joyHop = this.joyTimer > 0 ? Math.sin(this.joyTimer * 18) * 5 : 0;
        const totalBob = walkBob + breathBob - joyHop;

        const bagCount = this.state.getBagCount();
        const maxBag = this.state.getMaxBagCapacity();
        const isBagFull = bagCount >= maxBag;

        ctx.save();
        ctx.translate(px, py);

        // 1. Bayangan Dinamis di Tanah (Mengecil saat melompat/bob ke atas)
        const shadowScale = 1 - (totalBob / 24);
        ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
        ctx.beginPath();
        ctx.ellipse(0, 16, 17 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Kemiringan Tubuh (Lean & Squash-Stretch)
        ctx.rotate(this.lean);
        const squashY = this.isMoving ? 1 + Math.sin(this.walkFrame * 2) * 0.04 : 1 + Math.sin(this.idleTime * 2.8) * 0.015;
        const squashX = 2 - squashY;
        ctx.scale(squashX, squashY);

        // 3. Tas Ransel / Keranjang di Punggung (Roblox Style)
        this.drawBackpack(ctx, totalBob, isBagFull, bagCount, maxBag);

        // 4. Kaki & Sepatu Petani (Animasi Ayunan Langkah Alami)
        this.drawLegs(ctx, totalBob);

        // 5. Badan & Pakaian (Kemeja Kotak Merah & Overall Denim)
        this.drawBody(ctx, totalBob);

        // 6. Lengan & Tangan (Mengayun Berlawanan dengan Kaki)
        this.drawArms(ctx, totalBob);

        // 7. Kepala, Rambut Anime, & Ekspresi Wajah
        this.drawHead(ctx, totalBob, isBagFull);

        // 8. Topi Jerami Petani Tradisional (Straw Hat)
        this.drawStrawHat(ctx, totalBob);

        // 9. Reaksi Keringat jika Tas Penuh
        if (isBagFull && Math.sin(this.sweatTimer * 4) > 0) {
            ctx.fillStyle = "#40C4FF";
            ctx.beginPath();
            ctx.arc(14, -26 + totalBob, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(14, -30 + totalBob);
            ctx.lineTo(11, -26 + totalBob);
            ctx.lineTo(17, -26 + totalBob);
            ctx.fill();
        }

        ctx.restore();
    }

    drawBackpack(ctx, bob, isBagFull, bagCount, maxBag) {
        if (bagCount === 0 && this.facing === "down") return;

        const fillRatio = bagCount / maxBag;
        const bagW = 18 + fillRatio * 6;
        const bagH = 18 + fillRatio * 6;

        let bagX = 0;
        let bagY = -4 + bob;
        if (this.facing === "right") bagX = -13;
        else if (this.facing === "left") bagX = 13;
        else if (this.facing === "down") bagY = -8 + bob;
        else if (this.facing === "up") bagY = -2 + bob;

        ctx.save();
        ctx.translate(bagX, bagY);

        // Kotak Utama Tas
        ctx.fillStyle = isBagFull ? "#D32F2F" : (fillRatio > 0.6 ? "#E65100" : "#795548");
        ctx.beginPath();
        ctx.roundRect(-bagW / 2, -bagH / 2, bagW, bagH, 5);
        ctx.fill();
        ctx.strokeStyle = "#3E2723";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tali pengikat tas
        ctx.fillStyle = "#4E342E";
        ctx.fillRect(-bagW / 2 + 3, -bagH / 2, 3, bagH);
        ctx.fillRect(bagW / 2 - 6, -bagH / 2, 3, bagH);

        // Barang yang menyembul keluar dari tas (Roblox Style Visuals)
        if (this.state.player.bag.length > 0) {
            const topItem = this.state.player.bag[0].type;
            if (topItem === "egg") {
                ctx.fillStyle = "#FFF9C4";
                ctx.beginPath();
                ctx.ellipse(-3, -bagH / 2 - 2, 4, 6, 0.2, 0, Math.PI * 2);
                ctx.ellipse(3, -bagH / 2 - 3, 4, 6, -0.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#FBC02D";
                ctx.lineWidth = 1;
                ctx.stroke();
            } else if (topItem === "milk") {
                ctx.fillStyle = "#E1F5FE";
                ctx.fillRect(-4, -bagH / 2 - 6, 8, 8);
                ctx.fillStyle = "#0288D1";
                ctx.fillRect(-3, -bagH / 2 - 8, 6, 3);
            } else if (topItem === "wool") {
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(-3, -bagH / 2 - 3, 5, 0, Math.PI * 2);
                ctx.arc(3, -bagH / 2 - 4, 5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = "#FFD54F";
                ctx.fillRect(-5, -bagH / 2 - 5, 10, 6);
            }
        }

        ctx.restore();
    }

    drawLegs(ctx, bob) {
        const legSwing = this.isMoving ? Math.sin(this.walkFrame) * 8 : 0;
        const kneeBend = this.isMoving ? Math.max(0, Math.cos(this.walkFrame) * 4) : 0;

        // Kaki Kiri
        ctx.fillStyle = "#1565C0"; // Celana Denim
        ctx.fillRect(-9, 5 + bob + legSwing, 6, 9 - kneeBend);
        // Sepatu Kiri
        ctx.fillStyle = "#4E342E"; // Kulit Sepatu
        ctx.beginPath();
        ctx.roundRect(-10, 13 + bob + legSwing - kneeBend, 8, 5, 2);
        ctx.fill();
        ctx.fillStyle = "#8D6E63"; // Sol Sepatu
        ctx.fillRect(-10, 16 + bob + legSwing - kneeBend, 8, 2);

        // Kaki Kanan
        ctx.fillStyle = "#1565C0";
        ctx.fillRect(3, 5 + bob - legSwing, 6, 9 - kneeBend);
        // Sepatu Kanan
        ctx.fillStyle = "#4E342E";
        ctx.beginPath();
        ctx.roundRect(2, 13 + bob - legSwing - kneeBend, 8, 5, 2);
        ctx.fill();
        ctx.fillStyle = "#8D6E63";
        ctx.fillRect(2, 16 + bob - legSwing - kneeBend, 8, 2);
    }

    drawBody(ctx, bob) {
        // Kemeja Flanel Merah Kotak-kotak
        ctx.fillStyle = "#D32F2F";
        ctx.beginPath();
        ctx.roundRect(-11, -7 + bob, 22, 16, 5);
        ctx.fill();

        // Garis Corak Kotak Kemeja
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(-11, -3 + bob, 22, 3);
        ctx.fillRect(-4, -7 + bob, 3, 16);
        ctx.fillRect(3, -7 + bob, 3, 16);

        // Overall Denim Biru
        ctx.fillStyle = "#1976D2";
        ctx.beginPath();
        ctx.roundRect(-10, 2 + bob, 20, 8, 3);
        ctx.fill();
        ctx.strokeStyle = "#0D47A1";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Tali Suspender Overall
        ctx.fillStyle = "#1565C0";
        ctx.fillRect(-9, -7 + bob, 4, 11);
        ctx.fillRect(5, -7 + bob, 4, 11);

        // Kancing Kuningan Suspender (Gold Clasp)
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(-7, 2 + bob, 1.8, 0, Math.PI * 2);
        ctx.arc(7, 2 + bob, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Saku Depan Overall
        ctx.strokeStyle = "#0D47A1";
        ctx.lineWidth = 1;
        ctx.strokeRect(-5, 4 + bob, 10, 5);

        // Syal Merah di Leher (Red Bandana Neckerchief)
        ctx.fillStyle = "#E53935";
        ctx.beginPath();
        ctx.moveTo(-6, -7 + bob);
        ctx.lineTo(6, -7 + bob);
        ctx.lineTo(0, -3 + bob);
        ctx.closePath();
        ctx.fill();
    }

    drawArms(ctx, bob) {
        const armSwing = this.isMoving ? Math.sin(this.walkFrame) * 7 : Math.sin(this.idleTime * 2.8) * 1.5;
        const joyLift = this.joyTimer > 0 ? -12 : 0;

        // Lengan Kiri
        ctx.save();
        ctx.translate(-11, -4 + bob);
        ctx.rotate((-armSwing * Math.PI) / 180 + (joyLift * Math.PI) / 180);
        ctx.fillStyle = "#D32F2F"; // Lengan Kemeja
        ctx.beginPath();
        ctx.roundRect(-3, 0, 5, 10, 2.5);
        ctx.fill();
        ctx.fillStyle = "#FFE0B2"; // Telapak Tangan Kulit
        ctx.beginPath();
        ctx.arc(-0.5, 11, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Lengan Kanan
        ctx.save();
        ctx.translate(11, -4 + bob);
        ctx.rotate((armSwing * Math.PI) / 180 + (joyLift * Math.PI) / 180);
        ctx.fillStyle = "#D32F2F";
        ctx.beginPath();
        ctx.roundRect(-2, 0, 5, 10, 2.5);
        ctx.fill();
        ctx.fillStyle = "#FFE0B2";
        ctx.beginPath();
        ctx.arc(0.5, 11, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawHead(ctx, bob, isBagFull) {
        // Lingkar Wajah (Kulit Cerah Lembut)
        ctx.fillStyle = "#FFE0B2";
        ctx.beginPath();
        ctx.arc(0, -15 + bob, 10.5, 0, Math.PI * 2);
        ctx.fill();

        // Rambut Anime Hitam di Samping & Belakang (Khas Karakter Roblox Arazy Verse)
        ctx.fillStyle = "#212121";
        // Poni kiri & kanan
        ctx.beginPath();
        ctx.moveTo(-10, -16 + bob);
        ctx.lineTo(-12, -8 + bob);
        ctx.lineTo(-7, -12 + bob);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(10, -16 + bob);
        ctx.lineTo(12, -8 + bob);
        ctx.lineTo(7, -12 + bob);
        ctx.closePath();
        ctx.fill();

        // Poni depan di kening
        ctx.beginPath();
        ctx.moveTo(-6, -21 + bob);
        ctx.lineTo(-2, -15 + bob);
        ctx.lineTo(3, -20 + bob);
        ctx.lineTo(7, -15 + bob);
        ctx.lineTo(9, -21 + bob);
        ctx.closePath();
        ctx.fill();

        // Pipi Merona / Blush (Rosy Cheeks)
        ctx.fillStyle = "rgba(255, 107, 107, 0.45)";
        ctx.beginPath();
        ctx.arc(-6, -12 + bob, 2.5, 0, Math.PI * 2);
        ctx.arc(6, -12 + bob, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Mata Ekspresif
        if (this.isBlinking) {
            // Mata Berkedip Lengkung Senyum (⌒ ⌒)
            ctx.strokeStyle = "#212121";
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(-4, -15 + bob, 2.5, Math.PI, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(4, -15 + bob, 2.5, Math.PI, 0);
            ctx.stroke();
        } else if (this.joyTimer > 0) {
            // Mata Bintang Senang (Joy / Harvest)
            ctx.fillStyle = "#F57F17";
            ctx.font = "bold 9px Arial";
            ctx.textAlign = "center";
            ctx.fillText("★", -4, -13 + bob);
            ctx.fillText("★", 4, -13 + bob);
        } else {
            // Mata Anime Berkilau (Glossy Highlights)
            ctx.fillStyle = "#212121";
            ctx.beginPath();
            ctx.ellipse(-4, -15 + bob, 2.5, 3.2, 0, 0, Math.PI * 2);
            ctx.ellipse(4, -15 + bob, 2.5, 3.2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Kilau Cahaya Putih di Pupil
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(-4.8, -16 + bob, 1, 0, Math.PI * 2);
            ctx.arc(3.2, -16 + bob, 1, 0, Math.PI * 2);
            ctx.fill();
        }

        // Mulut Ekspresif
        ctx.strokeStyle = "#212121";
        ctx.lineWidth = 1.4;
        if (isBagFull) {
            // Mulut Terkejut / Lelah (O)
            ctx.fillStyle = "#E57373";
            ctx.beginPath();
            ctx.arc(0, -11 + bob, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (this.isMoving || this.joyTimer > 0) {
            // Senyum Riang Terbuka saat Berjalan / Panen
            ctx.fillStyle = "#D32F2F";
            ctx.beginPath();
            ctx.arc(0, -12 + bob, 3, 0.1, Math.PI - 0.1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            // Senyum Tenang saat Diam
            ctx.beginPath();
            ctx.arc(0, -12 + bob, 2.5, 0.2, Math.PI - 0.2);
            ctx.stroke();
        }
    }

    drawStrawHat(ctx, bob) {
        ctx.save();
        ctx.translate(0, -22 + bob);
        // Sedikit miring mengikuti gerakan
        ctx.rotate(-this.lean * 0.5);

        // Pinggiran Lebar Topi Jerami (Straw Brim)
        ctx.fillStyle = "#FDD835";
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#F57F17";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Tekstur anyaman jerami halus
        ctx.strokeStyle = "rgba(245, 127, 23, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-12, -2); ctx.lineTo(-8, 3);
        ctx.moveTo(-4, -3); ctx.lineTo(0, 3);
        ctx.moveTo(4, -3); ctx.lineTo(8, 2);
        ctx.stroke();

        // Mahkota / Kubah Topi
        ctx.fillStyle = "#FBC02D";
        ctx.beginPath();
        ctx.arc(0, -3, 9, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = "#F57F17";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pita Merah Khas Petani (Red Ribbon Band)
        ctx.fillStyle = "#D32F2F";
        ctx.fillRect(-9, -4.5, 18, 3.2);

        // Simpul Pita di Samping Topi
        ctx.beginPath();
        ctx.arc(8, -3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(8, -3, 4, 3);

        ctx.restore();
    }
}

class AnimalRenderer {
    static drawChicken(ctx, animal, time) {
        const bob = Math.sin(time * 0.006 + animal.x) * 2;
        ctx.save();
        ctx.translate(animal.x, animal.y + bob);

        // Bayangan
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.ellipse(0, 10, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tubuh putih
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.ellipse(0, 0, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#BDBDBD";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Sayap
        ctx.fillStyle = "#EEEEEE";
        ctx.beginPath();
        ctx.ellipse(-2, 0, 6, 4, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Jengger merah
        ctx.fillStyle = "#E53935";
        ctx.beginPath();
        ctx.arc(4, -11, 3, 0, Math.PI * 2);
        ctx.arc(7, -9, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Mata & Paruh kuning
        ctx.fillStyle = "#212121";
        ctx.fillRect(6, -4, 2, 2);
        ctx.fillStyle = "#FFB300";
        ctx.beginPath();
        ctx.moveTo(8, -2);
        ctx.lineTo(13, 0);
        ctx.lineTo(8, 2);
        ctx.fill();

        // Kaki kuning
        ctx.fillStyle = "#FFA000";
        ctx.fillRect(-4, 9, 2, 4);
        ctx.fillRect(2, 9, 2, 4);

        // Progress balon bertelur jika sudah hampir panen
        const prog = animal.timer / animal.produceTime;
        if (prog > 0.75) {
            ctx.fillStyle = "#FFF9C4";
            ctx.beginPath();
            ctx.arc(0, -18, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#FBC02D";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = "#F57F17";
            ctx.font = "bold 9px Arial";
            ctx.textAlign = "center";
            ctx.fillText("🥚", 0, -14);
        }

        ctx.restore();
    }

    static drawCow(ctx, animal, time) {
        const bob = Math.sin(time * 0.004 + animal.x) * 2;
        ctx.save();
        ctx.translate(animal.x, animal.y + bob);

        // Bayangan
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.beginPath();
        ctx.ellipse(0, 16, 24, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tubuh putih corak hitam
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.roundRect(-22, -12, 44, 26, 8);
        ctx.fill();
        ctx.strokeStyle = "#9E9E9E";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Corak hitam sapi
        ctx.fillStyle = "#212121";
        ctx.beginPath();
        ctx.ellipse(-10, -3, 8, 7, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(8, 2, 7, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Kaki
        ctx.fillStyle = "#EEEEEE";
        ctx.fillRect(-18, 12, 6, 8);
        ctx.fillRect(-8, 12, 6, 8);
        ctx.fillRect(4, 12, 6, 8);
        ctx.fillRect(14, 12, 6, 8);
        ctx.fillStyle = "#424242"; // Kuku kaki
        ctx.fillRect(-18, 18, 6, 3);
        ctx.fillRect(-8, 18, 6, 3);
        ctx.fillRect(4, 18, 6, 3);
        ctx.fillRect(14, 18, 6, 3);

        // Kepala
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.roundRect(14, -20, 18, 18, 5);
        ctx.fill();
        ctx.stroke();

        // Moncong pink
        ctx.fillStyle = "#F48FB1";
        ctx.beginPath();
        ctx.roundRect(20, -10, 14, 9, 3);
        ctx.fill();
        ctx.fillStyle = "#C2185B";
        ctx.fillRect(23, -6, 2, 2);
        ctx.fillRect(28, -6, 2, 2);

        // Tanduk kecil
        ctx.fillStyle = "#FFE082";
        ctx.fillRect(18, -24, 3, 5);
        ctx.fillRect(25, -24, 3, 5);

        // Mata
        ctx.fillStyle = "#212121";
        ctx.fillRect(22, -16, 2.5, 3);

        // Indikator susu siap
        const prog = animal.timer / animal.produceTime;
        if (prog > 0.8) {
            ctx.fillStyle = "#E1F5FE";
            ctx.beginPath();
            ctx.arc(0, -26, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#0288D1";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.font = "bold 9px Arial";
            ctx.textAlign = "center";
            ctx.fillText("🥛", 0, -22);
        }

        ctx.restore();
    }

    static drawSheep(ctx, animal, time) {
        const bob = Math.sin(time * 0.005 + animal.x) * 2;
        ctx.save();
        ctx.translate(animal.x, animal.y + bob);

        // Bayangan
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.ellipse(0, 14, 20, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tubuh gumpalan wol putih lebat
        ctx.fillStyle = "#F5F5F5";
        [-12, -4, 6, 12].forEach(ox => {
            ctx.beginPath();
            ctx.arc(ox, -2, 10, 0, Math.PI * 2);
            ctx.fill();
        });
        [-8, 4].forEach(ox => {
            ctx.beginPath();
            ctx.arc(ox, 6, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ox, -8, 8, 0, Math.PI * 2);
            ctx.fill();
        });

        // Kaki hitam kecil
        ctx.fillStyle = "#212121";
        ctx.fillRect(-12, 11, 4, 7);
        ctx.fillRect(-4, 11, 4, 7);
        ctx.fillRect(6, 11, 4, 7);
        ctx.fillRect(12, 11, 4, 7);

        // Kepala domba hitam
        ctx.fillStyle = "#263238";
        ctx.beginPath();
        ctx.roundRect(14, -14, 12, 14, 4);
        ctx.fill();

        // Telinga
        ctx.beginPath();
        ctx.ellipse(13, -11, 4, 2, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Mata putih kecil
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(20, -11, 2, 2);

        // Indikator wol siap
        const prog = animal.timer / animal.produceTime;
        if (prog > 0.8) {
            ctx.fillStyle = "#EDE7F6";
            ctx.beginPath();
            ctx.arc(0, -22, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#7E57C2";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.font = "bold 9px Arial";
            ctx.textAlign = "center";
            ctx.fillText("🧶", 0, -18);
        }

        ctx.restore();
    }
}

class MachineRenderer {
    static draw(ctx, machineDef, machineState, x, y, time) {
        ctx.save();
        ctx.translate(x, y);

        // Bayangan Pabrik / Mesin
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.roundRect(-55, 30, 110, 16, 8);
        ctx.fill();

        // Struktur Utama Mesin (Gaya Industri Kartun)
        ctx.fillStyle = "#455A64"; // Logam Industri
        ctx.beginPath();
        ctx.roundRect(-50, -40, 100, 75, 10);
        ctx.fill();
        ctx.strokeStyle = "#263238";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Panel Atas / Cerobong Asap
        ctx.fillStyle = "#37474F";
        ctx.fillRect(-35, -55, 16, 18);
        ctx.strokeRect(-35, -55, 16, 18);

        // Efek Asap Cerobong saat aktif memproses
        if (machineState.isProcessing) {
            const smokeOffset = (time * 0.03) % 25;
            ctx.fillStyle = "rgba(220, 220, 220, 0.7)";
            ctx.beginPath();
            ctx.arc(-27, -60 - smokeOffset, 6 + smokeOffset * 0.25, 0, Math.PI * 2);
            ctx.fill();
        }

        // Tangki Kaca / Display Proses
        ctx.fillStyle = "#90CAF9";
        ctx.beginPath();
        ctx.roundRect(-40, -25, 80, 32, 6);
        ctx.fill();
        ctx.strokeStyle = "#1565C0";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Animasi Gear / Roda Gigi di dalam tangki
        const gearAngle = machineState.isProcessing ? (time * 0.005) : 0;
        ctx.save();
        ctx.translate(0, -9);
        ctx.rotate(gearAngle);
        ctx.fillStyle = "#FFB300";
        for (let i = 0; i < 6; i++) {
            ctx.rotate(Math.PI / 3);
            ctx.fillRect(-4, -12, 8, 24);
        }
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#263238";
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Indikator Ikon Resep (Input -> Output)
        const inDef = ITEM_DEFS[machineDef.inputItem];
        const outDef = ITEM_DEFS[machineDef.outputItem];

        ctx.font = "bold 13px 'Segoe UI', Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFF";
        ctx.fillText(`${inDef.icon} ➔ ${outDef.icon}`, 0, 24);

        // Progress Bar Pemrosesan di atas mesin
        if (machineState.isProcessing) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.beginPath();
            ctx.roundRect(-40, -48, 80, 8, 4);
            ctx.fill();

            ctx.fillStyle = "#4CAF50";
            ctx.beginPath();
            ctx.roundRect(-39, -47, 78 * machineState.progress, 6, 3);
            ctx.fill();
        }

        // Teks Jumlah Antrean Input & Produk Jadi Tersedia
        ctx.font = "bold 11px Arial";
        // Antrean Input (Kiri)
        ctx.fillStyle = machineState.inputQueue > 0 ? "#FFEB3B" : "#B0BEC5";
        ctx.fillText(`Antre: ${machineState.inputQueue}`, -24, 48);

        // Output Box (Kanan)
        ctx.fillStyle = machineState.outputCount > 0 ? "#69F0AE" : "#B0BEC5";
        ctx.fillText(`Jadi: ${machineState.outputCount}`, 24, 48);

        ctx.restore();
    }
}

class TruckRenderer {
    static draw(ctx, truck, x, y, time) {
        ctx.save();
        ctx.translate(x, y);

        const truckCfg = TRUCK_LEVELS[truck.level - 1];

        // Bayangan Truk
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.beginPath();
        ctx.roundRect(-45, 22, 90, 16, 8);
        ctx.fill();

        // Badan Bak Belakang Truk
        ctx.fillStyle = "#CFD8DC";
        ctx.beginPath();
        ctx.roundRect(-42, -22, 54, 42, 6);
        ctx.fill();
        ctx.strokeStyle = "#546E7A";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Tampilkan Tumpukan Kargo di dalam bak truk
        const cargoTotal = truck.cargo.reduce((s, i) => s + i.count, 0);
        if (cargoTotal > 0) {
            const boxes = Math.min(6, Math.ceil(cargoTotal / 3));
            for (let b = 0; b < boxes; b++) {
                const bx = -36 + (b % 3) * 14;
                const by = -15 + Math.floor(b / 3) * 14;
                ctx.fillStyle = "#FFB74D"; // Kotak kardus kargo
                ctx.fillRect(bx, by, 12, 12);
                ctx.strokeStyle = "#E65100";
                ctx.lineWidth = 1;
                ctx.strokeRect(bx, by, 12, 12);
            }
        }

        // Kabin Depan Truk (Warna sesuai level armada)
        ctx.fillStyle = truckCfg.color;
        ctx.beginPath();
        ctx.roundRect(10, -24, 34, 46, 7);
        ctx.fill();
        ctx.strokeStyle = "#263238";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Kaca Depan Truk
        ctx.fillStyle = "#81D4FA";
        ctx.beginPath();
        ctx.roundRect(24, -20, 16, 38, 4);
        ctx.fill();
        ctx.strokeStyle = "#0288D1";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Lampu Depan Truk (Kuning Menyala)
        ctx.fillStyle = "#FFEE58";
        ctx.fillRect(42, -18, 3, 8);
        ctx.fillRect(42, 10, 3, 8);

        // Roda Truk
        ctx.fillStyle = "#212121";
        [-28, 26].forEach(wx => {
            ctx.beginPath();
            ctx.roundRect(wx - 8, -27, 16, 7, 3);
            ctx.roundRect(wx - 8, 20, 16, 7, 3);
            ctx.fill();
        });

        // Label Kapasitas di Atas Truk
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.beginPath();
        ctx.roundRect(-40, -42, 80, 16, 5);
        ctx.fill();

        ctx.fillStyle = cargoTotal >= truckCfg.capacity ? "#FF5252" : "#FFFFFF";
        ctx.font = "bold 11px 'Segoe UI', Arial";
        ctx.textAlign = "center";
        ctx.fillText(`🚚 ${cargoTotal} / ${truckCfg.capacity}`, 0, -30);

        ctx.restore();
    }
}

class WolfEntity {
    static draw(ctx, wolf, time) {
        if (!wolf.active) return;
        ctx.save();
        ctx.translate(wolf.x, wolf.y);

        // Bayangan serigala
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.ellipse(0, 10, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Badan serigala abu-abu
        ctx.fillStyle = "#616161";
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Kepala serigala
        ctx.beginPath();
        ctx.moveTo(10, -6);
        ctx.lineTo(24, 0);
        ctx.lineTo(10, 6);
        ctx.fill();

        // Telinga tajam
        ctx.fillStyle = "#424242";
        ctx.beginPath();
        ctx.moveTo(6, -8);
        ctx.lineTo(10, -18);
        ctx.lineTo(14, -8);
        ctx.fill();

        // Mata merah menyala
        ctx.fillStyle = "#FF1744";
        ctx.fillRect(14, -4, 3, 3);

        // Indikator peringatan
        ctx.fillStyle = "#FF1744";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("⚠️ SERIGALA!", 0, -22);

        ctx.restore();
    }
}

class GuardDogRenderer {
    static draw(ctx, x, y, time) {
        ctx.save();
        ctx.translate(x, y);

        // Bayangan
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.beginPath();
        ctx.ellipse(0, 10, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Badan anjing cokelat cerah
        ctx.fillStyle = "#8D6E63";
        ctx.beginPath();
        ctx.roundRect(-14, -6, 24, 14, 5);
        ctx.fill();

        // Kepala
        ctx.fillStyle = "#6D4C41";
        ctx.beginPath();
        ctx.arc(10, -8, 8, 0, Math.PI * 2);
        ctx.fill();

        // Telinga jatuh
        ctx.fillStyle = "#4E342E";
        ctx.beginPath();
        ctx.ellipse(8, -4, 4, 7, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Moncong & Hidung
        ctx.fillStyle = "#D7CCC8";
        ctx.beginPath();
        ctx.arc(14, -6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#212121";
        ctx.fillRect(16, -8, 2, 2);

        // Kalung anjing emas
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(3, -4, 5, 8);

        // Label Penjaga
        ctx.fillStyle = "#2E7D32";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.fillText("🛡️ Penjaga", 0, -18);

        ctx.restore();
    }
}

window.ParticleSystem = ParticleSystem;
window.FloatingTextManager = FloatingTextManager;
window.PlayerEntity = PlayerEntity;
window.AnimalRenderer = AnimalRenderer;
window.MachineRenderer = MachineRenderer;
window.TruckRenderer = TruckRenderer;
window.WolfEntity = WolfEntity;
window.GuardDogRenderer = GuardDogRenderer;
