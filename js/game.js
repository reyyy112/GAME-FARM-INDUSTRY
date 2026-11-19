// game.js - Core Game Loop, World Rendering, Interaksi Zona IMK, Logika Pengiriman & Pabrik

class GameEngine {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.state = window.gameState;
        this.sound = window.soundFX;

        this.particles = new window.ParticleSystem();
        this.floatingTexts = new window.FloatingTextManager();
        this.player = new window.PlayerEntity(this.state);

        this.keys = {};
        this.touchTarget = null;
        this.lastTime = performance.now();
        this.saveTimer = 0;

        // Koordinat Zona Interaktif Dunia (Peta 1280 x 800)
        this.zones = {
            // Kandang Hewan (Sisi Kiri, 3 Petak Vertikal Rapi)
            chickenPen: { x: 60, y: 70, w: 260, h: 190, label: "Kandang Ayam 🐔" },
            cowPen: { x: 60, y: 290, w: 260, h: 190, label: "Kandang Sapi 🐄" },
            sheepPen: { x: 60, y: 510, w: 260, h: 190, label: "Padang Domba 🐑" },

            // Pabrik Pengolahan (Tengah)
            factoryArea: { x: 380, y: 130, w: 500, h: 600 },
            machineMayo: { x: 470, y: 240, defKey: "mayo_maker" },
            machineCheese: { x: 630, y: 410, defKey: "cheese_maker" },
            machineLoom: { x: 790, y: 580, defKey: "loom_weaver" },

            // Zona Setor & Ambil Pabrik
            depositMayo: { x: 420, y: 280, radius: 36, type: "egg", label: "Setor Telur" },
            pickupMayo: { x: 520, y: 280, radius: 36, type: "mayo", label: "Ambil Mayo" },

            depositCheese: { x: 580, y: 450, radius: 36, type: "milk", label: "Setor Susu" },
            pickupCheese: { x: 680, y: 450, radius: 36, type: "cheese", label: "Ambil Keju" },

            depositLoom: { x: 740, y: 620, radius: 36, type: "wool", label: "Setor Wol" },
            pickupLoom: { x: 840, y: 620, radius: 36, type: "fabric", label: "Ambil Kain" },

            // Zona Logistik & Truk Pengiriman (Sisi Kanan)
            truckDock: { x: 1050, y: 410 },
            truckLoadPad: { x: 960, y: 410, radius: 46, label: "Muat Truk 📦" },
            truckShipPad: { x: 960, y: 510, radius: 42, label: "KIRIM TRUK 🚀" },

            // Toko / Upgrade Station (Atas Tengah)
            shopPad: { x: 630, y: 70, radius: 42, label: "Toko Upgrade 🏪" },

            // Pos Anjing Penjaga
            dogPost: { x: 350, y: 390 }
        };

