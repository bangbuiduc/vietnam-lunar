import QtQuick
import QtQuick.Layouts
import org.kde.plasma.plasmoid
import org.kde.plasma.core as PlasmaCore
import org.kde.plasma.components as PC3
import org.kde.kirigami as Kirigami
import "lunar.js" as Lunar

PlasmoidItem {
    id: root
    property date now: new Date()
    property date viewMonth: new Date(now.getFullYear(), now.getMonth(), 1)
    readonly property var today: Lunar.solar2lunar(now.getDate(), now.getMonth() + 1, now.getFullYear())
    readonly property var dow: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

    Timer { interval: 30000; running: true; repeat: true; onTriggered: root.now = new Date() }

    preferredRepresentation: compactRepresentation
    Plasmoid.backgroundHints: PlasmaCore.Types.DefaultBackground

    compactRepresentation: MouseArea {
        Layout.minimumWidth: lbl.implicitWidth + Kirigami.Units.largeSpacing
        onClicked: root.expanded = !root.expanded
        ColumnLayout {
            anchors.centerIn: parent
            spacing: 0
            PC3.Label {
                id: lbl
                Layout.alignment: Qt.AlignHCenter
                text: Qt.formatTime(root.now, "HH:mm") + "  " + Qt.formatDate(root.now, "dd/MM")
                font.bold: true
            }
        }
    }

    fullRepresentation: ColumnLayout {
        Layout.minimumWidth: Kirigami.Units.gridUnit * 24
        Layout.minimumHeight: Kirigami.Units.gridUnit * 24
        spacing: Kirigami.Units.smallSpacing

        PC3.Label {
            Layout.alignment: Qt.AlignHCenter
            text: Qt.formatDate(root.now, "dddd, dd/MM/yyyy")
            font.pixelSize: Kirigami.Theme.defaultFont.pixelSize * 1.4
        }
        PC3.Label {
            Layout.alignment: Qt.AlignHCenter
            text: "Âm lịch: ngày " + root.today.day + " tháng " + root.today.month + (root.today.leap ? " nhuận" : "")
                + " năm " + Lunar.canChiYear(root.today.year)
                + " · ngày " + Lunar.canChiDay(root.now.getDate(), root.now.getMonth() + 1, root.now.getFullYear())
            wrapMode: Text.Wrap
            Layout.maximumWidth: parent.width
            horizontalAlignment: Text.AlignHCenter
        }
        PC3.Label {
            Layout.alignment: Qt.AlignHCenter
            visible: text !== ""
            text: Lunar.holiday(root.today)
            color: Kirigami.Theme.negativeTextColor
            font.bold: true
        }

        RowLayout {
            Layout.fillWidth: true
            PC3.ToolButton { icon.name: "go-previous"; onClicked: root.viewMonth = new Date(root.viewMonth.getFullYear(), root.viewMonth.getMonth() - 1, 1) }
            PC3.Label {
                Layout.fillWidth: true
                horizontalAlignment: Text.AlignHCenter
                font.bold: true
                text: "Tháng " + (root.viewMonth.getMonth() + 1) + " / " + root.viewMonth.getFullYear()
            }
            PC3.ToolButton { text: "Hôm nay"; onClicked: root.viewMonth = new Date(root.now.getFullYear(), root.now.getMonth(), 1) }
            PC3.ToolButton { icon.name: "go-next"; onClicked: root.viewMonth = new Date(root.viewMonth.getFullYear(), root.viewMonth.getMonth() + 1, 1) }
        }

        GridLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            columns: 7
            rowSpacing: 2
            columnSpacing: 2
            Repeater {
                model: root.dow
                PC3.Label {
                    required property string modelData
                    required property int index
                    Layout.fillWidth: true
                    horizontalAlignment: Text.AlignHCenter
                    font.bold: true
                    color: index === 6 ? Kirigami.Theme.negativeTextColor : Kirigami.Theme.textColor
                    text: modelData
                }
            }
            Repeater {
                model: 42
                Rectangle {
                    id: cell
                    required property int index
                    readonly property int offset: (root.viewMonth.getDay() + 6) % 7
                    readonly property date d: new Date(root.viewMonth.getFullYear(), root.viewMonth.getMonth(), 1 - offset + index)
                    readonly property bool inMonth: d.getMonth() === root.viewMonth.getMonth()
                    readonly property bool isToday: d.toDateString() === root.now.toDateString()
                    readonly property var l: Lunar.solar2lunar(d.getDate(), d.getMonth() + 1, d.getFullYear())
                    readonly property string hol: Lunar.holiday(l)
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    Layout.minimumHeight: Kirigami.Units.gridUnit * 2.6
                    radius: 4
                    color: isToday ? Kirigami.Theme.highlightColor : "transparent"
                    border.width: hol !== "" ? 1 : 0
                    border.color: Kirigami.Theme.negativeTextColor
                    opacity: inMonth ? 1 : 0.35
                    ColumnLayout {
                        anchors.centerIn: parent
                        spacing: 0
                        PC3.Label {
                            Layout.alignment: Qt.AlignHCenter
                            text: cell.d.getDate()
                            font.bold: true
                            color: cell.isToday ? Kirigami.Theme.highlightedTextColor
                                 : (cell.index % 7 === 6 ? Kirigami.Theme.negativeTextColor : Kirigami.Theme.textColor)
                        }
                        PC3.Label {
                            Layout.alignment: Qt.AlignHCenter
                            text: Lunar.shortLabel(cell.l)
                            font.pixelSize: Kirigami.Theme.smallFont.pixelSize
                            color: cell.isToday ? Kirigami.Theme.highlightedTextColor
                                 : (cell.l.day === 1 || cell.l.day === 15 ? Kirigami.Theme.positiveTextColor : Kirigami.Theme.disabledTextColor)
                        }
                    }
                    HoverHandler { id: hh }
                    PC3.ToolTip.visible: hh.hovered && cell.hol !== ""
                    PC3.ToolTip.text: cell.hol
                }
            }
        }
    }
}
