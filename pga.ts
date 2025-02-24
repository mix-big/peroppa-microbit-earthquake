//% weight=100 color=#ff9933 icon="\uf0c3"
//% block="PGA Sensor"
namespace PGA {

    let prevX = 0;
    let prevY = 0;
    let prevZ = 0;
    let prevTime = control.millis();
    let prevPGA = 0;

    /**
     * PGA (gal) を変位から計算
     */
    //% blockId=pga_get block="PGA (gal)"
    export function getPGA(): number {
        let currentTime = control.millis();
        let timeDiff = (currentTime - prevTime) / 1000;
        prevTime = currentTime;

        if (timeDiff == 0) return prevPGA;

        let x = input.acceleration(Dimension.X);
        let y = input.acceleration(Dimension.Y);
        let z = input.acceleration(Dimension.Z);

        let deltaX = x - prevX;
        let deltaY = y - prevY;
        let deltaZ = z - prevZ;

        prevX = x;
        prevY = y;
        prevZ = z;

        let displacement = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        let pga = (displacement / timeDiff) * 0.0980665;

        prevPGA = pga;
        return pga;
    }

    /**
     * 長周期地震動階級を計算
     */
    //% blockId=long_period_intensity block="長周期地震動階級 (周期: %period 秒, 速度: %velocity cm/s)"
    export function getLongPeriodIntensity(period: number, velocity: number): number {
        if (period < 1.6) return 0;
        if (velocity >= 250) return 4;
        if (velocity >= 100) return 3;
        if (velocity >= 50) return 2;
        if (velocity >= 25) return 1;
        return 0;
    }

    /**
     * 長周期震度階級が 指定階級以上かを判定
     */
    //% blockId=is_long_period_above block="長周期震度階級 %period 秒, 速度 %velocity cm/s が %shindo 以上"
    export function isLongPeriodAbove(period: number, velocity: number, shindo: number): boolean {
        return getLongPeriodIntensity(period, velocity) >= shindo;
    }

    /**
     * PGA (gal) から JMA 震度階級に変換
     */
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
     * PGA (gal) から ヨーロッパ震度階級に変換
     */
    export function toEuropeanIntensity(pga: number): number {
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
     * PGA (gal) から 中国震度階級に変換
     */
    export function toChineseIntensity(pga: number): number {
        if (pga >= 1600) return 12;
        if (pga >= 1200) return 11;
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
     * PGA (gal) から 改正メルカリ震度階級に変換
     */
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

    /**
     * JMA震度階級が 指定震度以上かを判定
     */
    export function isJMASeismicAbove(pga: number, shindo: string): boolean {
        let intensity = toJMASeismicIntensity(pga);
        let levels = ["0", "1", "2", "3", "4", "5-", "5+", "6-", "6+", "7"];
        return levels.indexOf(intensity) >= levels.indexOf(shindo);
    }

    /**
     * ヨーロッパ震度階級が 指定震度以上かを判定
     */
    export function isEuropeanIntensityAbove(pga: number, shindo: number): boolean {
        return toEuropeanIntensity(pga) >= shindo;
    }

    /**
     * 中国震度階級が 指定震度以上かを判定
     */
    export function isChineseIntensityAbove(pga: number, shindo: number): boolean {
        return toChineseIntensity(pga) >= shindo;
    }

    /**
     * 改正メルカリ震度階級が 指定震度以上かを判定
     */
    export function isRevisedMercalliIntensityAbove(pga: number, shindo: number): boolean {
        return toRevisedMercalliIntensity(pga) >= shindo;
    }
}
