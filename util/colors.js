const colors = {}
global.RGB = function(r, g, b) {
    return (r << 16) + (g << 8) + b
}

colors.red = RGB(255, 0, 0)
colors.discordRed = RGB(237, 66, 69)
colors.discordPink = RGB(235, 69, 158)
colors.boosterPink = RGB(244, 127, 255)
colors.maroon = RGB(128, 0, 0)
colors.lightCoral = RGB(240, 128, 128)

//blue
colors.blue = RGB(42, 114, 199)
colors.lightBlue = RGB(45, 123, 223)
colors.dodgerBlue = RGB(30, 144, 255)
colors.steelBlue = RGB(70, 130, 180)
colors.lightSteelBlue = RGB(176, 196, 222)
colors.skyBlue = RGB(135, 206, 235)
colors.navy = RGB(0, 0, 128)
colors.mediumBlue = RGB(0, 0, 205)

//cyan/aqua
colors.aqua = RGB(0, 255, 255)
colors.turquoise = RGB(64, 224, 208)
colors.darkTurquoise = RGB(0, 206, 209)
colors.darkAqua = RGB(0, 139, 139)
colors.lightAqua = RGB(32, 178, 170)
//green
colors.discordGreen = RGB(87, 242, 135)
colors.limeGreen = RGB(46, 204, 113)
colors.lightGreen = RGB(26, 188, 156)
colors.darkGreen = RGB(17, 128, 106)
colors.forestGreen = RGB(31, 139, 76)
//orange
colors.orange = RGB(230, 126, 34)
colors.gold = RGB(249, 166, 2)
colors.metallicGold = RGB(212, 175, 55)
colors.oldGold = RGB(207, 181, 59)
colors.vegasGold = RGB(197, 179, 88)

//grey
colors.grey = RGB(128, 128, 128)
colors.lightGrey = RGB(100, 100, 100)
colors.darkGrey = RGB(50, 50, 50)
colors.silver = RGB(192, 192, 192)
colors.slateGrey = RGB(112, 128, 144)
colors.lightSlateGrey = RGB(119, 136, 153)
//black
colors.lightBlack = RGB(34, 34, 34)
colors.deepBlack = RGB(0, 0, 0)

//yellow
colors.discordYellow = RGB(254, 231, 92)
colors.yellow = RGB(255, 255, 0)
//other colors
colors.blurple = RGB(88, 101, 242)
colors.ogBlurple = RGB(114, 137, 218)
colors.white = RGB(255,255,255)
colors.lightPurple = RGB(135, 106, 235)
colors.violet = RGB(113, 76, 248)
colors.purple = RGB(85, 42, 240)
colors.black = RGB(0, 0, 0)
module.exports = {
    global: {
        colors: colors,
        color: colors
    }
}
//global.colors = colors
//global.color = colors
//module.exports = colors