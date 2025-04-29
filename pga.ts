//% weight=100 color=#ffb347 icon="\uf0c3"
//% block="PGA Sensor"
namespace PGA {

    let prevX = 0
    let prevY = 0
    let prevZ = 0
    let prevTime = control.millis()

    /**
     * PGA（gal）を定期的に更新し、前回との差から変化量を測定
     */
    //% blockId=pga_get block="PGA (gal)"
    export function getPGA(): number {
        let currentTime = control.millis()
        let timeDiff = (currentTime - prevTime) / 1000 // 秒
        if (timeDiff === 0) return 0
        prevTime = currentTime

        let x = input.acceleration(Dimension.X)
        let y = input.acceleration(Dimension.Y)
        let z = input.acceleration(Dimension.Z)

        let dx = x - prevX
        let dy = y - prevY
        let dz = z - prevZ

        prevX = x
        prevY = y
        prevZ = z

        let delta = Math.sqrt(dx * dx + dy * dy + dz * dz)
        return delta * 0.0980665 // mg → gal
    }

    /**
     * 周波数を検出（簡易推定）
     */
    //% blockId=pga_detect_frequency block="揺れの周波数 (Hz)"
    export function detectShakeFrequency(): number {
        let currentTime = control.millis()
        let timeDiff = (currentTime - prevTime) / 1000
        prevTime = currentTime

        if (timeDiff === 0) return 0

        let x = input.acceleration(Dimension.X)
        let y = input.acceleration(Dimension.Y)
        let z = input.acceleration(Dimension.Z)

        let totalChange = Math.abs(x - prevX) + Math.abs(y - prevY) + Math.abs(z - prevZ)
        prevX = x
        prevY = y
        prevZ = z

        return totalChange / timeDiff / 1000
    }

    // ---- 各震度階級への変換 ----

    //% blockId=pga_to_jma block="PGA %pga (gal) をJMA震度に変換"
    export function toJMASeismicIntensity(pga: number): string {
        if (pga >= 1400) return "7"
        if (pga >= 900) return "6+"
        if (pga >= 600) return "6-"
        if (pga >= 400) return "5+"
        if (pga >= 250) return "5-"
        if (pga >= 80) return "4"
        if (pga >= 25) return "3"
        if (pga >= 8) return "2"
        if (pga >= 2.5) return "1"
        return "0"
    }

    //% blockId=pga_to_revised_mercalli block="PGA %pga (gal) を改正メルカリ震度に変換"
    export function toRevisedMercalliIntensity(pga: number): number {
        if (pga >= 2000) return 12
        if (pga >= 1400) return 11
        if (pga >= 900) return 10
        if (pga >= 600) return 9
        if (pga >= 400) return 8
        if (pga >= 250) return 7
        if (pga >= 80) return 6
        if (pga >= 25) return 5
        if (pga >= 8) return 4
        if (pga >= 2.5) return 3
        if (pga >= 0.5) return 2
        if (pga >= 0.2) return 1
        return 0
    }

    //% blockId=pga_to_european_intensity block="PGA %pga (gal) をヨーロッパ震度に変換"
    export function toEuropeanIntensity(pga: number): number {
        if (pga >= 1800) return 12
        if (pga >= 1300) return 11
        if (pga >= 900) return 10
        if (pga >= 600) return 9
        if (pga >= 400) return 8
        if (pga >= 250) return 7
        if (pga >= 80) return 6
        if (pga >= 25) return 5
        if (pga >= 8) return 4
        if (pga >= 2.5) return 3
        if (pga >= 1) return 2
        return 1
    }

    //% blockId=pga_to_chinese_intensity block="PGA %pga (gal) を中国震度に変換"
    export function toChineseIntensity(pga: number): number {
        if (pga >= 2000) return 12
        if (pga >= 1500) return 11
        if (pga >= 1000) return 10
        if (pga >= 650) return 9
        if (pga >= 400) return 8
        if (pga >= 250) return 7
        if (pga >= 150) return 6
        if (pga >= 80) return 5
        if (pga >= 25) return 4
        if (pga >= 8) return 3
        if (pga >= 2.5) return 2
        return 1
    }

    // ---- "震度以上" 判定ブロック ----

    //% blockId=pga_is_jma_above block="PGA %pga (gal) がJMA震度 %shindo 以上"
    export function isJMASeismicAbove(pga: number, shindo: string): boolean {
        let intensity = toJMASeismicIntensity(pga)
        let levels = ["0", "1", "2", "3", "4", "5-", "5+", "6-", "6+", "7"]
        return levels.indexOf(intensity) >= levels.indexOf(shindo)
    }

    //% blockId=pga_is_revised_mercalli_above block="PGA %pga (gal) が改正メルカリ震度 %level 以上"
    //% level.min=1 level.max=12 level.defl=6
    export function isRevisedMercalliIntensityAbove(pga: number, level: number): boolean {
        return toRevisedMercalliIntensity(pga) >= level
    }

    //% blockId=pga_is_european_above block="PGA %pga (gal) がヨーロッパ震度 %level 以上"
    //% level.min=1 level.max=12 level.defl=6
    export function isEuropeanIntensityAbove(pga: number, level: number): boolean {
        return toEuropeanIntensity(pga) >= level
    }

    //% blockId=pga_is_chinese_above block="PGA %pga (gal) が中国震度 %level 以上"
    //% level.min=1 level.max=12 level.defl=6
    export function isChineseIntensityAbove(pga: number, level: number): boolean {
        return toChineseIntensity(pga) >= level
    }

    // ---- 長周期地震動 階級 ----

    //% blockId=pga_to_longperiod block="PGA %pga (gal) で長周期地震動階級を求める"
    export function toLongPeriodSeismicIntensity(pga: number): number {
        let freq = detectShakeFrequency()
        if (freq < 0.05 || freq > 0.5) return 0
        if (pga >= 400) return 4
        if (pga >= 250) return 3
        if (pga >= 100) return 2
        if (pga >= 40) return 1
        return 0
    }

    //% blockId=pga_is_longperiod_above block="長周期階級 %level 以上"
    //% level.min=0 level.max=4 level.defl=2
    export function isLongPeriodIntensityAbove(pga: number, level: number): boolean {
        return toLongPeriodSeismicIntensity(pga) >= level
    }
}
