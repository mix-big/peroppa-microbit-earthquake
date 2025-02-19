//% weight=100 color=#ff5733 icon="\uf0c3"
//% block="PGA Sensor"
namespace PGA {

    let prevX = 0;
    let prevY = 0;
    let prevZ = 0;
    let prevTime = control.millis(); // 前の測定時間

    /**
     * micro:bitの加速度計の値をPGA（gal）に変換して取得
     */
    //% blockId=pga_get block="PGA (gal)"
    export function getPGA(): number {
        let x = input.acceleration(Dimension.X); // mg単位
        let y = input.acceleration(Dimension.Y);
        let z = input.acceleration(Dimension.Z);

        let acc = Math.sqrt(x * x + y * y + z * z); // 合成加速度
        return acc * 0.0980665; // mg → gal 変換
    }

    /**
     * 揺れの周波数を検出（試作版）
     */
    //% blockId=pga_detect_frequency block="揺れの周波数 (Hz)"
    export function detectShakeFrequency(): number {
        let currentTime = control.millis();
        let timeDiff = (currentTime - prevTime) / 1000;
        prevTime = currentTime;

        if (timeDiff == 0) return 0; // 0除算防止

        let x = input.acceleration(Dimension.X);
        let y = input.acceleration(Dimension.Y);
        let z = input.acceleration(Dimension.Z);

        let totalChange = Math.abs(x - prevX) + Math.abs(y - prevY) + Math.abs(z - prevZ);
        prevX = x;
        prevY = y;
        prevZ = z;

        return totalChange / timeDiff / 1000; // 変化量を時間で割って周波数推定
    }

    /**
     * PGA (gal) から JMA 震度階級に変換
     */
    //% blockId=pga_to_jma block="PGA %pga (gal) をJMA震度に変換"
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

    /**
     * PGA (gal) から メルカリ震度階級に変換
     */
    //% blockId=pga_to_mercalli block="PGA %pga (gal) をメルカリ震度に変換"
    export function toMercalliIntensity(pga: number): number {
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

    /**
     * 指定した JMA 震度以上かを判定
     */
    //% blockId=pga_is_jma_above block="PGA %pga (gal) が震度 %shindo 以上"
    export function isJMASeismicAbove(pga: number, shindo: string): boolean {
        let intensity = toJMASeismicIntensity(pga);
        let levels = ["0", "1", "2", "3", "4", "5-", "5+", "6-", "6+", "7"];
        return levels.indexOf(intensity) >= levels.indexOf(shindo);
    }

    /**
     * 指定した メルカリ震度以上かを判定
     */
    //% blockId=pga_is_mercalli_above block="PGA %pga (gal) がメルカリ震度 %shindo 以上"
    //% shindo.min=1 shindo.max=12 shindo.defl=6
    export function isMercalliIntensityAbove(pga: number, shindo: number): boolean {
        let intensity = toMercalliIntensity(pga);
        return intensity >= shindo;
    }

    /**
     * PGA (gal) から 長周期地震動階級を求める
     */
    //% blockId=pga_to_long_period block="PGA %pga (gal) で長周期地震動階級を求める"
    export function toLongPeriodSeismicIntensity(pga: number): number {
        let frequency = detectShakeFrequency();
        if (frequency < 0.05 || frequency > 0.5) return 0; // 長周期地震動の範囲外

        if (pga >= 400) return 4;
        if (pga >= 250) return 3;
        if (pga >= 100) return 2;
        if (pga >= 40) return 1;
        return 0;
    }
}
