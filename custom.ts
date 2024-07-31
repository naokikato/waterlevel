
/**
* このファイルを使って、独自の関数やブロックを定義してください。
* 詳しくはこちらを参照してください：https://makecode.microbit.org/blocks/custom
*/

enum MyEnum {
}

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="" block="水位計"
namespace IMLwaterlevel {

    //% block
    //% block="水位"
    //% weight=100    
    export function getWaterLevel(): number {
        return doSomething()
    }

    let ATTINY2_LOW_ADDR = 119
    let ATTINY1_HIGH_ADDR = 120
    let high_data: number[] = []
    let low_data: number[] = []

    function getHigh12SectionValue() {
        high_data = []
        pins.i2cWriteNumber(
            ATTINY1_HIGH_ADDR,
            0,
            NumberFormat.UInt8BE,
            false
        )
        for (let index = 0; index < 12; index++) {
            high_data.push(pins.i2cReadNumber(ATTINY1_HIGH_ADDR, NumberFormat.UInt8BE, false))
        }
        basic.pause(10)
    }
    function getLow8SectionValue() {
        low_data = []
        pins.i2cWriteNumber(
            ATTINY2_LOW_ADDR,
            0,
            NumberFormat.UInt8BE,
            false
        )
        for (let index = 0; index < 8; index++) {
            low_data.push(pins.i2cReadNumber(ATTINY2_LOW_ADDR, NumberFormat.UInt8BE, false))
        }
        basic.pause(10)
    }

    function doSomething() : number {
        let THRESHOLD = 100
        let sensorvalue_max = 255
        let sensorvalue_min = 250
        let high_count = 0
        let low_count = 0

        getLow8SectionValue()
        getHigh12SectionValue()
        for (let m = 0; m <= 7; m++) {
            if (low_data[m] >= sensorvalue_min && low_data[m] <= sensorvalue_max) {
                low_count += 1
            }
        }
        for (let n = 0; n <= 11; n++) {
            if (high_data[n] >= sensorvalue_min && high_data[n] <= sensorvalue_max) {
                high_count += 1
            }
        }
        let touch_val = 0
        for (let o = 0; o <= 7; o++) {
            if (low_data[o] > THRESHOLD) {
                touch_val |= 1 << o
            }
        }
        for (let p = 0; p <= 11; p++) {
            if (high_data[p] > THRESHOLD) {
                touch_val |= 1 << (8 + p)
            }
        }
        let trig_section = 0
        while (touch_val & 0x01) {
            trig_section += 1
            touch_val >>= 1
        }
        basic.pause(100)
        return trig_section * 5
    }
}
