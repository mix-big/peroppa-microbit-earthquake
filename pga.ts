//% weight=100 color=#ff5733 icon="\uf0c3"
//% block="PGA Sensor"
namespace PGA {
    let prevX = 0;
    let prevY = 0;
    let prevZ = 0;

    /**
     * micro:bitの加速度計の値をPGA（gal）に変換して取得
     */
    //% blockId=pga_get block="PGA (gal)"
    export function getPGA(): number {
        let x = input.acceleration(Dimension.X);
        let y = input.acceleration(Dimension.Y);
        let z = input.acceleration(Dimension.Z);

        // 直前の値との差分を求める
        let deltaX = x - prevX;
        let deltaY = y - prevY;
        let deltaZ = z - prevZ;

        // 差分を保存（次回の比較用）
        prevX = x;
        prevY = y;
        prevZ = z;

        // ベクトルの変化量 (PGA の計算)
        let pga = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ) * 0.0980665;

        return pga;
    }

    /**
     * PGA (gal) から JMA 震度階級に変換 (5弱/5強, 6弱/6強 を "5-", "5+" のように表記)
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
}
