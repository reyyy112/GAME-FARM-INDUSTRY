// state.js - Game State, Items, Upgrades, Save/Load, Offline Progression, Daily Quests

const ITEM_DEFS = {
    egg: { name: "Telur", price: 5, icon: "🥚", color: "#FFE082", isRaw: true },
    milk: { name: "Susu", price: 10, icon: "🥛", color: "#B3E5FC", isRaw: true },
    wool: { name: "Wol", price: 18, icon: "🧶", color: "#E0E0E0", isRaw: true },
    mayo: { name: "Mayones", price: 20, icon: "🥫", color: "#FFF59D", isRaw: false },
    cheese: { name: "Keju", price: 45, icon: "🧀", color: "#FFCA28", isRaw: false },
    fabric: { name: "Benang", price: 85, icon: "🧵", color: "#BA68C8", isRaw: false },
    meat: { name: "Daging", price: 50, icon: "🥩", color: "#EF5350", isRaw: true },
    golden_yarn: { name: "Benang Emas", price: 220, icon: "✨", color: "#FFD700", isRaw: false }
};

const MACHINE_DEFS = {
    mayo_maker: {
        id: "mayo_maker",
        name: "Pengolah Telur (Mayones / Telur Kemasan)",
        inputItem: "egg",
        inputQty: 1,
        outputItem: "mayo",
        outputQty: 1,
        baseTimeMs: 3000 // Waktu pengolahan 3 detik sesuai instruksi
    },
    cheese_maker: {
        id: "cheese_maker",
        name: "Pengolah Susu (Keju / Susu Botol)",
        inputItem: "milk",
        inputQty: 1,
        outputItem: "cheese",
        outputQty: 1,
        baseTimeMs: 3000 // Waktu pengolahan 3 detik sesuai instruksi
    },
    loom_weaver: {
        id: "loom_weaver",
        name: "Alat Pemintal (Bulu Domba ke Benang / Kain Wol)",
        inputItem: "wool",
        inputQty: 1,
        outputItem: "fabric",
        outputQty: 1,
        baseTimeMs: 3000 // Waktu pengolahan 3 detik sesuai instruksi
    }
};

const LEVEL_CONFIG = [
    { level: 1, title: "Peternak Pemula", xpRequired: 100, rewardCash: 100, rewardStars: 10 },
    { level: 2, title: "Peternak Sapi Perah", xpRequired: 200, rewardCash: 250, rewardStars: 20 },
    { level: 3, title: "Peternak Domba & Tekstil", xpRequired: 350, rewardCash: 500, rewardStars: 30 },
    { level: 4, title: "Pengusaha Agribisnis Mandiri", xpRequired: 550, rewardCash: 800, rewardStars: 40 },
    { level: 5, title: "Maestro Industri Pertanian", xpRequired: 800, rewardCash: 1200, rewardStars: 50 }
];

