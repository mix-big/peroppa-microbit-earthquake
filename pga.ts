//% weight=100 color=#ff5733 icon="\uf0c3"
//% block="PGA Sensor"
namespace PGA {

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
}
