.pragma library
// Âm lịch Việt Nam (múi giờ UTC+7) - thuật toán Hồ Ngọc Đức
var PI = Math.PI;
function INT(d) { return Math.floor(d); }
function jdFromDate(dd, mm, yy) {
    var a = INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
    var jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    return jd;
}
function newMoon(k) {
    var T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180;
    var Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    var M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    var Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    var F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    var C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    var dt;
    if (T < -11) dt = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    else dt = -0.000278 + 0.000265 * T + 0.000262 * T2;
    return Jd1 + C1 - dt;
}
function sunLongitude(jdn) {
    var T = (jdn - 2451545.0) / 36525, T2 = T * T, dr = PI / 180;
    var M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    var L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    var DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    var L = (L0 + DL) * dr;
    return L - PI * 2 * INT(L / (PI * 2));
}
var TZ = 7;
function getNewMoonDay(k) { return INT(newMoon(k) + 0.5 + TZ / 24); }
function getSunLong(jdn) { return INT(sunLongitude(jdn - 0.5 - TZ / 24) / PI * 6); }
function getLunarMonth11(yy) {
    var off = jdFromDate(31, 12, yy) - 2415021;
    var k = INT(off / 29.530588853);
    var nm = getNewMoonDay(k);
    if (getSunLong(nm) >= 9) nm = getNewMoonDay(k - 1);
    return nm;
}
function getLeapMonthOffset(a11) {
    var k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    var last = 0, i = 1, arc = getSunLong(getNewMoonDay(k + i));
    do { last = arc; i++; arc = getSunLong(getNewMoonDay(k + i)); } while (arc != last && i < 14);
    return i - 1;
}
// -> {day, month, year, leap}
function solar2lunar(dd, mm, yy) {
    var dayNumber = jdFromDate(dd, mm, yy);
    var k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    var monthStart = getNewMoonDay(k + 1);
    if (monthStart > dayNumber) monthStart = getNewMoonDay(k);
    var a11 = getLunarMonth11(yy), b11 = a11, lunarYear;
    if (a11 >= monthStart) { lunarYear = yy; a11 = getLunarMonth11(yy - 1); }
    else { lunarYear = yy + 1; b11 = getLunarMonth11(yy + 1); }
    var lunarDay = dayNumber - monthStart + 1;
    var diff = INT((monthStart - a11) / 29), lunarLeap = 0, lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
        var lm = getLeapMonthOffset(a11);
        if (diff >= lm) { lunarMonth = diff + 10; if (diff == lm) lunarLeap = 1; }
    }
    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
    return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap };
}
var CAN = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
var CHI = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
function canChiYear(y) { return CAN[(y + 6) % 10] + " " + CHI[(y + 8) % 12]; }
function canChiDay(dd, mm, yy) { var j = jdFromDate(dd, mm, yy); return CAN[(j + 9) % 10] + " " + CHI[(j + 1) % 12]; }
// Lễ âm lịch cố định
var HOLIDAYS = { "1/1":"Tết Nguyên Đán", "2/1":"Mùng 2 Tết", "3/1":"Mùng 3 Tết", "15/1":"Rằm tháng Giêng",
  "3/3":"Tết Hàn Thực", "10/3":"Giỗ Tổ Hùng Vương", "15/4":"Phật Đản", "5/5":"Tết Đoan Ngọ",
  "15/7":"Vu Lan", "15/8":"Tết Trung Thu", "23/12":"Ông Công Ông Táo" };
function holiday(l) { return l.leap ? "" : (HOLIDAYS[l.day + "/" + l.month] || ""); }
function shortLabel(l) { return l.day === 1 ? (l.day + "/" + l.month + (l.leap ? "n" : "")) : String(l.day); }