function generateQuestsForLevel(level = 1) {
    if (level === 1) {
        return {
            daily: [
                {
                    id: "q_1_1",
                    level: 1,
                    difficulty: "Sangat Mudah",
                    diffBadge: "easy",
                    requirements: [{ type: "egg", name: "Telur", count: 5 }],
                    rewardCash: 60,
                    rewardStars: 10,
                    rewardXP: 35,
                    completed: false
                },
                {
                    id: "q_1_2",
                    level: 1,
                    difficulty: "Mudah",
                    diffBadge: "medium",
                    requirements: [{ type: "mayo", name: "Mayones", count: 3 }],
                    rewardCash: 120,
                    rewardStars: 15,
                    rewardXP: 35,
                    completed: false
                },
                {
                    id: "q_1_3",
                    level: 1,
                    difficulty: "Normal",
                    diffBadge: "normal",
                    requirements: [{ type: "egg", name: "Telur", count: 6 }, { type: "mayo", name: "Mayones", count: 2 }],
                    rewardCash: 180,
                    rewardStars: 20,
                    rewardXP: 40,
                    completed: false
                }
            ],
            weekly: [
                {
                    id: "q_w_1",
                    level: 1,
                    difficulty: "Tantangan Mingguan",
                    diffBadge: "normal",
                    requirements: [{ type: "egg", name: "Telur", count: 12 }, { type: "mayo", name: "Mayones", count: 6 }],
                    rewardCash: 350,
                    rewardStars: 30,
                    rewardXP: 80,
                    completed: false
                }
            ]
        };
    } else if (level === 2) {
        return {
            daily: [
                {
                    id: "q_2_1",
                    level: 2,
                    difficulty: "Mudah",
                    diffBadge: "easy",
                    requirements: [{ type: "milk", name: "Susu", count: 4 }],
                    rewardCash: 200,
                    rewardStars: 15,
                    rewardXP: 65,
                    completed: false
                },
                {
                    id: "q_2_2",
                    level: 2,
                    difficulty: "Normal",
                    diffBadge: "medium",
                    requirements: [{ type: "cheese", name: "Keju", count: 3 }],
                    rewardCash: 280,
                    rewardStars: 20,
                    rewardXP: 70,
                    completed: false
                },
                {
                    id: "q_2_3",
                    level: 2,
                    difficulty: "Tantangan",
                    diffBadge: "normal",
                    requirements: [{ type: "milk", name: "Susu", count: 4 }, { type: "cheese", name: "Keju", count: 2 }, { type: "mayo", name: "Mayones", count: 3 }],
                    rewardCash: 420,
                    rewardStars: 25,
                    rewardXP: 75,
                    completed: false
                }
            ],
            weekly: [
                {
                    id: "q_w_2",
                    level: 2,
                    difficulty: "Tantangan Mingguan",
                    diffBadge: "hard",
                    requirements: [{ type: "cheese", name: "Keju", count: 8 }, { type: "milk", name: "Susu", count: 10 }, { type: "mayo", name: "Mayones", count: 8 }],
                    rewardCash: 750,
                    rewardStars: 45,
                    rewardXP: 140,
                    completed: false
                }
            ]
        };
    } else if (level === 3) {
        return {
            daily: [
                {
                    id: "q_3_1",
                    level: 3,
                    difficulty: "Mudah",
                    diffBadge: "easy",
                    requirements: [{ type: "wool", name: "Wol", count: 4 }],
                    rewardCash: 320,
                    rewardStars: 20,
                    rewardXP: 110,
                    completed: false
                },
                {
                    id: "q_3_2",
                    level: 3,
                    difficulty: "Normal",
                    diffBadge: "medium",
                    requirements: [{ type: "fabric", name: "Benang", count: 3 }],
                    rewardCash: 480,
                    rewardStars: 25,
                    rewardXP: 120,
                    completed: false
                },
                {
                    id: "q_3_3",
                    level: 3,
                    difficulty: "Sulit",
                    diffBadge: "hard",
                    requirements: [{ type: "fabric", name: "Benang", count: 3 }, { type: "cheese", name: "Keju", count: 4 }, { type: "wool", name: "Wol", count: 3 }],
                    rewardCash: 680,
                    rewardStars: 35,
                    rewardXP: 130,
                    completed: false
                }
            ],
            weekly: [
                {
                    id: "q_w_3",
                    level: 3,
                    difficulty: "Tantangan Mingguan",
                    diffBadge: "hard",
                    requirements: [{ type: "fabric", name: "Benang", count: 10 }, { type: "wool", name: "Wol", count: 12 }, { type: "cheese", name: "Keju", count: 8 }],
                    rewardCash: 1200,
                    rewardStars: 60,
                    rewardXP: 220,
                    completed: false
                }
            ]
        };
    } else {
        return {
            daily: [
                {
                    id: `q_${level}_1`,
                    level: level,
                    difficulty: "Agribisnis Mandiri",
                    diffBadge: "medium",
                    requirements: [{ type: "egg", name: "Telur", count: 8 }, { type: "milk", name: "Susu", count: 6 }, { type: "wool", name: "Wol", count: 4 }],
                    rewardCash: 650,
                    rewardStars: 30,
                    rewardXP: 180,
                    completed: false
                },
                {
                    id: `q_${level}_2`,
                    level: level,
                    difficulty: "Industri Olahan",
                    diffBadge: "normal",
                    requirements: [{ type: "mayo", name: "Mayones", count: 5 }, { type: "cheese", name: "Keju", count: 4 }, { type: "fabric", name: "Benang", count: 4 }],
                    rewardCash: 950,
                    rewardStars: 40,
                    rewardXP: 190,
                    completed: false
                },
                {
                    id: `q_${level}_3`,
                    level: level,
                    difficulty: "Ekspedisi Pasar Raya",
                    diffBadge: "hard",
                    requirements: [{ type: "cheese", name: "Keju", count: 6 }, { type: "fabric", name: "Benang", count: 5 }, { type: "mayo", name: "Mayones", count: 6 }],
                    rewardCash: 1350,
                    rewardStars: 50,
                    rewardXP: 210,
                    completed: false
                }
            ],
            weekly: [
                {
                    id: `q_w_${level}`,
                    level: level,
                    difficulty: "Tantangan Maestro",
                    diffBadge: "hard",
                    requirements: [{ type: "fabric", name: "Benang", count: 12 }, { type: "cheese", name: "Keju", count: 12 }, { type: "mayo", name: "Mayones", count: 14 }],
                    rewardCash: 2400,
                    rewardStars: 80,
                    rewardXP: 350,
                    completed: false
                }
            ]
        };
    }
}