        this.initInput();
        this.initUI();
    }

    initInput() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.sound.init(); // Memulai audio context pada interaksi pertama pengguna

            if (e.key === "e" || e.key === "E") {
                this.manualActionTrigger();
            }
            if (e.key === " " || e.key === "Spacebar") {
                this.triggerShipTruck();
            }
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Kontrol klik kursor / tap untuk bergerak (Direct Manipulation & Accessibility)
        this.canvas.addEventListener("pointerdown", (e) => {
            this.sound.init();
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            this.touchTarget = {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        });

        this.canvas.addEventListener("pointermove", (e) => {
            if (this.touchTarget) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                this.touchTarget = {
                    x: (e.clientX - rect.left) * scaleX,
                    y: (e.clientY - rect.top) * scaleY
                };
            }
        });

        window.addEventListener("pointerup", () => {
            this.touchTarget = null;
        });
    }

    initUI() {
        // Tombol HUD Cepat
        const btnShop = document.getElementById("btnOpenShop");
        if (btnShop) btnShop.addEventListener("click", () => this.openShopModal());

        const btnMute = document.getElementById("btnToggleSound");
        if (btnMute) {
            btnMute.addEventListener("click", () => {
                const isMuted = this.sound.toggleMute();
                btnMute.textContent = isMuted ? "🔇 Suara: Mati" : "🔊 Suara: Nyala";
                btnMute.classList.toggle("btn-muted", isMuted);
            });
        }

        const btnShipTruck = document.getElementById("btnShipTruck");
        if (btnShipTruck) {
            btnShipTruck.addEventListener("click", () => this.triggerShipTruck());
        }

        const btnHowToPlay = document.getElementById("btnHowToPlay");
        if (btnHowToPlay) {
            btnHowToPlay.addEventListener("click", () => this.openHowToPlayModal());
        }

        // Cek data save & progress offline
        const loadResult = this.state.load();
        if (loadResult && loadResult.offlineDurationMs > 8000) {
            const offlineReport = this.state.processOfflineEarnings(loadResult.offlineDurationMs);
            if (offlineReport) {
                this.showOfflineModal(offlineReport);
            }
        }
    }

    start() {
        this.lastTime = performance.now();
        const loop = (timestamp) => {
            const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
            this.lastTime = timestamp;

            this.update(dt, timestamp);
            this.render(timestamp);

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update(dt, timestamp) {
        // 1. Input Gerak Pemain
        const inputDir = { x: 0, y: 0 };
        if (this.keys["w"] || this.keys["arrowup"]) inputDir.y -= 1;
        if (this.keys["s"] || this.keys["arrowdown"]) inputDir.y += 1;
        if (this.keys["a"] || this.keys["arrowleft"]) inputDir.x -= 1;
        if (this.keys["d"] || this.keys["arrowright"]) inputDir.x += 1;

        if (this.touchTarget) {
            const dx = this.touchTarget.x - this.state.player.x;
            const dy = this.touchTarget.y - this.state.player.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 12) {
                inputDir.x = dx / dist;
                inputDir.y = dy / dist;
            } else {
                this.touchTarget = null;
            }
        }

        this.player.update(dt, inputDir, this.particles);

        // 2. Pembaruan Hewan Ternak (Idle Production)
        const petMult = this.state.getPetCareMultiplier();
        this.state.animals.forEach(animal => {
            animal.timer += dt * 1000 * petMult;
            if (animal.timer >= animal.produceTime) {
                animal.timer = 0;
                // Hewan menjatuhkan hasil panen di tanah
                const itemType = (animal.type === "chicken") ? "egg" : (animal.type === "cow" ? "milk" : "wool");
                const dropX = animal.x + (Math.random() * 40 - 20);
                const dropY = animal.y + (Math.random() * 30 - 15);
                this.state.groundItems.push({
                    id: "item_" + Math.random(),
                    type: itemType,
                    x: dropX,
                    y: dropY,
                    spawnTime: timestamp
                });
            }
        });

        // 3. Pengambilan Bahan Panen di Tanah (Magnet Harvest)
        const px = this.state.player.x;
        const py = this.state.player.y;
        for (let i = this.state.groundItems.length - 1; i >= 0; i--) {
            const item = this.state.groundItems[i];
            const dist = Math.hypot(item.x - px, item.y - py);

            if (dist < 45) { // Radius magnet pengumpulan
                if (this.state.getBagCount() < this.state.getMaxBagCapacity()) {
                    const added = this.state.addToBag(item.type, 1);
                    if (added > 0) {
                        this.sound.playHarvest();
                        this.player.onHarvest();
                        const def = ITEM_DEFS[item.type];
                        this.floatingTexts.add(item.x, item.y - 10, `+1 ${def.icon}`, def.color, 14);
                        this.particles.emit(item.x, item.y, def.color, 6);
                        this.state.stats.totalHarvested++;
                        this.state.groundItems.splice(i, 1);
                    }
                } else {
                    // Peringatan tas penuh
                    if (Math.random() < 0.05) {
                        this.sound.playAlert();
                        this.floatingTexts.add(px, py - 30, "⚠️ Tas Penuh!", "#FF5252", 15, 0.8);
                    }
                }
            }
        }

        // 4. Logika Mesin Pabrik (Processing)
        const factorySpeedMult = this.state.getFactorySpeedMultiplier();
        for (let key in this.state.machines) {
            const mState = this.state.machines[key];
            const mDef = MACHINE_DEFS[key];

            // Mulai proses jika ada bahan di antrean
            if (!mState.isProcessing && mState.inputQueue >= mDef.inputQty) {
                mState.isProcessing = true;
                mState.progress = 0;
            }

            if (mState.isProcessing) {
                const effectiveDuration = mDef.baseTimeMs / factorySpeedMult;
                mState.progress += (dt * 1000) / effectiveDuration;

                if (mState.progress >= 1.0) {
                    mState.isProcessing = false;
                    mState.progress = 0;
                    mState.inputQueue -= mDef.inputQty;
                    mState.outputCount += mDef.outputQty;
                    this.state.stats.totalProcessed++;
                    this.sound.playMachineFinish();

                    const zonePos = key === "mayo_maker" ? this.zones.machineMayo :
                                   (key === "cheese_maker" ? this.zones.machineCheese : this.zones.machineLoom);
                    this.floatingTexts.add(zonePos.x, zonePos.y - 45, `✅ ${ITEM_DEFS[mDef.outputItem].icon} Siap!`, "#69F0AE", 14);
                    this.particles.emit(zonePos.x, zonePos.y - 20, "#69F0AE", 10);
                }
            }
        }

        // 5. Interaksi Zona Otomatis (Deposit & Pickup Bahan)
        this.checkZoneInteractions(px, py, dt);

        // 6. Logika Truk Pengiriman (Logistics Loop)
        const truckCfg = this.state.getTruckConfig();
        if (this.state.truck.status === "delivering") {
            this.state.truck.deliverTimer += dt * 1000;
            if (this.state.truck.deliverTimer >= this.state.truck.deliverDuration) {
                // Truk selesai mengantar dan kembali
                this.state.truck.status = "docked";
                this.state.truck.deliverTimer = 0;

                const earned = this.state.truck.potentialRevenue;
                this.state.player.cash += earned;
                this.state.stats.totalEarned += earned;
                this.state.stats.totalDelivered += this.state.truck.cargo.reduce((s, i) => s + i.count, 0);
                this.state.truck.cargo = [];
                this.state.truck.potentialRevenue = 0;

                this.sound.playCash();
                this.particles.emitCoinShower(this.zones.truckDock.x, this.zones.truckDock.y, 25);
                this.floatingTexts.add(this.zones.truckDock.x, this.zones.truckDock.y - 40, `+$${earned} TUNAI!`, "#FFD700", 22, 2.0);
            }
        }

        // 7. Event Ancaman Serigala (Wolf Event)
        this.updateWolfLogic(dt, px, py);

        // 8. Update Partikel & Teks Mengambang
        this.particles.update(dt);
        this.floatingTexts.update(dt);

        // 9. Auto-save tiap 6 detik
        this.saveTimer += dt;
        if (this.saveTimer > 6.0) {
            this.saveTimer = 0;
            this.state.save();
        }

        // 10. Update HUD DOM
        this.updateHUD();
    }

    checkZoneInteractions(px, py, dt) {
        // Interaksi Deposit Bahan Mentah ke Mesin
        const depositZones = [
            { zone: this.zones.depositMayo, machine: this.state.machines.mayo_maker, inType: "egg" },
            { zone: this.zones.depositCheese, machine: this.state.machines.cheese_maker, inType: "milk" },
            { zone: this.zones.depositLoom, machine: this.state.machines.loom_weaver, inType: "wool" }
        ];

        depositZones.forEach(dz => {
            const dist = Math.hypot(px - dz.zone.x, py - dz.zone.y);
            if (dist < dz.zone.radius) {
                // Transfer item dari tas pemain ke antrean mesin
                const hasItem = this.state.player.bag.find(i => i.type === dz.inType);
                if (hasItem && hasItem.count > 0 && dz.machine.inputQueue < 30) {
                    this.state.removeFromBag(dz.inType, 1);
                    dz.machine.inputQueue += 1;
                    this.sound.playDeposit();
                    const def = ITEM_DEFS[dz.inType];
                    this.floatingTexts.add(dz.zone.x, dz.zone.y - 15, `Setor 1 ${def.icon}`, def.color, 13, 0.7);
                    this.particles.emit(dz.zone.x, dz.zone.y, def.color, 4);
                }
            }
        });

        // Interaksi Pengambilan Produk Jadi dari Mesin
        const pickupZones = [
            { zone: this.zones.pickupMayo, machine: this.state.machines.mayo_maker, outType: "mayo" },
            { zone: this.zones.pickupCheese, machine: this.state.machines.cheese_maker, outType: "cheese" },
            { zone: this.zones.pickupLoom, machine: this.state.machines.loom_weaver, outType: "fabric" }
        ];

        pickupZones.forEach(pz => {
            const dist = Math.hypot(px - pz.zone.x, py - pz.zone.y);
            if (dist < pz.zone.radius && pz.machine.outputCount > 0) {
                if (this.state.getBagCount() < this.state.getMaxBagCapacity()) {
                    const added = this.state.addToBag(pz.outType, 1);
                    if (added > 0) {
                        pz.machine.outputCount -= 1;
                        this.sound.playHarvest();
                        this.player.onHarvest();
                        const def = ITEM_DEFS[pz.outType];
                        this.floatingTexts.add(pz.zone.x, pz.zone.y - 15, `Ambil 1 ${def.icon}`, def.color, 14, 0.8);
                        this.particles.emit(pz.zone.x, pz.zone.y, def.color, 5);
                    }
                }
            }
        });

        // Interaksi Muat Barang ke Truk Logistik
        const truckDist = Math.hypot(px - this.zones.truckLoadPad.x, py - this.zones.truckLoadPad.y);
        const truckCfg = this.state.getTruckConfig();
        if (truckDist < this.zones.truckLoadPad.radius && this.state.truck.status === "docked") {
            const currentCargoCount = this.state.getTruckCargoCount();
            if (currentCargoCount < truckCfg.capacity && this.state.player.bag.length > 0) {
                // Prioritaskan memuat barang hasil olahan yang bernilai tinggi
                const bagItem = this.state.player.bag[0];
                this.state.removeFromBag(bagItem.type, 1);

                let cargoItem = this.state.truck.cargo.find(c => c.type === bagItem.type);
                if (cargoItem) {
                    cargoItem.count += 1;
                } else {
                    this.state.truck.cargo.push({ type: bagItem.type, count: 1 });
                }

                this.sound.playDeposit();
                const def = ITEM_DEFS[bagItem.type];
                this.floatingTexts.add(this.zones.truckLoadPad.x, this.zones.truckLoadPad.y - 20, `Muat 1 ${def.icon}`, def.color, 13, 0.7);
                this.particles.emit(this.zones.truckLoadPad.x, this.zones.truckLoadPad.y, "#90CAF9", 4);
            }
        }

        // Interaksi Pad Kirim Truk
        const shipDist = Math.hypot(px - this.zones.truckShipPad.x, py - this.zones.truckShipPad.y);
        if (shipDist < this.zones.truckShipPad.radius && this.state.truck.status === "docked") {
            if (this.state.getTruckCargoCount() > 0) {
                this.triggerShipTruck();
            }
        }

        // Interaksi Masuk Toko Upgrade
        const shopDist = Math.hypot(px - this.zones.shopPad.x, py - this.zones.shopPad.y);
        if (shopDist < this.zones.shopPad.radius) {
            this.openShopModal();
        }
    }

    triggerShipTruck() {
        if (this.state.truck.status === "delivering") return;
        const cargoCount = this.state.getTruckCargoCount();
        if (cargoCount === 0) {
            this.floatingTexts.add(this.zones.truckDock.x, this.zones.truckDock.y - 20, "Muat barang dulu!", "#FF5252", 15);
            return;
        }

        const truckCfg = this.state.getTruckConfig();
        // Hitung total harga barang yang dimuat + multiplier armada truk
        let totalRevenue = 0;
        this.state.truck.cargo.forEach(c => {
            const def = ITEM_DEFS[c.type];
            totalRevenue += def.price * c.count;
        });
        totalRevenue = Math.round(totalRevenue * truckCfg.multiplier);

        this.state.truck.potentialRevenue = totalRevenue;
        this.state.truck.status = "delivering";
        this.state.truck.deliverTimer = 0;
        this.state.truck.deliverDuration = truckCfg.travelTimeMs;

        this.sound.playTruckHonk();
        this.floatingTexts.add(this.zones.truckDock.x, this.zones.truckDock.y - 30, "🚚 Truk Berangkat Mengantar!", "#42A5F5", 16);
    }

    updateWolfLogic(dt, px, py) {
        const wolf = this.state.wolf;
        if (!wolf.active) {
            wolf.nextSpawnTimer -= dt * 1000;
            if (wolf.nextSpawnTimer <= 0) {
                // Munculkan serigala di tepi kiri atas
                wolf.active = true;
                wolf.x = 20;
                wolf.y = 180;
                wolf.nextSpawnTimer = 50000; // Tiap 50 detik
                this.sound.playAlert();
                this.floatingTexts.add(wolf.x, wolf.y - 20, "⚠️ Serigala Mendekat!", "#FF1744", 16);
            }
        } else {
            // Serigala bergerak perlahan mendekati kandang ayam
            wolf.x += dt * 45;
            wolf.y += dt * 25;

            // Jika ada Anjing Penjaga -> Anjing otomatis mengusir serigala
            if (this.state.upgrades.hasGuardDog) {
                const dogPos = this.zones.dogPost;
                const distDog = Math.hypot(wolf.x - dogPos.x, wolf.y - dogPos.y);
                if (distDog < 180) {
                    wolf.active = false;
                    this.state.stats.wolvesRepelled++;
                    this.sound.playUpgrade();
                    this.floatingTexts.add(wolf.x, wolf.y - 20, "🛡️ Anjing Mengusir Serigala!", "#2E7D32", 15);
                    this.particles.emit(wolf.x, wolf.y, "#FFEB3B", 10);
                }
            }

            // Jika pemain mendekat -> Pemain mengusir serigala secara manual
            const distPlayer = Math.hypot(wolf.x - px, wolf.y - py);
            if (distPlayer < 80) {
                wolf.active = false;
                this.state.stats.wolvesRepelled++;
                this.sound.playUpgrade();
                this.floatingTexts.add(wolf.x, wolf.y - 20, "💥 Anda Mengusir Serigala!", "#4CAF50", 15);
                this.particles.emit(wolf.x, wolf.y, "#FF5722", 10);
            }

            // Jika serigala mencapai kandang tanpa diusir
            if (wolf.x > 220) {
                wolf.active = false;
                // Curi 2 telur di tanah jika ada
                const eggItem = this.state.groundItems.find(i => i.type === "egg");
                if (eggItem) {
                    this.state.groundItems = this.state.groundItems.filter(i => i !== eggItem);
                    this.floatingTexts.add(wolf.x, wolf.y - 20, "🐺 Serigala Mencuri Telur!", "#D50000", 15);
                }
            }
        }
    }

    manualActionTrigger() {
        // Tombol interaksi cepat 'E'
        const px = this.state.player.x;
        const py = this.state.player.y;
        this.checkZoneInteractions(px, py, 1.0);
    }

    render(time) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. Gambar Tanah & Rumput Segar
        this.renderTerrain(ctx, time);

        // 2. Gambar Zona & Bangunan (Pabrik, Kandang, Jalan, Dermaga)
        this.renderEnvironment(ctx, time);

        // 3. Gambar Item di Tanah (Bahan Mentah yang Jatuh)
        this.renderGroundItems(ctx, time);

        // 4. Gambar Hewan Ternak
        this.state.animals.forEach(animal => {
            if (animal.type === "chicken") window.AnimalRenderer.drawChicken(ctx, animal, time);
            if (animal.type === "cow") window.AnimalRenderer.drawCow(ctx, animal, time);
            if (animal.type === "sheep") window.AnimalRenderer.drawSheep(ctx, animal, time);
        });

        // 5. Gambar Mesin Pabrik Industri
        for (let key in this.state.machines) {
            const mState = this.state.machines[key];
            const mDef = MACHINE_DEFS[key];
            const pos = key === "mayo_maker" ? this.zones.machineMayo :
                       (key === "cheese_maker" ? this.zones.machineCheese : this.zones.machineLoom);
            window.MachineRenderer.draw(ctx, mDef, mState, pos.x, pos.y, time);
        }

        // 6. Gambar Truk Logistik
        let truckX = this.zones.truckDock.x;
        let truckY = this.zones.truckDock.y;
        if (this.state.truck.status === "delivering") {
            // Animasi truk berjalan ke luar layar kanan dan kembali
            const progress = this.state.truck.deliverTimer / this.state.truck.deliverDuration;
            if (progress < 0.5) {
                // Berangkat ke kanan
                truckX += progress * 2 * 300;
            } else {
                // Kembali dari kanan
                truckX += (1 - (progress - 0.5) * 2) * 300;
            }
        }
        window.TruckRenderer.draw(ctx, this.state.truck, truckX, truckY, time);

        // 7. Gambar Anjing Penjaga (Jika sudah dibeli)
        if (this.state.upgrades.hasGuardDog) {
            window.GuardDogRenderer.draw(ctx, this.zones.dogPost.x, this.zones.dogPost.y, time);
        }

        // 8. Gambar Serigala (Jika sedang menyerang)
        window.WolfEntity.draw(ctx, this.state.wolf, time);

        // 9. Gambar Karakter Pemain
        this.player.draw(ctx);

        // 10. Gambar Partikel & Teks Terapung
        this.particles.draw(ctx);
        this.floatingTexts.draw(ctx);
    }

    renderTerrain(ctx, time) {
        // Dasar Padang Rumput Hijau Segar
        ctx.fillStyle = "#7CB342";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Corak Rumput Halus
        ctx.fillStyle = "#689F38";
        for (let x = 30; x < this.canvas.width; x += 90) {
            for (let y = 30; y < this.canvas.height; y += 90) {
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Jalan Setapak Batu (Cobblestone Path)
        ctx.fillStyle = "#90A4AE";
        // Jalan Penghubung Horisontal & Vertikal
        ctx.fillRect(320, 385, 690, 50);
        ctx.fillRect(605, 50, 50, 690);

        // Jalan Aspal Truk di Sisi Kanan Menuju Kota
        ctx.fillStyle = "#37474F";
        ctx.fillRect(1000, 380, 280, 90);
        // Garis Putus-putus Kuning di Tengah Jalan
        ctx.strokeStyle = "#FFEE58";
        ctx.lineWidth = 4;
        ctx.setLineDash([16, 14]);
        ctx.beginPath();
        ctx.moveTo(1000, 425);
        ctx.lineTo(1280, 425);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    renderEnvironment(ctx, time) {
        // 1. Pagar Kandang Hewan (Sisi Kiri)
        this.drawPenFence(ctx, this.zones.chickenPen, "#FFEB3B", "Kandang Ayam 🐔");
        if (this.state.upgrades.hasCow) {
            this.drawPenFence(ctx, this.zones.cowPen, "#81D4FA", "Kandang Sapi 🐄");
        } else {
            this.drawLockedZone(ctx, this.zones.cowPen, "Beli Kandang Sapi di Toko ($150)");
        }

        if (this.state.upgrades.hasSheep) {
            this.drawPenFence(ctx, this.zones.sheepPen, "#CE93D8", "Padang Domba 🐑");
        } else {
            this.drawLockedZone(ctx, this.zones.sheepPen, "Beli Padang Domba di Toko ($400)");
        }

        // 2. Lantai Zona Pabrik Industri
        const fa = this.zones.factoryArea;
        ctx.fillStyle = "rgba(55, 71, 79, 0.25)";
        ctx.beginPath();
        ctx.roundRect(fa.x, fa.y, fa.w, fa.h, 16);
        ctx.fill();
        ctx.strokeStyle = "#455A64";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#263238";
        ctx.font = "bold 15px 'Segoe UI', Arial";
        ctx.textAlign = "center";
        ctx.fillText("🏭 PABRIK PENGOLAHAN INDUSTRI", fa.x + fa.w / 2, fa.y + 24);

        // 3. Gambar Glowing Interactive Pads (IMK Visual Affordance)
        this.drawInteractivePad(ctx, this.zones.depositMayo, "#FFB300", "SETOR 🥚", time);
        this.drawInteractivePad(ctx, this.zones.pickupMayo, "#4CAF50", "AMBIL 🥫", time);

        if (this.state.upgrades.hasCow) {
            this.drawInteractivePad(ctx, this.zones.depositCheese, "#FFB300", "SETOR 🥛", time);
            this.drawInteractivePad(ctx, this.zones.pickupCheese, "#4CAF50", "AMBIL 🧀", time);
        }

        if (this.state.upgrades.hasSheep) {
            this.drawInteractivePad(ctx, this.zones.depositLoom, "#FFB300", "SETOR 🧶", time);
            this.drawInteractivePad(ctx, this.zones.pickupLoom, "#4CAF50", "AMBIL 🧵", time);
        }

        // Pad Muat Truk & Kirim Truk
        this.drawInteractivePad(ctx, this.zones.truckLoadPad, "#29B6F6", "MUAT TRUK 📦", time);
        this.drawInteractivePad(ctx, this.zones.truckShipPad, "#AB47BC", "KIRIM TRUK 🚀", time);

        // Pad Toko Upgrade
        this.drawInteractivePad(ctx, this.zones.shopPad, "#FF7043", "TOKO UPGRADE 🏪", time);
    }

    drawPenFence(ctx, pen, accentColor, title) {
        ctx.fillStyle = "rgba(121, 85, 72, 0.2)";
        ctx.beginPath();
        ctx.roundRect(pen.x, pen.y, pen.w, pen.h, 8);
        ctx.fill();

        ctx.strokeStyle = "#5D4037"; // Kayu pagar
        ctx.lineWidth = 4;
        ctx.strokeRect(pen.x, pen.y, pen.w, pen.h);

        // Tiang pagar kayu
        ctx.fillStyle = "#8D6E63";
        for (let fx = pen.x; fx <= pen.x + pen.w; fx += 32) {
            ctx.fillRect(fx - 3, pen.y - 4, 6, 8);
            ctx.fillRect(fx - 3, pen.y + pen.h - 4, 6, 8);
        }

        // Label Papan Nama Kandang
        ctx.fillStyle = "#4E342E";
        ctx.beginPath();
        ctx.roundRect(pen.x + 12, pen.y + 10, 150, 22, 5);
        ctx.fill();
        ctx.fillStyle = accentColor;
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "left";
        ctx.fillText(title, pen.x + 18, pen.y + 25);
    }

    drawLockedZone(ctx, pen, desc) {
        ctx.fillStyle = "rgba(33, 33, 33, 0.4)";
        ctx.beginPath();
        ctx.roundRect(pen.x, pen.y, pen.w, pen.h, 8);
        ctx.fill();
        ctx.strokeStyle = "#757575";
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(pen.x, pen.y, pen.w, pen.h);
        ctx.setLineDash([]);

        ctx.fillStyle = "#FFF";
        ctx.font = "bold 13px Arial";
        ctx.textAlign = "center";
        ctx.fillText("🔒 AREA BELUM TERBUKA", pen.x + pen.w / 2, pen.y + pen.h / 2 - 8);
        ctx.fillStyle = "#FFCA28";
        ctx.font = "11px Arial";
        ctx.fillText(desc, pen.x + pen.w / 2, pen.y + pen.h / 2 + 14);
    }

    drawInteractivePad(ctx, pad, color, text, time) {
        const pulse = Math.sin(time * 0.005) * 3;
        ctx.save();
        ctx.translate(pad.x, pad.y);

        // Lingkaran luar berdenyut halus
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(0, 0, pad.radius + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Lingkaran solid dalam
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(0, 0, pad.radius - 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Teks Petunjuk Zona
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 10px 'Segoe UI', Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 0, 0);

        ctx.restore();
    }

    renderGroundItems(ctx, time) {
        this.state.groundItems.forEach(item => {
            const def = ITEM_DEFS[item.type];
            const bob = Math.sin(time * 0.008 + item.x) * 2;
            ctx.save();
            ctx.translate(item.x, item.y + bob);

            // Bayangan item kecil
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.beginPath();
            ctx.ellipse(0, 8, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Ikon item
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(def.icon, 0, 0);

            ctx.restore();
        });
    }

    updateHUD() {
        const cashEl = document.getElementById("hudCash");
        if (cashEl) cashEl.textContent = `$${this.state.player.cash}`;

        const bagCount = this.state.getBagCount();
        const maxBag = this.state.getMaxBagCapacity();
        const bagEl = document.getElementById("hudBag");
        if (bagEl) {
            bagEl.textContent = `${bagCount} / ${maxBag}`;
            bagEl.parentElement.classList.toggle("hud-warning", bagCount >= maxBag);
        }

        const truckCargo = this.state.getTruckCargoCount();
        const truckCap = this.state.getTruckConfig().capacity;
        const truckStatusEl = document.getElementById("hudTruckStatus");
        if (truckStatusEl) {
            if (this.state.truck.status === "delivering") {
                const sLeft = Math.ceil((this.state.truck.deliverDuration - this.state.truck.deliverTimer) / 1000);
                truckStatusEl.textContent = `Mengantar... (${sLeft}s)`;
                truckStatusEl.style.color = "#FFB74D";
            } else {
                truckStatusEl.textContent = `Muatan: ${truckCargo}/${truckCap}`;
                truckStatusEl.style.color = "#81C784";
            }
        }
    }

    openShopModal() {
        const modal = document.getElementById("shopModal");
        if (!modal) return;
        this.renderShopItems();
        modal.classList.remove("hidden");
    }

    renderShopItems() {
        const list = document.getElementById("shopItemsList");
        if (!list) return;
        list.innerHTML = "";

        // Render Upgrades
        const upgradeKeys = [
            { key: "bag", cfg: UPGRADE_CONFIG.bag, curr: this.state.upgrades.bagLevel, max: UPGRADE_CONFIG.bag.costs.length },
            { key: "speed", cfg: UPGRADE_CONFIG.speed, curr: this.state.upgrades.speedLevel, max: UPGRADE_CONFIG.speed.costs.length },
            { key: "petCare", cfg: UPGRADE_CONFIG.petCare, curr: this.state.upgrades.petCareLevel, max: UPGRADE_CONFIG.petCare.costs.length },
            { key: "factorySpeed", cfg: UPGRADE_CONFIG.factorySpeed, curr: this.state.upgrades.factorySpeedLevel, max: UPGRADE_CONFIG.factorySpeed.costs.length }
        ];

        upgradeKeys.forEach(u => {
            const isMax = u.curr >= u.max;
            const cost = isMax ? 0 : u.cfg.costs[u.curr];
            const div = document.createElement("div");
            div.className = "shop-card";
            div.innerHTML = `
                <div class="shop-card-info">
                    <h4>${u.cfg.title} (Lv. ${u.curr + 1})</h4>
                    <p>${u.cfg.desc}</p>
                </div>
                <button class="btn btn-buy ${isMax ? 'disabled' : ''}" ${isMax || this.state.player.cash < cost ? 'disabled' : ''} data-upgrade="${u.key}">
                    ${isMax ? 'MAKSIMAL' : `Beli: $${cost}`}
                </button>
            `;
            const btn = div.querySelector("button");
            if (!isMax) {
                btn.addEventListener("click", () => this.purchaseUpgrade(u.key, cost));
            }
            list.appendChild(div);
        });

        // Kandang Sapi
        if (!this.state.upgrades.hasCow) {
            const cost = UPGRADE_CONFIG.cowUnlock.cost;
            const div = document.createElement("div");
            div.className = "shop-card special-card";
            div.innerHTML = `
                <div class="shop-card-info">
                    <h4>🐄 ${UPGRADE_CONFIG.cowUnlock.title}</h4>
                    <p>${UPGRADE_CONFIG.cowUnlock.desc}</p>
                </div>
                <button class="btn btn-buy" ${this.state.player.cash < cost ? 'disabled' : ''} id="btnBuyCow">
                    Buka: $${cost}
                </button>
            `;
            div.querySelector("#btnBuyCow").addEventListener("click", () => {
                if (this.state.player.cash >= cost) {
                    this.state.player.cash -= cost;
                    this.state.upgrades.hasCow = true;
                    this.state.syncAnimalsFromUpgrades();
                    this.sound.playUpgrade();
                    this.renderShopItems();
                    this.updateHUD();
                }
            });
            list.appendChild(div);
        }

        // Padang Domba
        if (!this.state.upgrades.hasSheep) {
            const cost = UPGRADE_CONFIG.sheepUnlock.cost;
            const div = document.createElement("div");
            div.className = "shop-card special-card";
            div.innerHTML = `
                <div class="shop-card-info">
                    <h4>🐑 ${UPGRADE_CONFIG.sheepUnlock.title}</h4>
                    <p>${UPGRADE_CONFIG.sheepUnlock.desc}</p>
                </div>
                <button class="btn btn-buy" ${this.state.player.cash < cost ? 'disabled' : ''} id="btnBuySheep">
                    Buka: $${cost}
                </button>
            `;
            div.querySelector("#btnBuySheep").addEventListener("click", () => {
                if (this.state.player.cash >= cost) {
                    this.state.player.cash -= cost;
                    this.state.upgrades.hasSheep = true;
                    this.state.syncAnimalsFromUpgrades();
                    this.sound.playUpgrade();
                    this.renderShopItems();
                    this.updateHUD();
                }
            });
            list.appendChild(div);
        }

        // Anjing Penjaga (Anti-Wolf)
        if (!this.state.upgrades.hasGuardDog) {
            const cost = UPGRADE_CONFIG.guardDog.cost;
            const div = document.createElement("div");
            div.className = "shop-card";
            div.innerHTML = `
                <div class="shop-card-info">
                    <h4>🐕 ${UPGRADE_CONFIG.guardDog.title}</h4>
                    <p>${UPGRADE_CONFIG.guardDog.desc}</p>
                </div>
                <button class="btn btn-buy" ${this.state.player.cash < cost ? 'disabled' : ''} id="btnBuyDog">
                    Beli: $${cost}
                </button>
            `;
            div.querySelector("#btnBuyDog").addEventListener("click", () => {
                if (this.state.player.cash >= cost) {
                    this.state.player.cash -= cost;
                    this.state.upgrades.hasGuardDog = true;
                    this.sound.playUpgrade();
                    this.renderShopItems();
                    this.updateHUD();
                }
            });
            list.appendChild(div);
        }

        // Upgrade Armada Truk
        if (this.state.truck.level < 3) {
            const nextLv = this.state.truck.level + 1;
            const cost = UPGRADE_CONFIG.truckUpgrade.costs[this.state.truck.level - 1];
            const nextCfg = TRUCK_LEVELS[nextLv - 1];
            const div = document.createElement("div");
            div.className = "shop-card";
            div.innerHTML = `
                <div class="shop-card-info">
                    <h4>🚚 Upgrade ke: ${nextCfg.name}</h4>
                    <p>Kapasitas: ${nextCfg.capacity} barang | Bonus Keuntungan: ${nextCfg.multiplier}x</p>
                </div>
                <button class="btn btn-buy" ${this.state.player.cash < cost ? 'disabled' : ''} id="btnBuyTruck">
                    Upgrade: $${cost}
                </button>
            `;
            div.querySelector("#btnBuyTruck").addEventListener("click", () => {
                if (this.state.player.cash >= cost) {
                    this.state.player.cash -= cost;
                    this.state.truck.level = nextLv;
                    this.state.upgrades.truckLevel = nextLv;
                    this.sound.playUpgrade();
                    this.renderShopItems();
                    this.updateHUD();
                }
            });
            list.appendChild(div);
        }
    }

    purchaseUpgrade(type, cost) {
        if (this.state.player.cash >= cost) {
            this.state.player.cash -= cost;
            if (type === "bag") this.state.upgrades.bagLevel++;
            if (type === "speed") this.state.upgrades.speedLevel++;
            if (type === "petCare") this.state.upgrades.petCareLevel++;
            if (type === "factorySpeed") this.state.upgrades.factorySpeedLevel++;

            this.sound.playUpgrade();
            this.renderShopItems();
            this.updateHUD();
        }
    }

    showOfflineModal(report) {
        const modal = document.getElementById("offlineModal");
        if (!modal) return;
        document.getElementById("offlineDurationText").textContent = `Anda offline selama ${report.durationMinutes} menit.`;
        document.getElementById("offlineEggCount").textContent = report.itemsProduced.egg;
        document.getElementById("offlineMilkCount").textContent = report.itemsProduced.milk;
        document.getElementById("offlineWoolCount").textContent = report.itemsProduced.wool;
        modal.classList.remove("hidden");
    }

    openHowToPlayModal() {
        const modal = document.getElementById("howToPlayModal");
        if (modal) modal.classList.remove("hidden");
    }
}

// Inisialisasi saat window selesai dimuat
window.addEventListener("DOMContentLoaded", () => {
    window.gameEngine = new GameEngine();
    window.gameEngine.start();

    // Event penutup modal
    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const modal = e.target.closest(".modal-overlay");
            if (modal) modal.classList.add("hidden");
        });
    });
});
