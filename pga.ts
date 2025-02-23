//% weight=100 color=#ff9933 icon="\uf0c3"
//% block="PGA Sensor"
namespace PGA {

    let prevX = 0;
    let prevY = 0;
    let prevZ = 0;
    let prevTime = control.millis();
    let prevPGA = 0; // 直前のPGA

    /**
     * micro:bitの加速度計の値をPGA（gal）に変換して取得
     */
    //% blockId=pga_get block="PGA (gal)"
    export function getPGA(): number {
        let x = input.acceleration(Dimension.X);
        let y = input.acceleration(Dimension.Y);
        let z = input.acceleration(Dimension.Z);

        let acc = Math.sqrt(x * x + y * y + z * z);
        return acc * 0.0980665;
    }

    /**
     * 揺れの周波数を検出
     */
    //% blockId=pga_detect_frequency block="揺れの周波数 (Hz)"
    export function detectShakeFrequency(): number {
        let currentTime = control.millis();
        let timeDiff = (currentTime - prevTime) / 1000;
        prevTime = currentTime;

        if (timeDiff == 0) return 0; // 0除算防止

        let pga = getPGA();
        let pgaDiff = Math.abs(pga - prevPGA);
        prevPGA = pga;

        return pgaDiff / timeDiff / 100; // 変化量を時間で割って周波数推定
    }

    /**
     * 加速度計の変位を計算
     */
    //% blockId=pga_calculate_displacement block="加速度の変位 (mm)"
    export function calculateDisplacement(): number {
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
        return displacement * 0.0980665; // mg → mm
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

    /**
     * 長周期地震動階級が指定値以上かを判定
     */
    //% blockId=pga_is_long_period_above block="PGA %pga (gal) が長周期地震動階級 %level 以上"
    //% level.min=0 level.max=4 level.defl=2
    export function isLongPeriodSeismicAbove(pga: number, level: number): boolean {
        let intensity = toLongPeriodSeismicIntensity(pga);
        return intensity >= level;
    }
}