const INITIAL_QUESTS = generateQuestsForLevel(1);

const TRUCK_LEVELS = [
    { 
        level: 1, 
        name: "Level 1: Sepeda Onthel Keranjang", 
        capacity: 6, 
        travelTimeMs: 45000, // 20s ke ujung map + 5s tunggu di kota + 20s kembali (Awal lambat santai)
        multiplier: 1.0, 
        desc: "Sepeda kayuh santai awal (20s berangkat, 5s tunggu di kota, 20s kembali)" 
    },
    { 
        level: 2, 
        name: "Level 2: Sepeda Motor Gerobak", 
        capacity: 12, 
        travelTimeMs: 31000, // 13s ke ujung map + 5s tunggu + 13s kembali
        multiplier: 1.25, 
        desc: "Motor pengangkut bertenaga (13s berangkat, 5s tunggu di kota, 13s kembali)" 
    },
    { 
        level: 3, 
        name: "Level 3: Kendaraan Roda 3 / Pikap Kecil", 
        capacity: 20, 
        travelTimeMs: 23000, // 9s ke ujung map + 5s tunggu + 9s kembali
        multiplier: 1.55, 
        desc: "Motor niaga roda 3 (9s berangkat, 5s tunggu di kota, 9s kembali)" 
    },
    { 
        level: 4, 
        name: "Level 4: Mobil Pikap Serbaguna", 
        capacity: 32, 
        travelTimeMs: 17000, // 6s ke ujung map + 5s tunggu + 6s kembali
        multiplier: 1.9, 
        desc: "Mobil pikap serbaguna (6s berangkat, 5s tunggu di kota, 6s kembali)" 
    },
    { 
        level: 5, 
        name: "Level 5: Truk Sedang Pagar Kayu", 
        capacity: 48, 
        travelTimeMs: 13000, // 4s ke ujung map + 5s tunggu + 4s kembali
        multiplier: 2.35, 
        desc: "Truk kargo komersial sedang (4s berangkat, 5s tunggu di kota, 4s kembali)" 
    },
    { 
        level: 6, 
        name: "Level 6: Truk Kontainer Logistik", 
        capacity: 75, 
        travelTimeMs: 9000, // 2s ke ujung map + 5s tunggu + 2s kembali
        multiplier: 3.2, 
        desc: "Truk kontainer ekspedisi kilat (2s berangkat, 5s tunggu di kota, 2s kembali)" 
    }
];

