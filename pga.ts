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

        // 合成加速度を計算（ピタゴラスの定理）
        let acc = Math.sqrt(x * x + y * y + z * z);

        // mg → gal 変換
        let pga = acc * 0.0980665;

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

    /**
     * JMA震度が指定値以上かを判定
     */
    //% blockId=pga_is_above_jma block="JMA震度 %intensity 以上か判定"
    export function isAboveJMAIntensity(intensity: string): boolean {
        let pga = getPGA(); // 現在のPGA取得
        let currentIntensity = toJMASeismicIntensity(pga); // JMA震度に変換

        return currentIntensity >= intensity;
    }

    /**
     * メルカリ震度が指定値以上かを判定
     */
    //% blockId=pga_is_above_mercalli block="メルカリ震度 %intensity 以上か判定"
    export function isAboveMercalliIntensity(intensity: number): boolean {
        let pga = getPGA(); // 現在のPGA取得
        let currentIntensity = toMercalliIntensity(pga); // メルカリ震度に変換

        return currentIntensity >= intensity;
    }

    /**
     * 揺れの周波数を検出（試作版）
     */
    //% blockId=pga_detect_frequency block="揺れの周波数 (Hz)"
    export function detectShakeFrequency(): number {
        let currentTime = control.millis(); // 現在の時間を取得
        let timeDiff = (currentTime - prevTime) / 1000; // 前回との時間差 (秒)
        prevTime = currentTime; // 時間を更新

        if (timeDiff == 0) return 0; // 0除算防止

        let x = input.acceleration(Dimension.X);
        let y = input.acceleration(Dimension.Y);
        let z = input.acceleration(Dimension.Z);

        // 変化量の大きさを算出
        let deltaX = Math.abs(x - prevX);
        let deltaY = Math.abs(y - prevY);
        let deltaZ = Math.abs(z - prevZ);

        let totalChange = deltaX + deltaY + deltaZ; // 3軸の変化量合計

        prevX = x;
        prevY = y;
        prevZ = z;

        // 周波数を計算（変化が大きいと高周波とする単純モデル）
        let frequency = totalChange / timeDiff / 1000; // (仮) 変化量を時間で割る

        return frequency;
    }
}
