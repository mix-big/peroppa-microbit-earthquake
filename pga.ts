//% weight=100 color=#ff8c00 icon="\uf0c3"
//% block="PGA Sensor"
namespace PGA {

    let prevX = 0;
    let prevY = 0;
    let prevZ = 0;
    let prevTime = control.millis();

    let pga = 0;
    let lastUpdate = control.millis();

    /**
     * 一定間隔で加速度を測定し、最大加速度を保存
     */
    control.inBackground(function () {
        while (true) {
            let now = control.millis();
            if (now - lastUpdate >= 200) {
                lastUpdate = now;
                let x = input.acceleration(Dimension.X);
                let y = input.acceleration(Dimension.Y);
                let z = input.acceleration(Dimension.Z);
                let acc = Math.sqrt(x * x + y * y + z * z) * 0.0980665;
                if (acc > pga) {
                    pga = acc;
                }
            }
            basic.pause(50);
        }
    });

    /**
     * 現在の最大PGA (gal)
     */
    //% blockId=pga_get block="現在の最大PGA (gal)"
    export function getPGA(): number {
        return pga;
    }

    /**
     * 揺れの周波数 (Hz)
     */
    //% blockId=pga_detect_frequency block="揺れの周波数 (Hz)"
    export function detectShakeFrequency(): number {
        let currentTime = control.millis();
        let timeDiff = (currentTime - prevTime) / 1000;
        prevTime = currentTime;

        if (timeDiff == 0) return 0;

        let x = input.acceleration(Dimension.X);
        let y = input.acceleration(Dimension.Y);
        let z = input.acceleration(Dimension.Z);

        let totalChange = Math.abs(x - prevX) + Math.abs(y - prevY) + Math.abs(z - prevZ);
        prevX = x;
        prevY = y;
        prevZ = z;

        return totalChange / timeDiff / 1000;
    }

    // --- 震度変換ブロック群 ---

    //% blockId=pga_to_jma block="PGA %pga (gal) → JMA震度"
    export function toJMASeismicIntensity(pga: number): string {
        if (pga >= 1400) return "7";
        if (pga >= 900) return "6+";
        if (pga >= 600) return "6-";
        if (pga >= 400) return "5+";
        if (pga >= 250) return "5-";
        if (pga >= 80) return "4";
        if (pga >= 25) return "3";
        if (pga >= 8) return "2";
        if (pga >= 2.5) return "1";
        return "0";
    }

    //% blockId=pga_to_revised_mercalli block="PGA %pga (gal) → 改正メルカリ震度"
    export function toRevisedMercalliIntensity(pga: number): number {
        if (pga >= 2000) return 12;
        if (pga >= 1400) return 11;
        if (pga >= 900) return 10;
        if (pga >= 600) return 9;
        if (pga >= 400) return 8;
        if (pga >= 250) return 7;
        if (pga >= 80) return 6;
        if (pga >= 25) return 5;
        if (pga >= 8) return 4;
        if (pga >= 2.5) return 3;
        if (pga >= 0.5) return 2;
        if (pga >= 0.2) return 1;
        return 0;
    }

    //% blockId=pga_to_european_intensity block="PGA %pga (gal) → ヨーロッパ震度"
    export function toEuropeanIntensity(pga: number): number {
        if (pga >= 1600) return 12;
        if (pga >= 1200) return 11;
        if (pga >= 850) return 10;
        if (pga >= 600) return 9;
        if (pga >= 400) return 8;
        if (pga >= 250) return 7;
        if (pga >= 150) return 6;
        if (pga >= 80) return 5;
        if (pga >= 25) return 4;
        if (pga >= 8) return 3;
        if (pga >= 2.5) return 2;
        return 1;
    }

    //% blockId=pga_to_chinese_intensity block="PGA %pga (gal) → 中国震度"
    export function toChineseIntensity(pga: number): number {
        if (pga >= 1000) return 12;
        if (pga >= 800) return 11;
        if (pga >= 600) return 10;
        if (pga >= 400) return 9;
        if (pga >= 250) return 8;
        if (pga >= 150) return 7;
        if (pga >= 80) return 6;
        if (pga >= 40) return 5;
        if (pga >= 20) return 4;
        if (pga >= 10) return 3;
        if (pga >= 5) return 2;
        return 1;
    }

    //% blockId=pga_to_nima block="PGA %pga (gal) → NIMA震度"
    export function toNIMAIntensity(pga: number): number {
        if (pga < 8) return 1;
        if (pga >= 1100) return 10;
        let x = (pga - 8) / (1100 - 8);
        return Math.round(1 + x * 9);
    }

    // --- 判定ブロック群 ---

    //% blockId=pga_is_jma_above block="PGA %pga (gal) がJMA震度 %shindo 以上"
    export function isJMASeismicAbove(pga: number, shindo: string): boolean {
        let intensity = toJMASeismicIntensity(pga);
        let levels = ["0", "1", "2", "3", "4", "5-", "5+", "6-", "6+", "7"];
        return levels.indexOf(intensity) >= levels.indexOf(shindo);
    }

    //% blockId=pga_is_nima_above block="PGA %pga (gal) がNIMA震度 %shindo 以上"
    //% shindo.min=1 shindo.max=10
    export function isNIMAIntensityAbove(pga: number, shindo: number): boolean {
        return toNIMAIntensity(pga) >= shindo;
    }

    //% blockId=pga_to_long_period block="PGA %pga (gal) → 長周期地震動階級"
    export function toLongPeriodSeismicIntensity(pga: number): number {
        let freq = detectShakeFrequency();
        if (freq < 0.05 || freq > 0.5) return 0;
        if (pga >= 400) return 4;
        if (pga >= 250) return 3;
        if (pga >= 100) return 2;
        if (pga >= 40) return 1;
        return 0;
    }

    //% blockId=pga_is_long_period_above block="PGA %pga (gal) が長周期階級 %shindo 以上"
    //% shindo.min=0 shindo.max=4
    export function isLongPeriodAbove(pga: number, shindo: number): boolean {
        return toLongPeriodSeismicIntensity(pga) >= shindo;
    }
}