const UPGRADE_CONFIG = {
    bag: {
        title: "Kapasitas Tas (Backpack)",
        desc: "Bawa lebih banyak bahan panen sekaligus",
        costs: [50, 150, 350, 800],
        values: [10, 20, 35, 55, 90]
    },
    speed: {
        title: "Kecepatan Jalan Karakter",
        desc: "Meningkatkan mobilitas saat panen & setor",
        costs: [40, 120, 280, 600],
        values: [200, 240, 280, 320, 370]
    },
    petCare: {
        title: "Perawatan Hewan (Pet Care)",
        desc: "Nutrisi pakan mempercepat produksi ternak",
        costs: [80, 220, 550],
        multipliers: [1.0, 1.25, 1.55, 2.0]
    },
    factorySpeed: {
        title: "Efisiensi Mesin Pabrik",
        desc: "Mesin mengolah bahan lebih kilat",
        costs: [100, 250, 650],
        multipliers: [1.0, 1.3, 1.65, 2.2]
    },
    guardDog: {
        title: "Anjing Penjaga (Anti-Wolf)",
        desc: "Menghalau serigala yang mencoba mencuri ternak",
        cost: 200,
        purchased: false
    },
    cowUnlock: {
        title: "Beli Kandang Sapi Perah",
        desc: "Menghasilkan Susu Murni bernilai tinggi",
        cost: 150,
        purchased: false
    },
    sheepUnlock: {
        title: "Beli Padang Domba Wol",
        desc: "Menghasilkan Wol Alami bernilai premium",
        cost: 300,
        purchased: false
    },
    truckUpgrade: {
        title: "Peningkatan Kendaraan Pengantar",
        desc: "Dari Sepeda hingga Truk Kontainer! Perbesar kapasitas & percepat pengiriman",
        costs: [60, 140, 260, 480, 850] // level 2 (Motor), 3 (Roda 3), 4 (Pikap), 5 (Truk Sedang), 6 (Kontainer)
    }
};

class GameStateManager {
    constructor() {
        this.resetToDefaults();
    }

    resetToDefaults() {
        this.player = {
            name: "Petani Hebat",
            farmName: "Green Valley Farm",
            characterType: "grandpa", // "grandpa" | "girl" | "woman" | "boy"
            hasCreatedCharacter: false,
            x: 460,
            y: 380,
            level: 1,
            xp: 0,
            cash: 250, // Modal awal yang memadai untuk membeli hewan ternak
            stars: 150, // Total Bintang untuk penukaran skin & hadiah misi
            speedLevel: 0,
            bagLevel: 0,
            bag: [] // [{ type: 'egg', count: 1 }]
        };

        this.quests = JSON.parse(JSON.stringify(INITIAL_QUESTS));
        this.questTab = "daily"; // 'daily' | 'weekly'

        this.upgrades = {
            bagLevel: 0,
            speedLevel: 0,
            petCareLevel: 0,
            factorySpeedLevel: 0,
            truckLevel: 1,
            hasGuardDog: false,
            hasCow: false,
            hasSheep: false
        };

        // KAPASITAS RUMAH AYAM PANGGUNG: 4 EKOR AYAM AKTIF SESUAI GAMBAR REFERENSI
        // Hewan awal: Hanya 1 ekor ayam starter di awal permainan sesuai permintaan.
        // Jika ayam bertambah sampai 5 ekor, rumah ayam ke-2 muncul; sampai 9 ekor, rumah ayam ke-3 muncul (Maksimal 12 ekor).
        this.animals = [
            { id: "chk_1", type: "chicken", produceTime: 5000, timer: 1500 }
        ];

        this.groundItems = []; // [{ id, type, x, y, spawnTime }]

        this.machines = {
            mayo_maker: {
                id: "mayo_maker",
                inputQueue: 0,
                progress: 0,
                isProcessing: false,
                outputCount: 0
            },
            cheese_maker: {
                id: "cheese_maker",
                inputQueue: 0,
                progress: 0,
                isProcessing: false,
                outputCount: 0
            },
            loom_weaver: {
                id: "loom_weaver",
                inputQueue: 0,
                progress: 0,
                isProcessing: false,
                outputCount: 0
            }
        };

        this.truck = {
            level: 1,
            cargo: [], // [{ type: 'mayo', count: 5 }]
            status: "docked", // 'docked' | 'delivering'
            deliverTimer: 0,
            deliverDuration: 45000,
            potentialRevenue: 0
        };

        this.stats = {
            totalEarned: 0,
            totalHarvested: 0,
            totalProcessed: 0,
            totalDelivered: 0,
            wolvesRepelled: 0
        };

        this.wolf = {
            active: false,
            x: 0,
            y: 0,
            targetAnimalId: null,
            timer: 0,
            nextSpawnTimer: 45000 // Serigala muncul tiap 45 detik
        };

        this.lastSaved = Date.now();
    }

    getBagCount() {
        return this.player.bag.reduce((sum, item) => sum + item.count, 0);
    }

    getMaxBagCapacity() {
        return UPGRADE_CONFIG.bag.values[this.upgrades.bagLevel];
    }

    getPlayerSpeed() {
        return UPGRADE_CONFIG.speed.values[this.upgrades.speedLevel];
    }

    getPetCareMultiplier() {
        return UPGRADE_CONFIG.petCare.multipliers[this.upgrades.petCareLevel];
    }

    getFactorySpeedMultiplier() {
        return UPGRADE_CONFIG.factorySpeed.multipliers[this.upgrades.factorySpeedLevel];
    }

    getTruckConfig() {
        const lv = Math.max(1, Math.min(TRUCK_LEVELS.length, this.truck.level || 1));
        return TRUCK_LEVELS[lv - 1];
    }

    getTruckCargoCount() {
        return this.truck.cargo.reduce((sum, item) => sum + item.count, 0);
    }

    addToBag(itemType, count = 1) {
        const currentCount = this.getBagCount();
        const maxCap = this.getMaxBagCapacity();
        if (currentCount >= maxCap) return 0;

        const space = maxCap - currentCount;
        const toAdd = Math.min(space, count);

        let existing = this.player.bag.find(i => i.type === itemType);
        if (existing) {
            existing.count += toAdd;
        } else {
            this.player.bag.push({ type: itemType, count: toAdd });
        }
        return toAdd;
    }

    getItemCountInBag(itemType) {
        const found = this.player.bag.find(i => i.type === itemType);
        return found ? found.count : 0;
    }

    getQuestCountdownFormatted() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        let diffMs = midnight - now;
        if (diffMs <= 0) diffMs = 24 * 3600 * 1000;
        const totalSecs = Math.floor(diffMs / 1000);
        const hours = String(Math.floor(totalSecs / 3600)).padStart(2, "0");
        const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, "0");
        const secs = String(totalSecs % 60).padStart(2, "0");
        return `${hours}:${mins}:${secs}`;
    }

    onItemCollected(type, count = 1) {
        if (!this.stats.collected) this.stats.collected = {};
        this.stats.collected[type] = (this.stats.collected[type] || 0) + count;
        this.stats.totalHarvested = (this.stats.totalHarvested || 0) + count;

        const updateList = (list) => {
            if (!list) return;
            list.forEach(q => {
                if (q.completed) return;
                q.requirements.forEach(req => {
                    if (req.type === type) {
                        req.progress = Math.min(req.count, (req.progress || 0) + count);
                    }
                });
            });
        };
        updateList(this.quests.daily);
        updateList(this.quests.weekly);
        this.save();
    }

    checkQuestProgress(quest) {
        let satisfiedCount = 0;
        const details = quest.requirements.map(req => {
            // Sistem Akumulasi Pengumpulan (BUKAN SISTEM TUKAR / POTONG BARANG)
            // Cukup pemain pernah mengumpulkan sejumlah barang tersebut
            const inBag = this.getItemCountInBag(req.type);
            const current = Math.max(req.progress || 0, inBag);
            const isMet = current >= req.count;
            if (isMet) satisfiedCount++;
            return {
                type: req.type,
                name: req.name,
                required: req.count,
                current: current,
                isMet: isMet
            };
        });
        const isAllMet = (satisfiedCount === quest.requirements.length);
        return {
            satisfiedCount,
            totalRequired: quest.requirements.length,
            isAllMet,
            details
        };
    }

    getLevelConfig(level = (this.player.level || 1)) {
        const idx = Math.max(1, Math.min(LEVEL_CONFIG.length, level)) - 1;
        return LEVEL_CONFIG[idx];
    }

    addPlayerXP(amount) {
        this.player.xp = (this.player.xp || 0) + amount;
        let leveledUp = false;
        let oldLevel = this.player.level || 1;

        while (true) {
            const currentCfg = this.getLevelConfig(this.player.level);
            if (this.player.xp >= currentCfg.xpRequired) {
                this.player.xp -= currentCfg.xpRequired;
                this.player.level++;
                this.player.cash += currentCfg.rewardCash || 150;
                this.player.stars = (this.player.stars || 0) + (currentCfg.rewardStars || 15);
                leveledUp = true;
                // Generate misi baru sesuai tingkatan level yang baru tercapai
                this.quests = generateQuestsForLevel(this.player.level);
            } else {
                break;
            }
        }

        this.save();
        return {
            leveledUp: leveledUp,
            oldLevel: oldLevel,
            newLevel: this.player.level,
            xp: this.player.xp,
            xpRequired: this.getLevelConfig(this.player.level).xpRequired
        };
    }

    claimQuest(questId) {
        let quest = this.quests.daily.find(q => q.id === questId);
        if (!quest) quest = this.quests.weekly.find(q => q.id === questId);
        if (!quest || quest.completed) {
            return { success: false, msg: "Misi tidak valid atau sudah selesai." };
        }

        const progress = this.checkQuestProgress(quest);
        if (!progress.isAllMet) {
            return { success: false, msg: "Syarat misi belum terkumpul lengkap!" };
        }

        // SISTEM BUKAN TUKAR: Barang TIDAK dipotong/dihapus dari tas/inventory pemain!
        // Barang tetap tersimpan di tas untuk dijual dengan truk atau diolah di pabrik.

        // Tambahkan Hadiah Uang (Rp) dan Bintang (⭐)
        this.player.cash += quest.rewardCash;
        this.player.stars = (this.player.stars || 0) + quest.rewardStars;
        this.stats.totalEarned += quest.rewardCash;
        quest.completed = true;

        // Tambahkan XP & Periksa Naik Level
        const questXP = quest.rewardXP || 35;
        const xpResult = this.addPlayerXP(questXP);

        this.save();
        return {
            success: true,
            rewardCash: quest.rewardCash,
            rewardStars: quest.rewardStars,
            rewardXP: questXP,
            leveledUp: xpResult.leveledUp,
            oldLevel: xpResult.oldLevel,
            newLevel: xpResult.newLevel,
            quest: quest
        };
    }

    refreshQuests(isWeekly = false) {
        const fresh = generateQuestsForLevel(this.player.level || 1);
        if (!isWeekly) {
            this.quests.daily = fresh.daily;
        } else {
            this.quests.weekly = fresh.weekly;
        }
        this.save();
    }

    removeFromBag(itemType, count = 1) {
        let existing = this.player.bag.find(i => i.type === itemType);
        if (!existing || existing.count < count) return false;

        existing.count -= count;
        if (existing.count <= 0) {
            this.player.bag = this.player.bag.filter(i => i.type !== itemType);
        }
        return true;
    }

    save() {
        this.lastSaved = Date.now();
        const data = {
            player: {
                name: this.player.name || "Petani Hebat",
                farmName: this.player.farmName || "Green Valley Farm",
                characterType: this.player.characterType || "grandpa",
                hasCreatedCharacter: !!this.player.hasCreatedCharacter,
                level: this.player.level || 1,
                xp: this.player.xp || 0,
                cash: this.player.cash,
                stars: this.player.stars ?? 150,
                bag: this.player.bag
            },
            quests: this.quests,
            animals: this.animals.map(a => ({ id: a.id, type: a.type, produceTime: a.produceTime, timer: a.timer || 0 })),
            upgrades: this.upgrades,
            machines: this.machines,
            stats: this.stats,
            truckCargo: this.truck.cargo,
            lastSaved: this.lastSaved
        };
        try {
            localStorage.setItem("farm_industry_save", JSON.stringify(data));
        } catch (e) {
            console.error("Gagal menyimpan game:", e);
        }
    }

    resetSave() {
        try {
            localStorage.removeItem("farm_industry_save");
        } catch (e) {}
        this.resetToDefaults();
    }

    load() {
        try {
            if (typeof window !== "undefined" && window.location && window.location.search) {
                const params = new URLSearchParams(window.location.search);
                if (params.get("reset") === "1" || params.get("new") === "1") {
                    localStorage.removeItem("farm_industry_save");
                    this.resetToDefaults();
                    return null;
                }
            }

            const raw = localStorage.getItem("farm_industry_save");
            if (!raw) return null;
            const data = JSON.parse(raw);

            this.player.name = data.player.name || "Petani Hebat";
            this.player.farmName = data.player.farmName || "Green Valley Farm";
            this.player.characterType = data.player.characterType || "grandpa";
            this.player.hasCreatedCharacter = !!data.player.hasCreatedCharacter;
            this.player.level = data.player.level ?? 1;
            this.player.xp = data.player.xp ?? 0;
            this.player.cash = data.player.cash ?? 250;
            this.player.stars = data.player.stars ?? 150;
            // Jika pemain memiliki kas kurang dari 150 di save lama, tambahkan saldo agar bisa langsung mencoba beli hewan
            if (this.player.cash < 150) {
                this.player.cash = 200;
            }
            this.player.bag = data.player.bag ?? [];
            if (data.quests && data.quests.daily && data.quests.daily.length > 0) {
                this.quests = data.quests;
            } else {
                this.quests = generateQuestsForLevel(this.player.level);
            }
            // Sanitasi: jika level 1 tapi misi berisi wol/daging yang belum ada hewannya, perbarui ke misi level 1
            if (this.player.level === 1 && this.quests.daily.some(q => q.requirements.some(r => r.type === "wool" || r.type === "meat" || r.type === "milk"))) {
                this.quests = generateQuestsForLevel(1);
            }
            if (Array.isArray(data.animals) && data.animals.length > 0) {
                this.animals = data.animals;
            }
            this.upgrades = Object.assign(this.upgrades, data.upgrades);
            this.stats = Object.assign(this.stats, data.stats);

            // Pastikan hewan sesuai dengan status kandang yang terbuka
            if (!this.upgrades.hasCow) {
                this.animals = this.animals.filter(a => a.type !== "cow");
            }
            if (!this.upgrades.hasSheep) {
                this.animals = this.animals.filter(a => a.type !== "sheep");
            }

            if (data.machines) {
                for (let k in data.machines) {
                    if (this.machines[k]) {
                        this.machines[k].inputQueue = data.machines[k].inputQueue ?? 0;
                        this.machines[k].outputCount = data.machines[k].outputCount ?? 0;
                    }
                }
            }

            if (data.truckCargo) {
                this.truck.cargo = data.truckCargo;
            }
            this.truck.level = Math.max(1, Math.min(6, this.upgrades.truckLevel || 1));

            // Re-spawn additional animals based on unlocked upgrades
            this.syncAnimalsFromUpgrades();

            const offlineDuration = Date.now() - (data.lastSaved || Date.now());
            return {
                offlineDurationMs: offlineDuration
            };
        } catch (e) {
            console.error("Gagal memuat save game:", e);
            return null;
        }
    }

    syncAnimalsFromUpgrades() {
        // Minimal ada 1 ayam starter di awal dan batasi maksimal 12 ayam (3 kandang x 4 kapasitas)
        const ownedChickens = this.animals.filter(a => a.type === "chicken");
        if (ownedChickens.length === 0) {
            this.animals.push({ id: "chk_1", type: "chicken", produceTime: 5000, timer: 1500 });
        } else if (ownedChickens.length > 12) {
            // Batasi maksimal 12 ekor ayam jika ada data save lama yang melebihi kapasitas
            const excessIds = new Set(ownedChickens.slice(12).map(c => c.id));
            this.animals = this.animals.filter(a => !excessIds.has(a.id));
        }

        // Hanya tambahkan sapi starter jika kandang sapi sudah terbuka (hasCow === true)
        if (this.upgrades.hasCow && !this.animals.some(a => a.type === "cow")) {
            this.animals.push({ id: "cow_1", type: "cow", produceTime: 8000, timer: 2500 });
        }
        // Hanya tambahkan domba starter jika padang domba sudah terbuka (hasSheep === true)
        if (this.upgrades.hasSheep && !this.animals.some(a => a.type === "sheep")) {
            this.animals.push({ id: "shp_1", type: "sheep", produceTime: 11000, timer: 3500 });
        }
    }

    unlockPaddock(type) {
        if (type === "cow") {
            const cost = UPGRADE_CONFIG.cowUnlock.cost || 150;
            if (this.player.cash < cost) return false;
            this.player.cash -= cost;
            this.upgrades.hasCow = true;
            if (!this.animals.some(a => a.type === "cow")) {
                this.animals.push({ id: `cow_${Date.now()}`, type: "cow", produceTime: 8000, timer: 2500 });
            }
            this.save();
            return true;
        }
        if (type === "sheep") {
            const cost = UPGRADE_CONFIG.sheepUnlock.cost || 300;
            if (this.player.cash < cost) return false;
            this.player.cash -= cost;
            this.upgrades.hasSheep = true;
            if (!this.animals.some(a => a.type === "sheep")) {
                this.animals.push({ id: `shp_${Date.now()}`, type: "sheep", produceTime: 11000, timer: 3500 });
            }
            this.save();
            return true;
        }
        return false;
    }

    buyAnimal(type, cost) {
        if (type === "cow" && !this.upgrades.hasCow) return false;
        if (type === "sheep" && !this.upgrades.hasSheep) return false;
        if (this.player.cash < cost) return false;
        this.player.cash -= cost;
        const produceTime = (type === "chicken") ? 5000 : (type === "cow" ? 8000 : 11000);
        const newId = `${type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        this.animals.push({
            id: newId,
            type: type,
            produceTime: produceTime,
            timer: 0
        });
        this.save();
        return true;
    }

    getAnimalCount(type) {
        return this.animals.filter(a => a.type === type).length;
    }

    processOfflineEarnings(offlineMs) {
        if (offlineMs < 5000) return null; // Minimal 5 detik

        const cappedMs = Math.min(offlineMs, 8 * 3600 * 1000); // Max 8 jam offline
        const petMult = this.getPetCareMultiplier();

        const results = {
            durationMinutes: Math.floor(cappedMs / 60000),
            itemsProduced: { egg: 0, milk: 0, wool: 0 }
        };

        this.animals.forEach(animal => {
            const effectiveInterval = animal.produceTime / petMult;
            const count = Math.floor(cappedMs / effectiveInterval);
            const capped = Math.min(count, 35); // Batas panen per hewan offline

            if (animal.type === "chicken") results.itemsProduced.egg += capped;
            if (animal.type === "cow") results.itemsProduced.milk += capped;
            if (animal.type === "sheep") results.itemsProduced.wool += capped;
        });

        // Simpan langsung ke hasil tanah atau gudang offline
        let totalItems = 0;
        for (let type in results.itemsProduced) {
            const count = results.itemsProduced[type];
            if (count > 0) {
                totalItems += count;
                // Masukkan beberapa ke ground items dekat kandang hewan
                const anim = this.animals.find(a => (
                    (type === 'egg' && a.type === 'chicken') ||
                    (type === 'milk' && a.type === 'cow') ||
                    (type === 'wool' && a.type === 'sheep')
                ));
                const bx = anim ? anim.x : 200;
                const by = anim ? anim.y : 300;
                for (let i = 0; i < Math.min(count, 12); i++) {
                    this.groundItems.push({
                        id: "off_" + Math.random(),
                        type: type,
                        x: bx + (Math.random() * 80 - 40),
                        y: by + (Math.random() * 60 - 30),
                        spawnTime: Date.now()
                    });
                }
            }
        }

        return totalItems > 0 ? results : null;
    }
}

window.ITEM_DEFS = ITEM_DEFS;
window.MACHINE_DEFS = MACHINE_DEFS;
window.INITIAL_QUESTS = INITIAL_QUESTS;
window.UPGRADE_CONFIG = UPGRADE_CONFIG;
window.TRUCK_LEVELS = TRUCK_LEVELS;
window.gameState = new GameStateManager();
